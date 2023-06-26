<script setup lang="ts">
import {onMounted, reactive} from 'vue'

const props = defineProps<{ parameters: any }>();
const state = reactive({
  parameters: []
});
onMounted(() => {
  state.parameters = props.parameters;
});

</script>
<template>
  <div>
    <el-row class="">
      <el-col :span="8" class="p-2 text-center">Parameter</el-col>
    </el-row>
    <el-row v-for="(value, index) in state.parameters" :key="index" class="">
      <el-col :span="8" class="p-2">
        <el-input v-model="state.parameters[index]">
          <template #prepend>{{index}}</template>
        </el-input>
      </el-col>
    </el-row>
    <div class="parameter-error"></div>
  </div>
</template>
