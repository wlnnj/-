<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { Socket } from 'socket.io-client';
import axios from 'axios';
import GlassCard from '../components/GlassCard.vue';
import { gsap } from 'gsap';
import { useAuthStore } from '../stores/auth';
import { useSocketStore } from '../stores/socket';
import { API_BASE } from '../config';

const authStore = useAuthStore();
const socketStore = useSocketStore();

const vClickOutside = {
    mounted(el: any, binding: any) {
        el.clickOutsideEvent = (event: Event) => {
            if (!(el === event.target || el.contains(event.target))) {
                binding.value(event);
            }
        };
        document.body.addEventListener('click', el.clickOutsideEvent);
    },
    unmounted(el: any) {
        document.body.removeEventListener('click', el.clickOutsideEvent);
    },
};

interface Message {
  id: string;
  senderId: string;
  senderName?: string; // Optional, might not be in DB message entity directly
  receiverId: string;
  content: string;
  createdAt: string; // Raw ISO string for logic
  displayTime?: string; // Formatted for UI
  isRead: boolean;
  isRecalled?: boolean;
  showMenu?: boolean;
}

interface Conversation {
  userId: string;
  username: string;
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
}

interface UserResult {
    id: string;
    username: string;
}

const conversations = ref<Conversation[]>([]);
const selectedConversation = ref<Conversation | null>(null);
const messages = ref<Message[]>([]);
const newMessage = ref('');
// const socket = ref<Socket | null>(null); // Replaced by socketStore.socket
const isLoading = ref(false);

const containerRef = ref<HTMLElement | null>(null);
const messagesContainerRef = ref<HTMLElement | null>(null);

// Search State
const showSearchModal = ref(false);
const searchQuery = ref('');
const searchResults = ref<UserResult[]>([]);
const isSearching = ref(false);

// Initialize Socket.IO connection
// Setup listeners on the shared socket
function setupSocketListeners(socket: Socket) {
    socket.off('newMessage', handleNewMessage);
    socket.on('newMessage', handleNewMessage);

    socket.off('messageSent', handleMessageSent);
    socket.on('messageSent', handleMessageSent);

    socket.off('messageRecalled', handleMessageRecalled);
    socket.on('messageRecalled', handleMessageRecalled);

    socket.off('messagesRead', handleMessagesRead);
    socket.on('messagesRead', handleMessagesRead);
}

function handleMessageSent(message: Message) {
    const index = messages.value.findIndex(m => 
        m.senderId === authStore.user?.id && 
        m.content === message.content &&
        m.id.startsWith('temp-')
    );

    if (index !== -1) {
         messages.value[index] = formatMessageTime(message);
    } else if (!messages.value.find(m => m.id === message.id)) {
         if (message.receiverId === selectedConversation.value?.userId || message.senderId === selectedConversation.value?.userId) {
             messages.value.push(formatMessageTime(message));
             scrollToBottom();
         }
    }
}

function handleMessageRecalled(data: { messageId: string }) {
    const msg = messages.value.find(m => m.id === data.messageId);
    if (msg) {
        msg.isRecalled = true;
    }
}

function handleMessagesRead(data: { readerId: string }) {
     if (selectedConversation.value?.userId === data.readerId) {
         messages.value.forEach(m => {
             if (m.senderId === authStore.user?.id) {
                 m.isRead = true;
             }
         });
     }
}

function handleNewMessage(message: Message) {
    // If message belongs to current conversation, append it
    if (selectedConversation.value && 
       (message.senderId === selectedConversation.value.userId || message.senderId === authStore.user?.id)) {
        messages.value.push(formatMessageTime(message));
        scrollToBottom();
        
        // Mark as read immediately if window receives it
        if (message.senderId === selectedConversation.value.userId) {
             markAsRead(message.senderId);
        }
    } else {
        // Update conversation list (unread count, last msg)
        updateConversationList(message);
        
        // 通知 TopNav 刷新未读数（有新消息）
        window.dispatchEvent(new Event('messages-read'));
    }
}

async function updateConversationList(_message?: Message) {
    if(!authStore.token) return;
    try {
        const { data } = await axios.get(`${API_BASE}/messages/conversations`, {
             headers: { Authorization: `Bearer ${authStore.token}` }
        });
        conversations.value = data.map((c: any) => ({
            ...c,
            lastTime: formatTime(c.lastTime)
        }));
    } catch (error) {
        console.error('Failed to update conversations:', error);
    }
}

