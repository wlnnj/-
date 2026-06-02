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
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var axios_1 = require("axios");
var GlassCard_vue_1 = require("../components/GlassCard.vue");
var CommentsSection_vue_1 = require("../components/CommentsSection.vue");
var gsap_1 = require("gsap");
var auth_1 = require("../stores/auth");
var config_1 = require("../config");
var authStore = (0, auth_1.useAuthStore)();
var posts = (0, vue_1.ref)([]);
var newPostContent = (0, vue_1.ref)('');
var showPostModal = (0, vue_1.ref)(false);
var isLoading = (0, vue_1.ref)(false);
var containerRef = (0, vue_1.ref)(null);
function fetchPosts() {
    return __awaiter(this, void 0, void 0, function () {
        var data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    isLoading.value = true;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, axios_1.default.get("".concat(config_1.API_BASE, "/posts?limit=50"))];
                case 2:
                    data = (_a.sent()).data;
                    posts.value = data.posts.map(function (p) { return (__assign(__assign({}, p), { showComments: false })); });
                    // 动画
                    if (containerRef.value) {
                        // nextTick maybe needed, but axios is async so DOM update follows
                        setTimeout(function () {
                            var _a;
                            var cards = (_a = containerRef.value) === null || _a === void 0 ? void 0 : _a.querySelectorAll('.post-card');
                            if (cards) {
                                gsap_1.gsap.fromTo(cards, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' });
                            }
                        }, 100);
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error('获取帖子失败:', error_1);
                    return [3 /*break*/, 5];
                case 4:
                    isLoading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function createPost() {
    return __awaiter(this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!newPostContent.value.trim())
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.post("".concat(config_1.API_BASE, "/posts"), {
                            content: newPostContent.value,
                            images: [] // TODO: 图片上传
                        })];
                case 2:
                    _a.sent();
                    showPostModal.value = false;
                    newPostContent.value = '';
                    fetchPosts(); // 刷新列表
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error('发布帖子失败:', error_2);
                    alert('发布失败');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function deletePost(postId) {
    return __awaiter(this, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm('确定要删除这条帖子吗？'))
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.delete("".concat(config_1.API_BASE, "/posts/").concat(postId))];
                case 2:
                    _a.sent();
                    // Remove from list
                    posts.value = posts.value.filter(function (p) { return p.id !== postId; });
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error('删除帖子失败:', error_3);
                    alert('删除失败，请稍后重试');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function toggleComments(post) {
    post.showComments = !post.showComments;
}
function handleCommentAdded(post) {
    post.commentCount++;
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
    fetchPosts();
});
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['delete-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['post-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['post-textarea']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "posts-page" }));
/** @type {__VLS_StyleScopedClasses['posts-page']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "page-header" }));
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)(__assign({ class: "page-title" }));
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
if (__VLS_ctx.authStore.isAuthenticated) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.authStore.isAuthenticated))
                return;
            __VLS_ctx.showPostModal = true;
            // @ts-ignore
            [authStore, showPostModal,];
        } }, { class: "btn btn-primary" }));
    /** @type {__VLS_StyleScopedClasses['btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
}
if (__VLS_ctx.isLoading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "loading-state" }));
    /** @type {__VLS_StyleScopedClasses['loading-state']} */ ;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "posts-feed" }, { ref: "containerRef" }));
    /** @type {__VLS_StyleScopedClasses['posts-feed']} */ ;
    var _loop_1 = function (post) {
        var __VLS_0 = GlassCard_vue_1.default || GlassCard_vue_1.default;
        // @ts-ignore
        var __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0(__assign(__assign({ key: (post.id) }, { class: "post-card" }), { id: ("post-".concat(post.id)) })));
        var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign(__assign({ key: (post.id) }, { class: "post-card" }), { id: ("post-".concat(post.id)) })], __VLS_functionalComponentArgsRest(__VLS_1), false));
        /** @type {__VLS_StyleScopedClasses['post-card']} */ ;
        var __VLS_5 = __VLS_3.slots.default;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "post-header" }));
        /** @type {__VLS_StyleScopedClasses['post-header']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "post-avatar" }, { class: ("avatar-".concat(((_a = post.user) === null || _a === void 0 ? void 0 : _a.accentColor) || 'cyber-blue')) }));
        /** @type {__VLS_StyleScopedClasses['post-avatar']} */ ;
        (((_d = (_c = (_b = post.user) === null || _b === void 0 ? void 0 : _b.username) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.toUpperCase()) || '?');
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "post-meta" }));
        /** @type {__VLS_StyleScopedClasses['post-meta']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "post-username" }));
        /** @type {__VLS_StyleScopedClasses['post-username']} */ ;
        (((_e = post.user) === null || _e === void 0 ? void 0 : _e.username) || '用户');
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "post-time" }));
        /** @type {__VLS_StyleScopedClasses['post-time']} */ ;
        (__VLS_ctx.formatDate(post.createdAt));
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "post-content" }));
        /** @type {__VLS_StyleScopedClasses['post-content']} */ ;
        (post.content);
        if (post.images && post.images.length) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "post-images" }));
            /** @type {__VLS_StyleScopedClasses['post-images']} */ ;
            for (var _h = 0, _j = __VLS_vFor((post.images)); _h < _j.length; _h++) {
                var _k = _j[_h], img = _k[0], idx = _k[1];
                __VLS_asFunctionalElement1(__VLS_intrinsics.img)(__assign({ key: (idx), src: (img) }, { class: "post-image" }));
                /** @type {__VLS_StyleScopedClasses['post-image']} */ ;
                // @ts-ignore
                [isLoading, posts, formatDate,];
            }
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "post-footer" }));
        /** @type {__VLS_StyleScopedClasses['post-footer']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!!(__VLS_ctx.isLoading))
                    return;
                __VLS_ctx.toggleComments(post);
                // @ts-ignore
                [toggleComments,];
            } }, { class: "action-btn" }));
        /** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
        (post.commentCount);
        if (__VLS_ctx.authStore.user && (__VLS_ctx.authStore.user.id === ((_f = post.user) === null || _f === void 0 ? void 0 : _f.id) || __VLS_ctx.authStore.isAdmin)) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: function () {
                    var _a;
                    var _b = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        _b[_i] = arguments[_i];
                    }
                    var $event = _b[0];
                    if (!!(__VLS_ctx.isLoading))
                        return;
                    if (!(__VLS_ctx.authStore.user && (__VLS_ctx.authStore.user.id === ((_a = post.user) === null || _a === void 0 ? void 0 : _a.id) || __VLS_ctx.authStore.isAdmin)))
                        return;
                    __VLS_ctx.deletePost(post.id);
                    // @ts-ignore
                    [authStore, authStore, authStore, deletePost,];
                } }, { class: "action-btn delete-btn" }));
            /** @type {__VLS_StyleScopedClasses['action-btn']} */ ;
            /** @type {__VLS_StyleScopedClasses['delete-btn']} */ ;
        }
        if (post.showComments) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "post-comments" }));
            /** @type {__VLS_StyleScopedClasses['post-comments']} */ ;
            var __VLS_6 = CommentsSection_vue_1.default;
            // @ts-ignore
            var __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6(__assign({ 'onCommentAdded': {} }, { postId: (post.id) })));
            var __VLS_8 = __VLS_7.apply(void 0, __spreadArray([__assign({ 'onCommentAdded': {} }, { postId: (post.id) })], __VLS_functionalComponentArgsRest(__VLS_7), false));
            var __VLS_11 = void 0;
            var __VLS_12 = ({ commentAdded: {} },
                { onCommentAdded: function () {
                        var _a = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            _a[_i] = arguments[_i];
                        }
                        var $event = _a[0];
                        if (!!(__VLS_ctx.isLoading))
                            return;
                        if (!(post.showComments))
                            return;
                        __VLS_ctx.handleCommentAdded(post);
                        // @ts-ignore
                        [handleCommentAdded,];
                    } });
        }
        // @ts-ignore
        [];
        // @ts-ignore
        [];
    };
    var __VLS_9, __VLS_10, __VLS_3;
    for (var _i = 0, _g = __VLS_vFor((__VLS_ctx.posts)); _i < _g.length; _i++) {
        var post = _g[_i][0];
        _loop_1(post);
    }
}
if (__VLS_ctx.showPostModal) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "post-modal" }));
    /** @type {__VLS_StyleScopedClasses['post-modal']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.showPostModal))
                return;
            __VLS_ctx.showPostModal = false;
            // @ts-ignore
            [showPostModal, showPostModal,];
        } }, { class: "modal-backdrop" }));
    /** @type {__VLS_StyleScopedClasses['modal-backdrop']} */ ;
    var __VLS_13 = GlassCard_vue_1.default || GlassCard_vue_1.default;
    // @ts-ignore
    var __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13(__assign({ class: "modal-card" }, { hoverable: (false) })));
    var __VLS_15 = __VLS_14.apply(void 0, __spreadArray([__assign({ class: "modal-card" }, { hoverable: (false) })], __VLS_functionalComponentArgsRest(__VLS_14), false));
    /** @type {__VLS_StyleScopedClasses['modal-card']} */ ;
    var __VLS_18 = __VLS_16.slots.default;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)(__assign({ class: "modal-title" }));
    /** @type {__VLS_StyleScopedClasses['modal-title']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.textarea, __VLS_intrinsics.textarea)(__assign(__assign({ value: (__VLS_ctx.newPostContent) }, { class: "post-textarea" }), { placeholder: "分享你的想法..." }));
    /** @type {__VLS_StyleScopedClasses['post-textarea']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "modal-actions" }));
    /** @type {__VLS_StyleScopedClasses['modal-actions']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.showPostModal))
                return;
            __VLS_ctx.showPostModal = false;
            // @ts-ignore
            [showPostModal, newPostContent,];
        } }, { class: "btn btn-secondary" }));
    /** @type {__VLS_StyleScopedClasses['btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: (__VLS_ctx.createPost) }, { class: "btn btn-primary" }));
    /** @type {__VLS_StyleScopedClasses['btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
    // @ts-ignore
    [createPost,];
    var __VLS_16;
}
// @ts-ignore
[];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
