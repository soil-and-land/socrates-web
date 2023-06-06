<script setup lang="js">
import {computed, toRaw} from 'vue'

const props = defineProps(['results']);
const data = computed(() => {
  const results = toRaw(props.results);
  const data = [];
  const columns = ['crop', 'nitrogen', 'stubble', 'grazing'];
  for (let col of columns) {
    const v = {};
    v['year'] = col.charAt(0).toUpperCase() + col.slice(1);
    for (let index = 0; index < results.years.length; index++) {
      const year = '\'' + results.years[index].toString() + '\'';
      v[year] = results[col][index];
    }
    data.push(v);
  }
  return data;
});
</script>
<template>
  <h3>Table of management</h3>
  <el-row>
    <el-table :data="data" border style="width: 100%">
      <el-table-column prop="year" label="Year" width="100px"/>
      <el-table-column :prop="`'${y}'`" v-for="y of results.years">
        <template #header>{{ y }}</template>
      </el-table-column>
    </el-table>
    <div class="table-error"></div>
  </el-row>
</template>
