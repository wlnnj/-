<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import GlassCard from '../components/GlassCard.vue';
import { gsap } from 'gsap';
import axios from 'axios';
import { useAuthStore } from '../stores/auth';
import { v4 as uuidv4 } from 'uuid';
import { API_BASE } from '../config';

const authStore = useAuthStore();

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  fileName: string;
  thumbnailUrl: string;
  url: string; // The full URL for the media
  createdAt: string;
  mimeType: string;
}

const mediaList = ref<MediaItem[]>([]);
const containerRef = ref<HTMLElement | null>(null);
const selectedMedia = ref<MediaItem | null>(null);

// Upload State
const showUpload = ref(false);
const uploadProgress = ref(0);
const isUploading = ref(false);
const uploadStatus = ref('');

onMounted(() => {
  fetchMedia();
});

async function fetchMedia() {
  try {
    const res = await axios.get(`${API_BASE}/files`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
       params: { type: 'media' } // Assuming backend supports filtering or we filter clientside
    });
    
    // Filter client side if backend doesn't support specific media endpoint yet
    // Assuming /files returns all files. We filter for images and videos.
    const allFiles = res.data;
    mediaList.value = allFiles
      .filter((f: any) => f.mimeType.startsWith('image/') || f.mimeType.startsWith('video/'))
      .map((f: any) => ({
        id: f.id,
        type: f.mimeType.startsWith('video/') ? 'video' : 'image',
        fileName: f.fileName,
        thumbnailUrl: '', // Could be generated thumb
        // We need a way to serve the file content. 
        // For now, let's assume we can get it via download endpoint or static if configured.
        // Or generate a temp URL.
        // Use authenticated content endpoint with token in query param
        url: `${API_BASE}/files/${f.id}/content?token=${authStore.token}`,
        createdAt: new Date(f.createdAt).toLocaleDateString(),
        mimeType: f.mimeType
    }));

    await nextTick();
    animateEntrance();
  } catch (error) {
    console.error('Failed to fetch media:', error);
  }
}

function animateEntrance() {
  if (containerRef.value) {
    const items = containerRef.value.querySelectorAll('.media-item');
    if (items.length > 0) {
        gsap.fromTo(items,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, ease: 'power3.out' }
        );
    }
  }
}

const isSelectionMode = ref(false);
const selectedIds = ref<string[]>([]);

function toggleSelectionMode() {
  isSelectionMode.value = !isSelectionMode.value;
  selectedIds.value = [];
}

function toggleSelection(id: string) {
  if (selectedIds.value.includes(id)) {
    selectedIds.value = selectedIds.value.filter(i => i !== id);
  } else {
    selectedIds.value.push(id);
  }
}

async function deleteSelected() {
  if (selectedIds.value.length === 0) return;
  if (!confirm(`确定删除选中的 ${selectedIds.value.length} 个文件吗？`)) return;

  try {
    const deletePromises = selectedIds.value.map(id => 
      axios.delete(`${API_BASE}/files/${id}`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      })
    );
    await Promise.all(deletePromises);
    
    // Refresh and reset
    await fetchMedia();
    toggleSelectionMode();
  } catch (error) {
    console.error('Batch delete failed:', error);
    alert('删除失败，请重试');
  }
}

