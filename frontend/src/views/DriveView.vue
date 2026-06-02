<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import GlassCard from '../components/GlassCard.vue';
import { gsap } from 'gsap';
import axios from 'axios';
import { useAuthStore } from '../stores/auth';
import { v4 as uuidv4 } from 'uuid';
import { API_BASE } from '../config';

interface FileItem {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
  qrToken?: string;
  qrExpiresAt?: string;
  qrCodeUrl?: string; // Additional field for UI
}

const authStore = useAuthStore();
const files = ref<FileItem[]>([]);
const containerRef = ref<HTMLElement | null>(null);
const showUpload = ref(false);
const showQrCode = ref(false);
const selectedFile = ref<FileItem | null>(null);

// Upload State
const uploadProgress = ref(0);
const isUploading = ref(false);
const uploadStatus = ref('');

onMounted(() => {
  fetchFiles();
});

async function fetchFiles() {
  try {
    const res = await axios.get(`${API_BASE}/files`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    files.value = res.data.map((f: any) => ({
      ...f,
      createdAt: new Date(f.createdAt).toLocaleDateString()
    }));
    
    // Wait for DOM update
    await nextTick();
    animateEntrance();
  } catch (error) {
    console.error('Failed to fetch files:', error);
  }
}

function animateEntrance() {
  if (containerRef.value) {
    const items = containerRef.value.querySelectorAll('.file-row');
    if (items.length > 0) {
        gsap.fromTo(items,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.4, stagger: 0.05, ease: 'power3.out' }
        );
    }
  }
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}

function getFileIcon(_mimeType: string): string {
  return '';
}

// QRCode Generation
async function generateQrCode(file: FileItem) {
  selectedFile.value = file;
  try {
    const res = await axios.post(`${API_BASE}/files/${file.id}/qrcode`, {}, {
       headers: { Authorization: `Bearer ${authStore.token}` }
    });
    // Assuming backend returns { qrCode, token, expiresAt }
    // We add it to the selected file object temporarily for display
    selectedFile.value = { 
        ...file, 
        qrCodeUrl: res.data.qrCode,
        qrToken: res.data.token 
    };
    showQrCode.value = true;
  } catch (error) {
    console.error('Failed to generate QR:', error);
    alert('二维码生成失败');
  }
}

async function downloadFile(file: FileItem) {
  if(!file.qrToken) {
     // If no token, maybe generate one strictly for download or use a direct download endpoint if available.
     // For now, let's try to generate one if missing, or alert.
     await generateQrCode(file);
     // After generic, we can use the token
  }
  
  if (selectedFile.value?.qrToken) {
      window.open(`${API_BASE}/files/download/${selectedFile.value.qrToken}`, '_blank');
  }
}

