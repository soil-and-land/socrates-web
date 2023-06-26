<script setup lang="js">
import {reactive, ref, toRaw} from 'vue'
import Defaults from '../defaults.js';
import {isEmpty} from 'lodash';

import {run, sampleData} from '../model.service';

const state = reactive({
  soilProperties: {id: 0, type: 'clay', name: 'clay'},
  clay: 0,
  cec: 0,
  initialOC: 0,
  startYear: 0,
  periodLength: 0,
  rotationLength: 0,
  climateMethodDataEntry: null,
  monthRainTemp: [{
    rainfall: 0,
    temperature: 0
  }],
  annualRainfall: [{
    rainfall: 0,
  }],
  annualYields: [],
  averageAnnualRainFall: 0,
  annualMeanTemperature: 0,
  randomizeRainAndTemperature: 0,
  rotationTable: [],
  yieldsMethodDataEntry: 0,
  parameters: Defaults.parameters,
  showParameters: false,
  results: null,
  socrates: {
    soil: {},
    simulation: {},
    climate: {},
    rotation: {},
    yields: {}
  },
  toggleAnnualYields: false,
  toggleMonthlyClimate: false,
  toggleYearlyClimate: false,
  rotationTableMessage: null
});
const count = ref(0)
const soils = [
  {id: 0, type: 'clay', name: 'clay'},
  {id: 1, type: 'silt', name: 'silt clay'},
  {id: 2, type: 'clay loam', name: 'clay loam'},
  {id: 3, type: 'silt loam', name: 'silt loam'},
  {id: 4, type: 'sandy loam', name: 'sandy loam'},
  {id: 5, type: 'sand', name: 'sand'},
  {id: 6, type: 'Enter Clay', name: 'Enter Clay %'},
  {id: 7, type: 'Enter CEC', name: 'Enter CEC'}
];
const plants = [
  {'id': 0, 'name': 'Wheat', 'short_name': 'Wh'},
  {'id': 1, 'name': 'Barley', 'short_name': 'Ba'},
  {'id': 2, 'name': 'Oats', 'short_name': 'Oa'},
  {'id': 3, 'name': 'Canola', 'short_name': 'Ca'},
  {'id': 4, 'name': 'Grain Legume', 'short_name': 'GL'},
  {'id': 5, 'name': 'Legume Pasture', 'short_name': 'LP'},
  {'id': 6, 'name': 'Fallow', 'short_name': 'Fa'},
  {'id': 7, 'name': 'Grass Pasture', 'short_name': 'GP'}
];
const grazes = [
  {'id': 0, 'name': 'None'},
  {'id': 1, 'name': 'Light'},
  {'id': 2, 'name': 'Heavy'},
];
const stubbles = [
  {'id': 0, 'name': 'Burnt or Removed'},
  {'id': 1, 'name': 'Retained'}
];
const rotationTableColumns = [
  {prop: 'year', label: 'Year'},
  {prop: 'plant', label: 'Plant'},
  {prop: 'stubble', label: 'Stubble'},
  {prop: 'graze', label: 'Graze'},
  {prop: 'fertiliser', label: 'Fertiliser'}
]

const sendForm = async () => {
  console.log('run');
  socratesToData();
  state.errors = null;
  try {
    const results = await run({
      socrates: toRaw(state.socrates),
      parameters: toRaw(state.parameters)
    });
    state.results = results.run;
    scrollToTop('resultsOfInputPage');
  } catch (e) {
    state.errors = e.message
  }
}

const loadData = async () => {
  console.log('load data');
  state.errors = null;
  try {
    state.socrates = await sampleData();
    dataToSocrates();
  } catch (e) {
    state.errors = e.message
  }
}

