<script setup lang="ts">
import {RouterView} from 'vue-router';

</script>

<template>
  <el-config-provider namespace="ep">
    <BaseHeader/>
    <RouterView/>
  </el-config-provider>
</template>

<style scoped>

#app {
  text-align: center;
  color: var(--ep-text-color-primary);
}

.main-container {
  height: calc(100vh - var(--ep-menu-item-height) - 3px);
}
</style>
