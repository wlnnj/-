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
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var vue_router_1 = require("vue-router");
var gsap_1 = require("gsap");
var auth_1 = require("../stores/auth");
var router = (0, vue_router_1.useRouter)();
var authStore = (0, auth_1.useAuthStore)();
var heroTextRef = (0, vue_1.ref)(null);
var sectionsRef = (0, vue_1.ref)([]);
// Scroll Animation Logic
var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            // Add visible class to section
            entry.target.classList.add('visible');
            // Animate text elements
            gsap_1.gsap.to(entry.target.querySelectorAll('.anim-text'), {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.1,
                ease: 'power3.out'
            });
            // Animate visual mockups (scale/fade in)
            gsap_1.gsap.to(entry.target.querySelectorAll('.mockup-container'), {
                scale: 1,
                opacity: 1,
                duration: 1.2,
                ease: 'back.out(1.7)',
                delay: 0.2
            });
        }
    });
}, { threshold: 0.15, rootMargin: '-50px' });
(0, vue_1.onMounted)(function () {
    // Hero Animation
    if (heroTextRef.value) {
        gsap_1.gsap.from(heroTextRef.value.children, {
            y: 60,
            opacity: 0,
            duration: 1.4,
            stagger: 0.1,
            ease: 'power4.out',
            delay: 0.2
        });
    }
    // Observe sections
    sectionsRef.value.forEach(function (section) {
        if (section)
            observer.observe(section);
    });
});
(0, vue_1.onUnmounted)(function () {
    observer.disconnect();
});
var features = [
    {
        id: 'memos',
        title: "备忘录\n灵感，随手捕捉。",
        desc: "支持 Markdown 的纯粹写作体验。无论是瞬间的念头，还是深思熟虑的文章，都能在这里完美安放。",
        color: "#FF2D55", // Pink
        type: 'memo-mock'
    },
    {
        id: 'media',
        title: "媒体库\n回忆，鲜活如初。",
        desc: "沉浸式瀑布流布局，智能展示你的照片与视频。每一刻精彩，都值得被郑重对待。",
        color: "#5E5CE6", // Purple
        type: 'media-mock'
    },
    {
        id: 'drive',
        title: "私有云盘\n数据，掌控之中。",
        desc: "支持大文件存储与断点续传。你的数据安放在自家服务器，安全、私密、随取随用。",
        color: "#007AFF", // Blue
        type: 'drive-mock'
    },
    {
        id: 'chat',
        title: "即时通讯\n连接，即刻触达。",
        desc: "内置实时聊天系统。与家人好友私密畅聊，消息端到端加密，不仅是存储，更是连接。",
        color: "#30D158", // Green
        type: 'chat-mock'
    },
    {
        id: 'calendar',
        title: "日程日历\n时间，井井有条。",
        desc: "可视化的时间管理工具。标记重要时刻，规划未来行程，让生活与工作张弛有度。",
        color: "#FF9F0A", // Orange
        type: 'calendar-mock'
    },
    {
        id: 'posts',
        title: "社区动态\n分享，遇见共鸣。",
        desc: "在私有圈子里分享生活点滴。点赞、评论、互动，构建属于你的温馨社交圈。",
        color: "#64D2FF", // Cyan
        type: 'post-mock'
    }
];
function scrollToContent() {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
}
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['feature-section']} */ ;
/** @type {__VLS_StyleScopedClasses['photo-item']} */ ;
/** @type {__VLS_StyleScopedClasses['cal-day']} */ ;
/** @type {__VLS_StyleScopedClasses['scroll-hint']} */ ;
/** @type {__VLS_StyleScopedClasses['cta-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['cta-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['primary']} */ ;
/** @type {__VLS_StyleScopedClasses['cta-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['text-link']} */ ;
/** @type {__VLS_StyleScopedClasses['feature-section']} */ ;
/** @type {__VLS_StyleScopedClasses['feature-visual']} */ ;
/** @type {__VLS_StyleScopedClasses['mockup-container']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-title']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-subtitle']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "apple-home" }));
/** @type {__VLS_StyleScopedClasses['apple-home']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "nav-spacer" }));
/** @type {__VLS_StyleScopedClasses['nav-spacer']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)(__assign({ class: "hero-section" }));
/** @type {__VLS_StyleScopedClasses['hero-section']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "hero-content" }, { ref: "heroTextRef" }));
/** @type {__VLS_StyleScopedClasses['hero-content']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)(__assign({ class: "hero-title" }));
/** @type {__VLS_StyleScopedClasses['hero-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "hero-subtitle" }));
/** @type {__VLS_StyleScopedClasses['hero-subtitle']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "hero-actions" }));
/** @type {__VLS_StyleScopedClasses['hero-actions']} */ ;
if (__VLS_ctx.authStore.isAuthenticated) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!(__VLS_ctx.authStore.isAuthenticated))
                return;
            __VLS_ctx.router.push('/dashboard');
            // @ts-ignore
            [authStore, router,];
        } }, { class: "cta-btn primary" }));
    /** @type {__VLS_StyleScopedClasses['cta-btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['primary']} */ ;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!!(__VLS_ctx.authStore.isAuthenticated))
                return;
            __VLS_ctx.router.push('/register');
            // @ts-ignore
            [router,];
        } }, { class: "cta-btn primary" }));
    /** @type {__VLS_StyleScopedClasses['cta-btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['primary']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.a, __VLS_intrinsics.a)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            if (!!(__VLS_ctx.authStore.isAuthenticated))
                return;
            __VLS_ctx.router.push('/login');
            // @ts-ignore
            [router,];
        } }, { class: "text-link" }));
    /** @type {__VLS_StyleScopedClasses['text-link']} */ ;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "hero-glow" }));