async function fetchHistory(userId: string) {
    isLoading.value = true;
    try {
        const { data } = await axios.get(`${API_BASE}/messages/history/${userId}`, {
             headers: { Authorization: `Bearer ${authStore.token}` }
        });
        messages.value = data.reverse().map((m: any) => formatMessageTime(m));
        scrollToBottom();
    } catch (error) {
        console.error('Failed to fetch history:', error);
    } finally {
        isLoading.value = false;
    }
}

async function markAsRead(senderId: string) {
    try {
        await axios.put(`${API_BASE}/messages/read/${senderId}`, {}, {
             headers: { Authorization: `Bearer ${authStore.token}` }
        });
        // Locally update unread count for this conversation
        const conv = conversations.value.find(c => c.userId === senderId);
        if (conv) conv.unreadCount = 0;
        
        // 通过 WebSocket 通知发送者消息已读 (实时更新)
        if (socketStore.socket?.connected) {
            socketStore.socket.emit('readMessages', { senderId });
        }
        
        // 通知 TopNav 刷新未读数
        window.dispatchEvent(new Event('messages-read'));
    } catch (error) {
        console.error('Failed to mark as read:', error);
    }
}

async function selectConversation(conv: Conversation) {
  selectedConversation.value = conv;
  await fetchHistory(conv.userId);
  if (conv.unreadCount > 0) {
     await markAsRead(conv.userId);
  }
}

function sendMessage() {
  if (!newMessage.value.trim() || !selectedConversation.value || !socketStore.socket) return;
  
  const content = newMessage.value;
  const receiverId = selectedConversation.value.userId;

  // Emit event to server
  socketStore.socket.emit('sendMessage', {
      receiverId,
      content
  });
  
  // Optimistic UI update
  const tempMsg: Message = {
    id: `temp-${Date.now()}`, // temporary ID
    senderId: authStore.user?.id || 'me',
    senderName: authStore.user?.username || '我',
    receiverId,
    content,
    createdAt: new Date().toISOString(), // Use simple time for now, formatted downstream
    isRead: false,
  };
  
  messages.value.push(formatMessageTime(tempMsg));
  
  // Update conversation last message preview locally
  const conv = conversations.value.find(c => c.userId === receiverId);
  if (conv) {
      conv.lastMessage = content;
      conv.lastTime = formatTime(new Date().toISOString());
  } else {
      // New conversation created by sending first message
      // Fetch latest list to get full details properly or construct one
      // For now, simple refresh
      setTimeout(() => updateConversationList(), 500); 
  }

  newMessage.value = '';
  scrollToBottom();
}

async function deleteConversation(conv: Conversation) {
    if(!confirm('确定要删除该会话吗？删除后将不再显示历史消息。')) return;
    try {
        await axios.put(`${API_BASE}/messages/delete-conversation/${conv.userId}`, {}, {
            headers: { Authorization: `Bearer ${authStore.token}` }
        });
        // Remove from list
        conversations.value = conversations.value.filter(c => c.userId !== conv.userId);
        if (selectedConversation.value?.userId === conv.userId) {
            selectedConversation.value = null;
        }
    } catch (e) {
        console.error('Delete conversation failed', e);
    }
}

function recallMessage(message: Message) {
    // Recalling message
    if (!socketStore.socket) {
        console.error('Socket not connected');
        return;
    }
    socketStore.socket.emit('recallMessage', { messageId: message.id });
}

function canRecall(message: Message) {
    if (message.senderId !== authStore.user?.id || message.isRecalled) return false;
    // Check if within 2 minutes
    const msgTime = new Date(message.createdAt).getTime();
    const diff = (Date.now() - msgTime);
    // console.log(`Msg time diff: ${diff}ms`); // Debug if needed
    return diff < 2 * 60 * 1000;
}

function openMenu(msg: Message) {
    // Close others
    messages.value.forEach(m => m.showMenu = false);
    msg.showMenu = true;
}

