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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var vue_router_1 = require("vue-router");
var auth_1 = require("../stores/auth");
var GlassCard_vue_1 = require("../components/GlassCard.vue");
var axios_1 = require("axios");
var config_1 = require("../config");
var router = (0, vue_router_1.useRouter)();
var authStore = (0, auth_1.useAuthStore)();
// const socketStore = useSocketStore();
// --- State ---
var greeting = (0, vue_1.ref)('');
var unreadMessagesCount = (0, vue_1.ref)(0);
var todayEvents = (0, vue_1.ref)([]);
var recentMemos = (0, vue_1.ref)([]);
var storageUsage = (0, vue_1.ref)({ totalSize: 0, fileCount: 0 });
var isLoading = (0, vue_1.ref)(true);
// --- Computed ---
var formattedStorage = (0, vue_1.computed)(function () {
    var size = storageUsage.value.totalSize;
    if (size < 1024)
        return size + ' B';
    if (size < 1024 * 1024)
        return (size / 1024).toFixed(1) + ' KB';
    if (size < 1024 * 1024 * 1024)
        return (size / (1024 * 1024)).toFixed(1) + ' MB';
    return (size / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
});
var storagePercent = (0, vue_1.computed)(function () {
    // Attempting to simulate a 5GB limit for the progress bar visual
    var LIMIT = 5 * 1024 * 1024 * 1024;
    return Math.min((storageUsage.value.totalSize / LIMIT) * 100, 100);
});
// --- Methods ---
function setGreeting() {
    var hour = new Date().getHours();
    if (hour < 5)
        greeting.value = '夜深了，注意休息';
    else if (hour < 9)
        greeting.value = '早上好';
    else if (hour < 12)
        greeting.value = '上午好';
    else if (hour < 14)
        greeting.value = '中午好';
    else if (hour < 18)
        greeting.value = '下午好';
    else
        greeting.value = '晚上好';
}
function fetchData() {
    return __awaiter(this, void 0, void 0, function () {
        var headers, _a, msgRes, fileRes, memoRes, calendarRes, todayStr_1, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!authStore.token)
                        return [2 /*return*/];
                    isLoading.value = true;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, 4, 5]);
                    headers = { Authorization: "Bearer ".concat(authStore.token) };
                    return [4 /*yield*/, Promise.all([
                            axios_1.default.get("".concat(config_1.API_BASE, "/messages/unread-count"), { headers: headers }),
                            axios_1.default.get("".concat(config_1.API_BASE, "/files/storage/usage"), { headers: headers }).catch(function () { return ({ data: { totalSize: 0, fileCount: 0 } }); }),
                            axios_1.default.get("".concat(config_1.API_BASE, "/memos"), { headers: headers }).catch(function () { return ({ data: [] }); }),
                            axios_1.default.get("".concat(config_1.API_BASE, "/calendar"), { headers: headers }).catch(function () { return ({ data: [] }); })
                        ])];
                case 2:
                    _a = _b.sent(), msgRes = _a[0], fileRes = _a[1], memoRes = _a[2], calendarRes = _a[3];
                    unreadMessagesCount.value = msgRes.data.count || 0;
                    storageUsage.value = fileRes.data;
                    recentMemos.value = memoRes.data.slice(0, 3);
                    todayStr_1 = new Date().toDateString();
                    todayEvents.value = calendarRes.data.filter(function (e) { return new Date(e.startTime).toDateString() === todayStr_1; });
                    return [3 /*break*/, 5];
                case 3:
                    e_1 = _b.sent();
                    console.error('Failed to load dashboard data', e_1);
                    return [3 /*break*/, 5];
                case 4:
                    isLoading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
}
// --- Lifecycle ---
(0, vue_1.onMounted)(function () {
    setGreeting();
    fetchData();
});
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['schedule-card']} */ ;
/** @type {__VLS_StyleScopedClasses['memos-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-grid']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "home-dashboard" }));
/** @type {__VLS_StyleScopedClasses['home-dashboard']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "header-section" }));
/** @type {__VLS_StyleScopedClasses['header-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)(__assign({ class: "greeting" }));
/** @type {__VLS_StyleScopedClasses['greeting']} */ ;
(__VLS_ctx.greeting);
((_a = __VLS_ctx.authStore.user) === null || _a === void 0 ? void 0 : _a.username);
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "subtitle" }));
/** @type {__VLS_StyleScopedClasses['subtitle']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "dashboard-grid" }));
/** @type {__VLS_StyleScopedClasses['dashboard-grid']} */ ;
var __VLS_0 = GlassCard_vue_1.default || GlassCard_vue_1.default;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0(__assign(__assign({ 'onClick': {} }, { class: "dashboard-card stat-card" }), { delay: (0) })));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { class: "dashboard-card stat-card" }), { delay: (0) })], __VLS_functionalComponentArgsRest(__VLS_1), false));
var __VLS_5;
var __VLS_6 = ({ click: {} },
    { onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.router.push('/dashboard/messages');
            // @ts-ignore
            [greeting, authStore, router,];
        } });
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
var __VLS_7 = __VLS_3.slots.default;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "stat-icon message-icon" }));
/** @type {__VLS_StyleScopedClasses['stat-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['message-icon']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    'stroke-width': "2",
    'stroke-linecap': "round",
    'stroke-linejoin': "round",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.path, __VLS_intrinsics.path)({
    d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "stat-info" }));
/** @type {__VLS_StyleScopedClasses['stat-info']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "stat-value" }));
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
(__VLS_ctx.unreadMessagesCount);
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "stat-label" }));
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
// @ts-ignore
[unreadMessagesCount,];
var __VLS_3;
var __VLS_4;
var __VLS_8 = GlassCard_vue_1.default || GlassCard_vue_1.default;
// @ts-ignore
var __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8(__assign(__assign({ 'onClick': {} }, { class: "dashboard-card stat-card" }), { delay: (0.1) })));
var __VLS_10 = __VLS_9.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { class: "dashboard-card stat-card" }), { delay: (0.1) })], __VLS_functionalComponentArgsRest(__VLS_9), false));
var __VLS_13;
var __VLS_14 = ({ click: {} },
    { onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.router.push('/dashboard/drive');
            // @ts-ignore
            [router,];
        } });
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
var __VLS_15 = __VLS_11.slots.default;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "stat-icon storage-icon" }));
/** @type {__VLS_StyleScopedClasses['stat-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['storage-icon']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)({
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    'stroke-width': "2",
    'stroke-linecap': "round",
    'stroke-linejoin': "round",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.polyline, __VLS_intrinsics.polyline)({
    points: "22 12 18 12 15 21 9 3 6 12 2 12",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "stat-info" }));
/** @type {__VLS_StyleScopedClasses['stat-info']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "stat-value" }));
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
(__VLS_ctx.formattedStorage);
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "stat-label" }));
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "progress-bar" }));
/** @type {__VLS_StyleScopedClasses['progress-bar']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "progress-fill" }, { style: ({ width: __VLS_ctx.storagePercent + '%' }) }));
/** @type {__VLS_StyleScopedClasses['progress-fill']} */ ;
// @ts-ignore
[formattedStorage, storagePercent,];
var __VLS_11;
var __VLS_12;
var __VLS_16 = GlassCard_vue_1.default || GlassCard_vue_1.default;
// @ts-ignore
var __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16(__assign(__assign({ 'onClick': {} }, { class: "dashboard-card schedule-card" }), { delay: (0.2) })));
var __VLS_18 = __VLS_17.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { class: "dashboard-card schedule-card" }), { delay: (0.2) })], __VLS_functionalComponentArgsRest(__VLS_17), false));
var __VLS_21;
var __VLS_22 = ({ click: {} },
    { onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.router.push('/dashboard/calendar');
            // @ts-ignore
            [router,];
        } });
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['schedule-card']} */ ;
var __VLS_23 = __VLS_19.slots.default;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "card-header" }));
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "badge" }));
/** @type {__VLS_StyleScopedClasses['badge']} */ ;
(__VLS_ctx.todayEvents.length);
if (__VLS_ctx.todayEvents.length > 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "schedule-list" }));
    /** @type {__VLS_StyleScopedClasses['schedule-list']} */ ;
    for (var _i = 0, _b = __VLS_vFor((__VLS_ctx.todayEvents)); _i < _b.length; _i++) {
        var event_1 = _b[_i][0];
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ key: (event_1.id) }, { class: "schedule-item" }));
        /** @type {__VLS_StyleScopedClasses['schedule-item']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "time-dot" }));
        /** @type {__VLS_StyleScopedClasses['time-dot']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "event-title" }));
        /** @type {__VLS_StyleScopedClasses['event-title']} */ ;
        (event_1.title);
        // @ts-ignore
        [todayEvents, todayEvents, todayEvents,];
    }
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "empty-state" }));
    /** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
}
// @ts-ignore
[];
var __VLS_19;
var __VLS_20;
var __VLS_24 = GlassCard_vue_1.default || GlassCard_vue_1.default;
// @ts-ignore
var __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24(__assign(__assign({ 'onClick': {} }, { class: "dashboard-card memos-card" }), { delay: (0.3) })));
var __VLS_26 = __VLS_25.apply(void 0, __spreadArray([__assign(__assign({ 'onClick': {} }, { class: "dashboard-card memos-card" }), { delay: (0.3) })], __VLS_functionalComponentArgsRest(__VLS_25), false));
var __VLS_29;
var __VLS_30 = ({ click: {} },
    { onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.router.push('/dashboard/memos');
            // @ts-ignore
            [router,];
        } });
/** @type {__VLS_StyleScopedClasses['dashboard-card']} */ ;
/** @type {__VLS_StyleScopedClasses['memos-card']} */ ;
var __VLS_31 = __VLS_27.slots.default;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "card-header" }));
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({});
if (__VLS_ctx.recentMemos.length > 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "memos-list" }));
    /** @type {__VLS_StyleScopedClasses['memos-list']} */ ;
    for (var _c = 0, _d = __VLS_vFor((__VLS_ctx.recentMemos)); _c < _d.length; _c++) {
        var memo = _d[_c][0];
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ key: (memo.id) }, { class: "memo-item" }));
        /** @type {__VLS_StyleScopedClasses['memo-item']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "memo-content" }));
        /** @type {__VLS_StyleScopedClasses['memo-content']} */ ;
        (memo.content);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "memo-date" }));
        /** @type {__VLS_StyleScopedClasses['memo-date']} */ ;
        (__VLS_ctx.formatDate(memo.createdAt));
        // @ts-ignore
        [recentMemos, recentMemos, formatDate,];
    }
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "empty-state" }));
    /** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
}
// @ts-ignore
[];
var __VLS_27;
var __VLS_28;
// @ts-ignore
[];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
