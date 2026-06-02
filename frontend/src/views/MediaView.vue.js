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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var GlassCard_vue_1 = require("../components/GlassCard.vue");
var gsap_1 = require("gsap");
var axios_1 = require("axios");
var auth_1 = require("../stores/auth");
var uuid_1 = require("uuid");
var config_1 = require("../config");
var authStore = (0, auth_1.useAuthStore)();
var mediaList = (0, vue_1.ref)([]);
var containerRef = (0, vue_1.ref)(null);
var selectedMedia = (0, vue_1.ref)(null);
// Upload State
var showUpload = (0, vue_1.ref)(false);
var uploadProgress = (0, vue_1.ref)(0);
var isUploading = (0, vue_1.ref)(false);
var uploadStatus = (0, vue_1.ref)('');
(0, vue_1.onMounted)(function () {
    fetchMedia();
});
function fetchMedia() {
    return __awaiter(this, void 0, void 0, function () {
        var res, allFiles, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.get("".concat(config_1.API_BASE, "/files"), {
                            headers: { Authorization: "Bearer ".concat(authStore.token) },
                            params: { type: 'media' } // Assuming backend supports filtering or we filter clientside
                        })];
                case 1:
                    res = _a.sent();
                    allFiles = res.data;
                    mediaList.value = allFiles
                        .filter(function (f) { return f.mimeType.startsWith('image/') || f.mimeType.startsWith('video/'); })
                        .map(function (f) { return ({
                        id: f.id,
                        type: f.mimeType.startsWith('video/') ? 'video' : 'image',
                        fileName: f.fileName,
                        thumbnailUrl: '', // Could be generated thumb
                        // We need a way to serve the file content. 
                        // For now, let's assume we can get it via download endpoint or static if configured.
                        // Or generate a temp URL.
                        // Use authenticated content endpoint with token in query param
                        url: "".concat(config_1.API_BASE, "/files/").concat(f.id, "/content?token=").concat(authStore.token),
                        createdAt: new Date(f.createdAt).toLocaleDateString(),
                        mimeType: f.mimeType
                    }); });
                    return [4 /*yield*/, (0, vue_1.nextTick)()];
                case 2:
                    _a.sent();
                    animateEntrance();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Failed to fetch media:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function animateEntrance() {
    if (containerRef.value) {
        var items = containerRef.value.querySelectorAll('.media-item');
        if (items.length > 0) {
            gsap_1.gsap.fromTo(items, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, ease: 'power3.out' });
        }
    }
}
var isSelectionMode = (0, vue_1.ref)(false);
var selectedIds = (0, vue_1.ref)([]);
function toggleSelectionMode() {
    isSelectionMode.value = !isSelectionMode.value;
    selectedIds.value = [];
}
function toggleSelection(id) {
    if (selectedIds.value.includes(id)) {
        selectedIds.value = selectedIds.value.filter(function (i) { return i !== id; });
    }
    else {
        selectedIds.value.push(id);
    }
}
function deleteSelected() {
    return __awaiter(this, void 0, void 0, function () {
        var deletePromises, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (selectedIds.value.length === 0)
                        return [2 /*return*/];
                    if (!confirm("\u786E\u5B9A\u5220\u9664\u9009\u4E2D\u7684 ".concat(selectedIds.value.length, " \u4E2A\u6587\u4EF6\u5417\uFF1F")))
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    deletePromises = selectedIds.value.map(function (id) {
                        return axios_1.default.delete("".concat(config_1.API_BASE, "/files/").concat(id), {
                            headers: { Authorization: "Bearer ".concat(authStore.token) }
                        });
                    });
                    return [4 /*yield*/, Promise.all(deletePromises)];
                case 2:
                    _a.sent();
                    // Refresh and reset
                    return [4 /*yield*/, fetchMedia()];
                case 3:
                    // Refresh and reset
                    _a.sent();
                    toggleSelectionMode();
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _a.sent();
                    console.error('Batch delete failed:', error_2);
                    alert('删除失败，请重试');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function deleteSingle(media) {
    return __awaiter(this, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm("\u786E\u5B9A\u5220\u9664\u6587\u4EF6 \"".concat(media.fileName, "\" \u5417\uFF1F")))
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.delete("".concat(config_1.API_BASE, "/files/").concat(media.id), {
                            headers: { Authorization: "Bearer ".concat(authStore.token) }
                        })];
                case 2:
                    _a.sent();
                    closeViewer();
                    fetchMedia();
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error('Delete failed:', error_3);
                    alert('删除失败');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function handleItemClick(media) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (isSelectionMode.value) {
                toggleSelection(media.id);
            }
            else {
                openMedia(media);
            }
            return [2 /*return*/];
        });
    });
}
function openMedia(media) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // Opening media preview
            selectedMedia.value = media;
            return [2 /*return*/];
        });
    });
}
function closeViewer() {
    selectedMedia.value = null;
}
// Reuse Upload Logic (Simplified Version)
var CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
function handleFileUpload(event) {
    return __awaiter(this, void 0, void 0, function () {
        var input, file, totalChunks, identifier, i, start, end, chunk, formData, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    input = event.target;
                    if (!input.files || input.files.length === 0)
                        return [2 /*return*/];
                    file = input.files[0];
                    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
                        alert('请只上传图片或视频文件');
                        return [2 /*return*/];
                    }
                    totalChunks = Math.ceil(file.size / CHUNK_SIZE);
                    identifier = (0, uuid_1.v4)();
                    isUploading.value = true;
                    uploadProgress.value = 0;
                    uploadStatus.value = '准备上传...';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < totalChunks)) return [3 /*break*/, 5];
                    start = i * CHUNK_SIZE;
                    end = Math.min(start + CHUNK_SIZE, file.size);
                    chunk = file.slice(start, end);
                    formData = new FormData();
                    formData.append('chunk', chunk);
                    formData.append('identifier', identifier);
                    formData.append('index', i.toString());
                    return [4 /*yield*/, axios_1.default.post("".concat(config_1.API_BASE, "/files/upload/chunk"), formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                Authorization: "Bearer ".concat(authStore.token)
                            }
                        })];
                case 3:
                    _a.sent();
                    uploadProgress.value = Math.round(((i + 1) / totalChunks) * 100);
                    uploadStatus.value = "\u4E0A\u4F20\u4E2D... ".concat(uploadProgress.value, "%");
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5:
                    uploadStatus.value = '处理中...';
                    return [4 /*yield*/, axios_1.default.post("".concat(config_1.API_BASE, "/files/upload/merge"), {
                            identifier: identifier,
                            fileName: file.name,
                            totalChunks: totalChunks,
                            fileSize: file.size,
                            mimeType: file.type
                        }, {
                            headers: { Authorization: "Bearer ".concat(authStore.token) }
                        })];
                case 6:
                    _a.sent();
                    uploadStatus.value = '上传完成!';
                    setTimeout(function () {
                        showUpload.value = false;
                        isUploading.value = false;
                        fetchMedia();
                    }, 1000);
                    return [3 /*break*/, 8];
                case 7:
                    error_4 = _a.sent();
                    console.error('Upload failed:', error_4);
                    uploadStatus.value = '上传失败';
                    isUploading.value = false;
                    alert('上传失败，请重试');
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['media-item']} */ ;
/** @type {__VLS_StyleScopedClasses['media-preview-img']} */ ;
/** @type {__VLS_StyleScopedClasses['close-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-zone']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-danger']} */ ;
/** @type {__VLS_StyleScopedClasses['checkbox-circle']} */ ;
/** @type {__VLS_StyleScopedClasses['media-item']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-delete-single']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "media-page" }));
/** @type {__VLS_StyleScopedClasses['media-page']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "page-header" }));
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)(__assign({ class: "page-title" }));
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "header-actions" }));
/** @type {__VLS_StyleScopedClasses['header-actions']} */ ;
if (!__VLS_ctx.isSelectionMode) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: (__VLS_ctx.toggleSelectionMode) }, { class: "btn btn-secondary" }));
    /** @type {__VLS_StyleScopedClasses['btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(!__VLS_ctx.isSelectionMode))
                return;
            __VLS_ctx.showUpload = true;
            // @ts-ignore
            [isSelectionMode, toggleSelectionMode, showUpload,];
        } }, { class: "btn btn-primary" }));
    /** @type {__VLS_StyleScopedClasses['btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: (__VLS_ctx.deleteSelected) }, { class: "btn btn-danger" }), { disabled: (__VLS_ctx.selectedIds.length === 0) }));
    /** @type {__VLS_StyleScopedClasses['btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['btn-danger']} */ ;
    (__VLS_ctx.selectedIds.length);
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: (__VLS_ctx.toggleSelectionMode) }, { class: "btn btn-secondary" }));
    /** @type {__VLS_StyleScopedClasses['btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
}
if (__VLS_ctx.showUpload) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "modal" }));
    /** @type {__VLS_StyleScopedClasses['modal']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.showUpload))
                return;
            !__VLS_ctx.isUploading && (__VLS_ctx.showUpload = false);
            // @ts-ignore
            [toggleSelectionMode, showUpload, showUpload, deleteSelected, selectedIds, selectedIds, isUploading,];
        } }, { class: "modal-backdrop" }));
    /** @type {__VLS_StyleScopedClasses['modal-backdrop']} */ ;
    var __VLS_0 = GlassCard_vue_1.default || GlassCard_vue_1.default;
    // @ts-ignore
    var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0(__assign({ class: "modal-card" }, { hoverable: (false) })));
    var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ class: "modal-card" }, { hoverable: (false) })], __VLS_functionalComponentArgsRest(__VLS_1), false));
    /** @type {__VLS_StyleScopedClasses['modal-card']} */ ;
    var __VLS_5 = __VLS_3.slots.default;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)(__assign({ class: "modal-title" }));
    /** @type {__VLS_StyleScopedClasses['modal-title']} */ ;
    if (!__VLS_ctx.isUploading) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "upload-zone" }));
        /** @type {__VLS_StyleScopedClasses['upload-zone']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.input)(__assign(__assign({ onChange: (__VLS_ctx.handleFileUpload) }, { type: "file", accept: "image/*,video/*" }), { class: "file-input" }));
        /** @type {__VLS_StyleScopedClasses['file-input']} */ ;
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "uploading-state" }));
        /** @type {__VLS_StyleScopedClasses['uploading-state']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "progress-bar" }));
        /** @type {__VLS_StyleScopedClasses['progress-bar']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "progress-fill" }, { style: ({ width: __VLS_ctx.uploadProgress + '%' }) }));
        /** @type {__VLS_StyleScopedClasses['progress-fill']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "upload-status" }));
        /** @type {__VLS_StyleScopedClasses['upload-status']} */ ;
        (__VLS_ctx.uploadStatus);
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "modal-actions" }));
    /** @type {__VLS_StyleScopedClasses['modal-actions']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.showUpload))
                return;
            __VLS_ctx.showUpload = false;
            // @ts-ignore
            [showUpload, isUploading, handleFileUpload, uploadProgress, uploadStatus,];
        } }, { class: "btn btn-secondary" }), { disabled: (__VLS_ctx.isUploading) }));
    /** @type {__VLS_StyleScopedClasses['btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
    // @ts-ignore
    [isUploading,];
    var __VLS_3;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "media-grid" }, { ref: "containerRef" }));
/** @type {__VLS_StyleScopedClasses['media-grid']} */ ;
var _loop_1 = function (media) {
    var __VLS_6 = GlassCard_vue_1.default || GlassCard_vue_1.default;
    // @ts-ignore
    var __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6(__assign(__assign(__assign(__assign({ 'onClick': {} }, { key: (media.id) }), { class: "media-item" }), { hoverable: (true), clickable: (true) }), { class: ({ 'selected': __VLS_ctx.selectedIds.includes(media.id) }) })));
    var __VLS_8 = __VLS_7.apply(void 0, __spreadArray([__assign(__assign(__assign(__assign({ 'onClick': {} }, { key: (media.id) }), { class: "media-item" }), { hoverable: (true), clickable: (true) }), { class: ({ 'selected': __VLS_ctx.selectedIds.includes(media.id) }) })], __VLS_functionalComponentArgsRest(__VLS_7), false));
    var __VLS_11 = void 0;
    var __VLS_12 = ({ click: {} },
        { onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                __VLS_ctx.handleItemClick(media);
                // @ts-ignore
                [selectedIds, mediaList, handleItemClick,];
            } });
    /** @type {__VLS_StyleScopedClasses['media-item']} */ ;
    /** @type {__VLS_StyleScopedClasses['selected']} */ ;
    var __VLS_13 = __VLS_9.slots.default;
    if (__VLS_ctx.isSelectionMode) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "selection-checkbox" }));
        /** @type {__VLS_StyleScopedClasses['selection-checkbox']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "checkbox-circle" }, { class: ({ 'checked': __VLS_ctx.selectedIds.includes(media.id) }) }));
        /** @type {__VLS_StyleScopedClasses['checkbox-circle']} */ ;
        /** @type {__VLS_StyleScopedClasses['checked']} */ ;
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "media-thumb" }));
    /** @type {__VLS_StyleScopedClasses['media-thumb']} */ ;
    if (media.type === 'image') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)(__assign(__assign({ src: (media.url) }, { class: "media-preview-img" }), { loading: "lazy" }));
        /** @type {__VLS_StyleScopedClasses['media-preview-img']} */ ;
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "media-placeholder" }));
        /** @type {__VLS_StyleScopedClasses['media-placeholder']} */ ;
        ('🎬');
    }
    if (media.type === 'video') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "video-badge" }));
        /** @type {__VLS_StyleScopedClasses['video-badge']} */ ;
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "media-info" }));
    /** @type {__VLS_StyleScopedClasses['media-info']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "media-name" }));
    /** @type {__VLS_StyleScopedClasses['media-name']} */ ;
    (media.fileName);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "media-date" }));
    /** @type {__VLS_StyleScopedClasses['media-date']} */ ;
    (media.createdAt);
    // @ts-ignore
    [isSelectionMode, selectedIds,];
    // @ts-ignore
    [];
};
var __VLS_9, __VLS_10;
for (var _i = 0, _a = __VLS_vFor((__VLS_ctx.mediaList)); _i < _a.length; _i++) {
    var media = _a[_i][0];
    _loop_1(media);
}
if (__VLS_ctx.mediaList.length === 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "empty-state" }));
    /** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
}
if (__VLS_ctx.selectedMedia) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ onClick: (__VLS_ctx.closeViewer) }, { class: "media-viewer" }));
    /** @type {__VLS_StyleScopedClasses['media-viewer']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ onClick: function () { } }, { class: "viewer-content" }));
    /** @type {__VLS_StyleScopedClasses['viewer-content']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: (__VLS_ctx.closeViewer) }, { class: "close-btn" }));
    /** @type {__VLS_StyleScopedClasses['close-btn']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "media-display" }));
    /** @type {__VLS_StyleScopedClasses['media-display']} */ ;
    if (__VLS_ctx.selectedMedia.type === 'video') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.video, __VLS_intrinsics.video)(__assign({ src: (__VLS_ctx.selectedMedia.url), controls: true, autoplay: true }, { class: "media-content" }));
        /** @type {__VLS_StyleScopedClasses['media-content']} */ ;
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)(__assign({ src: (__VLS_ctx.selectedMedia.url) }, { class: "media-content" }));
        /** @type {__VLS_StyleScopedClasses['media-content']} */ ;
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "viewer-name" }));
    /** @type {__VLS_StyleScopedClasses['viewer-name']} */ ;
    (__VLS_ctx.selectedMedia.fileName);
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.selectedMedia))
                return;
            __VLS_ctx.deleteSingle(__VLS_ctx.selectedMedia);
            // @ts-ignore
            [mediaList, selectedMedia, selectedMedia, selectedMedia, selectedMedia, selectedMedia, selectedMedia, closeViewer, closeViewer, deleteSingle,];
        } }, { class: "btn btn-delete-single" }));
    /** @type {__VLS_StyleScopedClasses['btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['btn-delete-single']} */ ;
}
// @ts-ignore
[];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
