<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { usePlayerStore, type Track } from '../stores/player';
import { useAuthStore } from '../stores/auth';
import axios from 'axios';
import { API_BASE } from '../config';
import GlassCard from '../components/GlassCard.vue';

const playerStore = usePlayerStore();
const authStore = useAuthStore();
const tracks = ref<Track[]>([]);
const loading = ref(true);

// 搜索功能
const searchQuery = ref('');
const filteredTracks = computed(() => {
    // 没有搜索词时，直接返回原列表
    if (!searchQuery.value.trim()) return tracks.value;
    
    // 有搜索词时，过滤结果
    const query = searchQuery.value.toLowerCase();
    let result = tracks.value.filter((t: Track) => 
        t.title.toLowerCase().includes(query) || 
        (t.artist && t.artist.toLowerCase().includes(query))
    );
    
    // 搜索时将当前播放的歌曲排在第一位
    const currentId = playerStore.currentTrack?.id;
    if (currentId) {
        const currentIndex = result.findIndex((t: Track) => t.id === currentId);
        if (currentIndex > 0) {
            const currentTrack = result[currentIndex];
            result = [currentTrack, ...result.slice(0, currentIndex), ...result.slice(currentIndex + 1)];
        }
    }
    
    return result;
});

// 求助弹窗
const showRequestModal = ref(false);
const requestSongName = ref('');
const requestArtistName = ref('');
const submitting = ref(false);

// 上传弹窗
const showUploadModal = ref(false);
const uploadingMusic = ref(false);
const musicFile = ref<File | null>(null);
const lrcFile = ref<File | null>(null);

// Scan Button handled directly

onMounted(() => {
    fetchMusic();
});

async function fetchMusic() {
    loading.value = true;
    try {
        // Fetch ALL files once
        const res = await axios.get(`${API_BASE}/files`, {
            headers: { Authorization: `Bearer ${authStore.token}` },
            params: { includePublic: 'true' }
        });
        
        const allFiles = res.data;
        
        // Filter for Audio files only (exclude lrc files)
        const audioFiles = allFiles.filter((f: any) => {
            const fileName = f.fileName.toLowerCase();
            // 排除 lrc 和 txt 文件
            if (fileName.endsWith('.lrc') || fileName.endsWith('.txt')) return false;
            // 检查是否为音频文件
            return f.mimeType?.startsWith('audio/') || 
                ['.mp3', '.wav', '.flac', '.m4a', '.ogg', '.aac'].some(ext => fileName.endsWith(ext));
        });
        
        // Process tracks and find lyrics client-side
        tracks.value = audioFiles.map((f: any) => {
            const baseName = f.fileName.substring(0, f.fileName.lastIndexOf('.'));
            
            // 解析歌曲名和歌手名（格式：歌曲名-歌手.mp3）
            let title = baseName;
            let artist = 'Unknown Artist';
            const parts = baseName.split('-');
            if (parts.length >= 2) {
                title = parts[0].trim();
                artist = parts[1].trim();
            }
            
            // Find matching lrc in the SAME list
            const lrcFile = allFiles.find((l: any) => 
                l.fileName === `${baseName}.lrc` || 
                l.fileName.toLowerCase() === `${baseName.toLowerCase()}.lrc`
            );

            // Construct URLs
            const trackUrl = `${API_BASE}/files/${f.id}/content?token=${authStore.token}`;
            const lyricsUrl = lrcFile 
                ? `${API_BASE}/files/${lrcFile.id}/content?token=${authStore.token}`
                : undefined;

            return {
                id: f.id,
                title: title, 
                artist: artist, 
                fileName: f.fileName,
                url: trackUrl,
                lyricsUrl: lyricsUrl
            };
        });

    } catch (e) {
        console.error(e);
    } finally {
        loading.value = false;
    }
}

// Helper for path extname removed as it was unused

function handlePlay(track: Track) {
    console.log('Playing track:', track);
    if (playerStore.playlist[0]?.id !== tracks.value[0]?.id) {
        playerStore.playlist = [...tracks.value];
    }
    playerStore.play(track);
    // 不再自动展开歌词页面
}

