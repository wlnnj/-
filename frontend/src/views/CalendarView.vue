<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import GlassCard from '../components/GlassCard.vue';
import axios from 'axios';
import { useAuthStore } from '../stores/auth';
import { API_BASE } from '../config';

const authStore = useAuthStore();

const currentDate = ref(new Date());
const selectedDate = ref<Date | null>(null);

// Event Modal
const showAddEvent = ref(false);
const newEventTitle = ref('');
const newEventDesc = ref('');
const newEventDate = ref('');

const calendarRef = ref<HTMLElement | null>(null);

// 获取当前月份的天数
const daysInMonth = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  return new Date(year, month + 1, 0).getDate();
});

// 获取当月第一天是星期几
const firstDayOfMonth = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  return new Date(year, month, 1).getDay();
});

// 生成日历格子
const calendarDays = computed(() => {
  const days = [];
  const prevMonthDays = firstDayOfMonth.value;
  
  // 上月填充
  for (let i = 0; i < prevMonthDays; i++) {
    days.push({ day: null, isCurrentMonth: false });
  }
  
  // 当月
  for (let i = 1; i <= daysInMonth.value; i++) {
    days.push({ day: i, isCurrentMonth: true });
  }
  
  return days;
});

const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', 
                    '七月', '八月', '九月', '十月', '十一月', '十二月'];

const currentMonthYear = computed(() => {
  return `${currentDate.value.getFullYear()}年 ${monthNames[currentDate.value.getMonth()]}`;
});

const isToday = (day: number | null) => {
  if (!day) return false;
  const today = new Date();
  return today.getDate() === day && 
         today.getMonth() === currentDate.value.getMonth() &&
         today.getFullYear() === currentDate.value.getFullYear();
};

function prevMonth() {
  const newDate = new Date(currentDate.value);
  newDate.setMonth(newDate.getMonth() - 1);
  currentDate.value = newDate;
}

function nextMonth() {
  const newDate = new Date(currentDate.value);
  newDate.setMonth(newDate.getMonth() + 1);
  currentDate.value = newDate;
}

function selectDate(day: number | null) {
  if (!day) return;
  selectedDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth(),
    day
  );
  // Pre-fill date string
  const m = (selectedDate.value.getMonth() + 1).toString().padStart(2, '0');
  const d = selectedDate.value.getDate().toString().padStart(2, '0');
  newEventDate.value = `${selectedDate.value.getFullYear()}-${m}-${d}`;
}

onMounted(async () => {
  fetchEvents();
});

interface CalendarEvent {
   id: string;
   title: string;
   description?: string;
   startTime: string; // ISO
   endTime: string;
}

const events = ref<CalendarEvent[]>([]);

async function fetchEvents() {
    try {
        const res = await axios.get(`${API_BASE}/calendar`, {
            headers: { Authorization: `Bearer ${authStore.token}` }
        });
        events.value = res.data;
    } catch(err) {
        console.error(err);
    }
}

async function addEvent() {
    if(!newEventTitle.value || !newEventDate.value) return;
    try {
         // Construct basic full day event or default time
         const start = new Date(newEventDate.value);
         start.setHours(9, 0, 0);
         const end = new Date(newEventDate.value);
         end.setHours(10, 0, 0);

         await axios.post(`${API_BASE}/calendar`, {
             title: newEventTitle.value,
             description: newEventDesc.value,
             startTime: start.toISOString(),
             endTime: end.toISOString()
         }, {
            headers: { Authorization: `Bearer ${authStore.token}` }
         });
         
         await fetchEvents();
         showAddEvent.value = false;
         newEventTitle.value = '';
         newEventDesc.value = '';
    } catch(err) {
        alert('添加失败');
    }
}

const displayEvents = computed(() => {
    return events.value.map(e => ({
        id: e.id,
        date: new Date(e.startTime).toLocaleDateString(),
        title: e.title
    })).slice(0, 5);
});

async function deleteEvent(id: string) {
    if (!confirm('确定要删除这个日程吗？')) return;
    try {
        await axios.delete(`${API_BASE}/calendar/${id}`, {
            headers: { Authorization: `Bearer ${authStore.token}` }
        });
        await fetchEvents();
    } catch (error) {
        console.error('Delete event failed:', error);
        alert('删除失败');
    }
}
</script>

