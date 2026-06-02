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
var vue_router_1 = require("vue-router");
var auth_1 = require("../stores/auth");
var socket_1 = require("../stores/socket");
var useTheme_1 = require("../composables/useTheme");
var GlassCard_vue_1 = require("./GlassCard.vue");
var axios_1 = require("axios");
var config_1 = require("../config");
var router = (0, vue_router_1.useRouter)();
var authStore = (0, auth_1.useAuthStore)();
var socketStore = (0, socket_1.useSocketStore)();
var _a = (0, useTheme_1.useTheme)(), currentTheme = _a.currentTheme, setTheme = _a.setTheme, themes = _a.themes;
// 未读消息数
var unreadCount = (0, vue_1.ref)(0);
var fetchTimeout;
function fetchUnreadCount() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            if (!authStore.isAuthenticated)
                return [2 /*return*/];
            // Throttle: If a request is already pending or was just made, delay this one
            if (fetchTimeout)
                clearTimeout(fetchTimeout);
            fetchTimeout = window.setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                var data, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, axios_1.default.get("".concat(config_1.API_BASE, "/messages/unread-count"), {
                                    headers: { Authorization: "Bearer ".concat(authStore.token) }
                                })];
                        case 1:
                            data = (_a.sent()).data;
                            unreadCount.value = data.count;
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _a.sent();
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); }, 1000); // 1s Debounce
            return [2 /*return*/];
        });
    });
}
// 实时时钟
var currentTime = (0, vue_1.ref)('');
var currentDate = (0, vue_1.ref)('');
function updateTime() {
    var now = new Date();
    currentTime.value = now.toLocaleTimeString('zh-CN', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    currentDate.value = now.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        weekday: 'short'
    });
}
var timeInterval;
var unreadInterval;
(0, vue_1.onMounted)(function () {
    updateTime();
    timeInterval = window.setInterval(updateTime, 1000);
    // 初始化
    if (authStore.isAuthenticated) {
        socketStore.connect();
        fetchUnreadCount();
    }
    unreadInterval = window.setInterval(fetchUnreadCount, 30000); // 每30秒刷新
    // 监听消息已读事件，立即刷新未读数
    window.addEventListener('messages-read', fetchUnreadCount);
});
// 监听 Socket 新消息
function handleGlobalNewMessage(message) {
    var _a;
    // 如果不是自己发的，且当前不在消息页面(或消息页面未处理)，则增加未读数
    // 简单处理：收到新消息就刷新未读数，最准确
    if (message.senderId !== ((_a = authStore.user) === null || _a === void 0 ? void 0 : _a.id)) {
        fetchUnreadCount(); // 直接从后端拉取最新未读数，确保准确
    }
}
(0, vue_1.watch)(function () { return socketStore.socket; }, function (socket) {
    if (!socket)
        return;
    // 只监听一次，避免重复
    socket.off('newMessage', handleGlobalNewMessage);
    socket.on('newMessage', handleGlobalNewMessage);
}, { immediate: true });
(0, vue_1.onUnmounted)(function () {
    clearInterval(timeInterval);
    clearInterval(unreadInterval);
    window.removeEventListener('messages-read', fetchUnreadCount);
    if (socketStore.socket) {
        socketStore.socket.off('newMessage', handleGlobalNewMessage);
    }
});
// 监听登录状态变化
(0, vue_1.watch)(function () { return authStore.isAuthenticated; }, function (isAuth) {
    if (isAuth) {
        socketStore.connect();
        fetchUnreadCount();
    }
    else {
        socketStore.disconnect();
        unreadCount.value = 0;
    }
});
// 主题切换
var showThemePanel = (0, vue_1.ref)(false);
function selectTheme(theme) {
    setTheme(theme);
    authStore.updateAccentColor(theme);
    showThemePanel.value = false;
}
// 导航项
var navItems = [
    { name: 'DashboardHome', label: '首页' },
    { name: 'Memos', label: '备忘录' },
    { name: 'Posts', label: '帖子' },
    { name: 'Media', label: '媒体' },
    { name: 'Music', label: '音乐' },
    { name: 'Drive', label: '云盘' },
    { name: 'Calendar', label: '日历' },
    { name: 'Whiteboard', label: '白板' },
    { name: 'Messages', label: '消息' },
];
function handleLogout() {
    authStore.logout();
    router.push('/login');
}
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['logo']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['search-box']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['search-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['theme-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['theme-option']} */ ;
/** @type {__VLS_StyleScopedClasses['theme-option']} */ ;
/** @type {__VLS_StyleScopedClasses['theme-option-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['theme-option-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['theme-option-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['logout-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['search-box']} */ ;
/** @type {__VLS_StyleScopedClasses['result-category']} */ ;
/** @type {__VLS_StyleScopedClasses['result-item']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.header, __VLS_intrinsics.header)(__assign({ class: "top-nav" }));
/** @type {__VLS_StyleScopedClasses['top-nav']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nav-left" }));
/** @type {__VLS_StyleScopedClasses['nav-left']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.router.push('/dashboard');
        // @ts-ignore
        [router,];
    } }, { class: "logo" }));
/** @type {__VLS_StyleScopedClasses['logo']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.img)(__assign({ src: "/image.png", alt: "ZKY" }, { class: "logo-image" }));
/** @type {__VLS_StyleScopedClasses['logo-image']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "logo-subtitle" }));
/** @type {__VLS_StyleScopedClasses['logo-subtitle']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.nav, __VLS_intrinsics.nav)(__assign({ class: "nav-center" }));
/** @type {__VLS_StyleScopedClasses['nav-center']} */ ;
for (var _i = 0, _b = __VLS_vFor((__VLS_ctx.navItems)); _i < _b.length; _i++) {
    var item = _b[_i][0];
    var __VLS_0 = void 0;
    /** @ts-ignore @type {typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink | typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink} */
    routerLink;
    // @ts-ignore
    var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0(__assign({ key: (item.name), to: ({ name: item.name }) }, { class: "nav-link" })));
    var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ key: (item.name), to: ({ name: item.name }) }, { class: "nav-link" })], __VLS_functionalComponentArgsRest(__VLS_1), false));
    /** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
    var __VLS_5 = __VLS_3.slots.default;
    (item.label);
    if (item.name === 'Messages' && __VLS_ctx.unreadCount > 0) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "unread-badge" }));
        /** @type {__VLS_StyleScopedClasses['unread-badge']} */ ;
        (__VLS_ctx.unreadCount > 99 ? '99+' : __VLS_ctx.unreadCount);
    }
    // @ts-ignore
    [navItems, unreadCount, unreadCount, unreadCount,];
    var __VLS_3;
    // @ts-ignore
    [];
}
if (__VLS_ctx.authStore.isAdmin) {
    var __VLS_6 = void 0;
    /** @ts-ignore @type {typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink | typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink} */
    routerLink;
    // @ts-ignore
    var __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6(__assign({ to: ({ name: 'Admin' }) }, { class: "nav-link nav-link--admin" })));
    var __VLS_8 = __VLS_7.apply(void 0, __spreadArray([__assign({ to: ({ name: 'Admin' }) }, { class: "nav-link nav-link--admin" })], __VLS_functionalComponentArgsRest(__VLS_7), false));
    /** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
    /** @type {__VLS_StyleScopedClasses['nav-link--admin']} */ ;
    var __VLS_11 = __VLS_9.slots.default;
    // @ts-ignore
    [authStore,];
    var __VLS_9;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nav-right" }));
