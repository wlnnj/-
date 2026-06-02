<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useSocketStore } from '../stores/socket';
import { useTheme, type ThemeColor } from '../composables/useTheme';
import GlassCard from './GlassCard.vue';
import axios from 'axios';
import { API_BASE } from '../config';

const router = useRouter();
const authStore = useAuthStore();
const socketStore = useSocketStore();
const { currentTheme, setTheme, themes } = useTheme();

// 未读消息数
const unreadCount = ref(0);
let fetchTimeout: number | undefined;

async function fetchUnreadCount() {
  if (!authStore.isAuthenticated) return;
  
  // Throttle: If a request is already pending or was just made, delay this one
  if (fetchTimeout) clearTimeout(fetchTimeout);
  
  fetchTimeout = window.setTimeout(async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/messages/unread-count`, {
          headers: { Authorization: `Bearer ${authStore.token}` }
        });
        unreadCount.value = data.count;
      } catch (error) {
        // 静默失败
      }
  }, 1000); // 1s Debounce
}

// 实时时钟
const currentTime = ref('');
const currentDate = ref('');

function updateTime() {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString('zh-CN', { 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  currentDate.value = now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short'
  });
}

let timeInterval: number;
let unreadInterval: number;

onMounted(() => {
  updateTime();
  timeInterval = window.setInterval(updateTime, 1000);
  
  // 初始化
  if (authStore.isAuthenticated) {
      socketStore.connect();
      fetchUnreadCount();
  }
  
  unreadInterval = window.setInterval(fetchUnreadCount, 30000); // 每30秒刷新
  
  // 监听消息已读事件，立即刷新未读数
  window.addEventListener('messages-read', fetchUnreadCount);
});

// 监听 Socket 新消息
function handleGlobalNewMessage(message: any) {
    // 如果不是自己发的，且当前不在消息页面(或消息页面未处理)，则增加未读数
    // 简单处理：收到新消息就刷新未读数，最准确
    if (message.senderId !== authStore.user?.id) {
         fetchUnreadCount(); // 直接从后端拉取最新未读数，确保准确
    }
}

watch(() => socketStore.socket, (socket) => {
    if (!socket) return;
    
    // 只监听一次，避免重复
    socket.off('newMessage', handleGlobalNewMessage); 
    socket.on('newMessage', handleGlobalNewMessage);
}, { immediate: true });

onUnmounted(() => {
  clearInterval(timeInterval);
  clearInterval(unreadInterval);
  window.removeEventListener('messages-read', fetchUnreadCount);
  
  if (socketStore.socket) {
      socketStore.socket.off('newMessage', handleGlobalNewMessage);
  }
});

// 监听登录状态变化
watch(() => authStore.isAuthenticated, (isAuth) => {
  if (isAuth) {
      socketStore.connect();
      fetchUnreadCount();
  } else {
      socketStore.disconnect();
      unreadCount.value = 0;
  }
});

// 主题切换
const showThemePanel = ref(false);

function selectTheme(theme: ThemeColor) {
  setTheme(theme);
  authStore.updateAccentColor(theme);
  showThemePanel.value = false;
}

// 导航项
const navItems = [
  { name: 'DashboardHome', label: '首页' },
  { name: 'Memos', label: '备忘录' },
  { name: 'Posts', label: '帖子' },
  { name: 'Media', label: '媒体' },
  { name: 'Music', label: '音乐' },
  { name: 'Drive', label: '云盘' },
  { name: 'Calendar', label: '日历' },
  { name: 'Whiteboard', label: '白板' },
  { name: 'Messages', label: '消息' },
];

function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>

<template>
  <header class="top-nav">
    <div class="nav-left">
      <div class="logo" @click="router.push('/dashboard')">
        <img src="/image.png" alt="ZKY" class="logo-image" />
        <span class="logo-subtitle">私有云博</span>
      </div>
    </div>
    
    <nav class="nav-center">
      <router-link 
        v-for="item in navItems" 
        :key="item.name"
        :to="{ name: item.name }"
        class="nav-link"
      >
        {{ item.label }}
        <span v-if="item.name === 'Messages' && unreadCount > 0" class="unread-badge">
          {{ unreadCount > 99 ? '99+' : unreadCount }}
        </span>
      </router-link>
      
      <router-link 
        v-if="authStore.isAdmin"
        :to="{ name: 'Admin' }"
        class="nav-link nav-link--admin"
      >
        管理后台
      </router-link>
    </nav>
    
    <div class="nav-right">
      <!-- 实时时钟 -->
      <div class="clock">
        <span class="clock-time">{{ currentTime }}</span>
        <span class="clock-date">{{ currentDate }}</span>
      </div>
      
      <!-- 主题切换 -->
      <div class="theme-switcher">
        <button 
          class="theme-btn"
          @click="showThemePanel = !showThemePanel"
        >
          <span class="theme-dot"></span>
        </button>
        
        <GlassCard 
          v-if="showThemePanel" 
          class="theme-panel"
          :hoverable="false"
        >
          <div 
            v-for="theme in themes" 
            :key="theme"
            class="theme-option"
            :class="{ active: currentTheme === theme }"
            :data-theme="theme"
            @click="selectTheme(theme)"
          >
            <span class="theme-option-dot" :data-theme="theme"></span>
            <span>{{ 
              theme === 'cyber-blue' ? '赛博蓝' :
              theme === 'neon-green' ? '荧光绿' : '岩浆红'
            }}</span>
          </div>
        </GlassCard>
      </div>
      
      <!-- 用户信息 -->
      <div class="user-info" v-if="authStore.user">
        <span class="username">{{ authStore.user.username }}</span>
        <button class="logout-btn" @click="handleLogout">退出</button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-xl);
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--accent-color-20);
  z-index: 1000;
}

.nav-left {
  display: flex;
  align-items: center;
}

.nav-center {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--spacing-md);
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.logo {
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.logo:hover {
  transform: scale(1.05);
}

.logo-image {
  height: 32px;
  object-fit: contain;
  margin-bottom: 2px;
}

.logo-subtitle {
  font-size: 10px;
  color: var(--text-muted);
  letter-spacing: 4px;
}

.nav-links {
  display: flex;
  gap: var(--spacing-md);
}

.nav-link {
  padding: var(--spacing-sm) var(--spacing-md);
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 14px;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.nav-link:hover {
  color: var(--text-primary);
  background: var(--bg-card);
}

.nav-link.router-link-active {
  color: var(--accent-color);
  background: var(--accent-color-20);
}

.nav-link--admin {
  color: var(--accent-color);
}

.unread-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  margin-left: 4px;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  background: #ff4757;
  border-radius: 9px;
}

.search-box {
  display: flex;
  width: 100%;
  border: 1px solid var(--accent-color-20);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: all var(--transition-normal);
}

.search-box:focus-within {
  border-color: var(--accent-color-40);
  box-shadow: 0 0 10px var(--accent-color-20);
}

.search-input {
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-md);
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
}

.search-input::placeholder {
  color: var(--text-muted);
}

.search-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--accent-color-20);
  border: none;
  color: var(--accent-color);
  font-size: 14px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.search-btn:hover {
  background: var(--accent-color-40);
}

.nav-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.clock {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.clock-time {
  font-size: 18px;
  font-weight: 600;
  font-family: var(--font-mono);
  color: var(--accent-color);
}

.clock-date {
  font-size: 11px;
  color: var(--text-muted);
}

.theme-switcher {
  position: relative;
}

.theme-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--bg-card);
  border: 1px solid var(--accent-color-20);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.theme-btn:hover {
  border-color: var(--accent-color-40);
  box-shadow: var(--accent-glow);
}

.theme-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--accent-color);
}

.theme-panel {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: var(--spacing-sm);
  padding: var(--spacing-sm);
  min-width: 140px;
}

.theme-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--text-secondary);
  font-size: 14px;
}

.theme-option:hover {
  background: var(--bg-card-hover);
  color: var(--text-primary);
}

.theme-option.active {
  color: var(--accent-color);
}

.theme-option-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.theme-option-dot[data-theme="cyber-blue"] {
  background: rgb(0, 200, 255);
}

.theme-option-dot[data-theme="neon-green"] {
  background: rgb(0, 255, 128);
}

.theme-option-dot[data-theme="lava-red"] {
  background: rgb(255, 60, 60);
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.username {
  color: var(--text-primary);
  font-size: 14px;
}

.logout-btn {
  padding: var(--spacing-xs) var(--spacing-md);
  background: transparent;
  border: 1px solid var(--accent-color-20);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-size: 12px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.logout-btn:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
}

.search-box {
    position: relative;
}

.search-results {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: var(--spacing-sm);
    max-height: 400px;
    overflow-y: auto;
    z-index: 1001;
    border-radius: var(--radius-md) !important;
    padding: var(--spacing-sm) !important;
}

.search-loading,
.search-empty {
    padding: var(--spacing-md);
    text-align: center;
    color: var(--text-secondary);
    font-size: 14px;
}

.result-category {
    margin-bottom: var(--spacing-md);
}

.result-category:last-child {
    margin-bottom: 0;
}

.category-title {
    font-size: 12px;
    color: var(--text-muted);
    margin-bottom: var(--spacing-xs);
    padding-left: var(--spacing-sm);
}

.result-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-sm) var(--spacing-md);
    cursor: pointer;
    border-radius: var(--radius-sm);
    transition: background-color var(--transition-fast);
}

.result-item:hover {
    background-color: var(--bg-card-hover);
}

.result-icon {
    font-size: 16px;
    width: 24px;
    text-align: center;
}

.result-text {
    flex: 1;
    font-size: 14px;
    color: var(--text-primary);
}

.one-line {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
