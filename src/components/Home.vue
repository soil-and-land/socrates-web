<script setup lang="js">

</script>

<template>
  <about/>
  <router-link
      to="/input"
      v-slot="{href, route, navigate}">
    <el-button :href="href" @click="navigate"
               class="btn btn-custom btn-lg btn-block"
               role="button">Start Model
    </el-button>
  </router-link>
</template>

<style scoped>

</style>
