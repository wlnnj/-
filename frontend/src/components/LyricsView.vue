<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { usePlayerStore } from '../stores/player';
import { storeToRefs } from 'pinia';

const playerStore = usePlayerStore();
const { lyrics, currentLyricIndex } = storeToRefs(playerStore);
const containerRef = ref<HTMLElement | null>(null);

// Auto Scroll Logic
watch(currentLyricIndex, async (newIndex: number) => {
    if (newIndex >= 0 && containerRef.value) {
        await nextTick();
        const activeItem = containerRef.value.children[newIndex] as HTMLElement;
        if (activeItem) {
            activeItem.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }
});

function handleLyricClick(time: number) {
    playerStore.seek(time);
}
</script>

<template>
    <div class="lyrics-wrapper">
        <div class="lyrics-container" ref="containerRef">
            <div v-if="lyrics.length === 0" class="no-lyrics">
                <p>纯音乐，请欣赏</p>
            </div>
            <div 
                v-for="(line, index) in lyrics" 
                :key="index"
                class="lyric-line"
                :class="{ 'active': index === currentLyricIndex }"
                @click="handleLyricClick(line.time)"
            >
                {{ line.text }}
            </div>
        </div>
    </div>
</template>

<style scoped>
.lyrics-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

/* Fade mask overlay */
.lyrics-wrapper::before,
.lyrics-wrapper::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 80px;
    pointer-events: none;
    z-index: 10;
}

.lyrics-wrapper::before {
    top: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%);
}

.lyrics-wrapper::after {
    bottom: 0;
    background: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%);
}

.lyrics-container {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding: 40vh 20px;
    text-align: center;
    scroll-behavior: smooth;
    /* Hide scrollbar */
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.lyrics-container::-webkit-scrollbar {
    display: none;
}

.lyric-line {
    padding: 12px 20px;
    font-size: 18px;
    color: rgba(255,255,255,0.4);
    transition: all 0.3s ease;
    cursor: pointer;
    border-radius: 8px;
}

.lyric-line:hover {
    color: rgba(255,255,255,0.7);
    background: rgba(255,255,255,0.05);
}

.lyric-line.active {
    font-size: 24px;
    font-weight: bold;
    color: var(--accent-color, #00d4ff);
    transform: scale(1.05);
}

.no-lyrics {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: rgba(255,255,255,0.5);
    font-style: italic;
    font-size: 18px;
}
</style>