async function deleteSingle(media: MediaItem) {
  if (!confirm(`确定删除文件 "${media.fileName}" 吗？`)) return;
  
  try {
    await axios.delete(`${API_BASE}/files/${media.id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    closeViewer();
    fetchMedia();
  } catch (error) {
    console.error('Delete failed:', error);
    alert('删除失败');
  }
}

async function handleItemClick(media: MediaItem) {
    if (isSelectionMode.value) {
        toggleSelection(media.id);
    } else {
        openMedia(media);
    }
}

async function openMedia(media: MediaItem) {
    // Opening media preview
    selectedMedia.value = media;
}

function closeViewer() {
  selectedMedia.value = null;
}

// Reuse Upload Logic (Simplified Version)
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

async function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;
  
  const file = input.files[0];
  if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      alert('请只上传图片或视频文件');
      return;
  }

  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  const identifier = uuidv4();

  isUploading.value = true;
  uploadProgress.value = 0;
  uploadStatus.value = '准备上传...';

  try {
    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);

      const formData = new FormData();
      formData.append('chunk', chunk);
      formData.append('identifier', identifier);
      formData.append('index', i.toString());
      
      await axios.post(`${API_BASE}/files/upload/chunk`, formData, {
        headers: { 
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${authStore.token}` 
        }
      });

      uploadProgress.value = Math.round(((i + 1) / totalChunks) * 100);
      uploadStatus.value = `上传中... ${uploadProgress.value}%`;
    }

    uploadStatus.value = '处理中...';
    await axios.post(`${API_BASE}/files/upload/merge`, {
        identifier,
        fileName: file.name,
        totalChunks,
        fileSize: file.size,
        mimeType: file.type
    }, {
        headers: { Authorization: `Bearer ${authStore.token}` }
    });
    
    uploadStatus.value = '上传完成!';
    setTimeout(() => {
        showUpload.value = false;
        isUploading.value = false;
        fetchMedia();
    }, 1000);

  } catch (error) {
    console.error('Upload failed:', error);
    uploadStatus.value = '上传失败';
    isUploading.value = false;
    alert('上传失败，请重试');
  }
}
</script>

