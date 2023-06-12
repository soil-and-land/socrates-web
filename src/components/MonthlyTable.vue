<script setup lang="js">
import {computed, reactive, watch} from 'vue'
import {isEmpty} from 'lodash';

const props = defineProps(['monthRainTemp', 'periodLength', 'startYear']);
const state = reactive({
  monthRainTemp: []
});
const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
];
const emit = defineEmits(['updateMonthRainTemps']);

state.monthRainTemp = computed(() => {
  const monthRainTemp = [];
  for (let v = 0; v < months.length; v++) {
    const obj = {};
    if (isEmpty(props.monthRainTemp?.[v]?.rainfall)) {
      obj['rainfall'] = 0;
    } else {
      obj['rainfall'] = props.monthRainTemp?.[v]?.rainfall;
    }
    if (isEmpty(props.monthRainTemp?.[v]?.temperature)) {
      obj['temperature'] = 0;
    } else {
      obj['temperature'] = props.monthRainTemp?.[v]?.temperature;
    }
    monthRainTemp.push(obj);
  }
  return monthRainTemp;
});

function updateMonthRainTemp({$event, index, key}) {
  updateValues($event, index, key);
  emit('updateMonthRainTemps', {$event, index, key});
}

function updateValues($event, index, key) {
  const obj = {};
  if (isEmpty(state.monthRainTemp?.[index]?.rainfall)) {
    obj['rainfall'] = 0;
  } else if (key === 'rainfall') {
    obj['rainfall'] = $event;
  }
  if (isEmpty(state.monthRainTemp?.[index]?.temperature)) {
    obj['temperature'] = 0;
  } else if (key === 'temperature') {
    obj['temperature'] = $event;
  }
  state.monthRainTemp[index] = obj;
}

</script>
<template>
  <div>
    <el-row class="">
      <el-col :span="24" class="p-2 text-center text-2xl">Monthly Rain Temperature</el-col>
    </el-row>
    <el-row>
      <el-col :span="6" class="p-2 font-bold">Month</el-col>
      <el-col :span="9" class="p-2 font-bold">Rainfall (mm)</el-col>
      <el-col :span="9" class="p-2 font-bold">Temperature (&#x2103;)</el-col>
    </el-row>
    <el-row v-for="(value, index) in months" :key="index" class="">
      <el-col :span="6" class="p-2">
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
