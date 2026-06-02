import { gsap } from 'gsap';

/**
 * 卡片列表入场动画
 * @param elements 要动画的元素数组
 * @param stagger 元素之间的延迟(秒)
 */
export function animateCardsEntrance(elements: HTMLElement[], stagger = 0.1) {
    gsap.fromTo(elements,
        { opacity: 0, y: 50, scale: 0.95 },
        {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger,
            ease: 'power3.out',
        }
    );
}

/**
 * 页面淡入动画
 * @param element 页面容器元素
 */
export function animatePageEntrance(element: HTMLElement) {
    gsap.fromTo(element,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
    );
}

/**
 * 悬停发光效果
 * @param element 目标元素
 * @param glowIntensity 发光强度 (0-1)
 */
export function setupGlowHover(element: HTMLElement, glowIntensity = 0.4) {
    const accentColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--accent-rgb').trim();

    element.addEventListener('mouseenter', () => {
        gsap.to(element, {
            boxShadow: `0 0 30px rgba(${accentColor}, ${glowIntensity})`,
            scale: 1.02,
            duration: 0.3,
            ease: 'power2.out',
        });
    });

    element.addEventListener('mouseleave', () => {
        gsap.to(element, {
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
export function createRipple(event: MouseEvent, button: HTMLElement) {
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const ripple = document.createElement('span');
    ripple.style.cssText = `
    position: absolute;
    width: 20px;
    height: 20px;
    left: ${x}px;
    top: ${y}px;
    margin-left: -10px;
    margin-top: -10px;
    background: rgba(var(--accent-rgb), 0.4);
    border-radius: 50%;
    pointer-events: none;
  `;

    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);

    gsap.fromTo(ripple,
        { scale: 0, opacity: 0.6 },
        {
            scale: 4,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out',
            onComplete: () => ripple.remove(),
        }
    );
}

/**
 * 数字滚动动画
 * @param element 目标元素
 * @param endValue 最终数值
 * @param duration 动画时长(秒)
 */
export function animateNumber(element: HTMLElement, endValue: number, duration = 1) {
    const obj = { value: 0 };
    gsap.to(obj, {
        value: endValue,
        duration,
        ease: 'power2.out',
        onUpdate: () => {
            element.textContent = Math.round(obj.value).toLocaleString();
        },
    });
}

/**
 * 瀑布流图片懒加载动画
 * @param image 图片元素
 */
export function animateImageLoad(image: HTMLElement) {
    gsap.fromTo(image,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
    );
}
