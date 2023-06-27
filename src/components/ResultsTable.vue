<script setup lang="js">
import {computed, toRaw} from 'vue'

const props = defineProps(['results', 'initialOC']);
const data = computed(() => {
  const results = toRaw(props.results);
  const data = [];
  data.push({
    year: results.years[0] - 1,
    oc: props.initialOC
  });
  for (let index = 0; index < results.years.length; index++) {
    data.push({
      year: results.years[index],
      crop: results.crop[index],
      rain: results.rain[index],
      yields: results.yields.data_points[index],
      biomass: results.biomass[index],
      nitrogen: results.nitrogen[index],
      urine: results.urine[index],
      oc: results.organic_carbon.data_points[index],
      co2: results.co2[index],
      n2o_fert: results.n2o.fert[index],
      n2o_min: results.n2o.min[index],
      n2o_res: results.n2o.res[index],
      n2o_indirect: results.n2o.indirect[index],
      n2o_urine: results.n2o.urine[index],
      ch4_animal: results.ch4.animal[index],
      total: results.total[index],
    });
  }
  return data;
});
</script>
<template>
  <h3>Simulation Results</h3>
  <el-row>
    <el-table :data="data" border style="width: 100%">
      <el-table-column prop="year" label="Year"/>
      <el-table-column prop="crop" label="Crop"/>
      <el-table-column prop="rain" label="Rain"/>
      <el-table-column prop="yields" label="Yield"/>
      <el-table-column prop="biomass" min-width="90px">
        <template #header>Biomass</template>
      </el-table-column>
      <el-table-column prop="nitrogen" label="Fert"/>
      <el-table-column prop="urine" label="Urine"/>
      <el-table-column prop="oc" min-width="100px">
        <template #header>OC<br/>(0-10 cm)</template>
      </el-table-column>
      <el-table-column prop="co2" min-width="100px">
        <template #header>Soil C <br/>(0-30 cm)</template>
      </el-table-column>
      <el-table-column prop="n2o_fert" min-width="100px">
        <template #header>N<sub>2</sub>O<br/>(Fertiliser)</template>
      </el-table-column>
      <el-table-column prop="n2o_min" min-width="120px">
        <template #header>N<sub>2</sub>O<br/>(Mineralised)</template>
      </el-table-column>
      <el-table-column prop="n2o_res" min-width="110px">
        <template #header>N<sub>2</sub>O<br/>(Residues)</template>
      </el-table-column>
      <el-table-column prop="n2o_indirect" min-width="100px">
        <template #header>N<sub>2</sub>O<br/>(Indirect)</template>
      </el-table-column>
      <el-table-column prop="n2o_urine" min-width="90px">
        <template #header>N<sub>2</sub>O<br/>(Urine)</template>
      </el-table-column>
      <el-table-column prop="ch4_animal" min-width="90px">
        <template #header>CH<sub>4</sub><br/>(Animal)</template>
      </el-table-column>
      <el-table-column prop="total" label="TOTAL"/>
    </el-table>
    <div class="table-error"></div>
  </el-row>
</template>
