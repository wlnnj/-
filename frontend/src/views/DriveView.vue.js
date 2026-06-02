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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var GlassCard_vue_1 = require("../components/GlassCard.vue");
var gsap_1 = require("gsap");
var axios_1 = require("axios");
var auth_1 = require("../stores/auth");
var uuid_1 = require("uuid");
var config_1 = require("../config");
var authStore = (0, auth_1.useAuthStore)();
var files = (0, vue_1.ref)([]);
var containerRef = (0, vue_1.ref)(null);
var showUpload = (0, vue_1.ref)(false);
var showQrCode = (0, vue_1.ref)(false);
var selectedFile = (0, vue_1.ref)(null);
// Upload State
var uploadProgress = (0, vue_1.ref)(0);
var isUploading = (0, vue_1.ref)(false);
var uploadStatus = (0, vue_1.ref)('');
(0, vue_1.onMounted)(function () {
    fetchFiles();
});
function fetchFiles() {
    return __awaiter(this, void 0, void 0, function () {
        var res, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.get("".concat(config_1.API_BASE, "/files"), {
                            headers: { Authorization: "Bearer ".concat(authStore.token) }
                        })];
                case 1:
                    res = _a.sent();
                    files.value = res.data.map(function (f) { return (__assign(__assign({}, f), { createdAt: new Date(f.createdAt).toLocaleDateString() })); });
                    // Wait for DOM update
                    return [4 /*yield*/, (0, vue_1.nextTick)()];
                case 2:
                    // Wait for DOM update
                    _a.sent();
                    animateEntrance();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Failed to fetch files:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function animateEntrance() {
    if (containerRef.value) {
        var items = containerRef.value.querySelectorAll('.file-row');
        if (items.length > 0) {
            gsap_1.gsap.fromTo(items, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.4, stagger: 0.05, ease: 'power3.out' });
        }
    }
}
function formatSize(bytes) {
    if (bytes < 1024)
        return bytes + ' B';
    if (bytes < 1024 * 1024)
        return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024)
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}
function getFileIcon(_mimeType) {
    return '';
}
// QRCode Generation
function generateQrCode(file) {
    return __awaiter(this, void 0, void 0, function () {
        var res, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    selectedFile.value = file;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.post("".concat(config_1.API_BASE, "/files/").concat(file.id, "/qrcode"), {}, {
                            headers: { Authorization: "Bearer ".concat(authStore.token) }
                        })];
                case 2:
                    res = _a.sent();
                    // Assuming backend returns { qrCode, token, expiresAt }
                    // We add it to the selected file object temporarily for display
                    selectedFile.value = __assign(__assign({}, file), { qrCodeUrl: res.data.qrCode, qrToken: res.data.token });
                    showQrCode.value = true;
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error('Failed to generate QR:', error_2);
                    alert('二维码生成失败');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function downloadFile(file) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!!file.qrToken) return [3 /*break*/, 2];
                    // If no token, maybe generate one strictly for download or use a direct download endpoint if available.
                    // For now, let's try to generate one if missing, or alert.
                    return [4 /*yield*/, generateQrCode(file)];
                case 1:
                    // If no token, maybe generate one strictly for download or use a direct download endpoint if available.
                    // For now, let's try to generate one if missing, or alert.
                    _b.sent();
                    _b.label = 2;
                case 2:
                    if ((_a = selectedFile.value) === null || _a === void 0 ? void 0 : _a.qrToken) {
                        window.open("".concat(config_1.API_BASE, "/files/download/").concat(selectedFile.value.qrToken), '_blank');
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function deleteFile(id) {
    return __awaiter(this, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm('确定要删除这个文件吗？'))
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.delete("".concat(config_1.API_BASE, "/files/").concat(id), {
                            headers: { Authorization: "Bearer ".concat(authStore.token) }
                        })];
                case 2:
                    _a.sent();
                    files.value = files.value.filter(function (f) { return f.id !== id; });
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
// Chunked Upload Logic
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
                    uploadStatus.value = "\u6B63\u5728\u4E0A\u4F20\u5206\u7247 ".concat(i + 1, " / ").concat(totalChunks);
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5:
                    // 2. Merge Chunks
                    uploadStatus.value = '正在合并文件...';
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
                        fetchFiles(); // Refresh list
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
/** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['file-header']} */ ;
/** @type {__VLS_StyleScopedClasses['file-row']} */ ;
/** @type {__VLS_StyleScopedClasses['file-row']} */ ;
/** @type {__VLS_StyleScopedClasses['file-row']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-zone']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "drive-page" }));
/** @type {__VLS_StyleScopedClasses['drive-page']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "page-header" }));
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)(__assign({ class: "page-title" }));
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.showUpload = true;
        // @ts-ignore
        [showUpload,];
    } }, { class: "btn btn-primary" }));
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
var __VLS_0 = GlassCard_vue_1.default || GlassCard_vue_1.default;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0(__assign({ class: "file-list" }, { hoverable: (false) })));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ class: "file-list" }, { hoverable: (false) })], __VLS_functionalComponentArgsRest(__VLS_1), false));
/** @type {__VLS_StyleScopedClasses['file-list']} */ ;
var __VLS_5 = __VLS_3.slots.default;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "file-header" }));
/** @type {__VLS_StyleScopedClasses['file-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "col-name" }));
/** @type {__VLS_StyleScopedClasses['col-name']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "col-size" }));
/** @type {__VLS_StyleScopedClasses['col-size']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "col-date" }));
/** @type {__VLS_StyleScopedClasses['col-date']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "col-actions" }));
/** @type {__VLS_StyleScopedClasses['col-actions']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ref: "containerRef",
});
var _loop_1 = function (file) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ key: (file.id) }, { class: "file-row" }));
    /** @type {__VLS_StyleScopedClasses['file-row']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "col-name" }));
    /** @type {__VLS_StyleScopedClasses['col-name']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "file-icon" }));
    /** @type {__VLS_StyleScopedClasses['file-icon']} */ ;
    (__VLS_ctx.getFileIcon(file.mimeType));
    (file.fileName);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "col-size" }));
    /** @type {__VLS_StyleScopedClasses['col-size']} */ ;
    (__VLS_ctx.formatSize(file.fileSize));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "col-date" }));
    /** @type {__VLS_StyleScopedClasses['col-date']} */ ;
    (file.createdAt);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "col-actions" }));
    /** @type {__VLS_StyleScopedClasses['col-actions']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.generateQrCode(file);
            // @ts-ignore
            [files, getFileIcon, formatSize, generateQrCode,];
        } }, { class: "action-btn" }), { title: "二维码下载" }));
    /** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.downloadFile(file);
            // @ts-ignore
            [downloadFile,];
        } }, { class: "action-btn" }), { title: "下载" }));
    /** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.deleteFile(file.id);
            // @ts-ignore
            [deleteFile,];
        } }, { class: "action-btn delete" }), { title: "删除" }));
    /** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['delete']} */ ;
    // @ts-ignore
    [];
};
for (var _i = 0, _c = __VLS_vFor((__VLS_ctx.files)); _i < _c.length; _i++) {
    var file = _c[_i][0];
    _loop_1(file);
}
if (__VLS_ctx.files.length === 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "empty-state" }));
    /** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
}
// @ts-ignore
[files,];
var __VLS_3;
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
            [showUpload, showUpload, isUploading,];
        } }, { class: "modal-backdrop" }));
    /** @type {__VLS_StyleScopedClasses['modal-backdrop']} */ ;
    var __VLS_6 = GlassCard_vue_1.default || GlassCard_vue_1.default;
    // @ts-ignore
    var __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6(__assign({ class: "modal-card" }, { hoverable: (false) })));
    var __VLS_8 = __VLS_7.apply(void 0, __spreadArray([__assign({ class: "modal-card" }, { hoverable: (false) })], __VLS_functionalComponentArgsRest(__VLS_7), false));
    /** @type {__VLS_StyleScopedClasses['modal-card']} */ ;
    var __VLS_11 = __VLS_9.slots.default;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)(__assign({ class: "modal-title" }));
    /** @type {__VLS_StyleScopedClasses['modal-title']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "modal-hint" }));
    /** @type {__VLS_StyleScopedClasses['modal-hint']} */ ;
    if (!__VLS_ctx.isUploading) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "upload-zone" }));
        /** @type {__VLS_StyleScopedClasses['upload-zone']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.input)(__assign(__assign({ onChange: (__VLS_ctx.handleFileUpload) }, { type: "file" }), { class: "file-input" }));
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
        (__VLS_ctx.uploadProgress);
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
            [showUpload, isUploading, handleFileUpload, uploadProgress, uploadProgress, uploadStatus,];
        } }, { class: "btn btn-secondary" }), { disabled: (__VLS_ctx.isUploading) }));
    /** @type {__VLS_StyleScopedClasses['btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
    // @ts-ignore
    [isUploading,];
    var __VLS_9;
}
if (__VLS_ctx.showQrCode) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "modal" }));
    /** @type {__VLS_StyleScopedClasses['modal']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.showQrCode))
                return;
            __VLS_ctx.showQrCode = false;
            // @ts-ignore
            [showQrCode, showQrCode,];
        } }, { class: "modal-backdrop" }));
    /** @type {__VLS_StyleScopedClasses['modal-backdrop']} */ ;
    var __VLS_12 = GlassCard_vue_1.default || GlassCard_vue_1.default;
    // @ts-ignore
    var __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12(__assign({ class: "modal-card qr-card" }, { hoverable: (false) })));
    var __VLS_14 = __VLS_13.apply(void 0, __spreadArray([__assign({ class: "modal-card qr-card" }, { hoverable: (false) })], __VLS_functionalComponentArgsRest(__VLS_13), false));
    /** @type {__VLS_StyleScopedClasses['modal-card']} */ ;
    /** @type {__VLS_StyleScopedClasses['qr-card']} */ ;
    var __VLS_17 = __VLS_15.slots.default;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)(__assign({ class: "modal-title" }));
    /** @type {__VLS_StyleScopedClasses['modal-title']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "file-name" }));
    /** @type {__VLS_StyleScopedClasses['file-name']} */ ;
    ((_a = __VLS_ctx.selectedFile) === null || _a === void 0 ? void 0 : _a.fileName);
    if ((_b = __VLS_ctx.selectedFile) === null || _b === void 0 ? void 0 : _b.qrCodeUrl) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "qr-placeholder" }));
        /** @type {__VLS_StyleScopedClasses['qr-placeholder']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)(__assign({ src: (__VLS_ctx.selectedFile.qrCodeUrl), alt: "QR Code" }, { class: "qr-image" }));
        /** @type {__VLS_StyleScopedClasses['qr-image']} */ ;
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "qr-placeholder" }));
        /** @type {__VLS_StyleScopedClasses['qr-placeholder']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "qr-expire" }));
    /** @type {__VLS_StyleScopedClasses['qr-expire']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "qr-actions" }));
    /** @type {__VLS_StyleScopedClasses['qr-actions']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.showQrCode))
                return;
            __VLS_ctx.downloadFile(__VLS_ctx.selectedFile);
            // @ts-ignore
            [downloadFile, selectedFile, selectedFile, selectedFile, selectedFile,];
        } }, { class: "btn btn-primary" }));
    /** @type {__VLS_StyleScopedClasses['btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.showQrCode))
                return;
            __VLS_ctx.showQrCode = false;
            // @ts-ignore
            [showQrCode,];
        } }, { class: "btn btn-secondary" }));
    /** @type {__VLS_StyleScopedClasses['btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
    // @ts-ignore
    [];
    var __VLS_15;
}
// @ts-ignore
[];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
