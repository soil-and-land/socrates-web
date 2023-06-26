<script setup lang="js">
import {computed, onBeforeMount, reactive, watch} from 'vue'
import {isEmpty} from 'lodash';

const props = defineProps(['annualYields', 'startYear', 'periodLength']);
const state = reactive({
  annualYields: []
});
const emit = defineEmits(['updateYields']);
onBeforeMount(() => {
  const annualYields = [];
  for (let v = 0; v < props.periodLength; v++) {
    annualYields.push({
      year: parseInt(props.startYear) + v,
      rotation: props.annualYields?.[v]?.rotation || null,
      yield: props.annualYields?.[v]?.yield || 0
    });
  }
  state.annualYields = annualYields;
});

watch(() => props.periodLength, (periodLength) => {
  //If periodLength is changed reset the annualYields
  state.annualYields = [];
  for (let v = 0; v < props.periodLength; v++) {
    state.annualYields.push({
      year: parseInt(props.startYear) + v,
      rotation: state.annualYields?.[v]?.rotation || null,
      yield: state.annualYields?.[v]?.yield || 0
    });
  }
}, {immediate: true});

function updateYield({$event, key}) {
  updateValues($event, key);
  emit('updateYields', {annualYields: state.annualYields});
}

function updateValues(value, index) {
  state.annualYields[index]['yield'] = value;
}
</script>
<template>
  <div>
    <el-row class="">
      <el-col :span="24" class="p-2 text-center">Annual Yields</el-col>
    </el-row>
    <el-row v-if="parseInt(props.periodLength) > 0  && props.startYear"
            v-for="(value, key, index) in state.annualYields"
            :key="index">
      <el-col :span="24" class="p-2">
        <el-input :modelValue="state.annualYields?.[key]?.yield"
                  @input="updateYield({$event, key})">
          <template #prepend>{{ value.year }}</template>
        </el-input>
      </el-col>
    </el-row>
    <el-row v-else>
      <p>Add <span class="font-bold">Simulation period in years</span> and <span class="font-bold">Start Year</span></p>
    </el-row>
  </div>
</template>
