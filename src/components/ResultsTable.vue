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
      <el-table-column prop="rain">
        <template #header>Rain <br/>mm</template>
      </el-table-column>
      <el-table-column prop="yields" min-width="90px">
        <template #header>Yield <br/>kg DM/ha</template>
      </el-table-column>
      <el-table-column prop="biomass" min-width="90px">
        <template #header>Biomass <br/>kg C/ha</template>
      </el-table-column>
      <el-table-column prop="nitrogen" min-width="90px">
        <template #header>Fert <br/>kg N/ha</template>
      </el-table-column>
      <el-table-column prop="urine" min-width="90px">
        <template #header>Urine <br/>kg N/ha</template>
      </el-table-column>
      <el-table-column prop="oc" min-width="100px">
        <template #header>OC<br/>(0-10 cm)<br/>%</template>
      </el-table-column>
      <el-table-column prop="co2" min-width="130px">
        <template #header>Soil C <br/>(0-30 cm)<br/>kg CO<sub>2</sub>-eq/Ha</template>
      </el-table-column>
      <el-table-column prop="n2o_fert" min-width="130px">
        <template #header>N<sub>2</sub>O<br/>(Fertiliser)<br/>kg CO<sub>2</sub>-eq/Ha</template>
      </el-table-column>
      <el-table-column prop="n2o_min" min-width="130px">
        <template #header>N<sub>2</sub>O<br/>(Mineralised)<br/>kg CO<sub>2</sub>-eq/Ha</template>
      </el-table-column>
      <el-table-column prop="n2o_res" min-width="130px">
        <template #header>N<sub>2</sub>O<br/>(Residues)<br/>kg CO<sub>2</sub>-eq/Ha</template>
      </el-table-column>
      <el-table-column prop="n2o_indirect" min-width="130px">
        <template #header>N<sub>2</sub>O<br/>(Indirect)<br/>kg CO<sub>2</sub>-eq/Ha</template>
      </el-table-column>
      <el-table-column prop="n2o_urine" min-width="130px">
        <template #header>N<sub>2</sub>O<br/>(Urine)<br/>kg CO<sub>2</sub>-eq/Ha</template>
      </el-table-column>
      <el-table-column prop="ch4_animal" min-width="130px">
        <template #header>CH<sub>4</sub><br/>(Animal)<br/>kg CO<sub>2</sub>-eq/Ha</template>
      </el-table-column>
      <el-table-column prop="total" min-width="130px">
        <template #header>TOTAL<br/>kg CO<sub>2</sub>-eq/Ha</template>
      </el-table-column>
    </el-table>
    <div class="table-error"></div>
  </el-row>
</template>
