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
var config_1 = require("../config");
var authStore = (0, auth_1.useAuthStore)();
var users = (0, vue_1.ref)([]);
var systemStats = (0, vue_1.ref)({
    totalUsers: 0,
    totalFiles: 0,
    totalStorage: 0,
    storageLimit: 10737418240, // 10GB
});
var loading = (0, vue_1.ref)(true);
var error = (0, vue_1.ref)('');
var songRequests = (0, vue_1.ref)([]);
var containerRef = (0, vue_1.ref)(null);
(0, vue_1.onMounted)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetchData()];
            case 1:
                _a.sent();
                if (containerRef.value) {
                    gsap_1.gsap.fromTo(containerRef.value, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
                }
                return [2 /*return*/];
        }
    });
}); });
function fetchData() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, statsRes, usersRes, requestsRes, err_1;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    loading.value = true;
                    error.value = '';
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, Promise.all([
                            axios_1.default.get("".concat(config_1.API_BASE, "/admin/stats"), {
                                headers: { Authorization: "Bearer ".concat(authStore.token) }
                            }),
                            axios_1.default.get("".concat(config_1.API_BASE, "/admin/users"), {
                                headers: { Authorization: "Bearer ".concat(authStore.token) }
                            }),
                            axios_1.default.get("".concat(config_1.API_BASE, "/song-requests"), {
                                headers: { Authorization: "Bearer ".concat(authStore.token) }
                            }).catch(function () { return ({ data: [] }); }) // 如果失败返回空数组
                        ])];
                case 2:
                    _a = _d.sent(), statsRes = _a[0], usersRes = _a[1], requestsRes = _a[2];
                    systemStats.value = statsRes.data;
                    users.value = usersRes.data;
                    songRequests.value = requestsRes.data;
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _d.sent();
                    error.value = ((_c = (_b = err_1.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || '获取数据失败';
                    console.error('Admin fetch error:', err_1);
                    return [3 /*break*/, 5];
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
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
function toggleLock(user) {
    return __awaiter(this, void 0, void 0, function () {
        var endpoint, err_2;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    endpoint = user.isLocked ? 'unlock' : 'lock';
                    return [4 /*yield*/, axios_1.default.put("".concat(config_1.API_BASE, "/admin/users/").concat(user.id, "/").concat(endpoint), {}, {
                            headers: { Authorization: "Bearer ".concat(authStore.token) }
                        })];
                case 1:
                    _c.sent();
                    user.isLocked = !user.isLocked;
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _c.sent();
                    alert(((_b = (_a = err_2.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || '操作失败');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function deleteRequest(id) {
    return __awaiter(this, void 0, void 0, function () {
        var err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm('确定删除这条求助？'))
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.delete("".concat(config_1.API_BASE, "/song-requests/").concat(id), {
                            headers: { Authorization: "Bearer ".concat(authStore.token) }
                        })];
                case 2:
                    _a.sent();
                    songRequests.value = songRequests.value.filter(function (r) { return r.id !== id; });
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _a.sent();
                    alert('删除失败');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function formatDate(dateStr) {
    return new Date(dateStr).toLocaleString('zh-CN');
}
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['error-state']} */ ;
/** @type {__VLS_StyleScopedClasses['table-header']} */ ;
/** @type {__VLS_StyleScopedClasses['table-row']} */ ;
/** @type {__VLS_StyleScopedClasses['table-row']} */ ;
/** @type {__VLS_StyleScopedClasses['table-row']} */ ;
/** @type {__VLS_StyleScopedClasses['table-row']} */ ;
/** @type {__VLS_StyleScopedClasses['role-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['role-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['locked']} */ ;
/** @type {__VLS_StyleScopedClasses['request-item']} */ ;
/** @type {__VLS_StyleScopedClasses['delete-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "admin-page" }, { ref: "containerRef" }));
/** @type {__VLS_StyleScopedClasses['admin-page']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "page-header" }));
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)(__assign({ class: "page-title" }));
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "loading-state" }));
    /** @type {__VLS_StyleScopedClasses['loading-state']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
}
else if (__VLS_ctx.error) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "error-state" }));
    /** @type {__VLS_StyleScopedClasses['error-state']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    (__VLS_ctx.error);
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: (__VLS_ctx.fetchData) }, { class: "btn btn-primary" }));
    /** @type {__VLS_StyleScopedClasses['btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "stats-grid" }));
    /** @type {__VLS_StyleScopedClasses['stats-grid']} */ ;
    var __VLS_0 = GlassCard_vue_1.default || GlassCard_vue_1.default;
    // @ts-ignore
    var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0(__assign({ class: "stat-card" })));
    var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ class: "stat-card" })], __VLS_functionalComponentArgsRest(__VLS_1), false));
    /** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
    var __VLS_5 = __VLS_3.slots.default;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "stat-value" }));
    /** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
    (__VLS_ctx.systemStats.totalUsers);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "stat-label" }));
    /** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
    // @ts-ignore
    [loading, error, error, fetchData, systemStats,];
    var __VLS_3;
    var __VLS_6 = GlassCard_vue_1.default || GlassCard_vue_1.default;
    // @ts-ignore
    var __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6(__assign({ class: "stat-card" })));
    var __VLS_8 = __VLS_7.apply(void 0, __spreadArray([__assign({ class: "stat-card" })], __VLS_functionalComponentArgsRest(__VLS_7), false));
    /** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
    var __VLS_11 = __VLS_9.slots.default;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "stat-value" }));
    /** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
    (__VLS_ctx.systemStats.totalFiles);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "stat-label" }));
    /** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
    // @ts-ignore
    [systemStats,];
    var __VLS_9;
    var __VLS_12 = GlassCard_vue_1.default || GlassCard_vue_1.default;
    // @ts-ignore
    var __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12(__assign({ class: "stat-card" })));
    var __VLS_14 = __VLS_13.apply(void 0, __spreadArray([__assign({ class: "stat-card" })], __VLS_functionalComponentArgsRest(__VLS_13), false));
    /** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
    var __VLS_17 = __VLS_15.slots.default;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "stat-value" }));
    /** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
    (__VLS_ctx.formatSize(__VLS_ctx.systemStats.totalStorage));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "stat-label" }));
    /** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
    // @ts-ignore
    [systemStats, formatSize,];
    var __VLS_15;
    var __VLS_18 = GlassCard_vue_1.default || GlassCard_vue_1.default;
    // @ts-ignore
    var __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18(__assign({ class: "stat-card" })));
    var __VLS_20 = __VLS_19.apply(void 0, __spreadArray([__assign({ class: "stat-card" })], __VLS_functionalComponentArgsRest(__VLS_19), false));
    /** @type {__VLS_StyleScopedClasses['stat-card']} */ ;
    var __VLS_23 = __VLS_21.slots.default;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "stat-value" }));
    /** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
    (__VLS_ctx.formatSize(__VLS_ctx.systemStats.storageLimit));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "stat-label" }));
    /** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
    // @ts-ignore
    [systemStats, formatSize,];
    var __VLS_21;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)(__assign({ class: "section-title" }));
    /** @type {__VLS_StyleScopedClasses['section-title']} */ ;
    var __VLS_24 = GlassCard_vue_1.default || GlassCard_vue_1.default;
    // @ts-ignore
    var __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24(__assign({ class: "users-table" }, { hoverable: (false) })));
    var __VLS_26 = __VLS_25.apply(void 0, __spreadArray([__assign({ class: "users-table" }, { hoverable: (false) })], __VLS_functionalComponentArgsRest(__VLS_25), false));
    /** @type {__VLS_StyleScopedClasses['users-table']} */ ;
    var __VLS_29 = __VLS_27.slots.default;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "table-header" }));
    /** @type {__VLS_StyleScopedClasses['table-header']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "col-user" }));
    /** @type {__VLS_StyleScopedClasses['col-user']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "col-role" }));
    /** @type {__VLS_StyleScopedClasses['col-role']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "col-files" }));
    /** @type {__VLS_StyleScopedClasses['col-files']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "col-storage" }));
    /** @type {__VLS_StyleScopedClasses['col-storage']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "col-date" }));
    /** @type {__VLS_StyleScopedClasses['col-date']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "col-actions" }));
    /** @type {__VLS_StyleScopedClasses['col-actions']} */ ;
    var _loop_1 = function (user) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign(__assign({ key: (user.id) }, { class: "table-row" }), { class: ({ locked: user.isLocked }) }));
        /** @type {__VLS_StyleScopedClasses['table-row']} */ ;
        /** @type {__VLS_StyleScopedClasses['locked']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "col-user" }));
        /** @type {__VLS_StyleScopedClasses['col-user']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "user-avatar" }));
        /** @type {__VLS_StyleScopedClasses['user-avatar']} */ ;
        (user.username[0].toUpperCase());
        (user.username);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "col-role" }));
        /** @type {__VLS_StyleScopedClasses['col-role']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "role-badge" }, { class: (user.role) }));
        /** @type {__VLS_StyleScopedClasses['role-badge']} */ ;
        (user.role);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "col-files" }));
        /** @type {__VLS_StyleScopedClasses['col-files']} */ ;
        (user.fileCount);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "col-storage" }));
        /** @type {__VLS_StyleScopedClasses['col-storage']} */ ;
        (__VLS_ctx.formatSize(user.storageUsed));
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "col-date" }));
        /** @type {__VLS_StyleScopedClasses['col-date']} */ ;
        (user.createdAt);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "col-actions" }));
        /** @type {__VLS_StyleScopedClasses['col-actions']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!!(__VLS_ctx.loading))
                    return;
                if (!!(__VLS_ctx.error))
                    return;
                __VLS_ctx.toggleLock(user);
                // @ts-ignore
                [formatSize, users, toggleLock,];
            } }, { class: "action-btn" }), { class: ({ locked: user.isLocked }) }));
        /** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
        /** @type {__VLS_StyleScopedClasses['locked']} */ ;
        (user.isLocked ? '解锁' : '锁定');
        // @ts-ignore
        [];
    };
    for (var _i = 0, _a = __VLS_vFor((__VLS_ctx.users)); _i < _a.length; _i++) {
        var user = _a[_i][0];
        _loop_1(user);
    }
    // @ts-ignore
    [];
    var __VLS_27;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)(__assign({ class: "section-title" }));
    /** @type {__VLS_StyleScopedClasses['section-title']} */ ;
    var __VLS_30 = GlassCard_vue_1.default || GlassCard_vue_1.default;
    // @ts-ignore
    var __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30(__assign({ class: "requests-table" }, { hoverable: (false) })));
    var __VLS_32 = __VLS_31.apply(void 0, __spreadArray([__assign({ class: "requests-table" }, { hoverable: (false) })], __VLS_functionalComponentArgsRest(__VLS_31), false));
    /** @type {__VLS_StyleScopedClasses['requests-table']} */ ;
    var __VLS_35 = __VLS_33.slots.default;
    if (__VLS_ctx.songRequests.length === 0) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "empty-requests" }));
        /** @type {__VLS_StyleScopedClasses['empty-requests']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "request-list" }));
        /** @type {__VLS_StyleScopedClasses['request-list']} */ ;
        var _loop_2 = function (req) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ key: (req.id) }, { class: "request-item" }));
            /** @type {__VLS_StyleScopedClasses['request-item']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "request-info" }));
            /** @type {__VLS_StyleScopedClasses['request-info']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "request-user" }));
            /** @type {__VLS_StyleScopedClasses['request-user']} */ ;
            (req.username);
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "request-song" }));
            /** @type {__VLS_StyleScopedClasses['request-song']} */ ;
            (req.songName);
            if (req.artistName) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "request-artist" }));
                /** @type {__VLS_StyleScopedClasses['request-artist']} */ ;
                (req.artistName);
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "request-date" }));
            /** @type {__VLS_StyleScopedClasses['request-date']} */ ;
            (__VLS_ctx.formatDate(req.createdAt));
            __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: function () {
                    var _a = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        _a[_i] = arguments[_i];
                    }
                    var $event = _a[0];
                    if (!!(__VLS_ctx.loading))
                        return;
                    if (!!(__VLS_ctx.error))
                        return;
                    if (!!(__VLS_ctx.songRequests.length === 0))
                        return;
                    __VLS_ctx.deleteRequest(req.id);
                    // @ts-ignore
                    [songRequests, songRequests, formatDate, deleteRequest,];
                } }, { class: "delete-btn" }));
            /** @type {__VLS_StyleScopedClasses['delete-btn']} */ ;
            // @ts-ignore
            [];
        };
        for (var _b = 0, _c = __VLS_vFor((__VLS_ctx.songRequests)); _b < _c.length; _b++) {
            var req = _c[_b][0];
            _loop_2(req);
        }
    }
    // @ts-ignore
    [];
    var __VLS_33;
}
// @ts-ignore
[];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