// 切换播放/暂停状态
function toggleTrack(track: Track, event: Event) {
    event.stopPropagation(); // 阻止冒泡，不触发卡片点击
    
    // 如果是当前正在播放的歌曲，切换播放/暂停
    if (playerStore.currentTrack?.id === track.id) {
        playerStore.togglePlay();
    } else {
        // 否则播放这首歌
        handlePlay(track);
    }
}

async function handleScan() {
    loading.value = true;
    try {
        await axios.post(`${API_BASE}/files/music/scan`, {}, {
            headers: { Authorization: `Bearer ${authStore.token}` }
        });
        await fetchMusic();
        alert('歌单同步完成！');
    } catch (e) {
        console.error(e);
        alert('同步失败，请检查网络');
    } finally {
        loading.value = false;
    }
}

// 提交歌曲求助
async function submitRequest() {
    if (!requestSongName.value.trim()) {
        alert('请输入歌曲名');
        return;
    }
    submitting.value = true;
    try {
        await axios.post(`${API_BASE}/song-requests`, {
            songName: requestSongName.value,
            artistName: requestArtistName.value || undefined
        }, {
            headers: { Authorization: `Bearer ${authStore.token}` }
        });
        alert('求助已提交，管理员会尽快处理！');
        showRequestModal.value = false;
        requestSongName.value = '';
        requestArtistName.value = '';
    } catch (e) {
        console.error(e);
        alert('提交失败');
    } finally {
        submitting.value = false;
    }
}

// 管理员删除歌曲
async function deleteTrack(track: Track, event: Event) {
    event.stopPropagation();
    if (!confirm(`确定删除歌曲 "${track.title}" 吗？`)) return;
    
    try {
        await axios.delete(`${API_BASE}/files/${track.id}`, {
            headers: { Authorization: `Bearer ${authStore.token}` }
        });
        // 从列表中移除
        tracks.value = tracks.value.filter(t => t.id !== track.id);
        alert('删除成功');
    } catch (e) {
        console.error(e);
        alert('删除失败');
    }
}

// 管理员上传歌曲
function onMusicFileChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files[0]) {
        musicFile.value = target.files[0];
    }
}

function onLrcFileChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files[0]) {
        lrcFile.value = target.files[0];
    }
}