async function deleteFile(id: string) {
  if(!confirm('确定要删除这个文件吗？')) return;
  try {
    await axios.delete(`${API_BASE}/files/${id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    files.value = files.value.filter(f => f.id !== id);
  } catch (error) {
    console.error('Delete failed:', error);
    alert('删除失败');
  }
}

// Chunked Upload Logic
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

async function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;
  
  const file = input.files[0];
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  const identifier = uuidv4(); // Unique ID for this upload session

  isUploading.value = true;
  uploadProgress.value = 0;
  uploadStatus.value = '准备上传...';

  try {
    // 1. Upload Chunks
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
      uploadStatus.value = `正在上传分片 ${i + 1} / ${totalChunks}`;
    }

    // 2. Merge Chunks
    uploadStatus.value = '正在合并文件...';
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
        fetchFiles(); // Refresh list
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
  <div class="drive-page">
    <div class="page-header">
      <h1 class="page-title">文件云盘</h1>
      <button class="btn btn-primary" @click="showUpload = true">上传文件</button>
    </div>
    
    <GlassCard class="file-list" :hoverable="false">
      <div class="file-header">
        <span class="col-name">文件名</span>
        <span class="col-size">大小</span>
        <span class="col-date">日期</span>
        <span class="col-actions">操作</span>
      </div>
      
      <div ref="containerRef">
        <div 
          v-for="file in files" 
          :key="file.id"
          class="file-row"
        >
          <span class="col-name">
            <span class="file-icon">{{ getFileIcon(file.mimeType) }}</span>
            {{ file.fileName }}
          </span>
          <span class="col-size">{{ formatSize(file.fileSize) }}</span>
          <span class="col-date">{{ file.createdAt }}</span>
          <span class="col-actions">
            <button class="action-btn" @click="generateQrCode(file)" title="二维码下载">
              📱
            </button>
            <button class="action-btn" @click="downloadFile(file)" title="下载">
              ⬇️
            </button>
            <button class="action-btn delete" @click="deleteFile(file.id)" title="删除">
              🗑️
            </button>
          </span>
        </div>
      </div>
      
      <div v-if="files.length === 0" class="empty-state">
        <p>暂无文件，点击上传按钮添加</p>
      </div>
    </GlassCard>
    
    <!-- 上传弹窗 -->
    <div v-if="showUpload" class="modal">
      <div class="modal-backdrop" @click="!isUploading && (showUpload = false)"></div>
      <GlassCard class="modal-card" :hoverable="false">
        <h2 class="modal-title">上传文件</h2>
        <p class="modal-hint">支持单个文件最大 1GB (分片上传)</p>
        
        <div v-if="!isUploading" class="upload-zone">
          <p>📁 拖拽文件到此处或点击选择</p>
          <input type="file" class="file-input" @change="handleFileUpload" />
        </div>

        <div v-else class="uploading-state">
            <div class="progress-bar">
                <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
            </div>
            <p class="upload-status">{{ uploadStatus }} ({{ uploadProgress }}%)</p>
        </div>

        <div class="modal-actions">
          <button class="btn btn-secondary" @click="showUpload = false" :disabled="isUploading">取消</button>
        </div>
      </GlassCard>
    </div>
    
    <!-- 二维码弹窗 -->
    <div v-if="showQrCode" class="modal">
      <div class="modal-backdrop" @click="showQrCode = false"></div>
      <GlassCard class="modal-card qr-card" :hoverable="false">
        <h2 class="modal-title">扫码下载</h2>
        <p class="file-name">{{ selectedFile?.fileName }}</p>
        <div class="qr-placeholder" v-if="selectedFile?.qrCodeUrl">
          <img :src="selectedFile.qrCodeUrl" alt="QR Code" class="qr-image"/>
        </div>
        <div class="qr-placeholder" v-else>
           <p>生成中...</p>
        </div>
        <p class="qr-expire">链接 24 小时内有效</p>
         <div class="qr-actions">
           <button class="btn btn-primary" @click="downloadFile(selectedFile!)">直接下载</button>
           <button class="btn btn-secondary" @click="showQrCode = false">关闭</button>
         </div>
      </GlassCard>
    </div>
  </div>
</template>

<style scoped>
.drive-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--spacing-xl); /* Add padding so it doesn't touch edges */
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
  color: var(--text-primary);
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

.file-list {
  padding: 0;
  overflow: hidden;
  min-height: 400px; /* Ensure height for empty state */
}

.file-header,
.file-row {
  display: grid;
  grid-template-columns: 2fr 100px 120px 140px; /* Adjusted columns */
  padding: var(--spacing-md) var(--spacing-lg);
  align-items: center;
}

.file-header {
  background: var(--bg-secondary);
  font-size: 12px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.file-row {
  border-bottom: 1px solid var(--accent-color-20);
  transition: background var(--transition-fast);
}

.file-row:last-child {
  border-bottom: none;
}

.file-row:hover {
  background: var(--bg-card-hover);
}

.col-name {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  overflow: hidden;
  color: var(--text-primary);
}

.file-icon {
  font-size: 20px;
}

.col-size,
.col-date {
  color: var(--text-secondary);
  font-size: 14px;
}

.col-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.action-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 6px;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.action-btn:hover {
  background: var(--bg-card);
  transform: scale(1.1);
}

.action-btn.delete:hover {
  background: rgba(255, 100, 100, 0.2);
}

.empty-state {
  padding: var(--spacing-2xl);
  text-align: center;
  color: var(--text-muted);
  margin-top: 40px;
}

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
  z-index: 2001; /* Above backdrop */
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  color: var(--text-primary);
}

.modal-hint {
  color: var(--text-muted);
  font-size: 14px;
  margin-bottom: var(--spacing-lg);
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

.qr-card {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.file-name {
  color: var(--text-primary);
  font-size: 16px;
  margin-bottom: var(--spacing-lg);
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.qr-placeholder {
  width: 200px;
  height: 200px;
  margin: 0 auto var(--spacing-md);
  background: #fff; /* QR code needs white background */
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.qr-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.qr-hint {
  font-size: 14px;
  color: var(--text-muted);
}

.qr-expire {
  color: var(--text-muted);
  font-size: 12px;
  margin-bottom: var(--spacing-lg);
}
.qr-actions {
    display: flex;
    gap: var(--spacing-md);
}
</style>
