<script setup lang="js">
import {computed, onMounted, onUpdated, reactive, watch} from 'vue'

const props = defineProps(['annualRainfall', 'periodLength', 'startYear']);
const state = reactive({
  annualRainfall: props.annualRainfall
});
const emit = defineEmits(['updateAnnualRainfall']);
watch(() => props.annualRainfall, (annualRainfall) => {
  if (parseInt(props.periodLength) > 0) {
    for (let v = 0; v < props.periodLength; v++) {
      updateValues(v, props.annualRainfall?.[v]?.rainfall);
    }
  }
}, {immediate: true});


function updateRainfall({$event, key}) {
  updateValues($event, key);
  emit('updateAnnualRainfall', {$event, key});
}

function updateValues(index, value){
  if (!props.annualRainfall?.[index]?.rainfall) {
    state.annualRainfall[index] = {'rainfall': 0};
  } else {
    state.annualRainfall[index]['rainfall'] = value;
  }
}

// state.annualRainfall = computed({
//   get() {
//     const annualRainfall = [];
//     for (let v = 0; v < props.periodLength; v++) {
//       annualRainfall.push({
//         rainfall: props.annualRainfall?.[v]?.rainfall || 0,
//       });
//     }
//     return annualRainfall;
//   }
// });
</script>
<template>
  <div class="flex flex-col">
    <el-row class="">
      <el-col :span="24" class="p-2 text-center text-2xl">Yearly Rain</el-col>
    </el-row>
    <el-row>
      <el-col :span="6" class="p-2 font-bold">Year</el-col>
      <el-col :span="18" class="p-2 font-bold">Rainfall (mm)</el-col>
    </el-row>
    <el-row v-if="parseInt(props.periodLength) > 0"
            v-for="(value, index) in parseInt(props.periodLength)" :key="value">
      <el-col :span="6" class="p-2">
        {{ parseInt(props.startYear) - 1 + parseInt(value) }}
      </el-col>
      <el-col :span="18" class="p-2">
        <el-input :modelValue="state.annualRainfall?.[index]?.rainfall"
                  @input="updateRainfall({$event, key: index})">
        </el-input>
      </el-col>
    </el-row>
    <el-row v-else>
      <p>Add <span class="font-bold">Simulation period in years</span></p>
    </el-row>
  </div>
</template>