async function uploadMusic() {
    if (!musicFile.value) {
        alert('请选择歌曲文件');
        return;
    }
    
    uploadingMusic.value = true;
    try {
        // 上传歌曲文件
        const formData = new FormData();
        formData.append('file', musicFile.value);
        formData.append('isPublic', 'true'); // 公开歌曲
        formData.append('folder', 'music');
        
        await axios.post(`${API_BASE}/files/upload`, formData, {
            headers: { 
                Authorization: `Bearer ${authStore.token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        
        // 如果有歌词文件，也上传
        if (lrcFile.value) {
            const lrcFormData = new FormData();
            lrcFormData.append('file', lrcFile.value);
            lrcFormData.append('isPublic', 'true');
            lrcFormData.append('folder', 'music');
            
            await axios.post(`${API_BASE}/files/upload`, lrcFormData, {
                headers: { 
                    Authorization: `Bearer ${authStore.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
        }
        
        alert('上传成功！');
        showUploadModal.value = false;
        musicFile.value = null;
        lrcFile.value = null;
        // 重新加载歌曲列表
        await fetchMusic();
    } catch (e) {
        console.error(e);
        alert('上传失败');
    } finally {
        uploadingMusic.value = false;
    }
}
</script>

<template>
    <div class="music-page">
        <div class="header">
            <h1>歌曲</h1>
            <div class="header-actions" v-if="authStore.isAdmin">
                <button class="btn btn-secondary" @click="showUploadModal = true">上传歌曲</button>
                <button class="btn btn-primary" @click="handleScan">同步服务器歌单</button>
            </div>
        </div>

        <!-- 搜索框 -->
        <div class="search-bar">
            <div class="search-input-wrapper">
                <input 
                    type="text" 
                    v-model="searchQuery" 
                    placeholder="搜索歌曲名或歌手..." 
                    class="search-input"
                />
                <button 
                    v-if="searchQuery" 
                    class="clear-btn" 
                    @click="searchQuery = ''"
                >✕</button>
            </div>
        </div>

        <div class="track-list">
            <GlassCard 
                v-for="(track, index) in filteredTracks" 
                :key="track.id" 
                class="track-item"
                :hoverable="true"
                :clickable="true"
                @click="handlePlay(track)"
                :class="{ 'active': playerStore.currentTrack?.id === track.id }"
            >
                <div class="track-index">{{ index + 1 }}</div>
                <div class="track-main">
                    <div class="track-title">{{ track.title }}</div>
                    <div class="track-meta">
                        <span class="tag" v-if="track.lyricsUrl">LYRICS</span>
                        {{ track.artist }}
                    </div>
                </div>
                <div class="track-action" @click="toggleTrack(track, $event)">
                    <img 
                        v-if="playerStore.currentTrack?.id === track.id && playerStore.isPlaying" 
                        src="/image.png" 
                        alt="暂停" 
                        class="action-icon"
                    />
                    <span v-else class="play-icon">▶</span>
                </div>
                <!-- 管理员删除按钮 -->
                <button 
                    v-if="authStore.isAdmin" 
                    class="delete-track-btn" 
                    @click="deleteTrack(track, $event)"
                >×</button>
            </GlassCard>
        </div>
        
        <!-- 搜索无结果提示 -->
        <div v-if="searchQuery && filteredTracks.length === 0" class="empty">
            <p>未找到 "{{ searchQuery }}"</p>
            <button class="btn btn-primary" @click="showRequestModal = true; requestSongName = searchQuery">提交歌曲求助</button>
        </div>

        <div v-if="tracks.length === 0 && !loading" class="empty">
            <p>还没有歌曲，请管理员将歌曲放入 uploads/music 文件夹并点击同步</p>
        </div>

        <!-- 求助弹窗 -->
        <div v-if="showRequestModal" class="modal-overlay" @click.self="showRequestModal = false">
            <div class="modal-content">
                <h2>歌曲求助</h2>
                <div class="form-group">
                    <label>歌曲名 *</label>
                    <input v-model="requestSongName" type="text" placeholder="输入歌曲名" />
                </div>
                <div class="form-group">
                    <label>歌手（可选）</label>
                    <input v-model="requestArtistName" type="text" placeholder="输入歌手名" />
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary" @click="showRequestModal = false">取消</button>
                    <button class="btn btn-primary" @click="submitRequest" :disabled="submitting">
                        {{ submitting ? '提交中...' : '提交求助' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- 上传歌曲弹窗 -->
        <div v-if="showUploadModal" class="modal-overlay" @click.self="showUploadModal = false">
            <div class="modal-content">
                <h2>上传歌曲</h2>
                <div class="form-group">
                    <label>歌曲文件 * (.mp3, .flac, .wav)</label>
                    <input type="file" accept=".mp3,.flac,.wav,.m4a,.ogg,.aac" @change="onMusicFileChange" />
                    <span v-if="musicFile" class="file-name">{{ musicFile.name }}</span>
                </div>
                <div class="form-group">
                    <label>歌词文件（可选，.lrc）</label>
                    <input type="file" accept=".lrc" @change="onLrcFileChange" />
                    <span v-if="lrcFile" class="file-name">{{ lrcFile.name }}</span>
                </div>
                <p class="upload-tip">提示：文件名格式建议为「歌曲名-歌手.mp3」</p>
                <div class="modal-actions">
                    <button class="btn btn-secondary" @click="showUploadModal = false">取消</button>
                    <button class="btn btn-primary" @click="uploadMusic" :disabled="uploadingMusic">
                        {{ uploadingMusic ? '上传中...' : '确认上传' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.music-page {
    max-width: 1000px;
    margin: 0 auto;
    padding-bottom: 120px; /* Space for player bar */
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
}

h1 {
    font-size: 32px;
    font-weight: 800;
    letter-spacing: -1px;
}

.header-actions {
    display: flex;
    gap: 12px;
}

.file-name {
    display: block;
    margin-top: 8px;
    font-size: 14px;
    color: var(--accent-color);
}

.upload-tip {
    font-size: 13px;
    color: var(--text-muted);
    margin: 16px 0;
}

.track-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.track-item {
    display: flex;
    align-items: center;
    padding: 16px 24px;
    cursor: pointer;
    transition: transform 0.2s;
}

.track-item:active {
    transform: scale(0.99);
}

.track-item.active {
    background: rgba(var(--accent-rgb), 0.1);
    border-color: var(--accent-color);
}

.track-index {
    width: 40px;
    color: var(--text-muted);
    font-size: 14px;
    font-weight: 600;
}

.track-main {
    flex: 1;
}

.track-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 4px;
}

.track-meta {
    font-size: 13px;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    gap: 8px;
}

.tag {
    font-size: 9px;
    border: 1px solid var(--text-muted);
    padding: 1px 4px;
    border-radius: 4px;
    opacity: 0.7;
}

.track-action {
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    font-size: 18px;
    cursor: pointer;
    border-radius: 50%;
    transition: all 0.2s;
}

.track-action:hover {
    background: rgba(255,255,255,0.1);
    transform: scale(1.1);
}

.action-icon {
    width: 28px;
    height: 28px;
    object-fit: contain;
}

.play-icon {
    color: var(--text-muted);
}

.track-item:hover .play-icon {
    color: var(--accent-color);
}

.delete-track-btn {
    width: 32px;
    height: 32px;
    background: rgba(255, 68, 68, 0.15);
    border: 1px solid rgba(255, 68, 68, 0.3);
    color: #ff4444;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    border-radius: 50%;
    transition: all 0.2s;
    margin-left: 8px;
}

.delete-track-btn:hover {
    background: rgba(255, 68, 68, 0.3);
    transform: scale(1.1);
}

.btn-primary {
    background: var(--text-primary);
    color: var(--bg-primary);
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
}

.btn-primary:hover {
    opacity: 0.9;
}

.empty {
    text-align: center;
    padding: 60px;
    color: var(--text-muted);
}

.empty .btn {
    margin-top: 16px;
}

/* 搜索栏 */
.search-bar {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
}

.search-input-wrapper {
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
}

.search-input {
    width: 100%;
    padding: 12px 45px 12px 20px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    color: var(--text-primary);
    font-size: 16px;
    outline: none;
    transition: all 0.2s;
}

.search-input:focus {
    border-color: var(--accent-color);
    background: rgba(255,255,255,0.08);
}

.search-input::placeholder {
    color: var(--text-muted);
}

.clear-btn {
    position: absolute;
    right: 12px;
    background: transparent;
    border: none;
    color: #ff4444;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 50%;
    transition: all 0.2s;
}

.clear-btn:hover {
    background: rgba(255, 68, 68, 0.2);
    transform: scale(1.1);
}

.btn-secondary {
    background: rgba(255,255,255,0.1);
    color: var(--text-primary);
    border: 1px solid rgba(255,255,255,0.2);
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-secondary:hover {
    background: rgba(255,255,255,0.15);
}

/* 弹窗 */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.modal-content {
    background: var(--bg-secondary);
    padding: 32px;
    border-radius: 16px;
    min-width: 400px;
    max-width: 90%;
    border: 1px solid rgba(255,255,255,0.1);
}

.modal-content h2 {
    margin-bottom: 24px;
    font-size: 24px;
}

.form-group {
    margin-bottom: 16px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    color: var(--text-secondary);
    font-size: 14px;
}

.form-group input {
    width: 100%;
    padding: 12px 16px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    color: var(--text-primary);
    font-size: 16px;
    outline: none;
}

.form-group input:focus {
    border-color: var(--accent-color);
}

.modal-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 24px;
}

.btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>
