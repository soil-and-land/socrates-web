<script setup lang="js">

</script>

<template>
  <el-row>
    <el-col :xl="20" :lg="20" :md="20" :sm="24" :xs="24">
      <about/>
      <el-row class="m-4 p-4">
        <router-link
            to="/input"
            v-slot="{href, route, navigate}">
          <el-button :href="href" @click="navigate"
                     class="btn btn-custom btn-lg btn-block"
                     role="button">Start Model
          </el-button>
        </router-link>
      </el-row>
    </el-col>
  </el-row>
</template>

<style scoped>

</style>
