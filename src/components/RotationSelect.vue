<script setup lang="js">
import {onMounted, watch} from "vue";

const props = defineProps(['posibleValues', 'year', 'modelValue', 'name', 'nullify']);
const emit = defineEmits(['update:modelValue']);

let value = props.modelValue;

onMounted(() => {
  if (props.nullify) {
    value = 'null'
    updateProperty('null');
  }
});

watch(() => props.nullify, (newValue, oldValue) => {
  if (props.nullify) {
    value = 'null'
    updateProperty('null');
  }
}, {immediate: true});

function updateProperty(value) {
  emit('update:modelValue', value);
}

</script>
<template>
  <!--    value: {{ value }} props.nullify {{!props.nullify }}-->
  <div v-if="!nullify">
    <el-select v-model="value" @change="updateProperty($event)">
      <el-option v-for="obj in posibleValues"
                 :key="props.year + props.name"
                 :label="obj.name"
                 :value="obj.id"/>
    </el-select>
  </div>
</template>
