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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var player_1 = require("../stores/player");
var auth_1 = require("../stores/auth");
var axios_1 = require("axios");
var config_1 = require("../config");
var GlassCard_vue_1 = require("../components/GlassCard.vue");
var playerStore = (0, player_1.usePlayerStore)();
var authStore = (0, auth_1.useAuthStore)();
var tracks = (0, vue_1.ref)([]);
var loading = (0, vue_1.ref)(true);
// 搜索功能
var searchQuery = (0, vue_1.ref)('');
var filteredTracks = (0, vue_1.computed)(function () {
    var _a;
    // 没有搜索词时，直接返回原列表
    if (!searchQuery.value.trim())
        return tracks.value;
    // 有搜索词时，过滤结果
    var query = searchQuery.value.toLowerCase();
    var result = tracks.value.filter(function (t) {
        return t.title.toLowerCase().includes(query) ||
            (t.artist && t.artist.toLowerCase().includes(query));
    });
    // 搜索时将当前播放的歌曲排在第一位
    var currentId = (_a = playerStore.currentTrack) === null || _a === void 0 ? void 0 : _a.id;
    if (currentId) {
        var currentIndex = result.findIndex(function (t) { return t.id === currentId; });
        if (currentIndex > 0) {
            var currentTrack = result[currentIndex];
            result = __spreadArray(__spreadArray([currentTrack], result.slice(0, currentIndex), true), result.slice(currentIndex + 1), true);
        }
    }
    return result;
});
// 求助弹窗
var showRequestModal = (0, vue_1.ref)(false);
var requestSongName = (0, vue_1.ref)('');
var requestArtistName = (0, vue_1.ref)('');
var submitting = (0, vue_1.ref)(false);
// 上传弹窗
var showUploadModal = (0, vue_1.ref)(false);
var uploadingMusic = (0, vue_1.ref)(false);
var musicFile = (0, vue_1.ref)(null);
var lrcFile = (0, vue_1.ref)(null);
// Scan Button handled directly
(0, vue_1.onMounted)(function () {
    fetchMusic();
});
function fetchMusic() {
    return __awaiter(this, void 0, void 0, function () {
        var res, allFiles_1, audioFiles, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, axios_1.default.get("".concat(config_1.API_BASE, "/files"), {
                            headers: { Authorization: "Bearer ".concat(authStore.token) },
                            params: { includePublic: 'true' }
                        })];
                case 2:
                    res = _a.sent();
                    allFiles_1 = res.data;
                    audioFiles = allFiles_1.filter(function (f) {
                        var _a;
                        var fileName = f.fileName.toLowerCase();
                        // 排除 lrc 和 txt 文件
                        if (fileName.endsWith('.lrc') || fileName.endsWith('.txt'))
                            return false;
                        // 检查是否为音频文件
                        return ((_a = f.mimeType) === null || _a === void 0 ? void 0 : _a.startsWith('audio/')) ||
                            ['.mp3', '.wav', '.flac', '.m4a', '.ogg', '.aac'].some(function (ext) { return fileName.endsWith(ext); });
                    });
                    // Process tracks and find lyrics client-side
                    tracks.value = audioFiles.map(function (f) {
                        var baseName = f.fileName.substring(0, f.fileName.lastIndexOf('.'));
                        // 解析歌曲名和歌手名（格式：歌曲名-歌手.mp3）
                        var title = baseName;
                        var artist = 'Unknown Artist';
                        var parts = baseName.split('-');
                        if (parts.length >= 2) {
                            title = parts[0].trim();
                            artist = parts[1].trim();
                        }
                        // Find matching lrc in the SAME list
                        var lrcFile = allFiles_1.find(function (l) {
                            return l.fileName === "".concat(baseName, ".lrc") ||
                                l.fileName.toLowerCase() === "".concat(baseName.toLowerCase(), ".lrc");
                        });
                        // Construct URLs
                        var trackUrl = "".concat(config_1.API_BASE, "/files/").concat(f.id, "/content?token=").concat(authStore.token);
                        var lyricsUrl = lrcFile
                            ? "".concat(config_1.API_BASE, "/files/").concat(lrcFile.id, "/content?token=").concat(authStore.token)
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
                    return [3 /*break*/, 5];
                case 3:
                    e_1 = _a.sent();
                    console.error(e_1);
                    return [3 /*break*/, 5];
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// Helper for path extname removed as it was unused
function handlePlay(track) {
    var _a, _b;
    console.log('Playing track:', track);
    if (((_a = playerStore.playlist[0]) === null || _a === void 0 ? void 0 : _a.id) !== ((_b = tracks.value[0]) === null || _b === void 0 ? void 0 : _b.id)) {
        playerStore.playlist = __spreadArray([], tracks.value, true);
    }
    playerStore.play(track);
    // 不再自动展开歌词页面
}
// 切换播放/暂停状态
function toggleTrack(track, event) {
    var _a;
    event.stopPropagation(); // 阻止冒泡，不触发卡片点击
    // 如果是当前正在播放的歌曲，切换播放/暂停
    if (((_a = playerStore.currentTrack) === null || _a === void 0 ? void 0 : _a.id) === track.id) {
        playerStore.togglePlay();
    }
    else {
        // 否则播放这首歌
        handlePlay(track);
    }
}
function handleScan() {
    return __awaiter(this, void 0, void 0, function () {
        var e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loading.value = true;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, axios_1.default.post("".concat(config_1.API_BASE, "/files/music/scan"), {}, {
                            headers: { Authorization: "Bearer ".concat(authStore.token) }
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, fetchMusic()];
                case 3:
                    _a.sent();
                    alert('歌单同步完成！');
                    return [3 /*break*/, 6];
                case 4:
                    e_2 = _a.sent();
                    console.error(e_2);
                    alert('同步失败，请检查网络');
                    return [3 /*break*/, 6];
                case 5:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
// 提交歌曲求助
function submitRequest() {
    return __awaiter(this, void 0, void 0, function () {
        var e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!requestSongName.value.trim()) {
                        alert('请输入歌曲名');
                        return [2 /*return*/];
                    }
                    submitting.value = true;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, axios_1.default.post("".concat(config_1.API_BASE, "/song-requests"), {
                            songName: requestSongName.value,
                            artistName: requestArtistName.value || undefined
                        }, {
                            headers: { Authorization: "Bearer ".concat(authStore.token) }
                        })];
                case 2:
                    _a.sent();
                    alert('求助已提交，管理员会尽快处理！');
                    showRequestModal.value = false;
                    requestSongName.value = '';
                    requestArtistName.value = '';
                    return [3 /*break*/, 5];
                case 3:
                    e_3 = _a.sent();
                    console.error(e_3);
                    alert('提交失败');
                    return [3 /*break*/, 5];
                case 4:
                    submitting.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// 管理员删除歌曲
function deleteTrack(track, event) {
    return __awaiter(this, void 0, void 0, function () {
        var e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event.stopPropagation();
                    if (!confirm("\u786E\u5B9A\u5220\u9664\u6B4C\u66F2 \"".concat(track.title, "\" \u5417\uFF1F")))
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.delete("".concat(config_1.API_BASE, "/files/").concat(track.id), {
                            headers: { Authorization: "Bearer ".concat(authStore.token) }
                        })];
                case 2:
                    _a.sent();
                    // 从列表中移除
                    tracks.value = tracks.value.filter(function (t) { return t.id !== track.id; });
                    alert('删除成功');
                    return [3 /*break*/, 4];
                case 3:
                    e_4 = _a.sent();
                    console.error(e_4);
                    alert('删除失败');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// 管理员上传歌曲
function onMusicFileChange(e) {
    var target = e.target;
    if (target.files && target.files[0]) {
        musicFile.value = target.files[0];
    }
}
function onLrcFileChange(e) {
    var target = e.target;
    if (target.files && target.files[0]) {
        lrcFile.value = target.files[0];
    }
}
function uploadMusic() {
    return __awaiter(this, void 0, void 0, function () {
        var formData, lrcFormData, e_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!musicFile.value) {
                        alert('请选择歌曲文件');
                        return [2 /*return*/];
                    }
                    uploadingMusic.value = true;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    formData = new FormData();
                    formData.append('file', musicFile.value);
                    formData.append('isPublic', 'true'); // 公开歌曲
                    formData.append('folder', 'music');
                    return [4 /*yield*/, axios_1.default.post("".concat(config_1.API_BASE, "/files/upload"), formData, {
                            headers: {
                                Authorization: "Bearer ".concat(authStore.token),
                                'Content-Type': 'multipart/form-data'
                            }
                        })];
                case 2:
                    _a.sent();
                    if (!lrcFile.value) return [3 /*break*/, 4];
                    lrcFormData = new FormData();
                    lrcFormData.append('file', lrcFile.value);
                    lrcFormData.append('isPublic', 'true');
                    lrcFormData.append('folder', 'music');
                    return [4 /*yield*/, axios_1.default.post("".concat(config_1.API_BASE, "/files/upload"), lrcFormData, {
                            headers: {
                                Authorization: "Bearer ".concat(authStore.token),
                                'Content-Type': 'multipart/form-data'
                            }
                        })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    alert('上传成功！');
                    showUploadModal.value = false;
                    musicFile.value = null;
                    lrcFile.value = null;
                    // 重新加载歌曲列表
                    return [4 /*yield*/, fetchMusic()];
                case 5:
                    // 重新加载歌曲列表
                    _a.sent();
                    return [3 /*break*/, 8];
                case 6:
                    e_5 = _a.sent();
                    console.error(e_5);
                    alert('上传失败');
                    return [3 /*break*/, 8];
                case 7:
                    uploadingMusic.value = false;
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    });
}
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['track-item']} */ ;
/** @type {__VLS_StyleScopedClasses['track-item']} */ ;
/** @type {__VLS_StyleScopedClasses['track-action']} */ ;
/** @type {__VLS_StyleScopedClasses['track-item']} */ ;
/** @type {__VLS_StyleScopedClasses['play-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['delete-track-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['empty']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['clear-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-content']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "music-page" }));
/** @type {__VLS_StyleScopedClasses['music-page']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "header" }));
/** @type {__VLS_StyleScopedClasses['header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({});
if (__VLS_ctx.authStore.isAdmin) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "header-actions" }));
    /** @type {__VLS_StyleScopedClasses['header-actions']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.authStore.isAdmin))
                return;
            __VLS_ctx.showUploadModal = true;
            // @ts-ignore
            [authStore, showUploadModal,];
        } }, { class: "btn btn-secondary" }));
    /** @type {__VLS_StyleScopedClasses['btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: (__VLS_ctx.handleScan) }, { class: "btn btn-primary" }));
    /** @type {__VLS_StyleScopedClasses['btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "search-bar" }));
/** @type {__VLS_StyleScopedClasses['search-bar']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "search-input-wrapper" }));
/** @type {__VLS_StyleScopedClasses['search-input-wrapper']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.input)(__assign({ type: "text", value: (__VLS_ctx.searchQuery), placeholder: "搜索歌曲名或歌手..." }, { class: "search-input" }));
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
if (__VLS_ctx.searchQuery) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.searchQuery))
                return;
            __VLS_ctx.searchQuery = '';
            // @ts-ignore
            [handleScan, searchQuery, searchQuery, searchQuery,];
        } }, { class: "clear-btn" }));
    /** @type {__VLS_StyleScopedClasses['clear-btn']} */ ;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "track-list" }));
/** @type {__VLS_StyleScopedClasses['track-list']} */ ;
var _loop_1 = function (track, index) {
    var __VLS_0 = GlassCard_vue_1.default || GlassCard_vue_1.default;
    // @ts-ignore
    var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0(__assign(__assign(__assign(__assign({ 'onClick': {} }, { key: (track.id) }), { class: "track-item" }), { hoverable: (true), clickable: (true) }), { class: ({ 'active': ((_a = __VLS_ctx.playerStore.currentTrack) === null || _a === void 0 ? void 0 : _a.id) === track.id }) })));
    var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign(__assign(__assign(__assign({ 'onClick': {} }, { key: (track.id) }), { class: "track-item" }), { hoverable: (true), clickable: (true) }), { class: ({ 'active': ((_b = __VLS_ctx.playerStore.currentTrack) === null || _b === void 0 ? void 0 : _b.id) === track.id }) })], __VLS_functionalComponentArgsRest(__VLS_1), false));
    var __VLS_5 = void 0;
    var __VLS_6 = ({ click: {} },
        { onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                __VLS_ctx.handlePlay(track);
                // @ts-ignore
                [filteredTracks, playerStore, handlePlay,];
            } });
    /** @type {__VLS_StyleScopedClasses['track-item']} */ ;
    /** @type {__VLS_StyleScopedClasses['active']} */ ;
    var __VLS_7 = __VLS_3.slots.default;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "track-index" }));
    /** @type {__VLS_StyleScopedClasses['track-index']} */ ;
    (index + 1);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "track-main" }));
    /** @type {__VLS_StyleScopedClasses['track-main']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "track-title" }));
    /** @type {__VLS_StyleScopedClasses['track-title']} */ ;
    (track.title);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "track-meta" }));
    /** @type {__VLS_StyleScopedClasses['track-meta']} */ ;
    if (track.lyricsUrl) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "tag" }));
        /** @type {__VLS_StyleScopedClasses['tag']} */ ;
    }
    (track.artist);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.toggleTrack(track, $event);
            // @ts-ignore
            [toggleTrack,];
        } }, { class: "track-action" }));
    /** @type {__VLS_StyleScopedClasses['track-action']} */ ;
    if (((_c = __VLS_ctx.playerStore.currentTrack) === null || _c === void 0 ? void 0 : _c.id) === track.id && __VLS_ctx.playerStore.isPlaying) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)(__assign({ src: "/image.png", alt: "暂停" }, { class: "action-icon" }));
        /** @type {__VLS_StyleScopedClasses['action-icon']} */ ;
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "play-icon" }));
        /** @type {__VLS_StyleScopedClasses['play-icon']} */ ;
    }
    if (__VLS_ctx.authStore.isAdmin) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.authStore.isAdmin))
                    return;
                __VLS_ctx.deleteTrack(track, $event);
                // @ts-ignore
                [authStore, playerStore, playerStore, deleteTrack,];
            } }, { class: "delete-track-btn" }));
        /** @type {__VLS_StyleScopedClasses['delete-track-btn']} */ ;
    }
    // @ts-ignore
    [];
    // @ts-ignore
    [];
};
var __VLS_3, __VLS_4;
for (var _i = 0, _d = __VLS_vFor((__VLS_ctx.filteredTracks)); _i < _d.length; _i++) {
    var _e = _d[_i], track = _e[0], index = _e[1];
    _loop_1(track, index);
}
if (__VLS_ctx.searchQuery && __VLS_ctx.filteredTracks.length === 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "empty" }));
    /** @type {__VLS_StyleScopedClasses['empty']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    (__VLS_ctx.searchQuery);
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.searchQuery && __VLS_ctx.filteredTracks.length === 0))
                return;
            __VLS_ctx.showRequestModal = true;
            __VLS_ctx.requestSongName = __VLS_ctx.searchQuery;
            // @ts-ignore
            [searchQuery, searchQuery, searchQuery, filteredTracks, showRequestModal, requestSongName,];
        } }, { class: "btn btn-primary" }));
    /** @type {__VLS_StyleScopedClasses['btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
}
if (__VLS_ctx.tracks.length === 0 && !__VLS_ctx.loading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "empty" }));
    /** @type {__VLS_StyleScopedClasses['empty']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
}
if (__VLS_ctx.showRequestModal) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.showRequestModal))
                return;
            __VLS_ctx.showRequestModal = false;
            // @ts-ignore
            [showRequestModal, showRequestModal, tracks, loading,];
        } }, { class: "modal-overlay" }));
    /** @type {__VLS_StyleScopedClasses['modal-overlay']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "modal-content" }));
    /** @type {__VLS_StyleScopedClasses['modal-content']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "form-group" }));
    /** @type {__VLS_StyleScopedClasses['form-group']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
        value: (__VLS_ctx.requestSongName),
        type: "text",
        placeholder: "输入歌曲名",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "form-group" }));
    /** @type {__VLS_StyleScopedClasses['form-group']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
        value: (__VLS_ctx.requestArtistName),
        type: "text",
        placeholder: "输入歌手名",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "modal-actions" }));
    /** @type {__VLS_StyleScopedClasses['modal-actions']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.showRequestModal))
                return;
            __VLS_ctx.showRequestModal = false;
            // @ts-ignore
            [showRequestModal, requestSongName, requestArtistName,];
        } }, { class: "btn btn-secondary" }));
    /** @type {__VLS_StyleScopedClasses['btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: (__VLS_ctx.submitRequest) }, { class: "btn btn-primary" }), { disabled: (__VLS_ctx.submitting) }));
    /** @type {__VLS_StyleScopedClasses['btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
    (__VLS_ctx.submitting ? '提交中...' : '提交求助');
}
if (__VLS_ctx.showUploadModal) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.showUploadModal))
                return;
            __VLS_ctx.showUploadModal = false;
            // @ts-ignore
            [showUploadModal, showUploadModal, submitRequest, submitting, submitting,];
        } }, { class: "modal-overlay" }));
    /** @type {__VLS_StyleScopedClasses['modal-overlay']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "modal-content" }));
    /** @type {__VLS_StyleScopedClasses['modal-content']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "form-group" }));
    /** @type {__VLS_StyleScopedClasses['form-group']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)(__assign({ onChange: (__VLS_ctx.onMusicFileChange) }, { type: "file", accept: ".mp3,.flac,.wav,.m4a,.ogg,.aac" }));
    if (__VLS_ctx.musicFile) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "file-name" }));
        /** @type {__VLS_StyleScopedClasses['file-name']} */ ;
        (__VLS_ctx.musicFile.name);
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "form-group" }));
    /** @type {__VLS_StyleScopedClasses['form-group']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)(__assign({ onChange: (__VLS_ctx.onLrcFileChange) }, { type: "file", accept: ".lrc" }));
    if (__VLS_ctx.lrcFile) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "file-name" }));
        /** @type {__VLS_StyleScopedClasses['file-name']} */ ;
        (__VLS_ctx.lrcFile.name);
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "upload-tip" }));
    /** @type {__VLS_StyleScopedClasses['upload-tip']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "modal-actions" }));
    /** @type {__VLS_StyleScopedClasses['modal-actions']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.showUploadModal))
                return;
            __VLS_ctx.showUploadModal = false;
            // @ts-ignore
            [showUploadModal, onMusicFileChange, musicFile, musicFile, onLrcFileChange, lrcFile, lrcFile,];
        } }, { class: "btn btn-secondary" }));
    /** @type {__VLS_StyleScopedClasses['btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: (__VLS_ctx.uploadMusic) }, { class: "btn btn-primary" }), { disabled: (__VLS_ctx.uploadingMusic) }));
    /** @type {__VLS_StyleScopedClasses['btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
    (__VLS_ctx.uploadingMusic ? '上传中...' : '确认上传');
}
// @ts-ignore
[uploadMusic, uploadingMusic, uploadingMusic,];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