// User Search Logic
async function searchUsers() {
    if (!searchQuery.value.trim()) return;
    isSearching.value = true;
    try {
        // Use endpoint that returns users
        const { data } = await axios.get(`${API_BASE}/messages/search`, {
            params: { q: searchQuery.value },
            headers: { Authorization: `Bearer ${authStore.token}` }
        });
        searchResults.value = data.filter((u: any) => u.id !== authStore.user?.id); // Exclude self
    } catch (e) {
        console.error('Search failed', e);
    } finally {
        isSearching.value = false;
    }
}

function startChat(user: UserResult) {
    // Check if conversation exists
    const existing = conversations.value.find(c => c.userId === user.id);
    if (existing) {
        selectConversation(existing);
    } else {
        // Create temporary conversation object
        const newConv: Conversation = {
            userId: user.id,
            username: user.username,
            lastMessage: '',
            lastTime: '',
            unreadCount: 0
        };
        // Add to list or just set selected? 
        // Setting selected allows sending message immediately. 
        // We won't add to `conversations` array until a message is sent or we handle it otherwise.
        selectedConversation.value = newConv;
        messages.value = []; // Empty history
    }
    showSearchModal.value = false;
    searchQuery.value = '';
    searchResults.value = [];
}

function formatTime(dateStr: string) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    // primitive logic: if today, show time; else show date
    if (date.toDateString() === now.toDateString()) {
         return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
}

function formatMessageTime(msg: any): Message {
    return {
        ...msg,
        // Ensure we keep the original createdAt for logic (e.g. recall time check)
        createdAt: msg.createdAt, 
        displayTime: formatTime(msg.createdAt) 
    };
}

function scrollToBottom() {
    nextTick(() => {
        if (messagesContainerRef.value) {
            messagesContainerRef.value.scrollTop = messagesContainerRef.value.scrollHeight;
        }
    });
}

// Watch for socket changes (e.g. reconnection)
watch(() => socketStore.socket, (newSocket) => {
    if (newSocket) {
        setupSocketListeners(newSocket as unknown as Socket);
    }
});

onMounted(async () => {
  if (containerRef.value) {
    gsap.fromTo(containerRef.value,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: 'power3.out' }
    );
  }
  
  await updateConversationList();
  
  // Ensure connected
  if (!socketStore.isConnected) {
    socketStore.connect();
  }
  
  if (socketStore.socket) {
    setupSocketListeners(socketStore.socket as unknown as Socket);
  }
});

onUnmounted(() => {
    if (socketStore.socket) {
        socketStore.socket.off('newMessage', handleNewMessage);
        socketStore.socket.off('messageSent', handleMessageSent);
        socketStore.socket.off('messageRecalled', handleMessageRecalled);
        socketStore.socket.off('messagesRead', handleMessagesRead);
    }
});
</script>

