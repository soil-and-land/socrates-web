<script setup lang="ts">
import {onMounted, reactive} from 'vue'

const props = defineProps<{ parameters: any }>();
const state = reactive({
  parameters: []
});
onMounted(() => {
  state.parameters = props.parameters;
});
const addParameter = function () {
}
</script>
<template>
  <div>
    <el-row class="border-solid border-1 border-b-0 border-gray-200">
      <el-col :span="12" class="p-2 text-center">Parameter</el-col>
      <el-col :span="12" class="p-2 text-center">Value</el-col>
    </el-row>
    <el-row v-for="(name, index) in state.parameters" :key="index" class="border-solid border-1 border-gray-200">
      <el-col :span="12" class="p-2">
        {{ name }}
      </el-col>
      <el-col :span="12" class="p-2">
        <el-input v-model="state.parameters[name]"/>
      </el-col>
    </el-row>
    <el-row>
      <el-button class="mt-4 w-full" @click="addParameter">Add Parameter</el-button>
    </el-row>
    <div class="parameter-error"></div>
  </div>
</template>
