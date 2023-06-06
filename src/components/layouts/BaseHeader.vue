<script lang="js" setup>
import { toggleDark } from "~/composables";
</script>

<template>
  <el-menu class="el-menu-demo" mode="horizontal" :router="true">
    <el-menu-item index="/input">SOCRATES</el-menu-item>
    <el-sub-menu index="/help">
      <template #title>Help</template>
      <el-menu-item index="/help#Inputs">Inputs</el-menu-item>
      <el-menu-item index="/help#Results">Results</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="/contact">Contact</el-menu-item>
    <el-menu-item index="/about">About</el-menu-item>
    <el-menu-item h="full" @click="toggleDark()">
      <button
        class="border-none w-full bg-transparent cursor-pointer"
        style="height: var(--ep-menu-item-height)"
      >
        <i inline-flex i="dark:ep-moon ep-sunny" />
      </button>
    </el-menu-item>
  </el-menu>
</template>
