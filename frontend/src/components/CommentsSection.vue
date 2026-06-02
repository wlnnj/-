<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../stores/auth';
import { API_BASE } from '../config';

const props = defineProps<{
    postId: string;
}>();

const emit = defineEmits<{
    (e: 'comment-added'): void;
}>();

const authStore = useAuthStore();

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    user: {
        id: string;
        username: string;
        accentColor: string;
    };
}

const comments = ref<Comment[]>([]);
const commentContent = ref('');
const isLoading = ref(false);
const isSubmitting = ref(false);

async function fetchComments() {
    isLoading.value = true;
    try {
        const { data } = await axios.get(`${API_BASE}/comments/post/${props.postId}`);
        comments.value = data;
    } catch (error) {
        console.error('获取评论失败:', error);
    } finally {
        isLoading.value = false;
    }
}

async function submitComment() {
    if (!commentContent.value.trim() || isSubmitting.value) return;

    if (!authStore.isAuthenticated) {
        alert('请先登录');
        return;
    }

    isSubmitting.value = true;
    try {
        const { data } = await axios.post(`${API_BASE}/comments`, {
            postId: props.postId,
            content: commentContent.value
        });
        
        comments.value.unshift(data);
        commentContent.value = '';
        emit('comment-added');
    } catch (error) {
        console.error('发表评论失败:', error);
        alert('发表评论失败，请重试');
    } finally {
        isSubmitting.value = false;
    }
}

async function deleteComment(commentId: string) {
    if (!confirm('确定要删除这条评论吗？')) return;

    try {
        await axios.delete(`${API_BASE}/comments/${commentId}`);
        comments.value = comments.value.filter(c => c.id !== commentId);
    } catch (error) {
        console.error('删除评论失败:', error);
        alert('删除失败');
    }
}

function canDelete(comment: Comment) {
    if (!authStore.user) return false;
    return authStore.isAdmin || (comment.user && authStore.user.id === comment.user.id);
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

onMounted(() => {
    fetchComments();
});
</script>

<template>
    <div class="comments-section">
        <h3 class="section-title">评论 ({{ comments.length }})</h3>
        
        <!-- 评论列表 -->
        <div v-if="isLoading" class="loading">加载中...</div>
        <div v-else-if="comments.length === 0" class="empty">暂无评论，快来抢沙发吧~</div>
        
        <div v-else class="comments-list">
            <div v-for="comment in comments" :key="comment.id" class="comment-item">
                <div class="comment-avatar" :class="`avatar-${comment.user?.accentColor || 'cyber-blue'}`">
                    {{ comment.user?.username?.[0]?.toUpperCase() || '?' }}
                </div>
                <div class="comment-body">
                    <div class="comment-header">
                        <span class="comment-username">{{ comment.user?.username || '已注销用户' }}</span>
                        <span class="comment-time">{{ formatDate(comment.createdAt) }}</span>
                    </div>
                    <div class="comment-content">{{ comment.content }}</div>
                </div>
                <button 
                    v-if="canDelete(comment)" 
                    class="delete-btn"
                    @click="deleteComment(comment.id)"
                >
                    ×
                </button>
            </div>
        </div>
        
        <!-- 发表评论 -->
        <div class="comment-form">
            <input 
                v-model="commentContent"
                type="text" 
                class="comment-input"
                placeholder="写下你的评论..."
                @keyup.enter="submitComment"
                :disabled="isSubmitting"
            />
            <button 
                class="send-btn" 
                @click="submitComment"
                :disabled="!commentContent.trim() || isSubmitting"
            >
                发送
            </button>
        </div>
    </div>
</template>

<style scoped>
.comments-section {
    margin-top: var(--spacing-md);
    padding-top: var(--spacing-md);
    border-top: 1px solid var(--accent-color-20);
}

.section-title {
    font-size: 14px;
    color: var(--text-secondary);
    margin-bottom: var(--spacing-md);
}

.comments-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-md);
    max-height: 300px;
    overflow-y: auto;
}

.comment-item {
    display: flex;
    gap: var(--spacing-sm);
    position: relative;
}

.comment-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--bg-card);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    flex-shrink: 0;
    color: var(--accent-color);
    border: 1px solid var(--accent-color-20);
}

.avatar-cyber-blue { color: rgb(0, 200, 255); border-color: rgba(0, 200, 255, 0.3); }
.avatar-neon-green { color: rgb(0, 255, 128); border-color: rgba(0, 255, 128, 0.3); }
.avatar-lava-red { color: rgb(255, 60, 60); border-color: rgba(255, 60, 60, 0.3); }

.comment-body {
    flex: 1;
    font-size: 13px;
}

.comment-header {
    display: flex;
    gap: var(--spacing-sm);
    align-items: baseline;
    margin-bottom: 2px;
}

.comment-username {
    font-weight: 600;
    color: var(--text-primary);
}

.comment-time {
    font-size: 11px;
    color: var(--text-muted);
}

.comment-content {
    color: var(--text-secondary);
    line-height: 1.4;
}

.delete-btn {
    opacity: 0;
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    font-size: 16px;
    padding: 0 var(--spacing-xs);
    transition: all var(--transition-fast);
}

.comment-item:hover .delete-btn {
    opacity: 1;
}

.delete-btn:hover {
    color: rgb(255, 60, 60);
}

.comment-form {
    display: flex;
    gap: var(--spacing-sm);
}

.comment-input {
    flex: 1;
    background: var(--bg-card);
    border: 1px solid var(--accent-color-20);
    border-radius: var(--radius-sm);
    padding: var(--spacing-sm);
    color: var(--text-primary);
    font-size: 13px;
    outline: none;
    transition: border-color var(--transition-fast);
}

.comment-input:focus {
    border-color: var(--accent-color-40);
}

.send-btn {
    padding: 0 var(--spacing-md);
    background: var(--accent-color-20);
    color: var(--accent-color);
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-size: 13px;
    transition: all var(--transition-fast);
}

.send-btn:hover:not(:disabled) {
    background: var(--accent-color-40);
}

.send-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.loading, .empty {
    text-align: center;
    color: var(--text-muted);
    font-size: 13px;
    padding: var(--spacing-md) 0;
}
</style>
