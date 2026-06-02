<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Excalidraw } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';

const containerRef = ref<HTMLDivElement | null>(null);
const excalidrawAPI = ref<any>(null); // Store API instance
let root: any = null;

const LOCAL_STORAGE_KEY = 'zky-whiteboard-data';
const showToast = ref(false);

function manualSave() {
    showToast.value = true;
    setTimeout(() => showToast.value = false, 2000);
}

function handleReset() {
    if (confirm('确定要清空所有画布内容吗？此操作无法撤销。')) {
        // 1. Clear local storage
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        
        // 2. Programmatically reset scene if API is available
        if (excalidrawAPI.value) {
            excalidrawAPI.value.resetScene();
        } else {
            // Fallback
            window.location.reload();
        }
        
        showToast.value = true; 
        // We could change toast message to "已清空" but "已保存" (autosave triggers) is also techincally true.
        // Let's rely on visual feedback of empty canvas.
    }
}

onMounted(() => {
  if (containerRef.value) {
    root = createRoot(containerRef.value);
    
    // Load initial data
    let initialData = null;
    try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
            initialData = JSON.parse(saved);
        }
    } catch (e) {
        console.error('Failed to load whiteboard data', e);
    }

    // Render with persistence and cleaned UI
    root.render(React.createElement(Excalidraw, { 
        name: "ZKY Whiteboard",
        langCode: "zh-CN",
        initialData: initialData,
        excalidrawAPI: (api: any) => { excalidrawAPI.value = api; }, // Capture API
        onChange: (elements: any, appState: any, files: any) => {
            if (elements && elements.length > 0) {
                 try {
                     localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
                         elements,
                         // Only persist UI state that matters for restoration
                         appState: { 
                            viewBackgroundColor: appState.viewBackgroundColor,
                            currentItemFontFamily: appState.currentItemFontFamily,
                            currentItemStrokeColor: appState.currentItemStrokeColor,
                            currentItemBackgroundColor: appState.currentItemBackgroundColor,
                            scrollX: appState.scrollX,
                            scrollY: appState.scrollY,
                            zoom: appState.zoom,
                         },
                         files 
                     }));
                 } catch (err) {
                     console.error('Error saving whiteboard:', err);
                 }
            }
        },
        UIOptions: {
            canvasActions: {
                loadScene: false,
                saveToActiveFile: false,
                toggleTheme: true,
                saveAsImage: true,
            },
            welcomeScreen: false
        },
    }));
  }
});

onUnmounted(() => {
  if (root) {
    root.unmount();
  }
});
</script>

<template>
  <div class="excalidraw-container" ref="containerRef"></div>
  
  <div class="custom-ui">
      <button class="action-btn save-btn" @click="manualSave">
          左侧菜单保存到本地
      </button>
      <button class="action-btn reset-btn" @click="handleReset">
          清空
      </button>
  </div>

  <div class="toast" v-if="showToast">
      操作成功
  </div>
</template>

<style scoped>
.excalidraw-container {
  height: 100%;
  width: 100%;
}

.custom-ui {
    position: absolute;
    top: 10px;
    right: 300px; /* Position next to standard tools */
    z-index: 10;
    display: flex;
    gap: 10px;
}

.action-btn {
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    transition: transform 0.1s;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 4px;
}

.save-btn {
    background: var(--accent-color);
    color: #000;
}

.reset-btn {
    background: #ff4757;
    color: white;
}

.action-btn:active {
    transform: scale(0.95);
}

.toast {
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0,0,0,0.8);
    color: white;
    padding: 10px 20px;
    border-radius: 20px;
    font-size: 14px;
    z-index: 20;
    animation: fadeIn 0.3s, fadeOut 0.3s 1.7s forwards;
}

@keyframes fadeIn { from { opacity: 0; transform: translate(-50%, -10px); } to { opacity: 1; transform: translate(-50%, 0); } }
@keyframes fadeOut { to { opacity: 0; } }

/* Hide Excalidraw Footer/Help/Branding */
:deep(.excalidraw .layer-ui__wrapper__footer-left),
:deep(.excalidraw .layer-ui__wrapper__footer-right) {
    display: none !important;
}
</style>
