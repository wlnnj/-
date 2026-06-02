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
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var player_1 = require("../stores/player");
var pinia_1 = require("pinia");
var playerStore = (0, player_1.usePlayerStore)();
var _a = (0, pinia_1.storeToRefs)(playerStore), lyrics = _a.lyrics, currentLyricIndex = _a.currentLyricIndex;
var containerRef = (0, vue_1.ref)(null);
// Auto Scroll Logic
(0, vue_1.watch)(currentLyricIndex, function (newIndex) { return __awaiter(void 0, void 0, void 0, function () {
    var activeItem;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(newIndex >= 0 && containerRef.value)) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, vue_1.nextTick)()];
            case 1:
                _a.sent();
                activeItem = containerRef.value.children[newIndex];
                if (activeItem) {
                    activeItem.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                    });
                }
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); });
function handleLyricClick(time) {
    playerStore.seek(time);
}
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['lyrics-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['lyrics-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['lyrics-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['lyrics-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['lyrics-container']} */ ;
/** @type {__VLS_StyleScopedClasses['lyric-line']} */ ;
/** @type {__VLS_StyleScopedClasses['lyric-line']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "lyrics-wrapper" }));
/** @type {__VLS_StyleScopedClasses['lyrics-wrapper']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "lyrics-container" }, { ref: "containerRef" }));
/** @type {__VLS_StyleScopedClasses['lyrics-container']} */ ;
if (__VLS_ctx.lyrics.length === 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "no-lyrics" }));
    /** @type {__VLS_StyleScopedClasses['no-lyrics']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
}
var _loop_1 = function (line, index) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.handleLyricClick(line.time);
            // @ts-ignore
            [lyrics, lyrics, handleLyricClick,];
        } }, { key: (index) }), { class: "lyric-line" }), { class: ({ 'active': index === __VLS_ctx.currentLyricIndex }) }));
    /** @type {__VLS_StyleScopedClasses['lyric-line']} */ ;
    /** @type {__VLS_StyleScopedClasses['active']} */ ;
    (line.text);
    // @ts-ignore
    [currentLyricIndex,];
};
for (var _i = 0, _b = __VLS_vFor((__VLS_ctx.lyrics)); _i < _b.length; _i++) {
    var _c = _b[_i], line = _c[0], index = _c[1];
    _loop_1(line, index);
}
// @ts-ignore
[];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