function socratesToData() {
  try {
    state.socrates.soil['soil_properties'] = state.soilProperties;
    state.socrates.soil['clay_percentage'] = parseFloat(state.clay);
    state.socrates.soil['cec'] = parseFloat(state.cec);
    state.socrates.soil['initial_oc'] = parseFloat(state.initialOC);
    state.socrates.simulation['start_year'] = parseInt(state.startYear);
    state.socrates.simulation['period_length'] = parseInt(state.periodLength);
    state.socrates.simulation['rotation_length'] = parseInt(state.rotationLength);
    state.socrates.climate['climate_method_data_entry'] = state.climateMethodDataEntry;
    state.socrates.climate['average_annual_rainfall'] = parseFloat(state.averageAnnualRainFall);
    state.socrates.climate['annual_mean_temperature'] = parseFloat(state.annualMeanTemperature);
    state.socrates.climate['randomize_rain_and_temperature'] = state.randomizeRainAndTemperature;
    state.socrates.climate['annual_rainfall'] = [];
    for (let r of state.annualRainfall) {
      state.socrates.climate['annual_rainfall'].push({rainfall: parseFloat(r?.rainfall)});
    }
    state.socrates.climate['month_rain_temp'] = [];
    for (let mrt of state.monthRainTemp) {
      state.socrates.climate['month_rain_temp'].push({
        rainfall: parseFloat(mrt?.rainfall),
        temperature: parseFloat(mrt?.temperature)
      });
    }
    state.socrates.rotation = [];
    for (let rotation of state.rotationTable) {
      state.socrates.rotation.push({
        year: parseInt(rotation['year']),
        plant: parseInt(rotation['plant']),
        stubble: parseInt(rotation['stubble']),
        graze: parseInt(rotation['graze']),
        fertiliser: parseFloat(rotation['fertiliser'])
      })
    }
    state.socrates.yields['yields_method_data_entry'] = state.yieldsMethodDataEntry;
    state.socrates.yields['annual_yields'] = [];
    for (let y of state.annualYields) {
      state.socrates.yields['annual_yields'].push({
        year: y?.year,
        rotation: y?.rotation,
        yield: parseFloat(y['yield'])
      });
    }
  } catch (e) {
    state.errors = e.message;
  }
}

function dataToSocrates() {
  try {
    state.soilProperties = soils[state.socrates.soil.soil_properties]
    state.clay = state.socrates.soil.clay_percentage;
    state.cec = state.socrates.soil.cec;
    state.initialOC = state.socrates.soil.initial_oc;
    state.startYear = state.socrates.simulation.start_year;
    state.periodLength = state.socrates.simulation.period_length;
    state.rotationLength = state.socrates.simulation.rotation_length;
    state.climateMethodDataEntry = state.socrates.climate.climate_method_data_entry;
    state.averageAnnualRainFall = state.socrates.climate.average_annual_rainfall;
    state.annualMeanTemperature = state.socrates.climate.annual_mean_temperature;
    state.randomizeRainAndTemperature = state.socrates.climate.randomize_rain_and_temperature;
    state.annualRainfall = state.socrates.climate.annual_rainfall;
    state.monthRainTemp = state.socrates.climate.month_rain_temp;
    state.rotationTable = state.socrates.rotation;
    state.yieldsMethodDataEntry = state.socrates.yields.yields_method_data_entry;
    state.annualYields = state.socrates.yields.annual_yields;
  } catch (e) {
    state.errors = e.message;
  }
}

function clearForm() {
  state.soilProperties = {id: 0, type: 'clay', name: 'clay'};
  state.clay = 0;
  state.cec = 0;
  state.initialOC = 0;
  state.startYear = 0;
  state.periodLength = 0;
  state.rotationLength = 0;
  state.climateMethodDataEntry = null;
  state.monthRainTemp = [{
    rainfall: 0,
    temperature: 0
  }];
  state.annualRainfall = [{
    rainfall: 0,
  }];
  state.annualYields = [];
  state.averageAnnualRainFall = 0;
  state.annualMeanTemperature = 0;
  state.randomizeRainAndTemperature = 0;
  state.rotationTable = [];
  state.yieldsMethodDataEntry = 0;
  state.parameters = Defaults.parameters;
  state.showParameters = false;
  state.results = null;
  state.socrates = {
    soil: {},
    simulation: {},
    climate: {},
    rotation: {},
    yields: {}
  };
  state.toggleAnnualYields = false;
  state.toggleMonthlyClimate = false;
  state.toggleYearlyClimate = false;
  state.rotationTableMessage = null;
}

const deleteRotation = (index) => {
  state.rotationTable.splice(index, 1);
  state.rotationLength--;
}

function updateRotation(event) {
  if (event) {
    state.rotationLength = parseInt(event);
    for (let e = 0; e < state.rotationLength; e++) {
      state.rotationTable.push({
        year: e + 1,
        plant: '',
        stubble: '',
        graze: '',
        fertiliser: ''
      });
    }
  }
}

function addRotation() {
  state.rotationLength++;
  state.rotationTable.push({
    year: state.rotationLength,
    plant: '',
    stubble: '',
    graze: '',
    fertiliser: ''
  });
}

function updateRotationLength(event) {
  if (state.rotationTable.length !== event) {
    state.rotationTable = []; // This will clear the rotation table
    updateRotation(event);
    state.rotationTableMessage = null;
  } else {
    state.rotationTableMessage = 'Rotation Length differs from rotation table, please adjust';
  }
}

