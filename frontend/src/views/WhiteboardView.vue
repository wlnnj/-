<script setup lang="ts">
import ExcalidrawWrapper from '../components/ExcalidrawWrapper.vue';
</script>

<template>
  <div class="whiteboard-page">
    <ExcalidrawWrapper />
  </div>
</template>

<style scoped>
.whiteboard-page {
    width: 100%;
    height: calc(100vh - 64px); /* Adjust for top nav */
    position: relative;
    background: #fff; /* Excalidraw usually needs light or configured bg, but component handles it */
}
</style>