<template>
  <div class="media-page">
    <div class="page-header">
      <h1 class="page-title">媒体库</h1>
      <div class="header-actions">
        <template v-if="!isSelectionMode">
           <button class="btn btn-secondary" @click="toggleSelectionMode">选择</button>
           <button class="btn btn-primary" @click="showUpload = true">上传媒体</button>
        </template>
        <template v-else>
           <button class="btn btn-danger" @click="deleteSelected" :disabled="selectedIds.length === 0">删除 ({{ selectedIds.length }})</button>
           <button class="btn btn-secondary" @click="toggleSelectionMode">取消</button>
        </template>
      </div>
    </div>
    
    <!-- Upload Modal -->
    <div v-if="showUpload" class="modal">
      <div class="modal-backdrop" @click="!isUploading && (showUpload = false)"></div>
      <GlassCard class="modal-card" :hoverable="false">
        <h2 class="modal-title">上传图片/视频</h2>
        
        <div v-if="!isUploading" class="upload-zone">
            <p>📷 拖拽或点击选择</p>
            <input type="file" accept="image/*,video/*" class="file-input" @change="handleFileUpload" />
        </div>
        <div v-else class="uploading-state">
            <div class="progress-bar">
                <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
            </div>
            <p class="upload-status">{{ uploadStatus }}</p>
        </div>
        <div class="modal-actions">
             <button class="btn btn-secondary" @click="showUpload = false" :disabled="isUploading">取消</button>
        </div>
      </GlassCard>
    </div>

    <!-- 瀑布流展示 -->
    <div class="media-grid" ref="containerRef">
      <GlassCard 
        v-for="media in mediaList" 
        :key="media.id"
        class="media-item"
        :hoverable="true"
        :clickable="true"
        @click="handleItemClick(media)"
        :class="{ 'selected': selectedIds.includes(media.id) }"
      >
        <div class="selection-checkbox" v-if="isSelectionMode">
            <div class="checkbox-circle" :class="{ 'checked': selectedIds.includes(media.id) }"></div>
        </div>
        <div class="media-thumb">
          <img v-if="media.type === 'image'" :src="media.url" class="media-preview-img" loading="lazy" />
          <div v-else class="media-placeholder">
            {{ '🎬' }}
          </div>
          <span v-if="media.type === 'video'" class="video-badge">视频</span>
        </div>
        <div class="media-info">
          <span class="media-name">{{ media.fileName }}</span>
          <span class="media-date">{{ media.createdAt }}</span>
        </div>
      </GlassCard>
    </div>
    
    <div v-if="mediaList.length === 0" class="empty-state">
        <p>暂无媒体文件</p>
    </div>

    <!-- 媒体查看器 -->
    <div v-if="selectedMedia" class="media-viewer" @click="closeViewer">
      <div class="viewer-content" @click.stop>
        <button class="close-btn" @click="closeViewer">×</button>
        
        <div class="media-display">
            <video v-if="selectedMedia.type === 'video'" :src="selectedMedia.url" controls autoplay class="media-content"></video>
            <img v-else :src="selectedMedia.url" class="media-content" />
        </div>
        
        <p class="viewer-name">{{ selectedMedia.fileName }}</p>
        <button class="btn btn-delete-single" @click="deleteSingle(selectedMedia)">删除</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.media-page {
  max-width: 1400px;
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

.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.media-item {
  cursor: pointer;
  overflow: hidden;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.media-thumb {
  position: relative;
  width: 100%;
  height: 180px; /* Fixed height for uniformity */
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.media-placeholder {
  font-size: 48px;
}

.video-badge {
  position: absolute;
  top: var(--spacing-sm);
  left: var(--spacing-sm);
  padding: 2px 8px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: var(--radius-sm);
  font-size: 10px;
  color: var(--text-primary);
  z-index: 2;
}

.media-preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.media-item:hover .media-preview-img {
  transform: scale(1.05);
}

.media-info {
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: rgba(0,0,0,0.2);
}

.media-name {
  font-size: 14px;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.media-date {
  font-size: 12px;
  color: var(--text-muted);
}

.media-viewer {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
}

.viewer-content {
  position: relative;
  width: 90vw;
  height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.media-display {
    flex: 1;
    width: 100%;
    height: 0; /* Important for flex child to scroll/scale properly */
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: var(--spacing-lg);
}

.media-content {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: var(--radius-md);
    box-shadow: 0 0 50px rgba(0,0,0,0.5);
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  background: rgba(255,255,255,0.1);
  border-radius: 50%;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  z-index: 3010;
}

.close-btn:hover {
  background: rgba(255,255,255,0.2);
}

.viewer-name {
  color: var(--text-secondary);
  margin-top: var(--spacing-md);
}

.empty-state {
    text-align: center;
    padding: 40px;
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
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
}
.modal-card {
  position: relative;
  width: 450px;
  max-width: 90vw;
  padding: var(--spacing-xl);
  z-index: 2001;
}
.modal-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
  color: var(--text-primary);
}
.upload-zone {
  border: 2px dashed var(--accent-color-20);
  border-radius: var(--radius-lg);
  padding: var(--spacing-2xl);
  text-align: center;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-normal);
  position: relative;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.upload-zone:hover {
  border-color: var(--accent-color);
  background: var(--bg-card);
  color: var(--accent-color);
}
.file-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}
.uploading-state {
    text-align: center;
    padding: var(--spacing-lg) 0;
}
.progress-bar {
    width: 100%;
    height: 8px;
    background: var(--bg-secondary);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: var(--spacing-md);
}
.progress-fill {
    height: 100%;
    background: var(--accent-color);
    transition: width 0.2s linear;
}
.upload-status {
    color: var(--text-secondary);
    font-size: 14px;
}
.modal-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  margin-top: var(--spacing-lg);
}

.btn-danger {
  background: #ef4444;
  color: white;
}
.btn-danger:hover {
  background: #dc2626;
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.4);
}

.selection-checkbox {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 10;
}

.checkbox-circle {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.8);
    background: rgba(0,0,0,0.3);
    transition: all 0.2s;
}

.checkbox-circle.checked {
    background: var(--accent-color);
    border-color: var(--accent-color);
    box-shadow: 0 0 10px var(--accent-glow);
}

.media-item.selected {
    border: 1px solid var(--accent-color);
}

.btn-delete-single {
    margin-top: 20px;
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
    border: 1px solid #ef4444;
    padding: 8px 24px;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s;
}
.btn-delete-single:hover {
    background: #ef4444;
    color: white;
}
</style>
