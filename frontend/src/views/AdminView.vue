<script setup lang="ts">
import { ref, onMounted } from 'vue';
import GlassCard from '../components/GlassCard.vue';
import { gsap } from 'gsap';
import axios from 'axios';
import { useAuthStore } from '../stores/auth';
import { API_BASE } from '../config';

const authStore = useAuthStore();

interface UserStats {
  id: string;
  username: string;
  role: string;
  fileCount: number;
  storageUsed: number;
  createdAt: string;
  isLocked: boolean;
}

interface SystemStats {
  totalUsers: number;
  totalFiles: number;
  totalStorage: number;
  storageLimit: number;
}

const users = ref<UserStats[]>([]);
const systemStats = ref<SystemStats>({
  totalUsers: 0,
  totalFiles: 0,
  totalStorage: 0,
  storageLimit: 10737418240, // 10GB
});
const loading = ref(true);
const error = ref('');

// 歌曲求助
interface SongRequest {
  id: string;
  songName: string;
  artistName?: string;
  username: string;
  createdAt: string;
}
const songRequests = ref<SongRequest[]>([]);

const containerRef = ref<HTMLElement | null>(null);

onMounted(async () => {
  await fetchData();
  if (containerRef.value) {
    gsap.fromTo(containerRef.value,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
    );
  }
});

async function fetchData() {
  loading.value = true;
  error.value = '';
  try {
    const [statsRes, usersRes, requestsRes] = await Promise.all([
      axios.get(`${API_BASE}/admin/stats`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      }),
      axios.get(`${API_BASE}/admin/users`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      }),
      axios.get(`${API_BASE}/song-requests`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      }).catch(() => ({ data: [] })) // 如果失败返回空数组
    ]);
    systemStats.value = statsRes.data;
    users.value = usersRes.data;
    songRequests.value = requestsRes.data;
  } catch (err: any) {
    error.value = err.response?.data?.message || '获取数据失败';
    console.error('Admin fetch error:', err);
  } finally {
    loading.value = false;
  }
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}

