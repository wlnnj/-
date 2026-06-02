<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import GlassCard from '../components/GlassCard.vue';
import { gsap } from 'gsap';
import axios from 'axios';
import { useAuthStore } from '../stores/auth';
import { API_BASE } from '../config';

const authStore = useAuthStore();

interface Memo {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

const memos = ref<Memo[]>([]); // Start empty, fetch from API

const showEditor = ref(false);
const editingMemo = ref<Memo | null>(null);
const newTitle = ref('');
const newContent = ref('');

const containerRef = ref<HTMLElement | null>(null);

onMounted(() => {
  fetchMemos();
});

async function fetchMemos() {
  try {
    const res = await axios.get(`${API_BASE}/memos`, {
       headers: { Authorization: `Bearer ${authStore.token}` }
    });
    // Backend returns entities, map if necessary, or just use. 
    // Assuming backend returns { id, title, content, updatedAt }
    memos.value = res.data.map((m: any) => ({
      ...m,
      updatedAt: new Date(m.updatedAt).toLocaleDateString()
    }));
    
    // Animate after fetch
    await nextTick();
    if (containerRef.value) {
      const cards = containerRef.value.querySelectorAll('.memo-card');
      if (cards.length > 0) {
          gsap.fromTo(cards,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' }
          );
      }
    }
  } catch (error) {
    console.error('Failed to fetch memos:', error);
  }
}

function openEditor(memo?: Memo) {
  if (memo) {
    editingMemo.value = memo;
    newTitle.value = memo.title;
    newContent.value = memo.content;
  } else {
    editingMemo.value = null;
    newTitle.value = '';
    newContent.value = '';
  }
  showEditor.value = true;
}

async function saveMemo() {
  if (!newTitle.value.trim()) return;
  
  try {
    if (editingMemo.value) {
      // Update
      await axios.put(`${API_BASE}/memos/${editingMemo.value.id}`, {
        title: newTitle.value,
        content: newContent.value
      }, {
         headers: { Authorization: `Bearer ${authStore.token}` }
      });
    } else {
      // Create
      await axios.post(`${API_BASE}/memos`, {
        title: newTitle.value,
        content: newContent.value
      }, {
         headers: { Authorization: `Bearer ${authStore.token}` }
      });
    }
    await fetchMemos();
    showEditor.value = false;
  } catch (error) {
    console.error('Failed to save memo:', error);
    alert('保存失败');
  }
}

async function deleteMemo(id: string) {
  if(!confirm('确定要删除这条备忘录吗？')) return;
  try {
    await axios.delete(`${API_BASE}/memos/${id}`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
    });
    memos.value = memos.value.filter(m => m.id !== id);
  } catch (error) {
    console.error('Failed to delete memo:', error);
    alert('删除失败');
  }
}
</script>

<template>
  <div class="memos-page">
    <div class="page-header">
      <h1 class="page-title">备忘录</h1>
      <button class="btn btn-primary" @click="openEditor()">新建备忘录</button>
    </div>
    
    <div class="memos-grid" ref="containerRef">
      <GlassCard 
        v-for="memo in memos" 
        :key="memo.id"
        class="memo-card"
        :clickable="true"
        @click="openEditor(memo)"
      >
        <h3 class="memo-title">{{ memo.title }}</h3>
        <p class="memo-preview">{{ memo.content.slice(0, 100) }}...</p>
        <div class="memo-footer">
          <span class="memo-date">{{ memo.updatedAt }}</span>
          <button class="delete-btn" @click.stop="deleteMemo(memo.id)">删除</button>
        </div>
      </GlassCard>
    </div>
    
    <!-- 编辑器弹窗 -->
    <div v-if="showEditor" class="editor-modal">
      <div class="editor-backdrop" @click="showEditor = false"></div>
      <GlassCard class="editor-card" :hoverable="false">
        <h2 class="editor-title">{{ editingMemo ? '编辑备忘录' : '新建备忘录' }}</h2>
        <input v-model="newTitle" class="editor-input" placeholder="标题" />
        <textarea v-model="newContent" class="editor-textarea" placeholder="支持 Markdown 格式..."></textarea>
        <div class="editor-actions">
          <button class="btn btn-secondary" @click="showEditor = false">取消</button>
          <button class="btn btn-primary" @click="saveMemo">保存</button>
        </div>
      </GlassCard>
    </div>
  </div>
</template>

<style scoped>
.memos-page {
  max-width: 1200px;
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

.btn-secondary {
  background: transparent;
  color: var(--text-secondary);
  border-color: var(--accent-color-20);
}

.btn-secondary:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
}

.memos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.memo-card {
  min-height: 160px;
  display: flex;
  flex-direction: column;
}

.memo-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  color: var(--text-primary);
}

.memo-preview {
  flex: 1;
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.memo-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--accent-color-20);
}

.memo-date {
  font-size: 12px;
  color: var(--text-muted);
}

.delete-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 12px;
  cursor: pointer;
  transition: color var(--transition-fast);
}

.delete-btn:hover {
  color: rgb(255, 100, 100);
}

.editor-modal {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.editor-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
}

.editor-card {
  position: relative;
  width: 600px;
  max-width: 90vw;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  padding: var(--spacing-xl);
}

.editor-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
}

.editor-input {
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--accent-color-20);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 16px;
  margin-bottom: var(--spacing-md);
}

.editor-input:focus {
  outline: none;
  border-color: var(--accent-color-40);
}

.editor-textarea {
  flex: 1;
  min-height: 200px;
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--accent-color-20);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 14px;
  font-family: var(--font-mono);
  resize: vertical;
}

.editor-textarea:focus {
  outline: none;
  border-color: var(--accent-color-40);
}

.editor-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  margin-top: var(--spacing-lg);
}
</style>
