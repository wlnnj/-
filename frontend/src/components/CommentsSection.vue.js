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
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var axios_1 = require("axios");
var auth_1 = require("../stores/auth");
var config_1 = require("../config");
var props = defineProps();
var emit = defineEmits();
var authStore = (0, auth_1.useAuthStore)();
var comments = (0, vue_1.ref)([]);
var commentContent = (0, vue_1.ref)('');
var isLoading = (0, vue_1.ref)(false);
var isSubmitting = (0, vue_1.ref)(false);
function fetchComments() {
    return __awaiter(this, void 0, void 0, function () {
        var data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    isLoading.value = true;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, axios_1.default.get("".concat(config_1.API_BASE, "/comments/post/").concat(props.postId))];
                case 2:
                    data = (_a.sent()).data;
                    comments.value = data;
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error('获取评论失败:', error_1);
                    return [3 /*break*/, 5];
                case 4:
                    isLoading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function submitComment() {
    return __awaiter(this, void 0, void 0, function () {
        var data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!commentContent.value.trim() || isSubmitting.value)
                        return [2 /*return*/];
                    if (!authStore.isAuthenticated) {
                        alert('请先登录');
                        return [2 /*return*/];
                    }
                    isSubmitting.value = true;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, axios_1.default.post("".concat(config_1.API_BASE, "/comments"), {
                            postId: props.postId,
                            content: commentContent.value
                        })];
                case 2:
                    data = (_a.sent()).data;
                    comments.value.unshift(data);
                    commentContent.value = '';
                    emit('comment-added');
                    return [3 /*break*/, 5];
                case 3:
                    error_2 = _a.sent();
                    console.error('发表评论失败:', error_2);
                    alert('发表评论失败，请重试');
                    return [3 /*break*/, 5];
                case 4:
                    isSubmitting.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function deleteComment(commentId) {
    return __awaiter(this, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm('确定要删除这条评论吗？'))
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.delete("".concat(config_1.API_BASE, "/comments/").concat(commentId))];
                case 2:
                    _a.sent();
                    comments.value = comments.value.filter(function (c) { return c.id !== commentId; });
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error('删除评论失败:', error_3);
                    alert('删除失败');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function canDelete(comment) {
    if (!authStore.user)
        return false;
    return authStore.isAdmin || (comment.user && authStore.user.id === comment.user.id);
}
function formatDate(dateStr) {
    return new Date(dateStr).toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}
(0, vue_1.onMounted)(function () {
    fetchComments();
});
var __VLS_ctx = __assign(__assign(__assign(__assign(__assign({}, {}), {}), {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['comment-item']} */ ;
/** @type {__VLS_StyleScopedClasses['delete-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['delete-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['comment-input']} */ ;
/** @type {__VLS_StyleScopedClasses['send-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['send-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "comments-section" }));
/** @type {__VLS_StyleScopedClasses['comments-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)(__assign({ class: "section-title" }));
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
(__VLS_ctx.comments.length);
if (__VLS_ctx.isLoading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "loading" }));
    /** @type {__VLS_StyleScopedClasses['loading']} */ ;
}
else if (__VLS_ctx.comments.length === 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "empty" }));
    /** @type {__VLS_StyleScopedClasses['empty']} */ ;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "comments-list" }));
    /** @type {__VLS_StyleScopedClasses['comments-list']} */ ;
    var _loop_1 = function (comment) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ key: (comment.id) }, { class: "comment-item" }));
        /** @type {__VLS_StyleScopedClasses['comment-item']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "comment-avatar" }, { class: ("avatar-".concat(((_a = comment.user) === null || _a === void 0 ? void 0 : _a.accentColor) || 'cyber-blue')) }));
        /** @type {__VLS_StyleScopedClasses['comment-avatar']} */ ;
        (((_d = (_c = (_b = comment.user) === null || _b === void 0 ? void 0 : _b.username) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.toUpperCase()) || '?');
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "comment-body" }));
        /** @type {__VLS_StyleScopedClasses['comment-body']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "comment-header" }));
        /** @type {__VLS_StyleScopedClasses['comment-header']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "comment-username" }));
        /** @type {__VLS_StyleScopedClasses['comment-username']} */ ;
        (((_e = comment.user) === null || _e === void 0 ? void 0 : _e.username) || '已注销用户');
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "comment-time" }));
        /** @type {__VLS_StyleScopedClasses['comment-time']} */ ;
        (__VLS_ctx.formatDate(comment.createdAt));
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "comment-content" }));
        /** @type {__VLS_StyleScopedClasses['comment-content']} */ ;
        (comment.content);
        if (__VLS_ctx.canDelete(comment)) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: function () {
                    var _a = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        _a[_i] = arguments[_i];
                    }
                    var $event = _a[0];
                    if (!!(__VLS_ctx.isLoading))
                        return;
                    if (!!(__VLS_ctx.comments.length === 0))
                        return;
                    if (!(__VLS_ctx.canDelete(comment)))
                        return;
                    __VLS_ctx.deleteComment(comment.id);
                    // @ts-ignore
                    [comments, comments, comments, isLoading, formatDate, canDelete, deleteComment,];
                } }, { class: "delete-btn" }));
            /** @type {__VLS_StyleScopedClasses['delete-btn']} */ ;
        }
        // @ts-ignore
        [];
    };
    for (var _i = 0, _f = __VLS_vFor((__VLS_ctx.comments)); _i < _f.length; _i++) {
        var comment = _f[_i][0];
        _loop_1(comment);
    }
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "comment-form" }));
/** @type {__VLS_StyleScopedClasses['comment-form']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.input)(__assign(__assign(__assign({ onKeyup: (__VLS_ctx.submitComment) }, { value: (__VLS_ctx.commentContent), type: "text" }), { class: "comment-input" }), { placeholder: "写下你的评论...", disabled: (__VLS_ctx.isSubmitting) }));
/** @type {__VLS_StyleScopedClasses['comment-input']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: (__VLS_ctx.submitComment) }, { class: "send-btn" }), { disabled: (!__VLS_ctx.commentContent.trim() || __VLS_ctx.isSubmitting) }));
/** @type {__VLS_StyleScopedClasses['send-btn']} */ ;
// @ts-ignore
[submitComment, submitComment, commentContent, commentContent, isSubmitting, isSubmitting,];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
exports.default = {};