async function toggleLock(user: UserStats) {
  try {
    const endpoint = user.isLocked ? 'unlock' : 'lock';
    await axios.put(`${API_BASE}/admin/users/${user.id}/${endpoint}`, {}, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    user.isLocked = !user.isLocked;
  } catch (err: any) {
    alert(err.response?.data?.message || '操作失败');
  }
}

async function deleteRequest(id: string) {
  if (!confirm('确定删除这条求助？')) return;
  try {
    await axios.delete(`${API_BASE}/song-requests/${id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    songRequests.value = songRequests.value.filter(r => r.id !== id);
  } catch (err: any) {
    alert('删除失败');
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('zh-CN');
}
</script>

<template>
  <div class="admin-page" ref="containerRef">
    <div class="page-header">
      <h1 class="page-title">管理后台</h1>
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <p>加载中...</p>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button class="btn btn-primary" @click="fetchData">重试</button>
    </div>
    
    <!-- Content -->
    <template v-else>
    <!-- 系统统计 -->
    <div class="stats-grid">
      <GlassCard class="stat-card">
        <span class="stat-value">{{ systemStats.totalUsers }}</span>
        <span class="stat-label">用户总数</span>
      </GlassCard>
      <GlassCard class="stat-card">
        <span class="stat-value">{{ systemStats.totalFiles }}</span>
        <span class="stat-label">文件总数</span>
      </GlassCard>
      <GlassCard class="stat-card">
        <span class="stat-value">{{ formatSize(systemStats.totalStorage) }}</span>
        <span class="stat-label">已用存储</span>
      </GlassCard>
      <GlassCard class="stat-card">
        <span class="stat-value">{{ formatSize(systemStats.storageLimit) }}</span>
        <span class="stat-label">存储上限</span>
      </GlassCard>
    </div>
    
    <!-- 用户管理 -->
    <h2 class="section-title">用户管理</h2>
    <GlassCard class="users-table" :hoverable="false">
      <div class="table-header">
        <span class="col-user">用户名</span>
        <span class="col-role">角色</span>
        <span class="col-files">文件数</span>
        <span class="col-storage">存储占用</span>
        <span class="col-date">注册日期</span>
        <span class="col-actions">操作</span>
      </div>
      
      <div 
        v-for="user in users"
        :key="user.id"
        class="table-row"
        :class="{ locked: user.isLocked }"
      >
        <span class="col-user">
          <span class="user-avatar">{{ user.username[0].toUpperCase() }}</span>
          {{ user.username }}
        </span>
        <span class="col-role">
          <span class="role-badge" :class="user.role">{{ user.role }}</span>
        </span>
        <span class="col-files">{{ user.fileCount }}</span>
        <span class="col-storage">{{ formatSize(user.storageUsed) }}</span>
        <span class="col-date">{{ user.createdAt }}</span>
        <span class="col-actions">
          <button 
            class="action-btn"
            :class="{ locked: user.isLocked }"
            @click="toggleLock(user)"
          >
            {{ user.isLocked ? '解锁' : '锁定' }}
          </button>
        </span>
      </div>
    </GlassCard>

    <!-- 歌曲求助 -->
    <h2 class="section-title">歌曲求助</h2>
    <GlassCard class="requests-table" :hoverable="false">
      <div v-if="songRequests.length === 0" class="empty-requests">
        <p>暂无歌曲求助</p>
      </div>
      <div v-else class="request-list">
        <div 
          v-for="req in songRequests" 
          :key="req.id"
          class="request-item"
        >
          <div class="request-info">
            <span class="request-user">{{ req.username }}</span>
            <span class="request-song">{{ req.songName }}</span>
            <span class="request-artist" v-if="req.artistName">- {{ req.artistName }}</span>
            <span class="request-date">{{ formatDate(req.createdAt) }}</span>
          </div>
          <button class="delete-btn" @click="deleteRequest(req.id)">删除</button>
        </div>
      </div>
    </GlassCard>
    </template>
  </div>
</template>

<style scoped>
.admin-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: var(--spacing-xl);
}

.page-title {
  font-size: 28px;
  font-weight: 600;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary);
}

.error-state p {
  color: #ef4444;
  margin-bottom: 20px;
}

.btn-primary {
  background: var(--accent-color);
  color: #000;
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
}

.stat-card {
  text-align: center;
  padding: var(--spacing-xl);
}

.stat-value {
  display: block;
  font-size: 32px;
  font-weight: 700;
  color: var(--accent-color);
  margin-bottom: var(--spacing-sm);
}

.stat-label {
  font-size: 14px;
  color: var(--text-secondary);
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
}

.users-table {
  padding: 0;
  overflow: hidden;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 1.5fr 100px 80px 120px 120px 100px;
  padding: var(--spacing-md) var(--spacing-lg);
  align-items: center;
}

.table-header {
  background: var(--bg-secondary);
  font-size: 12px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.table-row {
  border-bottom: 1px solid var(--accent-color-20);
  transition: background var(--transition-fast);
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:hover {
  background: var(--bg-card-hover);
}

.table-row.locked {
  opacity: 0.6;
}

.col-user {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--accent-color-20);
  color: var(--accent-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.role-badge {
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

.role-badge.admin {
  background: var(--accent-color-20);
  color: var(--accent-color);
}

.role-badge.user {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-secondary);
}

.col-files,
.col-storage,
.col-date {
  font-size: 14px;
  color: var(--text-secondary);
}

.action-btn {
  padding: var(--spacing-xs) var(--spacing-md);
  background: transparent;
  border: 1px solid var(--accent-color-20);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-size: 12px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.action-btn:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
}

.action-btn.locked {
  border-color: rgb(255, 100, 100);
  color: rgb(255, 100, 100);
}

/* 歌曲求助样式 */
.requests-table {
  padding: var(--spacing-md);
}

.empty-requests {
  text-align: center;
  padding: 40px;
  color: var(--text-secondary);
}

.request-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.request-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: rgba(255,255,255,0.03);
  border-radius: 8px;
  transition: background 0.2s;
}

.request-item:hover {
  background: rgba(255,255,255,0.06);
}

.request-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.request-user {
  background: var(--accent-color);
  color: #000;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.request-song {
  font-weight: 600;
  color: var(--text-primary);
}

.request-artist {
  color: var(--text-secondary);
}

.request-date {
  color: var(--text-muted);
  font-size: 12px;
}

.delete-btn {
  background: rgba(255, 100, 100, 0.1);
  border: 1px solid rgba(255, 100, 100, 0.3);
  color: rgb(255, 100, 100);
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.delete-btn:hover {
  background: rgba(255, 100, 100, 0.2);
}
</style>