<template>
  <div class="messages-page" ref="containerRef">
    
    <div class="messages-container">
      <!-- 会话列表 -->
      <GlassCard class="conversations-panel" :hoverable="false">
        <div class="panel-header">
            <div class="header-title-group">
                <h3>消息</h3>
                <span class="header-subtitle">You are my favorite notification.</span>
            </div>
            <button class="icon-btn" @click="showSearchModal = true" title="新对话">
                <span class="plus-icon">+</span>
            </button>
        </div>

        <div 
          v-for="conv in conversations"
          :key="conv.userId"
          class="conversation-item"
          :class="{ active: selectedConversation?.userId === conv.userId }"
          @click="selectConversation(conv)"
        >
          <div class="conv-avatar">{{ conv.username[0].toUpperCase() }}</div>
          <div class="conv-info">
            <div class="conv-header">
              <span class="conv-name">{{ conv.username }}</span>
              <span class="conv-time">{{ conv.lastTime }}</span>
            </div>
            <p class="conv-preview">{{ conv.lastMessage }}</p>
          </div>
          <span v-if="conv.unreadCount" class="unread-badge">{{ conv.unreadCount }}</span>
          <button class="delete-conv-btn" @click.stop="deleteConversation(conv)">×</button>
        </div>
        
        <div v-if="conversations.length === 0" class="empty-state">
          <p>暂无消息</p>
        </div>
      </GlassCard>
      
      <!-- 聊天面板 -->
      <GlassCard class="chat-panel" :hoverable="false">
        <template v-if="selectedConversation">
          <div class="chat-header">
            <span class="chat-name">{{ selectedConversation.username }}</span>
          </div>
          
          <div class="chat-messages" ref="messagesContainerRef">
            <div 
              v-for="msg in messages"
              :key="msg.id"
              class="message-item"
              :class="{ 'sent': msg.senderId === authStore.user?.id }"
            >
              <div v-if="msg.isRecalled" class="message-system">
                 {{ msg.senderId === authStore.user?.id ? '你' : selectedConversation.username }} 撤回了一条消息
              </div>
              <template v-else>
                  <div class="message-content-wrapper">
                      <div class="message-bubble" @contextmenu.prevent.stop="openMenu(msg)">
                          {{ msg.content }}
                          <!-- Context Menu -->
                          <div v-if="msg.showMenu" class="context-menu" v-click-outside="() => msg.showMenu = false">
                                <div v-if="canRecall(msg)" class="menu-item" @click="recallMessage(msg)">撤回</div>
                                <div v-else class="menu-item disabled">无法撤回</div>
                          </div>
                      </div>
                      <!-- Read Status -->
                      <span v-if="msg.senderId === authStore.user?.id" class="read-status">
                          {{ msg.isRead ? '已读' : '未读' }}
                      </span>
                  </div>
                  <span class="message-time">{{ msg.displayTime }}</span>
              </template>
            </div>
          </div>
          
          <div class="chat-input">
            <input
              v-model="newMessage"
              type="text"
              placeholder="Zooming into your inbox.Keeping us connected, always.You are the reason I type."
              @keyup.enter="sendMessage"
            />
            <button class="send-btn" @click="sendMessage">发送</button>
          </div>
        </template>
        
        <div v-else class="no-chat-selected">
          <p>选择一个会话开始聊天</p>
        </div>
      </GlassCard>
    </div>

    <!-- 用户搜索弹窗 -->
    <div v-if="showSearchModal" class="modal">
        <div class="modal-backdrop" @click="showSearchModal = false"></div>
        <GlassCard class="modal-card" :hoverable="false">
            <h2 class="modal-title">发起新聊天</h2>
            <div class="search-box">
                <input 
                    v-model="searchQuery" 
                    placeholder="搜索用户名..." 
                    class="search-input"
                    @keyup.enter="searchUsers" 
                />
                <button class="btn btn-primary" @click="searchUsers" :disabled="isSearching">
                    {{ isSearching ? '搜索中...' : '搜索' }}
                </button>
            </div>

            <div class="search-results">
                <div 
                    v-for="user in searchResults" 
                    :key="user.id" 
                    class="user-result-item"
                    @click="startChat(user)"
                >
                    <div class="conv-avatar sm">{{ user.username[0].toUpperCase() }}</div>
                    <span class="user-name">{{ user.username }}</span>
                </div>
                <p v-if="searchResults.length === 0 && searchQuery && !isSearching" class="no-results">
                    未找到用户
                </p>
            </div>
        </GlassCard>
    </div>

  </div>
</template>

<style scoped>
.messages-page {
  max-width: 1200px;
  margin: 0 auto;
  height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
}

/* Updated Layout without explicit page header, integrated into panels */

.messages-container {
  flex: 1;
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: var(--spacing-lg);
  min-height: 0;
}

.conversations-panel {
  padding: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
    padding: var(--spacing-md) var(--spacing-lg);
    border-bottom: 1px solid var(--accent-color-20);
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.panel-header h3 {
    font-size: 18px;
    font-weight: 600;
}

.header-title-group {
    display: flex;
    align-items: baseline;
    gap: 8px;
}

.header-subtitle {
    font-size: 11px;
    color: var(--text-muted);
    font-weight: 400;
}

.icon-btn {
    background: transparent;
    border: 1px solid var(--accent-color-40);
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--accent-color);
    cursor: pointer;
    transition: all 0.2s;
}
.icon-btn:hover {
    background: var(--accent-color);
    color: #000;
}
.plus-icon {
    font-size: 20px;
    line-height: 1;
    margin-top: -2px; /* visual center fix */
}

.conversation-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  cursor: pointer;
  border-bottom: 1px solid var(--accent-color-20);
  transition: background var(--transition-fast);
  position: relative;
}

