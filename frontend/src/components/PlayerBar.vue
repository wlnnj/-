<script setup lang="ts">
import { usePlayerStore } from '../stores/player';
import { storeToRefs } from 'pinia';
import LyricsView from './LyricsView.vue';

const playerStore = usePlayerStore();
const { currentTrack, isPlaying, volume, currentTime, duration, progressPercent, isExpanded } = storeToRefs(playerStore);

function formatTime(seconds: number) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
}

function handleSeek(e: MouseEvent) {
    const bar = e.currentTarget as HTMLElement;
    const rect = bar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    playerStore.seek(percent * duration.value);
}

function toggleExpand() {
    if (isExpanded.value) {
        playerStore.collapsePlayer();
    } else {
        playerStore.expandPlayer();
    }
}
</script>

<template>
    <div class="player-wrapper">
        <!-- Expanded Full Screen Layer -->
        <transition name="slide-up">
            <div v-if="isExpanded" class="full-player">
                <!-- Background Blur -->
                <div class="full-bg" :style="{ backgroundImage: `url(${currentTrack?.coverUrl || ''})` }"></div>
                <div class="full-backdrop"></div>
                
                <button class="collapse-btn" @click="playerStore.collapsePlayer()">﹀</button>

                <div class="full-content">
                    <!-- Header: Title & Artist -->
                    <div class="track-header">
                       <h1 class="full-title">{{ currentTrack?.title || 'Unknown Title' }}</h1>
                       <h2 class="full-artist">{{ currentTrack?.artist || 'Unknown Artist' }}</h2>
                    </div>

                    <!-- Lyrics Area (Centered) -->
                    <div class="lyrics-section">
                        <LyricsView />
                    </div>
                </div>
            </div>
        </transition>

        <!-- Mini Player Bar -->
        <div class="mini-player-card" :class="{ 'hidden': isExpanded }">
            <div class="progress-line" @click.stop="handleSeek">
                <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
            </div>
            
            <div class="time-tooltip" :style="{ left: progressPercent + '%' }">
                {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
            </div>

            <div class="mini-content" @click="toggleExpand">
                <div class="track-info">
                    <div class="track-name">{{ currentTrack?.title || '未播放' }}</div>
                    <div class="track-artist">{{ currentTrack?.artist || 'Unknown' }}</div>
                </div>

                <div class="controls" @click.stop>
                    <button class="ctrl-btn" @click="playerStore.prev">⏮</button>
                    <button class="ctrl-btn play-btn" @click="playerStore.togglePlay">
                        <img v-if="isPlaying" src="/image.png" alt="Pause" class="play-icon" />
                        <img v-else src="/vite.svg" alt="Play" class="play-icon" />
                    </button>
                    <button class="ctrl-btn" @click="playerStore.next">⏭</button>
                </div>
                
                <!-- Volume & Expand -->
                <div class="extras" @click.stop>
                     <input type="range" min="0" max="1" step="0.1" v-model="volume" @input="playerStore.setVolume(parseFloat(($event.target as HTMLInputElement).value))" class="vol-slider"/>
                     <button class="ctrl-btn expand-hint" @click="toggleExpand">︿</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.player-wrapper {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 9000;
}

/* Mini Player Styles */
.mini-player-card {
    border-radius: 0; /* Full width bar */
    border-top: 1px solid var(--glass-border-color);
    background: rgba(30, 30, 30, 0.9);
    backdrop-filter: blur(20px);
    transition: transform 0.3s ease;
    position: relative; /* Context for absolute progress bar */
    z-index: 9005; /* Ensure high z-index */
    pointer-events: auto;
}

.mini-player-card.hidden {
    transform: translateY(100%);
}

.progress-line {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: rgba(255,255,255,0.15);
    cursor: pointer;
    z-index: 10;
}

/* 扩大可点击区域 */
.progress-line::before {
    content: '';
    position: absolute;
    top: -10px;
    left: 0;
    right: 0;
    bottom: -10px;
}

.progress-line:hover {
    height: 8px;
    background: rgba(255,255,255,0.25);
}

.time-tooltip {
    position: absolute;
    top: -25px;
    background: rgba(0,0,0,0.8);
    color: #fff;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 10px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s;
    transform: translateX(-50%);
}

.progress-line:hover + .time-tooltip,
.mini-player-card:hover .time-tooltip {
    opacity: 1;
}

.progress-fill {
    height: 100%;
    background: var(--accent-color);
    transition: width 0.1s linear;
    position: relative;
}

/* 滑块指示球 */
.progress-fill::after {
    content: '';
    position: absolute;
    right: -6px;
    top: 50%;
    transform: translateY(-50%);
    width: 12px;
    height: 12px;
    background: var(--accent-color);
    border-radius: 50%;
    box-shadow: 0 0 8px var(--accent-glow);
    opacity: 0;
    transition: opacity 0.2s;
}

.progress-line:hover .progress-fill::after {
    opacity: 1;
}

.mini-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 24px;
    height: 70px;
    cursor: pointer;
}

.track-info {
    flex: 1;
    min-width: 0;
}

.track-name {
    font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.track-artist {
    font-size: 12px;
    color: var(--text-secondary);
}

.controls {
    flex: 1;
    display: flex;
    justify-content: center;
    gap: 20px;
    align-items: center;
}

.ctrl-btn {
    background: none;
    border: none;
    color: var(--text-primary);
    font-size: 20px;
    cursor: pointer;
    transition: transform 0.1s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.ctrl-btn:hover {
    color: var(--accent-color);
}

.ctrl-btn:active {
    transform: scale(0.9);
}

.play-btn {
    font-size: 32px;
    width: 48px;
    height: 48px;
    background: transparent;
    border-radius: 50%;
}
.play-btn:hover {
    transform: scale(1.1);
}



.play-icon {
    width: 40px;
    height: 40px;
    object-fit: contain;
}

.extras {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 15px;
}

.vol-slider {
    width: 80px;
    accent-color: var(--accent-color);
}

/* Full Screen Player Styles */
.full-player {
    position: fixed;
    inset: 0;
    z-index: 9001; /* Above mini player */
    background: #000;
    color: #fff;
    display: flex;
    flex-direction: column;
    pointer-events: auto;
}

.full-bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    opacity: 0.3;
    filter: blur(50px);
    transition: background-image 0.5s ease;
}

.full-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.4);
    backdrop-filter: blur(20px);
}

.collapse-btn {
    position: absolute;
    top: 20px;
    left: 20px;
    background: transparent;
    border: none;
    color: #fff;
    font-size: 24px;
    cursor: pointer;
    z-index: 10;
    padding: 10px;
}

.full-content {
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 5;
    display: flex;
    flex-direction: column;
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
    align-items: center;
    overflow: hidden;
}

.track-header {
    text-align: center;
    margin-bottom: 20px;
    flex-shrink: 0;
}

.full-title {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 10px;
    color: #fff;
}

.full-artist {
    font-size: 18px;
    color: var(--text-secondary);
    font-weight: 400;
}

.lyrics-section {
    flex: 1 1 0;
    width: 100%;
    min-height: 0;
    position: relative;
    overflow: hidden;
}

/* Transitions */
.slide-up-enter-active,
.slide-up-leave-active {
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
    transform: translateY(100%);
}
</style>