/** @type {__VLS_StyleScopedClasses['hero-glow']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ onClick: (__VLS_ctx.scrollToContent) }, { class: "scroll-hint anim-fade" }));
/** @type {__VLS_StyleScopedClasses['scroll-hint']} */ ;
/** @type {__VLS_StyleScopedClasses['anim-fade']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ class: "hint-text" }));
/** @type {__VLS_StyleScopedClasses['hint-text']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.svg, __VLS_intrinsics.svg)(__assign({ class: "hint-icon" }, { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", 'stroke-width': "2", 'stroke-linecap': "round", 'stroke-linejoin': "round" }));
/** @type {__VLS_StyleScopedClasses['hint-icon']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.path)({
    d: "M7 13l5 5 5-5M7 6l5 5 5-5",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "feature-flow" }));
/** @type {__VLS_StyleScopedClasses['feature-flow']} */ ;
for (var _i = 0, _a = __VLS_vFor((__VLS_ctx.features)); _i < _a.length; _i++) {
    var _b = _a[_i], feat = _b[0], index = _b[1];
    __VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)(__assign(__assign(__assign({ key: (feat.id) }, { class: "feature-section" }), { class: ({ 'align-right': index % 2 !== 0 }) }), { ref: "sectionsRef" }));
    /** @type {__VLS_StyleScopedClasses['feature-section']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-right']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "feature-text" }));
    /** @type {__VLS_StyleScopedClasses['feature-text']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)(__assign({ class: "feature-title anim-text" }, { style: ({ '--glow-color': feat.color }) }));
    /** @type {__VLS_StyleScopedClasses['feature-title']} */ ;
    /** @type {__VLS_StyleScopedClasses['anim-text']} */ ;
    (feat.title);
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "feature-desc anim-text" }));
    /** @type {__VLS_StyleScopedClasses['feature-desc']} */ ;
    /** @type {__VLS_StyleScopedClasses['anim-text']} */ ;
    (feat.desc);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "feature-visual" }));
    /** @type {__VLS_StyleScopedClasses['feature-visual']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "mockup-container" }, { class: (feat.type) }));
    /** @type {__VLS_StyleScopedClasses['mockup-container']} */ ;
    if (feat.type === 'memo-mock') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-card memo-ui" }));
        /** @type {__VLS_StyleScopedClasses['ui-card']} */ ;
        /** @type {__VLS_StyleScopedClasses['memo-ui']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-line title-line" }));
        /** @type {__VLS_StyleScopedClasses['ui-line']} */ ;
        /** @type {__VLS_StyleScopedClasses['title-line']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-line text-line" }, { style: {} }));
        /** @type {__VLS_StyleScopedClasses['ui-line']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-line']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-line text-line" }, { style: {} }));
        /** @type {__VLS_StyleScopedClasses['ui-line']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-line']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-line text-line" }, { style: {} }));
        /** @type {__VLS_StyleScopedClasses['ui-line']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-line']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-tag" }));
        /** @type {__VLS_StyleScopedClasses['ui-tag']} */ ;
    }
    if (feat.type === 'media-mock') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-grid media-ui" }));
        /** @type {__VLS_StyleScopedClasses['ui-grid']} */ ;
        /** @type {__VLS_StyleScopedClasses['media-ui']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "photo-item p1" }));
        /** @type {__VLS_StyleScopedClasses['photo-item']} */ ;
        /** @type {__VLS_StyleScopedClasses['p1']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "photo-item p2" }));
        /** @type {__VLS_StyleScopedClasses['photo-item']} */ ;
        /** @type {__VLS_StyleScopedClasses['p2']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "photo-item p3" }));
        /** @type {__VLS_StyleScopedClasses['photo-item']} */ ;
        /** @type {__VLS_StyleScopedClasses['p3']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "photo-item p4" }));
        /** @type {__VLS_StyleScopedClasses['photo-item']} */ ;
        /** @type {__VLS_StyleScopedClasses['p4']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "play-btn" }));
        /** @type {__VLS_StyleScopedClasses['play-btn']} */ ;
    }
    if (feat.type === 'drive-mock') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-card drive-ui" }));
        /** @type {__VLS_StyleScopedClasses['ui-card']} */ ;
        /** @type {__VLS_StyleScopedClasses['drive-ui']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "folder-row" }));
        /** @type {__VLS_StyleScopedClasses['folder-row']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "folder-icon" }));
        /** @type {__VLS_StyleScopedClasses['folder-icon']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "file-info" }));
        /** @type {__VLS_StyleScopedClasses['file-info']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "folder-row" }));
        /** @type {__VLS_StyleScopedClasses['folder-row']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "folder-icon" }, { style: {} }));
        /** @type {__VLS_StyleScopedClasses['folder-icon']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "file-info" }, { style: {} }));
        /** @type {__VLS_StyleScopedClasses['file-info']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "progress-bar-ui" }));
        /** @type {__VLS_StyleScopedClasses['progress-bar-ui']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "progress-fill-ui" }));
        /** @type {__VLS_StyleScopedClasses['progress-fill-ui']} */ ;
    }
    if (feat.type === 'chat-mock') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-card chat-ui" }));
        /** @type {__VLS_StyleScopedClasses['ui-card']} */ ;
        /** @type {__VLS_StyleScopedClasses['chat-ui']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "msg-bubble left" }));
        /** @type {__VLS_StyleScopedClasses['msg-bubble']} */ ;
        /** @type {__VLS_StyleScopedClasses['left']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "msg-bubble right" }));
        /** @type {__VLS_StyleScopedClasses['msg-bubble']} */ ;
        /** @type {__VLS_StyleScopedClasses['right']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "msg-bubble left" }));
        /** @type {__VLS_StyleScopedClasses['msg-bubble']} */ ;
        /** @type {__VLS_StyleScopedClasses['left']} */ ;
    }
    if (feat.type === 'calendar-mock') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-card calendar-ui" }));
        /** @type {__VLS_StyleScopedClasses['ui-card']} */ ;
        /** @type {__VLS_StyleScopedClasses['calendar-ui']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "cal-header" }));
        /** @type {__VLS_StyleScopedClasses['cal-header']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "cal-grid" }));
        /** @type {__VLS_StyleScopedClasses['cal-grid']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "cal-day" }));
        /** @type {__VLS_StyleScopedClasses['cal-day']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "cal-day" }));
        /** @type {__VLS_StyleScopedClasses['cal-day']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "cal-day dots" }));
        /** @type {__VLS_StyleScopedClasses['cal-day']} */ ;
        /** @type {__VLS_StyleScopedClasses['dots']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "cal-day" }));
        /** @type {__VLS_StyleScopedClasses['cal-day']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "cal-day active" }));
        /** @type {__VLS_StyleScopedClasses['cal-day']} */ ;
        /** @type {__VLS_StyleScopedClasses['active']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "cal-day" }));
        /** @type {__VLS_StyleScopedClasses['cal-day']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "event-pill" }));
        /** @type {__VLS_StyleScopedClasses['event-pill']} */ ;
    }
    if (feat.type === 'post-mock') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "ui-card post-ui" }));
        /** @type {__VLS_StyleScopedClasses['ui-card']} */ ;
        /** @type {__VLS_StyleScopedClasses['post-ui']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "post-header" }));
        /** @type {__VLS_StyleScopedClasses['post-header']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "avatar-circle" }));
        /** @type {__VLS_StyleScopedClasses['avatar-circle']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "name-line" }));
        /** @type {__VLS_StyleScopedClasses['name-line']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "post-content-box" }));
        /** @type {__VLS_StyleScopedClasses['post-content-box']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "post-actions" }));
        /** @type {__VLS_StyleScopedClasses['post-actions']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "action-icon heart" }));
        /** @type {__VLS_StyleScopedClasses['action-icon']} */ ;
        /** @type {__VLS_StyleScopedClasses['heart']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "action-icon comment" }));
        /** @type {__VLS_StyleScopedClasses['action-icon']} */ ;
        /** @type {__VLS_StyleScopedClasses['comment']} */ ;
    }
    // @ts-ignore
    [scrollToContent, features,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)(__assign({ class: "footer-cta" }));
/** @type {__VLS_StyleScopedClasses['footer-cta']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "footer-content anim-text visible-default" }));
/** @type {__VLS_StyleScopedClasses['footer-content']} */ ;
/** @type {__VLS_StyleScopedClasses['anim-text']} */ ;
/** @type {__VLS_StyleScopedClasses['visible-default']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.router.push('/register');
        // @ts-ignore
        [router,];
    } }, { class: "cta-btn big" }));
/** @type {__VLS_StyleScopedClasses['cta-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['big']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)(__assign({ class: "footer-note" }));
/** @type {__VLS_StyleScopedClasses['footer-note']} */ ;
// @ts-ignore
[];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
