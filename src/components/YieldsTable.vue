<script setup lang="js">
import {computed, onBeforeMount, onUpdated, reactive, watch} from 'vue'
import {isEmpty} from 'lodash';

const props = defineProps(['annualYields', 'startYear', 'periodLength', 'rotationTable', 'rotationLength', 'plants']);

const state = reactive({
  annualYields: []
});

const emit = defineEmits(['updateYields']);
watch(() => props.annualYields, (annualYields) => {
  state.annualYields = props.annualYields;
}, {immediate: true});

watch(() => props.periodLength, (periodLength) => {
  //If periodLength is changed reset the annualYields
  state.annualYields = props.annualYields;
  for (let v = 0; v < parseInt(props.periodLength); v++) {
    if (state.annualYields[v] && props.annualYields[v]) {
      state.annualYields[v].yield = props.annualYields[v].yield;
    } else {
      state.annualYields.push({
        year: parseInt(props.startYear) + v,
        rotation: state.annualYields?.[v]?.rotation || null,
        yield: state.annualYields?.[v]?.yield || 0
      });
    }
  }
  emit('updateYields', {annualYields: state.annualYields});
}, {immediate: true});

watch(() => props.rotationLength, (rotationLength) => {
  updateRotation();
  emit('updateYields', {annualYields: state.annualYields});
}, {immediate: true});

watch(() => props.rotationTable, (rotationTable) => {
  updateRotation();
  emit('updateYields', {annualYields: state.annualYields});
}, {immediate: true});

function updateYield({$event, key}) {
  updateValues($event, key);
  emit('updateYields', {annualYields: state.annualYields});
}

function updateValues(value, index) {
  state.annualYields[index]['yield'] = value;
}

function updateRotation() {
  let currentRotation = 0;
  for (let v = 0; v < state.annualYields?.length; v++) {
    if (props.rotationTable[currentRotation]) {
      const thisRotation = props.rotationTable[currentRotation];
      const plantId = thisRotation.plant.id;
      state.annualYields[v].rotation = props.plants[plantId]?.name
      currentRotation++;
      if (currentRotation >= props.rotationLength) {
        currentRotation = 0;
      }
    }
  }
}
</script>
<template>
  <div>
    <el-row class="">
      <el-col :span="24" class="p-2 text-center text-2xl">Annual Yields</el-col>
    </el-row>
    <el-row v-if="parseInt(props.periodLength) > 0  && parseInt(props.startYear) >= 0"
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
