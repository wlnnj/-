<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import GlassCard from '../components/GlassCard.vue';
import axios from 'axios';
import { API_BASE } from '../config';

const router = useRouter();
const authStore = useAuthStore();
// const socketStore = useSocketStore();

// --- State ---
const greeting = ref('');
const unreadMessagesCount = ref(0);
const todayEvents = ref<any[]>([]);
const recentMemos = ref<any[]>([]);
const storageUsage = ref({ totalSize: 0, fileCount: 0 });
const isLoading = ref(true);

// --- Computed ---
const formattedStorage = computed(() => {
    const size = storageUsage.value.totalSize;
    if (size < 1024) return size + ' B';
    if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
    if (size < 1024 * 1024 * 1024) return (size / (1024 * 1024)).toFixed(1) + ' MB';
    return (size / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
});

const storagePercent = computed(() => {
    // Attempting to simulate a 5GB limit for the progress bar visual
    const LIMIT = 5 * 1024 * 1024 * 1024; 
    return Math.min((storageUsage.value.totalSize / LIMIT) * 100, 100);
});

// --- Methods ---
function setGreeting() {
    const hour = new Date().getHours();
    if (hour < 5) greeting.value = '夜深了，注意休息';
    else if (hour < 9) greeting.value = '早上好';
    else if (hour < 12) greeting.value = '上午好';
    else if (hour < 14) greeting.value = '中午好';
    else if (hour < 18) greeting.value = '下午好';
    else greeting.value = '晚上好';
}

async function fetchData() {
    if (!authStore.token) return;
    isLoading.value = true;
    try {
        const headers = { Authorization: `Bearer ${authStore.token}` };
        
        // Parallel requests
        const [msgRes, fileRes, memoRes, calendarRes] = await Promise.all([
            axios.get(`${API_BASE}/messages/unread-count`, { headers }),
            axios.get(`${API_BASE}/files/storage/usage`, { headers }).catch(() => ({ data: { totalSize: 0, fileCount: 0 }})),
            axios.get(`${API_BASE}/memos`, { headers }).catch(() => ({ data: [] })),
            axios.get(`${API_BASE}/calendar`, { headers }).catch(() => ({ data: [] }))
        ]);

        unreadMessagesCount.value = msgRes.data.count || 0;
        storageUsage.value = fileRes.data;
        recentMemos.value = memoRes.data.slice(0, 3);
        
        // Filter today's events
        const todayStr = new Date().toDateString();
        todayEvents.value = calendarRes.data.filter((e: any) => new Date(e.startTime).toDateString() === todayStr);

    } catch (e) {
        console.error('Failed to load dashboard data', e);
    } finally {
        isLoading.value = false;
    }
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
}

// --- Lifecycle ---
onMounted(() => {
    setGreeting();
    fetchData();
});
</script>

<template>
  <div class="home-dashboard">
    <div class="header-section">
      <h1 class="greeting">{{ greeting }}, {{ authStore.user?.username }}</h1>
      <p class="subtitle">今日概览</p>
    </div>

    <div class="dashboard-grid">
      <!-- Quick Stats -->
      <GlassCard class="dashboard-card stat-card" :delay="0" @click="router.push('/dashboard/messages')">
        <div class="stat-icon message-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        </div>
        <div class="stat-info">
            <span class="stat-value">{{ unreadMessagesCount }}</span>
            <span class="stat-label">未读消息</span>
        </div>
      </GlassCard>

      <GlassCard class="dashboard-card stat-card" :delay="0.1" @click="router.push('/dashboard/drive')">
        <div class="stat-icon storage-icon">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
        </div>
        <div class="stat-info">
            <span class="stat-value">{{ formattedStorage }}</span>
            <span class="stat-label">已用空间</span>
        </div>
        <div class="progress-bar">
            <div class="progress-fill" :style="{ width: storagePercent + '%' }"></div>
        </div>
      </GlassCard>

      <!-- Today's Schedule -->
      <GlassCard class="dashboard-card schedule-card" :delay="0.2" @click="router.push('/dashboard/calendar')">
        <div class="card-header">
            <h3>今日日程</h3>
            <span class="badge">{{ todayEvents.length }}</span>
        </div>
        <div class="schedule-list" v-if="todayEvents.length > 0">
            <div v-for="event in todayEvents" :key="event.id" class="schedule-item">
                <div class="time-dot"></div>
                <span class="event-title">{{ event.title }}</span>
            </div>
        </div>
        <div class="empty-state" v-else>
            <p>今日暂无安排</p>
        </div>
      </GlassCard>

      <!-- Recent Memos -->
      <GlassCard class="dashboard-card memos-card" :delay="0.3" @click="router.push('/dashboard/memos')">
        <div class="card-header">
            <h3>最近备忘</h3>
        </div>
        <div class="memos-list" v-if="recentMemos.length > 0">
            <div v-for="memo in recentMemos" :key="memo.id" class="memo-item">
                <span class="memo-content">{{ memo.content }}</span>
                <span class="memo-date">{{ formatDate(memo.createdAt) }}</span>
            </div>
        </div>
        <div class="empty-state" v-else>
            <p>随手记点什么...</p>
        </div>
      </GlassCard>
    </div>
  </div>
</template>

<style scoped>
.home-dashboard {
    max-width: 1200px;
    margin: 0 auto;
}

.header-section {
    margin-bottom: 2rem;
    color: var(--text-primary);
}

.greeting {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.subtitle {
    color: var(--text-secondary);
    font-size: 1.1rem;
}

.dashboard-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
}

/* Specific Card Layouts */
.stat-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 1.5rem;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    position: relative;
    overflow: hidden;
}

.stat-card:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.15);
}

.stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    color: white;
}

.message-icon {
    background: linear-gradient(135deg, #FF6B6B 0%, #EE5253 100%);
    box-shadow: 0 4px 12px rgba(238, 82, 83, 0.3);
}

.storage-icon {
    background: linear-gradient(135deg, #4834d4 0%, #686de0 100%);
    box-shadow: 0 4px 12px rgba(104, 109, 224, 0.3);
}

.stat-info {
    display: flex;
    flex-direction: column;
}

.stat-value {
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.2;
    color: var(--text-primary);
}

.stat-label {
    font-size: 0.9rem;
    color: var(--text-secondary);
}

.progress-bar {
    height: 6px;
    background: rgba(255,255,255,0.1);
    border-radius: 3px;
    margin-top: 1rem;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: var(--primary-color);
    border-radius: 3px;
}

/* List Cards */
.schedule-card, .memos-card {
    grid-column: span 1;
    min-height: 200px;
    cursor: pointer;
    transition: transform 0.2s ease;
}

.schedule-card:hover, .memos-card:hover {
    transform: translateY(-5px);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    padding-bottom: 0.5rem;
}

.card-header h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
}

.badge {
    background: var(--surface-hover);
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 0.8rem;
    color: var(--text-secondary);
}

.empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    color: var(--text-secondary);
    font-style: italic;
}

.schedule-item {
    display: flex;
    align-items: center;
    padding: 0.8rem 0;
    border-bottom: 1px dashed rgba(255,255,255,0.05);
}

.time-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent-green);
    margin-right: 12px;
    box-shadow: 0 0 8px var(--accent-green);
}

.event-title {
    color: var(--text-primary);
}

.memo-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.8rem 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
}

.memo-content {
    color: var(--text-primary);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 70%;
}

.memo-date {
    font-size: 0.8rem;
    color: var(--text-secondary);
}

/* Responsive */
@media (max-width: 768px) {
    .dashboard-grid {
        grid-template-columns: 1fr;
    }
}
</style>