.conversation-item:hover {
  background: var(--bg-card-hover);
}

.conversation-item.active {
  background: var(--accent-color-20);
}

.conv-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--accent-color-20);
  color: var(--accent-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 18px;
  flex-shrink: 0;
}
.conv-avatar.sm {
  width: 32px;
  height: 32px;
  font-size: 14px;
}

.conv-info {
  flex: 1;
  min-width: 0;
}

.conv-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.conv-name {
  font-weight: 600;
  color: var(--text-primary);
}

.conv-time {
  font-size: 12px;
  color: var(--text-muted);
}

.conv-preview {
  font-size: 14px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.unread-badge {
  background: var(--accent-color);
  color: #000;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
}

.chat-panel {
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
}

.chat-header {
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--accent-color-20);
}

.chat-name {
  font-size: 16px;
  font-weight: 600;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.message-item {
  display: flex;
  flex-direction: column;
  max-width: 70%;
}

.message-item.sent {
  align-self: flex-end;
}

.message-bubble {
  position: relative;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  font-size: 14px;
  line-height: 1.5;
}

.message-item.sent .message-bubble {
  background: var(--accent-color-20);
  color: var(--text-primary);
}

.message-time {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 4px;
  padding: 0 var(--spacing-sm);
}

.message-item.sent .message-time {
  text-align: right;
}

.delete-conv-btn {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: transparent;
    border: none;
    color: var(--text-muted);
    font-size: 20px;
    cursor: pointer;
    display: none;
    padding: 5px;
}
.conversation-item:hover .delete-conv-btn {
    display: block;
}
.delete-conv-btn:hover {
    color: #ff4d4f;
}

.message-system {
    text-align: center;
    color: var(--text-muted);
    font-size: 12px;
    margin: 4px 0;
}

.message-content-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
}
.message-item.sent .message-content-wrapper {
    align-items: flex-end;
}

.message-actions {
    font-size: 10px;
    margin-top: 2px;
    cursor: pointer;
    color: var(--accent-color);
    text-decoration: underline;
}

.read-status {
    font-size: 10px;
    color: var(--text-muted);
    margin-top: 2px;
}

.chat-input {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  border-top: 1px solid var(--accent-color-20);
}

.context-menu {
    position: absolute;
    top: 100%;
    right: 0;
    min-width: 100px;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid var(--accent-color-40);
    border-radius: 8px;
    z-index: 100;
    overflow: hidden;
    margin-top: 5px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
}

.menu-item {
    padding: 8px 16px;
    cursor: pointer;
    font-size: 13px;
    color: var(--text-primary);
    transition: background 0.2s;
    text-align: center;
}

.menu-item:hover {
    background: var(--accent-color-20);
}

.menu-item.disabled {
    color: var(--text-muted);
    cursor: not-allowed;
}

.chat-input input {
  flex: 1;
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--accent-color-20);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 14px;
}

.chat-input input:focus {
  outline: none;
  border-color: var(--accent-color-40);
}

.send-btn {
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--accent-color);
  border: none;
  border-radius: var(--radius-md);
  color: #000;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.send-btn:hover {
  box-shadow: var(--accent-glow);
}

.no-chat-selected,
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-muted);
}

/* Modal Styles */
.modal {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(2px);
}
.modal-card {
  position: relative;
  width: 400px;
  max-width: 90vw;
  padding: var(--spacing-xl);
  z-index: 2001;
}
.modal-title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: var(--spacing-lg);
}
.search-box {
    display: flex;
    gap: 8px;
    margin-bottom: var(--spacing-lg);
}
.search-input {
    flex: 1;
    padding: 8px 12px;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--accent-color-20);
    border-radius: var(--radius-md);
    color: var(--text-primary);
}
.btn-primary {
    background: var(--accent-color);
    color: #000;
    border: none;
    border-radius: var(--radius-md);
    padding: 0 16px;
    cursor: pointer;
}
.search-results {
    max-height: 300px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.user-result-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background 0.2s;
}
.user-result-item:hover {
    background: var(--bg-card-hover);
}
.user-name {
    font-size: 15px;
    color: var(--text-primary);
}
.no-results {
    text-align: center;
    color: var(--text-muted);
    padding: 20px 0;
}
</style>
