<script setup lang="js">
import {computed, onBeforeMount, onMounted, onUpdated, reactive, watch} from 'vue'

const props = defineProps(['annualRainfall', 'periodLength', 'startYear']);
const state = reactive({
  annualRainfall: props.annualRainfall
});
const emit = defineEmits(['updateAnnualRainfall']);

onBeforeMount(() => {
  if (parseInt(props.periodLength) > 0) {
    for (let v = 0; v < props.periodLength; v++) {
      if(props.annualRainfall?.[v]?.rainfall) {
        updateValues(v, props.annualRainfall?.[v]?.rainfall);
      }
    }
  }
});

watch(() => props.periodLength, (periodLength) => {
  //If periodLength is changed reset the rainfall
  for (let v = 0; v < parseInt(props.periodLength); v++) {
    state.annualRainfall[v] = {'rainfall': 0, 'temperature': 0};
  }
}, {immediate: true});


function updateRainfall({$event, key}) {
  updateValues($event, key, 'rainfall');
  emit('updateAnnualRainfall', {annualRainfall: state.annualRainfall});
}
function updateTemperature({$event, key}) {
  updateValues($event, key, 'temperature');
  emit('updateAnnualRainfall', {annualRainfall: state.annualRainfall});
}

function updateValues(value, index, type) {
  if (state.annualRainfall[index]) {
    state.annualRainfall[index][type] = value;
  }
}

</script>
<template>
  <div class="flex flex-col">
    <el-row class="">
      <el-col :span="24" class="p-2 text-center text-2xl">Yearly Rain</el-col>
    </el-row>
    <el-row>
      <el-col :span="5" class="p-2 font-bold">Year</el-col>
      <el-col :span="9" class="p-2 font-bold">Rainfall (mm)</el-col>
      <el-col :span="9" class="p-2 font-bold">Temperature (&#x2103;)</el-col>
    </el-row>
    <el-row v-if="parseInt(props.periodLength) > 0"
            v-for="(value, index) in parseInt(props.periodLength)" :key="value">
      <el-col :span="5" class="p-2">
        {{ parseInt(props.startYear) - 1 + parseInt(value) }}
      </el-col>
      <el-col :span="9" class="p-2">
        <el-input :modelValue="state.annualRainfall?.[index]?.rainfall"
                  @input="updateRainfall({$event, key: index})">
        </el-input>
      </el-col>
      <el-col :span="9" class="p-2">
        <el-input :modelValue="state.annualRainfall?.[index]?.temperature"
                  @input="updateTemperature({$event, index, key: index })">
        </el-input>
      </el-col>
    </el-row>
    <el-row v-else>
      <p>Add <span class="font-bold">Simulation period in years</span></p>
    </el-row>
  </div>
</template>
