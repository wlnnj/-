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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
var player_1 = require("../stores/player");
var pinia_1 = require("pinia");
var LyricsView_vue_1 = require("./LyricsView.vue");
var playerStore = (0, player_1.usePlayerStore)();
var _f = (0, pinia_1.storeToRefs)(playerStore), currentTrack = _f.currentTrack, isPlaying = _f.isPlaying, volume = _f.volume, currentTime = _f.currentTime, duration = _f.duration, progressPercent = _f.progressPercent, isExpanded = _f.isExpanded;
function formatTime(seconds) {
    var min = Math.floor(seconds / 60);
    var sec = Math.floor(seconds % 60);
    return "".concat(min, ":").concat(sec.toString().padStart(2, '0'));
}
function handleSeek(e) {
    var bar = e.currentTarget;
    var rect = bar.getBoundingClientRect();
    var percent = (e.clientX - rect.left) / rect.width;
    playerStore.seek(percent * duration.value);
}
function toggleExpand() {
    if (isExpanded.value) {
        playerStore.collapsePlayer();
    }
    else {
        playerStore.expandPlayer();
    }
}
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['mini-player-card']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-line']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-line']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-line']} */ ;
/** @type {__VLS_StyleScopedClasses['time-tooltip']} */ ;
/** @type {__VLS_StyleScopedClasses['mini-player-card']} */ ;
/** @type {__VLS_StyleScopedClasses['time-tooltip']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-line']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['ctrl-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['ctrl-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['play-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "player-wrapper" }));
/** @type {__VLS_StyleScopedClasses['player-wrapper']} */ ;
var __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.transition | typeof __VLS_components.Transition | typeof __VLS_components.transition | typeof __VLS_components.Transition} */
transition;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    name: "slide-up",
}));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([{
        name: "slide-up",
    }], __VLS_functionalComponentArgsRest(__VLS_1), false));
var __VLS_5 = __VLS_3.slots.default;
if (__VLS_ctx.isExpanded) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "full-player" }));
    /** @type {__VLS_StyleScopedClasses['full-player']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "full-bg" }, { style: ({ backgroundImage: "url(".concat(((_a = __VLS_ctx.currentTrack) === null || _a === void 0 ? void 0 : _a.coverUrl) || '', ")") }) }));
    /** @type {__VLS_StyleScopedClasses['full-bg']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "full-backdrop" }));
    /** @type {__VLS_StyleScopedClasses['full-backdrop']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.isExpanded))
                return;
            __VLS_ctx.playerStore.collapsePlayer();
            // @ts-ignore
            [isExpanded, currentTrack, playerStore,];
        } }, { class: "collapse-btn" }));
    /** @type {__VLS_StyleScopedClasses['collapse-btn']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "full-content" }));
    /** @type {__VLS_StyleScopedClasses['full-content']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "track-header" }));
    /** @type {__VLS_StyleScopedClasses['track-header']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)(__assign({ class: "full-title" }));
    /** @type {__VLS_StyleScopedClasses['full-title']} */ ;
    (((_b = __VLS_ctx.currentTrack) === null || _b === void 0 ? void 0 : _b.title) || 'Unknown Title');
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)(__assign({ class: "full-artist" }));
    /** @type {__VLS_StyleScopedClasses['full-artist']} */ ;
    (((_c = __VLS_ctx.currentTrack) === null || _c === void 0 ? void 0 : _c.artist) || 'Unknown Artist');
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "lyrics-section" }));
    /** @type {__VLS_StyleScopedClasses['lyrics-section']} */ ;
    var __VLS_6 = LyricsView_vue_1.default;
    // @ts-ignore
    var __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({}));
    var __VLS_8 = __VLS_7.apply(void 0, __spreadArray([{}], __VLS_functionalComponentArgsRest(__VLS_7), false));
}
// @ts-ignore
[currentTrack, currentTrack,];
var __VLS_3;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "mini-player-card" }, { class: ({ 'hidden': __VLS_ctx.isExpanded }) }));
/** @type {__VLS_StyleScopedClasses['mini-player-card']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ onClick: (__VLS_ctx.handleSeek) }, { class: "progress-line" }));
/** @type {__VLS_StyleScopedClasses['progress-line']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "progress-fill" }, { style: ({ width: __VLS_ctx.progressPercent + '%' }) }));
/** @type {__VLS_StyleScopedClasses['progress-fill']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "time-tooltip" }, { style: ({ left: __VLS_ctx.progressPercent + '%' }) }));
/** @type {__VLS_StyleScopedClasses['time-tooltip']} */ ;
(__VLS_ctx.formatTime(__VLS_ctx.currentTime));
(__VLS_ctx.formatTime(__VLS_ctx.duration));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ onClick: (__VLS_ctx.toggleExpand) }, { class: "mini-content" }));
/** @type {__VLS_StyleScopedClasses['mini-content']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "track-info" }));
/** @type {__VLS_StyleScopedClasses['track-info']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "track-name" }));
/** @type {__VLS_StyleScopedClasses['track-name']} */ ;
(((_d = __VLS_ctx.currentTrack) === null || _d === void 0 ? void 0 : _d.title) || '未播放');
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "track-artist" }));
/** @type {__VLS_StyleScopedClasses['track-artist']} */ ;
(((_e = __VLS_ctx.currentTrack) === null || _e === void 0 ? void 0 : _e.artist) || 'Unknown');
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ onClick: function () { } }, { class: "controls" }));
/** @type {__VLS_StyleScopedClasses['controls']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: (__VLS_ctx.playerStore.prev) }, { class: "ctrl-btn" }));
/** @type {__VLS_StyleScopedClasses['ctrl-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: (__VLS_ctx.playerStore.togglePlay) }, { class: "ctrl-btn play-btn" }));
/** @type {__VLS_StyleScopedClasses['ctrl-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['play-btn']} */ ;
if (__VLS_ctx.isPlaying) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)(__assign({ src: "/image.png", alt: "Pause" }, { class: "play-icon" }));
    /** @type {__VLS_StyleScopedClasses['play-icon']} */ ;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)(__assign({ src: "/vite.svg", alt: "Play" }, { class: "play-icon" }));
    /** @type {__VLS_StyleScopedClasses['play-icon']} */ ;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: (__VLS_ctx.playerStore.next) }, { class: "ctrl-btn" }));
/** @type {__VLS_StyleScopedClasses['ctrl-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ onClick: function () { } }, { class: "extras" }));
/** @type {__VLS_StyleScopedClasses['extras']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.input)(__assign(__assign({ onInput: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.playerStore.setVolume(parseFloat($event.target.value));
        // @ts-ignore
        [isExpanded, currentTrack, currentTrack, playerStore, playerStore, playerStore, playerStore, handleSeek, progressPercent, progressPercent, formatTime, formatTime, currentTime, duration, toggleExpand, isPlaying,];
    } }, { type: "range", min: "0", max: "1", step: "0.1" }), { class: "vol-slider" }));
(__VLS_ctx.volume);
/** @type {__VLS_StyleScopedClasses['vol-slider']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: (__VLS_ctx.toggleExpand) }, { class: "ctrl-btn expand-hint" }));
/** @type {__VLS_StyleScopedClasses['ctrl-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['expand-hint']} */ ;
// @ts-ignore
[toggleExpand, volume,];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
