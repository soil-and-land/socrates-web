<script setup lang="js">
import {onMounted, onUpdated, reactive} from 'vue';
import {useStore} from "~/store.js";
const store = useStore();

function updatedParameters() {
  store.parametersEdited = true;
}

</script>
<template>
    <el-row >
      <el-col :span="24" class="p-2 text-center text-2xl">Parameters</el-col>
    </el-row>
    <el-row v-for="(value, index) in store.parameters" :key="index" class="">
      <el-col :span="24" class="p-2">
        <el-input v-model="store.parameters[index]" type="number" @input="updatedParameters()">
          <template #prepend>{{ index }}</template>
        </el-input>
      </el-col>
    </el-row>
    <div class="parameter-error"></div>
</template>