<template>
  <div class="calendar-page">
    <div class="page-header">
      <h1 class="page-title">日历</h1>
      <button class="btn btn-primary" @click="showAddEvent = true">添加日程</button>
    </div>
    
    <div class="calendar-container">
      <GlassCard class="calendar-card" ref="calendarRef" :hoverable="false">
        <div class="calendar-header">
          <button class="nav-btn" @click="prevMonth">‹</button>
          <h2 class="current-month">{{ currentMonthYear }}</h2>
          <button class="nav-btn" @click="nextMonth">›</button>
        </div>
        
        <div class="weekdays">
          <span v-for="day in ['日', '一', '二', '三', '四', '五', '六']" :key="day">
            {{ day }}
          </span>
        </div>
        
        <div class="days-grid">
          <div 
            v-for="(item, idx) in calendarDays" 
            :key="idx"
            class="day-cell"
            :class="{
              'other-month': !item.isCurrentMonth,
              'today': isToday(item.day),
              'selected': selectedDate?.getDate() === item.day && 
                          selectedDate?.getMonth() === currentDate.getMonth()
            }"
            @click="selectDate(item.day)"
          >
            <span v-if="item.day">{{ item.day }}</span>
          </div>
        </div>
      </GlassCard>
      
      <GlassCard class="events-card" :hoverable="false">
        <h3 class="events-title">日程安排</h3>
        <div v-if="displayEvents.length" class="events-list">
          <div v-for="event in displayEvents" :key="event.id" class="event-item">
            <div class="event-info">
                <span class="event-date">{{ event.date }}</span>
                <span class="event-title">{{ event.title }}</span>
            </div>
            <button class="delete-btn" @click.stop="deleteEvent(event.id)">×</button>
          </div>
        </div>
        <p v-else class="no-events">暂无日程</p>
      </GlassCard>
    </div>

    <!-- 添加日程弹窗 -->
    <div v-if="showAddEvent" class="modal">
      <div class="modal-backdrop" @click="showAddEvent = false"></div>
      <GlassCard class="modal-card" :hoverable="false">
        <h2 class="modal-title">添加日程</h2>
        
        <div class="form-group">
            <label>日期</label>
            <input type="date" v-model="newEventDate" class="form-input" />
        </div>
        <div class="form-group">
            <label>标题</label>
            <input type="text" v-model="newEventTitle" placeholder="日程标题" class="form-input" />
        </div>
        <div class="form-group">
            <label>描述</label>
            <textarea v-model="newEventDesc" placeholder="备注..." class="form-textarea"></textarea>
        </div>

        <div class="modal-actions">
          <button class="btn btn-secondary" @click="showAddEvent = false">取消</button>
          <button class="btn btn-primary" @click="addEvent">保存</button>
        </div>
      </GlassCard>
    </div>
  </div>
</template>

<style scoped>
/* Append Modal Styles */
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
.form-group {
    margin-bottom: var(--spacing-md);
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.form-input, .form-textarea {
    padding: 10px;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--accent-color-20);
    border-radius: var(--radius-md);
    color: var(--text-primary);
}
.form-textarea {
    min-height: 80px;
    resize: vertical;
}
.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 20px;
}
/* End Modal Styles */

.calendar-page {
  max-width: 1000px;
  margin: 0 auto;
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

.calendar-container {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: var(--spacing-lg);
}

.calendar-card {
  padding: var(--spacing-xl);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.nav-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--bg-card);
  border: 1px solid var(--accent-color-20);
  color: var(--text-primary);
  font-size: 20px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.nav-btn:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
}

.current-month {
  font-size: 20px;
  font-weight: 600;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--accent-color-20);
}

.weekdays span {
  color: var(--text-muted);
  font-size: 12px;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.day-cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  font-size: 14px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.day-cell:hover {
  background: var(--bg-card-hover);
}

.day-cell.other-month {
  color: var(--text-muted);
}

.day-cell.today {
  background: var(--accent-color-20);
  color: var(--accent-color);
  font-weight: 600;
}

.day-cell.selected {
  background: var(--accent-color);
  color: #000;
  font-weight: 600;
}

.events-card {
  padding: var(--spacing-lg);
  height: fit-content;
}

.events-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.event-item {
  padding: var(--spacing-md);
  background: var(--bg-card);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--accent-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.event-info {
    display: flex;
    flex-direction: column;
}

.delete-btn {
    background: none;
    border: none;
    color: rgba(255, 80, 80, 0.8);
    font-size: 20px;
    cursor: pointer;
    padding: 0 4px;
    line-height: 1;
    transition: color 0.2s;
}

.delete-btn:hover {
    color: rgb(255, 0, 0);
    transform: scale(1.1);
}

.event-date {
  display: block;
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.event-title {
  font-size: 14px;
  color: var(--text-primary);
}

.no-events {
  color: var(--text-muted);
  text-align: center;
  padding: var(--spacing-lg);
}
</style>
