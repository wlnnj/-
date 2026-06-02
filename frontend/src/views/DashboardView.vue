<script setup lang="ts">
// TopNav is now in App.vue
</script>

<template>
  <div class="dashboard-layout">
    <main class="dashboard-content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.dashboard-layout {
  min-height: 100vh;
  background: var(--bg-primary);
}

.dashboard-content {
  padding-top: 80px; /* 导航栏高度 + 间距 */
  padding-left: var(--spacing-xl);
  padding-right: var(--spacing-xl);
  padding-bottom: var(--spacing-xl);
  min-height: 100vh;
}
</style>
