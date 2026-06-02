<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useTheme } from './composables/useTheme';
import TopNav from './components/TopNav.vue';
import PlayerBar from './components/PlayerBar.vue';

// 初始化主题
useTheme();

const route = useRoute();
const showNav = computed(() => {
  return !['Login', 'Register'].includes(route.name as string);
});
</script>

<template>
  <TopNav v-if="showNav" />
  <div :class="{ 'main-content': showNav }">
    <router-view />
  </div>
  <PlayerBar v-if="route.name === 'Music'" />
</template>

<style>
/* 全局样式已在 variables.css 中定义 */
.main-content {
  padding-top: 80px; /* 为顶部导航预留空间 */
  min-height: 100vh;
}
</style>

