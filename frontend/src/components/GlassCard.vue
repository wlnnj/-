<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import gsap from 'gsap';

interface Props {
  hoverable?: boolean;
  clickable?: boolean;
  glowOnHover?: boolean;
  delay?: number;
}

const props = withDefaults(defineProps<Props>(), {
  hoverable: true,
  clickable: false,
  glowOnHover: true,
  delay: 0,
});

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

const cardRef = ref<HTMLElement | null>(null);
const isHovered = ref(false);

const cardClasses = computed(() => ({
  'glass-card': true,
  'glass-card--hoverable': props.hoverable,
  'glass-card--clickable': props.clickable,
  'glass-card--hovered': isHovered.value,
}));

function handleMouseEnter() {
  if (!props.hoverable || !cardRef.value) return;
  isHovered.value = true;
  
  if (props.glowOnHover) {
    gsap.to(cardRef.value, {
      scale: 1.02,
      duration: 0.3,
      ease: 'power2.out',
    });
  }
}

function handleMouseLeave() {
  if (!props.hoverable || !cardRef.value) return;
  isHovered.value = false;
  
  if (props.glowOnHover) {
    gsap.to(cardRef.value, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
    });
  }
}

function handleClick(event: MouseEvent) {
  if (!props.clickable || !cardRef.value) return;
  
  // 涟漪效果
  const rect = cardRef.value.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  cardRef.value.appendChild(ripple);
  
  gsap.fromTo(ripple, 
    { scale: 0, opacity: 0.6 },
    { 
      scale: 4, 
      opacity: 0, 
      duration: 0.6, 
      ease: 'power2.out',
      onComplete: () => ripple.remove()
    }
  );
  
  emit('click', event);
}

// 入场动画
onMounted(() => {
  if (cardRef.value) {
    gsap.fromTo(cardRef.value,
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.5, 
        ease: 'power3.out',
        delay: props.delay // Apply delay
      }
    );
  }
});
</script>

<template>
  <div
    ref="cardRef"
    :class="cardClasses"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @click="handleClick"
  >
    <slot />
  </div>
</template>

<style scoped>
.glass-card {
  position: relative;
  overflow: hidden;
  background: var(--bg-card);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: var(--glass-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--glass-shadow);
  padding: var(--spacing-lg);
  transition: 
    background var(--transition-normal),
    border-color var(--transition-normal),
    box-shadow var(--transition-normal);
}

.glass-card--hoverable:hover {
  background: var(--bg-card-hover);
  border-color: var(--accent-color-40);
}

.glass-card--hovered {
  box-shadow: var(--accent-glow);
}

.glass-card--clickable {
  cursor: pointer;
}

.glass-card :deep(.ripple) {
  position: absolute;
  width: 20px;
  height: 20px;
  margin-left: -10px;
  margin-top: -10px;
  background: var(--accent-color-40);
  border-radius: 50%;
  pointer-events: none;
}
</style>
