"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.animateCardsEntrance = animateCardsEntrance;
exports.animatePageEntrance = animatePageEntrance;
exports.setupGlowHover = setupGlowHover;
exports.createRipple = createRipple;
exports.animateNumber = animateNumber;
exports.animateImageLoad = animateImageLoad;
var gsap_1 = require("gsap");
/**
 * 卡片列表入场动画
 * @param elements 要动画的元素数组
 * @param stagger 元素之间的延迟(秒)
 */
function animateCardsEntrance(elements, stagger) {
    if (stagger === void 0) { stagger = 0.1; }
    gsap_1.gsap.fromTo(elements, { opacity: 0, y: 50, scale: 0.95 }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: stagger,
        ease: 'power3.out',
    });
}
/**
 * 页面淡入动画
 * @param element 页面容器元素
 */
function animatePageEntrance(element) {
    gsap_1.gsap.fromTo(element, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' });
}
/**
 * 悬停发光效果
 * @param element 目标元素
 * @param glowIntensity 发光强度 (0-1)
 */
function setupGlowHover(element, glowIntensity) {
    if (glowIntensity === void 0) { glowIntensity = 0.4; }
    var accentColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--accent-rgb').trim();
    element.addEventListener('mouseenter', function () {
        gsap_1.gsap.to(element, {
            boxShadow: "0 0 30px rgba(".concat(accentColor, ", ").concat(glowIntensity, ")"),
            scale: 1.02,
            duration: 0.3,
            ease: 'power2.out',
        });
    });
    element.addEventListener('mouseleave', function () {
        gsap_1.gsap.to(element, {
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
        });
    });
}
/**
 * 按钮点击涟漪效果
 * @param event 鼠标事件
 * @param button 按钮元素
 */
function createRipple(event, button) {
    var rect = button.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    var ripple = document.createElement('span');
    ripple.style.cssText = "\n    position: absolute;\n    width: 20px;\n    height: 20px;\n    left: ".concat(x, "px;\n    top: ").concat(y, "px;\n    margin-left: -10px;\n    margin-top: -10px;\n    background: rgba(var(--accent-rgb), 0.4);\n    border-radius: 50%;\n    pointer-events: none;\n  ");
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    gsap_1.gsap.fromTo(ripple, { scale: 0, opacity: 0.6 }, {
        scale: 4,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: function () { return ripple.remove(); },
    });
}
/**
 * 数字滚动动画
 * @param element 目标元素
 * @param endValue 最终数值
 * @param duration 动画时长(秒)
 */
function animateNumber(element, endValue, duration) {
    if (duration === void 0) { duration = 1; }
    var obj = { value: 0 };
    gsap_1.gsap.to(obj, {
        value: endValue,
        duration: duration,
        ease: 'power2.out',
        onUpdate: function () {
            element.textContent = Math.round(obj.value).toLocaleString();
        },
    });
}
/**
 * 瀑布流图片懒加载动画
 * @param image 图片元素
 */
function animateImageLoad(image) {
    gsap_1.gsap.fromTo(image, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' });
}
