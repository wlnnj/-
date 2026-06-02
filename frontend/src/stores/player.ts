import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

export interface Track {
    id: string;
    title: string;
    artist?: string;
    url: string;
    coverUrl?: string; // Optional album art
    lyricsUrl?: string; // Optional .lrc url
    fileName: string;
}

export const usePlayerStore = defineStore('player', () => {
    const audio = new Audio();
    const isPlaying = ref(false);
    const currentTime = ref(0);
    const duration = ref(0);
    const volume = ref(0.8);
    const playlist = ref<Track[]>([]);
    const currentIndex = ref(-1);
    const showPlayer = ref(false);
    const isExpanded = ref(false); // Global expand state

    function expandPlayer() {
        isExpanded.value = true;
    }

    function collapsePlayer() {
        isExpanded.value = false;
    }

    // Lyrics State
    const lyrics = ref<{ time: number; text: string }[]>([]);
    const currentLyricIndex = ref(-1);

    const currentTrack = computed(() => {
        if (currentIndex.value >= 0 && currentIndex.value < playlist.value.length) {
            return playlist.value[currentIndex.value];
        }
        return null;
    });

    const currentLyricLine = computed(() => {
        if (currentLyricIndex.value >= 0 && currentLyricIndex.value < lyrics.value.length) {
            return lyrics.value[currentLyricIndex.value];
        }
        return null;
    });

    const progressPercent = computed(() => {
        if (duration.value > 0) {
            return (currentTime.value / duration.value) * 100;
        }
        return 0;
    });

    // Initialize Audio Events
    audio.addEventListener('timeupdate', () => {
        currentTime.value = audio.currentTime;
        updateLyricIndex();
    });
    audio.addEventListener('durationchange', () => {
        duration.value = audio.duration;
    });
    audio.addEventListener('ended', () => {
        next();
    });

    function updateLyricIndex() {
        if (!lyrics.value.length) return;
        // Find the active lyric line
        // We look for the last line where time <= currentTime
        let idx = -1;
        for (let i = 0; i < lyrics.value.length; i++) {
            if (lyrics.value[i].time <= currentTime.value) {
                idx = i;
            } else {
                break;
            }
        }
        currentLyricIndex.value = idx;
    }

    async function play(track: Track) {
        // If same track, just toggle
        if (currentTrack.value?.id === track.id) {
            togglePlay();
            return;
        }

        // Find index in playlist or add it
        const idx = playlist.value.findIndex(t => t.id === track.id);
        if (idx === -1) {
            // Add to end and play
            playlist.value.push(track);
            currentIndex.value = playlist.value.length - 1;
        } else {
            currentIndex.value = idx;
        }

        // Reset
        audio.src = track.url;
        audio.volume = volume.value;
        showPlayer.value = true;

        try {
            console.log('Audio playing...', audio.src);
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    isPlaying.value = true;
                    fetchLyrics(track);
                }).catch(e => {
                    console.error('Audio play failed (promise):', e);
                });
            }
        } catch (e) {
            console.error('Playback failed immediately', e);
        }
    }

    function togglePlay() {
        if (audio.paused) {
            audio.play();
            isPlaying.value = true;
        } else {
            audio.pause();
            isPlaying.value = false;
        }
    }

    function next() {
        if (playlist.value.length === 0) return;
        let nextIdx = currentIndex.value + 1;
        if (nextIdx >= playlist.value.length) nextIdx = 0; // Loop
        play(playlist.value[nextIdx]);
    }

    function prev() {
        if (playlist.value.length === 0) return;
        let prevIdx = currentIndex.value - 1;
        if (prevIdx < 0) prevIdx = playlist.value.length - 1;
        play(playlist.value[prevIdx]);
    }

    function seek(time: number) {
        audio.currentTime = time;
        currentTime.value = time;
    }

    function setVolume(v: number) {
        volume.value = Math.max(0, Math.min(1, v));
        audio.volume = volume.value;
    }

    // Lyrics Parser: [00:12.34]Lyric Text
    async function fetchLyrics(track: Track) {
        lyrics.value = [];
        currentLyricIndex.value = -1;

        // Try to find .lrc with same name
        // Implementation note: This assumes the lrc file exists and we can find it.
        // For simplicity, we might just assume the user uploaded it and the UI found it.
        // Or we search via backend.
        // For this version: we rely on `track.lyricsUrl` being populated by the view logic.
        if (!track.lyricsUrl) return;

        try {
            const res = await axios.get(track.lyricsUrl);
            const rawLrc = res.data;
            if (typeof rawLrc === 'string') {
                lyrics.value = parseLrc(rawLrc);
            }
        } catch (e) {
            console.warn('No lyrics found via URL', track.lyricsUrl);
        }
    }

    function parseLrc(lrc: string) {
        const lines = lrc.split('\n');
        const result = [];
        const timeReg = /\[(\d{2}):(\d{2})(\.(\d{2,3}))?\]/;

        for (const line of lines) {
            const match = timeReg.exec(line);
            if (match) {
                const min = parseInt(match[1]);
                const sec = parseInt(match[2]);
                const ms = match[4] ? parseInt(match[4].padEnd(3, '0').slice(0, 3)) : 0;
                const time = min * 60 + sec + ms / 1000;
                const text = line.replace(timeReg, '').trim();
                if (text) {
                    result.push({ time, text });
                }
            }
        }
        return result;
    }

    return {
        audio, // Expose for advanced viz
        isPlaying,
        currentTime,
        duration,
        volume,
        playlist,
        currentTrack,
        lyrics,
        currentLyricIndex,
        currentLyricLine,
        progressPercent,
        showPlayer,
        isExpanded,
        expandPlayer,
        collapsePlayer,
        play,
        togglePlay,
        next,
        prev,
        seek,
        setVolume
    };
});
