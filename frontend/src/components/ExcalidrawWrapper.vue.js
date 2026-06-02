"use strict";
/// <reference types="C:/Users/lujia/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="C:/Users/lujia/AppData/Local/npm-cache/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var react_1 = require("react");
var client_1 = require("react-dom/client");
var excalidraw_1 = require("@excalidraw/excalidraw");
require("@excalidraw/excalidraw/index.css");
var containerRef = (0, vue_1.ref)(null);
var excalidrawAPI = (0, vue_1.ref)(null); // Store API instance
var root = null;
var LOCAL_STORAGE_KEY = 'zky-whiteboard-data';
var showToast = (0, vue_1.ref)(false);
function manualSave() {
    showToast.value = true;
    setTimeout(function () { return showToast.value = false; }, 2000);
}
function handleReset() {
    if (confirm('确定要清空所有画布内容吗？此操作无法撤销。')) {
        // 1. Clear local storage
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        // 2. Programmatically reset scene if API is available
        if (excalidrawAPI.value) {
            excalidrawAPI.value.resetScene();
        }
        else {
            // Fallback
            window.location.reload();
        }
        showToast.value = true;
        // We could change toast message to "已清空" but "已保存" (autosave triggers) is also techincally true.
        // Let's rely on visual feedback of empty canvas.
    }
}
(0, vue_1.onMounted)(function () {
    if (containerRef.value) {
        root = (0, client_1.createRoot)(containerRef.value);
        // Load initial data
        var initialData = null;
        try {
            var saved = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (saved) {
                initialData = JSON.parse(saved);
            }
        }
        catch (e) {
            console.error('Failed to load whiteboard data', e);
        }
        // Render with persistence and cleaned UI
        root.render(react_1.default.createElement(excalidraw_1.Excalidraw, {
            name: "ZKY Whiteboard",
            langCode: "zh-CN",
            initialData: initialData,
            excalidrawAPI: function (api) { excalidrawAPI.value = api; }, // Capture API
            onChange: function (elements, appState, files) {
                if (elements && elements.length > 0) {
                    try {
                        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
                            elements: elements,
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
                            files: files
                        }));
                    }
                    catch (err) {
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
(0, vue_1.onUnmounted)(function () {
    if (root) {
        root.unmount();
    }
});
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['excalidraw']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "excalidraw-container" }, { ref: "containerRef" }));
/** @type {__VLS_StyleScopedClasses['excalidraw-container']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "custom-ui" }));
/** @type {__VLS_StyleScopedClasses['custom-ui']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: (__VLS_ctx.manualSave) }, { class: "action-btn save-btn" }));
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['save-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: (__VLS_ctx.handleReset) }, { class: "action-btn reset-btn" }));
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['reset-btn']} */ ;
if (__VLS_ctx.showToast) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "toast" }));
    /** @type {__VLS_StyleScopedClasses['toast']} */ ;
}
// @ts-ignore
[manualSave, handleReset, showToast,];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