/** @type {__VLS_StyleScopedClasses['nav-right']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "clock" }));
/** @type {__VLS_StyleScopedClasses['clock']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "clock-time" }));
/** @type {__VLS_StyleScopedClasses['clock-time']} */ ;
(__VLS_ctx.currentTime);
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "clock-date" }));
/** @type {__VLS_StyleScopedClasses['clock-date']} */ ;
(__VLS_ctx.currentDate);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "theme-switcher" }));
/** @type {__VLS_StyleScopedClasses['theme-switcher']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.showThemePanel = !__VLS_ctx.showThemePanel;
        // @ts-ignore
        [currentTime, currentDate, showThemePanel, showThemePanel,];
    } }, { class: "theme-btn" }));
/** @type {__VLS_StyleScopedClasses['theme-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "theme-dot" }));
/** @type {__VLS_StyleScopedClasses['theme-dot']} */ ;
if (__VLS_ctx.showThemePanel) {
    var __VLS_12 = GlassCard_vue_1.default || GlassCard_vue_1.default;
    // @ts-ignore
    var __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12(__assign({ class: "theme-panel" }, { hoverable: (false) })));
    var __VLS_14 = __VLS_13.apply(void 0, __spreadArray([__assign({ class: "theme-panel" }, { hoverable: (false) })], __VLS_functionalComponentArgsRest(__VLS_13), false));
    /** @type {__VLS_StyleScopedClasses['theme-panel']} */ ;
    var __VLS_17 = __VLS_15.slots.default;
    var _loop_1 = function (theme) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign(__assign(__assign(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.showThemePanel))
                    return;
                __VLS_ctx.selectTheme(theme);
                // @ts-ignore
                [showThemePanel, themes, selectTheme,];
            } }, { key: (theme) }), { class: "theme-option" }), { class: ({ active: __VLS_ctx.currentTheme === theme }) }), { 'data-theme': (theme) }));
        /** @type {__VLS_StyleScopedClasses['theme-option']} */ ;
        /** @type {__VLS_StyleScopedClasses['active']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "theme-option-dot" }, { 'data-theme': (theme) }));
        /** @type {__VLS_StyleScopedClasses['theme-option-dot']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (theme === 'cyber-blue' ? '赛博蓝' :
            theme === 'neon-green' ? '荧光绿' : '岩浆红');
        // @ts-ignore
        [currentTheme,];
    };
    for (var _c = 0, _d = __VLS_vFor((__VLS_ctx.themes)); _c < _d.length; _c++) {
        var theme = _d[_c][0];
        _loop_1(theme);
    }
    // @ts-ignore
    [];
    var __VLS_15;
}
if (__VLS_ctx.authStore.user) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "user-info" }));
    /** @type {__VLS_StyleScopedClasses['user-info']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "username" }));
    /** @type {__VLS_StyleScopedClasses['username']} */ ;
    (__VLS_ctx.authStore.user.username);
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: (__VLS_ctx.handleLogout) }, { class: "logout-btn" }));
    /** @type {__VLS_StyleScopedClasses['logout-btn']} */ ;
}
// @ts-ignore
[authStore, authStore, handleLogout,];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