function selectYield(yieldOption) {
  state.yieldsMethodDataEntry = yieldOption;
}

function updateRainfall({annualRainfall}) {
  state.annualRainfall = annualRainfall;
}

function updateYields({annualYields}) {
  state.annualYields = annualYields;
}

function updateMonthRainTemps({monthRainTemp}) {
  state.monthRainTemp = monthRainTemp;
}

function saveResults() {

}

function scrollToTop(id) {
  setTimeout(function () {
    // window.scroll({top: 0, left:0, behavior: 'smooth'});
    document.getElementById(id).scrollIntoView({behavior: 'smooth'});
  }, 100);
}
</script>

<template>
  <div class="mx-4" id="topOfInputPage">
    <el-row :gutter="20" class="flex flex-col justify-center items-center">
      <el-col :span="24" :xl="20" :lg="20" :md="20" :sm="24" :xs="24">
        <h2 class="center" style="word-break: break-all;">S.O.C.R.A.T.E.S.</h2>
      </el-col>
      <el-col :span="24" :xl="20" :lg="20" :md="20" :sm="24" :xs="24"
              class="py-10" v-if="state.errors">
        <el-row>
          <div class="errorMessages">Error: {{ state.errors }}</div>
        </el-row>
      </el-col>
      <el-col :span="24" :xl="20" :lg="20" :md="20" :sm="24" :xs="24">
        <el-button @click="state.showParameters = !state.showParameters">
          {{ state.showParameters ? 'Hide Parameters' : 'Show Parameters' }}
        </el-button>
        <div v-show="state.showParameters">
          <h3>Parameters Table</h3>
          <parameter-table :parameters="state.parameters"/>
        </div>
        <h3>Soil</h3>
        <el-row>
          <el-col class="py-1">
            <div class="px-1">
              <span>Soil Properties</span>
              <el-select v-model="state.soilProperties" class="m-2" placeholder="Select">
                <el-option v-for="soil in soils"
                           :key="soil.id"
                           :label="soil.type"
                           :value="soil.id"/>
              </el-select>
            </div>
          </el-col>
          <el-col class="py-1" :xl="8" :lg="8" :md="8" :sm="8" :xs="24">
            <div class="px-1">
              <el-input v-model="state.clay" placeholder="Clay %"
                        :disabled="state.soilProperties !== 6">
                <template #prepend>Clay %</template>
              </el-input>
            </div>
          </el-col>
          <el-col class="py-1" :xl="8" :lg="8" :md="8" :sm="8" :xs="24">
            <div class="px-1">
              <el-input v-model="state.cec" placeholder="CEC"
                        :disabled="state.soilProperties !== 7">
                <template #prepend>CEC</template>
              </el-input>
            </div>
          </el-col>
          <el-col class="py-1" :xl="8" :lg="8" :md="8" :sm="8" :xs="24">
            <div class="px-1">
              <el-input v-model="state.initialOC" placeholder="OC">
                <template #prepend>Initial OC %</template>
              </el-input>
            </div>
          </el-col>
        </el-row>
        <h3>Simulation</h3>
        <el-row>
          <el-col class="py-1" :xl="8" :lg="8" :md="8" :sm="8" :xs="24">
            <div class="px-1">
              <el-input v-model="state.startYear" placeholder="(eg. 1990)">
                <template #prepend>Start year</template>
              </el-input>
            </div>
          </el-col>
          <el-col class="py-1" :xl="8" :lg="8" :md="8" :sm="8" :xs="24">
            <div class="px-1">
              <el-input v-model="state.periodLength" placeholder="Period">
                <template #prepend>Simulation period in years</template>
              </el-input>
            </div>
          </el-col>
          <el-col class="py-1" :xl="8" :lg="8" :md="8" :sm="8" :xs="24">
            <div class="px-1">
              <el-input v-model="state.rotationLength"
                        placeholder="(eg. Peas - Wheat would be 2)"
                        @change="updateRotationLength">
                <template #prepend>Length of rotation in years</template>
              </el-input>
            </div>
          </el-col>
        </el-row>
        <div>
          <h3>Climate</h3>
          <el-row>
            <el-col class="py-1">
              <div class="px-1">
                <span>Method of entering data</span>
                <el-select v-model="state.climateMethodDataEntry" class="m-2" placeholder="Select">
                  <el-option
                      label="Enter yearly rainfall & mean temperature"
                      :value="0"/>
                  <el-option
                      label="Enter average rainfall & mean temperature"
                      :value="1"/>
                  <!--              <el-option-->
                  <!--                  label="Closest town, stored weather averages"-->
                  <!--                  :value="2"/>-->
                  <!--              <el-option-->
                  <!--                  label="Closest town, actual weather data"-->
                  <!--                  :value="3"/>-->
                  <el-option
                      label="Enter monthly rainfall & mean temperature"
                      :value="4"/>
                </el-select>
                <el-button v-if="state.climateMethodDataEntry===4"
                           @click="state.toggleMonthlyClimate = !state.toggleMonthlyClimate">
                  {{ state.toggleMonthlyClimate ? 'Hide Monthly Rain/Temperature' : 'Show Monthly Rain/Temperature' }}
                </el-button>
                <el-button v-if="state.climateMethodDataEntry===0"
                           @click="state.toggleYearlyClimate = !state.toggleYearlyClimate">
                  {{ state.toggleYearlyClimate ? 'Hide Yearly Rain' : 'Show Yearly Rain' }}
                </el-button>
              </div>
            </el-col>
            <el-col class="py-1">
            <span class="input-group-addon">
              <a href="#" id="climateEdit" rel="popover"><i class="glyphicon glyphicon-edit"></i></a>
            </span>
            </el-col>
            <el-col class="py-1" :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
              <el-row v-if="state.climateMethodDataEntry===4" v-show="state.toggleMonthlyClimate">
                <monthly-table :monthRainTemp="state.monthRainTemp"
                               :periodLength="state.periodLength"
                               :startYear="state.startYear"
                               @updateMonthRainTemps="updateMonthRainTemps"/>
              </el-row>
              <el-row v-if="state.climateMethodDataEntry===0" v-show="state.toggleYearlyClimate">
                <yearly-table :annualRainfall="state.annualRainfall"
                              :periodLength="state.periodLength"
                              :startYear="state.startYear"
                              @updateAnnualRainfall="updateRainfall"/>
              </el-row>
            </el-col>
            <el-col class="py-1" :xl="12" :lg="12" :md="12" :sm="12" :xs="24">
              <div class="px-1">
                <el-input v-model="state.averageAnnualRainFall" placeholder="Rain"
                          :disabled="state.climateMethodDataEntry===4 || state.climateMethodDataEntry===0">
                  <template #prepend>Average annual rainfall (mm)</template>
                </el-input>
              </div>
            </el-col>
            <el-col class="py-1" :xl="12" :lg="12" :md="12" :sm="12" :xs="24">
              <div class="px-1">
                <el-input v-model="state.annualMeanTemperature" placeholder="Temperature"
                          :disabled="state.climateMethodDataEntry===4">
                  <template #prepend>Annual mean temperature (&#x2103;)</template>
                </el-input>
              </div>
            </el-col>
            <!--<div class="input-group">-->
            <!--    <span class="input-group-addon">Closest town (i.e. weather station)</span>-->
            <!--    <select id="closestTown" name="closestTown" class="form-control">-->
            <!--        &lt;!&ndash;<option value="none" disabled selected="selected">Select...</option>&ndash;&gt;-->
            <!--        <% weatherSource.forEach(function (weather, i) { %>-->
            <!--        <option value = "<%= weather.id %>"><%= weather.name %></option>-->
            <!--        <% }); %>-->
            <!--    </select>-->
            <!--</div>-->
            <el-col class="py-1">
              <div>
                <span>Randomize rainfall and temperature</span>
                <el-select v-model="state.randomizeRainAndTemperature" class="m-2" placeholder="Select">
                  <el-option
                      label="No"
                      :value="0"/>
                  <el-option
                      label="Yes"
                      :value="1"/>
                </el-select>
              </div>
            </el-col>
          </el-row>
        </div>
        <div>
          <h3>Rotation</h3>
          <el-row :span="24" v-if="state.rotationTableMessage">{{ state.rotationTableMessage }}</el-row>
          <el-row class="border-solid border-1 border-b-0 border-gray-200">
            <el-col :span="1" class="p-2 text-center">Year</el-col>
            <el-col :span="5" class="p-2 text-center">Plant</el-col>
            <el-col :span="5" class="p-2 text-center">Stubble</el-col>
            <el-col :span="5" class="p-2 text-center">Graze</el-col>
            <el-col :span="5" class="p-2 text-center">Fertiliser</el-col>
            <el-col :span="3"></el-col>
          </el-row>
          <el-row v-for="(rotation, idx) of state.rotationTable" :key="idx"
                  class="border-solid border-1 border-gray-200">
            <el-col :span="2" class="p-2">
              <el-input v-model="rotation['year']"/>
            </el-col>
            <el-col :span="5" class="p-2">
              <el-select v-model="rotation['plant']">
                <el-option v-for="plant in plants"
                           :key="plant.id"
                           :label="plant.name"
                           :value="plant.id"/>
              </el-select>
            </el-col>
            <el-col :span="5" class="p-2">
              <el-select v-model="rotation['stubble']">
                <el-option v-for="stubble in stubbles"
                           :key="stubble.id"
                           :label="stubble.name"
                           :value="stubble.id"/>
              </el-select>
            </el-col>
            <el-col :span="5" class="p-2">
              <el-select v-model="rotation['graze']">
                <el-option v-for="graze in grazes"
                           :key="graze.id"
                           :label="graze.name"
                           :value="graze.id"/>
              </el-select>
            </el-col>
            <el-col :span="5" class="p-2">
              <el-input v-model="rotation['fertiliser']"/>
            </el-col>
            <el-col :span="2" class="p-2">
              <el-button
                  v-if="idx===state.rotationLength-1"
                  link
                  type="primary"
                  size="small"
                  class="w-full"
                  @click.prevent="deleteRotation(idx)">
                Remove
              </el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-button class="mt-4 w-full" @click="addRotation">Add Rotation</el-button>
          </el-row>
          <div class="rotation-error"></div>
        </div>
        <div>
          <h3>Yields</h3>
          <el-row>
            <el-col class="py-1">
              <div>
                <span class="input-group-addon">Method of entering yield</span>
                <el-select v-model="state.yieldsMethodDataEntry"
                           class="m-2" placeholder="Select"
                           @change="selectYield">
                  <el-option
                      label="Enter annual yields manually"
                      :value="0"/>
                  <el-option
                      label="Computer will calculate annual yields"
                      :value="1"/>
                </el-select>
                <span class="input-group-addon">
              <a href="#" id="yieldEdit" rel="popover"><i class="glyphicon glyphicon-edit"></i></a>
            </span>
                <el-button v-if="state.yieldsMethodDataEntry===0"
                           @click="state.toggleAnnualYields = !state.toggleAnnualYields">
                  {{ state.toggleAnnualYields ? 'Hide Annual Yields' : 'Show Annual Yields' }}
                </el-button>
              </div>
            </el-col>
          </el-row>
          <el-row v-show="state.toggleAnnualYields">
            <yields-table :annualYields="state.annualYields"
                          :startYear="state.startYear"
                          :periodLength="state.periodLength"
                          @updateYields="updateYields"/>
          </el-row>
        </div>
        <el-col :span="24" class="py-10" v-if="state.errors">
          <el-row>
            <div class="errorMessages">Error: {{ state.errors }}</div>
          </el-row>
        </el-col>
      </el-col>
      <el-col :span="24" :xl="20" :lg="20" :md="20" :sm="24" :xs="24"
              class="py-10">
        <div>
          <el-button @click="sendForm()">Run</el-button>
          <el-button @click="loadData()" data-toggle="modal">Load Sample Data</el-button>
          <el-button @click="clearForm()">Clear Form</el-button>
        </div>
      </el-col>
      <el-col :span="24" :xl="20" :lg="20" :md="20" :sm="24" :xs="24"
              v-if="state.results" id="resultsOfInputPage">
        <el-row :span="24" class="max-h-[600px]">
          <line-chart :label="'Organic Carbon (0-10cm)'" :x-axis="state.results.years"
                      :data="state.results.organic_carbon.data_points"/>
        </el-row>
      </el-col>
      <el-col :span="24" :xl="20" :lg="20" :md="20" :sm="24" :xs="24"
              v-if="state.results">
        <management-table :results="state.results"/>
      </el-col>
      <el-col :span="24" :xl="20" :lg="20" :md="20" :sm="24" :xs="24"
              v-if="state.results">
        <results-table :results="state.results" :initial-o-c="state.initialOC"/>
      </el-col>
      <el-col :span="24" :xl="20" :lg="20" :md="20" :sm="24" :xs="24"
              v-if="state.results">
        <pie-chart :label="'Total greenhouse gas emissions'"
                   :data="state.results"/>
      </el-col>
      <el-col :span="24" :xl="20" :lg="20" :md="20" :sm="24" :xs="24"
              class="py-10" v-if="state.results">
        <div>
          <el-button @click="saveResults()" data-toggle="modal">Save Results</el-button>
          <el-button @click="scrollToTop('topOfInputPage')">Scroll to Top</el-button>
        </div>
      </el-col>
    </el-row>
    <el-row class="pb-20"></el-row>
  </div>
</template>

<style scoped>

</style>
