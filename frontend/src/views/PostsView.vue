<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import GlassCard from '../components/GlassCard.vue';
import CommentsSection from '../components/CommentsSection.vue';
import { gsap } from 'gsap';
import { useAuthStore } from '../stores/auth';
import { API_BASE } from '../config';

const authStore = useAuthStore();

interface Post {
  id: string;
  content: string;
  images: string[];
  commentCount: number;
  createdAt: string;
  user: {
      id: string;
      username: string;
      accentColor: string;
  };
  showComments?: boolean; // 前端状态
}

const posts = ref<Post[]>([]);
const newPostContent = ref('');
const showPostModal = ref(false);
const isLoading = ref(false);

const containerRef = ref<HTMLElement | null>(null);

async function fetchPosts() {
    isLoading.value = true;
    try {
        const { data } = await axios.get(`${API_BASE}/posts?limit=50`);
        posts.value = data.posts.map((p: any) => ({ ...p, showComments: false }));
        
        // 动画
        if (containerRef.value) {
            // nextTick maybe needed, but axios is async so DOM update follows
            setTimeout(() => {
                const cards = containerRef.value?.querySelectorAll('.post-card');
                if (cards) {
                    gsap.fromTo(cards,
                        { opacity: 0, y: 30 },
                        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' }
                    );
                }
            }, 100);
        }
    } catch (error) {
        console.error('获取帖子失败:', error);
    } finally {
        isLoading.value = false;
    }
}

async function createPost() {
    if (!newPostContent.value.trim()) return;

    try {
        await axios.post(`${API_BASE}/posts`, {
            content: newPostContent.value,
            images: [] // TODO: 图片上传
        });
        
        showPostModal.value = false;
        newPostContent.value = '';
        fetchPosts(); // 刷新列表
    } catch (error) {
        console.error('发布帖子失败:', error);
        alert('发布失败');
    }
}

async function deletePost(postId: string) {
    if (!confirm('确定要删除这条帖子吗？')) return;

    try {
        await axios.delete(`${API_BASE}/posts/${postId}`);
        // Remove from list
        posts.value = posts.value.filter(p => p.id !== postId);
    } catch (error) {
        console.error('删除帖子失败:', error);
        alert('删除失败，请稍后重试');
    }
}

function toggleComments(post: Post) {
    post.showComments = !post.showComments;
}

function handleCommentAdded(post: Post) {
    post.commentCount++;
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
  fetchPosts();
});
</script>

<template>
  <div class="posts-page">
    <div class="page-header">
      <h1 class="page-title">社区帖子</h1>
      <button class="btn btn-primary" @click="showPostModal = true" v-if="authStore.isAuthenticated">发布帖子</button>
    </div>
    
    <div v-if="isLoading" class="loading-state">
        加载中...
    </div>
    
    <div v-else class="posts-feed" ref="containerRef">
      <GlassCard 
        v-for="post in posts" 
        :key="post.id"
        class="post-card"
        :id="`post-${post.id}`"
      >
        <div class="post-header">
          <div class="post-avatar" :class="`avatar-${post.user?.accentColor || 'cyber-blue'}`">
              {{ post.user?.username?.[0]?.toUpperCase() || '?' }}
          </div>
          <div class="post-meta">
            <span class="post-username">{{ post.user?.username || '用户' }}</span>
            <span class="post-time">{{ formatDate(post.createdAt) }}</span>
          </div>
        </div>
        <p class="post-content">{{ post.content }}</p>
        <div v-if="post.images && post.images.length" class="post-images">
          <img v-for="(img, idx) in post.images" :key="idx" :src="img" class="post-image" />
        </div>
        
        <div class="post-footer">
          <button class="action-btn" @click="toggleComments(post)">
            💬 {{ post.commentCount }} 评论
          </button>
          
          <button 
            v-if="authStore.user && (authStore.user.id === post.user?.id || authStore.isAdmin)" 
            class="action-btn delete-btn"
            @click="deletePost(post.id)"
          >
            删除
          </button>
        </div>
        
        <!-- 评论区 -->
        <div v-if="post.showComments" class="post-comments">
            <CommentsSection 
                :postId="post.id" 
                @comment-added="handleCommentAdded(post)"
            />
        </div>
      </GlassCard>
    </div>
    
    <!-- 发布弹窗 -->
    <div v-if="showPostModal" class="post-modal">
      <div class="modal-backdrop" @click="showPostModal = false"></div>
      <GlassCard class="modal-card" :hoverable="false">
        <h2 class="modal-title">发布帖子</h2>
        <textarea 
          v-model="newPostContent" 
          class="post-textarea" 
          placeholder="分享你的想法..."
        ></textarea>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="showPostModal = false">取消</button>
          <button class="btn btn-primary" @click="createPost">发布</button>
        </div>
      </GlassCard>
    </div>
  </div>
</template>

<style scoped>
.posts-page {
  max-width: 700px;
  margin: 0 auto;
  padding-bottom: var(--spacing-2xl);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.page-title {
  font-size: 28px;
  font-weight: 600;
}

.loading-state {
    text-align: center;
    padding: var(--spacing-2xl);
    color: var(--text-secondary);
}

.btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal);
  border: 1px solid transparent;
}

.btn-primary {
  background: var(--accent-color);
  color: #000;
}

.btn-primary:hover {
  box-shadow: var(--accent-glow);
}

.btn-secondary {
  background: transparent;
  color: var(--text-secondary);
  border-color: var(--accent-color-20);
}

.btn-secondary:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
}

.posts-feed {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.post-card {
  padding: var(--spacing-lg);
}

.post-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.post-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--bg-card);
  color: var(--accent-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  border: 1px solid var(--accent-color-20);
}

.avatar-cyber-blue { color: rgb(0, 200, 255); border-color: rgba(0, 200, 255, 0.3); }
.avatar-neon-green { color: rgb(0, 255, 128); border-color: rgba(0, 255, 128, 0.3); }
.avatar-lava-red { color: rgb(255, 60, 60); border-color: rgba(255, 60, 60, 0.3); }

.post-meta {
  display: flex;
  flex-direction: column;
}

.post-username {
  font-weight: 600;
  color: var(--text-primary);
}

.post-time {
  font-size: 12px;
  color: var(--text-muted);
}

.post-content {
  font-size: 15px;
  line-height: 1.6;
  color: var(--text-primary);
  white-space: pre-wrap;
}

.post-images {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
}

.post-image {
  width: 100%;
  border-radius: var(--radius-md);
  object-fit: cover;
}

.post-footer {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--accent-color-20);
}

.action-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 14px;
  cursor: pointer;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.action-btn:hover {
  background: var(--bg-card);
  color: var(--accent-color);
}

.delete-btn {
    color: #ff4757;
    margin-left: auto; /* Push to right if flex container allows, or just margin */
}

.delete-btn:hover {
    background: rgba(255, 71, 87, 0.1);
    color: #ff6b81;
}

.post-footer {
    display: flex; /* Ensure flex for alignment */
    gap: var(--spacing-md);
    /* Existing styles... */
    margin-top: var(--spacing-md);
    padding-top: var(--spacing-md);
    border-top: 1px solid var(--accent-color-20);
}
.post-modal {
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
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
}

.modal-card {
  position: relative;
  width: 500px;
  max-width: 90vw;
  padding: var(--spacing-xl);
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
}

.post-textarea {
  width: 100%;
  min-height: 150px;
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--accent-color-20);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 15px;
  resize: vertical;
}

.post-textarea:focus {
  outline: none;
  border-color: var(--accent-color-40);
}

.modal-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  margin-top: var(--spacing-lg);
}
</style>
