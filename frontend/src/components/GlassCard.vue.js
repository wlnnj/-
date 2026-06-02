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
var gsap_1 = require("gsap");
var props = withDefaults(defineProps(), {
    hoverable: true,
    clickable: false,
    glowOnHover: true,
    delay: 0,
});
var emit = defineEmits();
var cardRef = (0, vue_1.ref)(null);
var isHovered = (0, vue_1.ref)(false);
var cardClasses = (0, vue_1.computed)(function () { return ({
    'glass-card': true,
    'glass-card--hoverable': props.hoverable,
    'glass-card--clickable': props.clickable,
    'glass-card--hovered': isHovered.value,
}); });
function handleMouseEnter() {
    if (!props.hoverable || !cardRef.value)
        return;
    isHovered.value = true;
    if (props.glowOnHover) {
        gsap_1.default.to(cardRef.value, {
            scale: 1.02,
            duration: 0.3,
            ease: 'power2.out',
        });
    }
}
function handleMouseLeave() {
    if (!props.hoverable || !cardRef.value)
        return;
    isHovered.value = false;
    if (props.glowOnHover) {
        gsap_1.default.to(cardRef.value, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
        });
    }
}
function handleClick(event) {
    if (!props.clickable || !cardRef.value)
        return;
    // 涟漪效果
    var rect = cardRef.value.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    var ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = "".concat(x, "px");
    ripple.style.top = "".concat(y, "px");
    cardRef.value.appendChild(ripple);
    gsap_1.default.fromTo(ripple, { scale: 0, opacity: 0.6 }, {
        scale: 4,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: function () { return ripple.remove(); }
    });
    emit('click', event);
}
// 入场动画
(0, vue_1.onMounted)(function () {
    if (cardRef.value) {
        gsap_1.default.fromTo(cardRef.value, { opacity: 0, y: 30 }, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power3.out',
            delay: props.delay // Apply delay
        });
    }
});
var __VLS_defaults = {
    hoverable: true,
    clickable: false,
    glowOnHover: true,
    delay: 0,
};
var __VLS_ctx = __assign(__assign(__assign(__assign(__assign({}, {}), {}), {}), {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['glass-card']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign(__assign(__assign(__assign({ onMouseenter: (__VLS_ctx.handleMouseEnter) }, { onMouseleave: (__VLS_ctx.handleMouseLeave) }), { onClick: (__VLS_ctx.handleClick) }), { ref: "cardRef" }), { class: (__VLS_ctx.cardClasses) }));
var __VLS_0 = {};
// @ts-ignore
var __VLS_1 = __VLS_0;
// @ts-ignore
[handleMouseEnter, handleMouseLeave, handleClick, cardClasses,];
var __VLS_base = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
var __VLS_export = {};
exports.default = {};
