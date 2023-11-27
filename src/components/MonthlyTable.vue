<script setup lang="js">
import {computed, reactive, onBeforeMount} from 'vue'
import {isEmpty} from 'lodash';

const props = defineProps(['monthRainTemp', 'periodLength', 'startYear']);

const state = reactive({
  monthRainTemp: []
});
const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
];

const emit = defineEmits(['updateMonthRainTemps']);

onBeforeMount(() => {
  const monthRainTemp = [];
  for (let v = 0; v < months.length; v++) {
    const obj = {};
    if (isEmpty(props.monthRainTemp?.[v]?.rainfall)) {
      obj['rainfall'] = 0;
    } else {
      obj['rainfall'] = parseFloat(props.monthRainTemp?.[v]?.rainfall);
    }
    if (isEmpty(props.monthRainTemp?.[v]?.temperature)) {
      obj['temperature'] = 0;
    } else {
      obj['temperature'] = parseFloat(props.monthRainTemp?.[v]?.temperature);
    }
    monthRainTemp.push(obj);
  }
  state.monthRainTemp = monthRainTemp;
  emit('updateMonthRainTemps', {monthRainTemp: state.monthRainTemp});
});

function updateMonthRainTemp({$event, index, key}) {
  updateValues($event, index, key);
  emit('updateMonthRainTemps', {monthRainTemp: state.monthRainTemp});
}

function updateValues($event, index, key) {
  if (state.monthRainTemp[index]) {
    if (key === 'rainfall') {
      state.monthRainTemp[index].rainfall = $event;
    }
    if (key === 'temperature') {
      state.monthRainTemp[index].temperature = $event;
    }
  }
}

</script>
<template>
  <div>
    <el-row class="">
      <el-col :span="24" class="p-2 text-center text-2xl">Monthly Rain Temperature</el-col>
    </el-row>
    <el-row>
      <el-col :span="5" class="p-2 font-bold">Month</el-col>
      <el-col :span="9" class="p-2 font-bold">Rainfall (mm)</el-col>
      <el-col :span="9" class="p-2 font-bold">Temperature (&#x2103;)</el-col>
    </el-row>
    <el-row v-for="(value, index) in months" :key="index" class="">
      <el-col :span="5" class="p-2">
        {{ value }}
      </el-col>
      <el-col :span="9" class="p-2">
        <el-input :modelValue="state.monthRainTemp[index].rainfall"
                  @input="updateMonthRainTemp({$event, index, key: 'rainfall' })">
        </el-input>
      </el-col>
      <el-col :span="9" class="p-2">
        <el-input :modelValue="state.monthRainTemp[index].temperature"
                  @input="updateMonthRainTemp({$event, index, key: 'temperature' })">
        </el-input>
      </el-col>
    </el-row>
  </div>
</template>
