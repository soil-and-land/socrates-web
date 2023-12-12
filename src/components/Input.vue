<script setup lang="js">
import {reactive, ref, toRaw, onMounted} from 'vue';
import {storeToRefs} from 'pinia';

import Defaults from '../defaults.js';

import {run, sampleData} from '../model.service';
import {toCSV} from "~/export.service.js";
import {useStore} from '../store';
import {isEmpty} from "lodash";

const store = useStore();

onMounted(async () => {
  await store.getParameters();
});

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
  {'id': 5, 'name': 'Improved Pasture', 'short_name': 'IP'},
  {'id': 6, 'name': 'Fallow', 'short_name': 'Fa'},
  {'id': 7, 'name': 'Grass Pasture', 'short_name': 'GP'}
];
const grazes = [
  {'id': 'null', 'name': 'None'},
  {'id': 0, 'name': 'Light'},
  {'id': 1, 'name': 'Heavy'},
];
const stubbles = [
  {'id': 'null', 'name': 'None'},
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
  store.errors = [];
  socratesToData();
  validateParameters();
  if (store.errors.length === 0) {
    try {
      const results = await run({
        socrates: toRaw(store.socrates),
        parameters: toRaw(store.parameters)
      });
      store.results = results.run;
      scrollToTop('resultsOfInputPage');
    } catch (e) {
      store.errors.push(e.message);
      console.error(e);
    }
  }
}

const loadSampleData = async () => {
  store.errors = [];
  try {
    store.socrates = await sampleData();
    dataToSocrates();
  } catch (e) {
    store.errors.push(e.message);
    console.error(e);
  }
  store.showLoadDialog = false;
}

const loadData = (event) => {
  store.selectedFile = event.target.files[0];
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const jsonData = JSON.parse(event.target.result);
      if (jsonData) {
        if (jsonData.version) {
          store.socrates = jsonData;
          dataToSocrates();
        } else {
          store.socratesOld = jsonData;
          oldDataToSocrates();
        }
      }
    } catch (error) {
      store.errors.push('Invalid JSON file.');
    }
  };
  reader.readAsText(store.selectedFile);
  store.showLoadDialog = false;
}


function socratesToData() {
  try {
    store.socrates.version = store.version;
    store.socrates.soil['soil_properties'] = parseInt(store.soilProperties);
    if (
        (!store.socrates.soil['soil_properties'] && store.socrates.soil['soil_properties'] !== 0) ||
        store.socrates.soil['soil_properties'] < 0 && store.socrates.soil['soil_properties'] > 7
    ) {
      store.errors.push('Select soil properties');
    }
    store.socrates.soil['clay_percentage'] = parseFloat(store.clay);
    store.socrates.soil['cec'] = parseFloat(store.cec);
    store.socrates.soil['initial_oc'] = parseFloat(store.initialOC);
    if (store.socrates.simulation['initial_oc'] === 0) {
      store.errors.push('Insert a value for Initial OC%');
    }
    store.socrates.simulation['start_year'] = parseInt(store.startYear);
    if (!store.socrates.simulation['start_year'] && store.socrates.simulation['start_year'] !== 0) {
      store.errors.push('Simulation Start year missing');
    }
    store.socrates.simulation['period_length'] = parseInt(store.periodLength);
    if ((!store.socrates.simulation['period_length'] && store.socrates.simulation['period_length'] !== 0) || store.socrates.simulation['period_length'] <= 0) {
      store.errors.push('Add simulation period in years');
    }
    store.socrates.simulation['rotation_length'] = parseInt(store.rotationLength);
    if ((!store.socrates.simulation['rotation_length'] && store.socrates.simulation['rotation_length'] !== 0) || store.socrates.simulation['rotation_length'] < 1) {
      store.errors.push('Add length of rotation in years');
    }
    store.socrates.climate['climate_method_data_entry'] = store.climateMethodDataEntry;
    if ((!store.socrates.climate['climate_method_data_entry'] && store.socrates.climate['climate_method_data_entry'] !== 0) || store.socrates.climate['climate_method_data_entry'] < 0) {
      store.errors.push('Missing: Method of entering data');
    }
    store.socrates.climate['average_annual_rainfall'] = parseFloat(store.averageAnnualRainFall);
    store.socrates.climate['annual_mean_temperature'] = parseFloat(store.annualMeanTemperature);
    store.socrates.climate['randomize_rain_and_temperature'] = store.randomizeRainAndTemperature;
    store.socrates.climate['annual_rainfall'] = [];
    if (isIterable(store.annualRainfall)) {
      for (let r of store.annualRainfall) {
        store.socrates.climate['annual_rainfall'].push({rainfall: parseFloat(r?.rainfall)});
      }
    }
    store.socrates.climate['month_rain_temp'] = [];
    if (isIterable(store.monthRainTemp)) {
      for (let mrt of store.monthRainTemp) {
        store.socrates.climate['month_rain_temp'].push({
          rainfall: parseFloat(mrt?.rainfall),
          temperature: parseFloat(mrt?.temperature)
        });
      }
    }
    store.socrates.rotation = [];
    for (let rotation of store.rotationTable) {
      const r = {
        year: parseInt(rotation['year']),
        plant: parseInt(rotation['plant']),
        stubble: parseInt(rotation['stubble']),
        graze: parseInt(rotation['graze']),
        fertiliser: parseFloat(rotation['fertiliser'])
      }
      if ((!r.plant && r.plant !== 0) || r.plant < 0 || r.plant > 7) {
        store.errors.push(`Missing or incorrect plant in rotation year #${r.year}`);
      } else {
        if (r.plant < 5) { // Don't test stubble if plant is fallow, or pasture
          if ((!r.stubble && r.stubble !== 0)) {
            store.errors.push(`Stubble management missing in rotation year #${r.year}`);
          }
        }
        if ((!r.fertiliser && r.fertiliser !== 0)) {
          store.errors.push(`Fertiliser missing in rotation year #${r.year}`);
        }
        // if (r.plant !== 6) { // Don't test graze if plant is fallow
        // }
      }
      store.socrates.rotation.push(r);
    }
    if (store.socrates.rotation < 1) {
      store.errors.push('Add rotation crop');
    }
    store.socrates.yields['yields_method_data_entry'] = store.yieldsMethodDataEntry;
    store.socrates.yields['annual_yields'] = [];
    if (isIterable(store.annualYields)) {
      const yieldErrors = [];
      for (let y of store.annualYields) {
        const yy = {
          year: y?.year,
          rotation: y?.rotation,
          yield: parseFloat(y['yield'])
        }
        if (!yy.yield && yy.yield !== 0) {
          yieldErrors.push(`Missing: yield in year #${yy.year}`);
        }
        store.socrates.yields['annual_yields'].push(yy);
      }
      // console.log(JSON.stringify(store.annualYields));
      if (yieldErrors.length > 0) {
        yieldErrors.push('Missing: some yield values');
      }
    } else {
      store.socrates.yields['annual_yields'] = [];
    }
  } catch (e) {
    store.errors.push(`${e.name} ${e.message}`);
    console.error(e);
  }
}

function validateParameters() {
  for (let p of Object.keys(store.parameters)) {
    store.parameters[p] = parseFloat(store.parameters[p]);
  }
}

function dataToSocrates() {
  try {
    store.version = store.socrates.version || Defaults.version;
    store.soilProperties = store.socrates.soil.soil_properties;
    store.clay = store.socrates.soil.clay_percentage;
    store.cec = store.socrates.soil.cec;
    store.initialOC = store.socrates.soil.initial_oc;
    store.startYear = store.socrates.simulation.start_year;
    store.periodLength = store.socrates.simulation.period_length;
    store.rotationLength = store.socrates.simulation.rotation_length;
    store.climateMethodDataEntry = store.socrates.climate.climate_method_data_entry;
    store.averageAnnualRainFall = store.socrates.climate.average_annual_rainfall;
    store.annualMeanTemperature = store.socrates.climate.annual_mean_temperature;
    store.randomizeRainAndTemperature = store.socrates.climate.randomize_rain_and_temperature;
    store.annualRainfall = store.socrates.climate.annual_rainfall;
    store.monthRainTemp = store.socrates.climate.month_rain_temp;
    store.rotationTable = store.socrates.rotation;
    store.yieldsMethodDataEntry = store.socrates.yields.yields_method_data_entry;
    store.annualYields = store.socrates.yields.annual_yields;
  } catch (e) {
    store.errors.push(e.message);
    console.error(e);
  }
}

function oldDataToSocrates() {
  try {
    store.version = Defaults.version;
    store.soilProperties = store.socratesOld.soil.soilProperties;
    store.clay = store.socratesOld.soil.clayPercentage;
    store.cec = store.socratesOld.soil.cec || 0; //Where is this in socratesOld ?
    store.initialOC = store.socratesOld.soil.initialOC;
    store.startYear = store.socratesOld.simulation.startYear;
    store.periodLength = store.socratesOld.simulation.periodLength;
    store.rotationLength = store.socratesOld.simulation.rotationLength;
    store.climateMethodDataEntry = store.socratesOld.climate.climateMethodDataEntry;
    store.averageAnnualRainFall = store.socratesOld.climate.averageAnnualRainfall;
    store.annualMeanTemperature = store.socratesOld.climate.annualMeanTemperature;
    store.randomizeRainAndTemperature = store.socratesOld.climate.randomizeRainAndTemperature;
    store.annualRainfall = store.socratesOld.climate.annualRainFall;
    store.monthRainTemp = store.socratesOld.climate.monthRainTemp;
    store.rotationTable = store.socratesOld.rotation;
    store.yieldsMethodDataEntry = store.socratesOld.yields.yieldsMethodDataEntry;
    store.annualYields = store.socratesOld.yields.annualYields;
    if (store.socratesOld.parametersEdited) {
      store.parametersEdited = true;
      store.parameters = store.socratesOld.parameters;
    }
  } catch (e) {
    store.errors.push(e.message);
    console.error(e);
  }
}

async function clearForm() {
  store.$reset();
  await store.getParameters();
}

function clearResults() {
  store.results = null;
}

async function saveResults() {
  const csv = await toCSV({results: store.results, initialOC: store.initialOC});
  const exportedFilename = 'data.csv';
  const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, exportedFilename);
  } else {
    const link = document.createElement("a");
    if (link.download !== undefined) { // feature detection
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", exportedFilename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

function saveInputs() {
  socratesToData();
  const sc = toRaw(store.socrates);
  const jsonString = JSON.stringify(sc, null, 2);
  const blob = new Blob([jsonString], {type: 'application/json'});
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'socrates.json';
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}


function scrollToTop(id) {
  setTimeout(function () {
    // window.scroll({top: 0, left:0, behavior: 'smooth'});
    // document.getElementById(id).scrollIntoView({behavior: 'smooth'});
    const yOffset = -40;
    const element = document.getElementById(id);
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({top: y, behavior: 'smooth'});
  }, 100);
}

function howToNotebook() {
  store.displayRunInNotebook = true;
  const socrates_json = JSON.stringify(store.socrates);
  const parameters_json = JSON.stringify(store.parameters);
  store.jupyterSource = [
    '!pip install requests',
    'import os',
    'import json',
    'import requests',
    "socrates_json = '''",
    socrates_json,
    "'''",
    'socrates = json.loads(socrates_json)',
    "parameters_json = '''",
    parameters_json,
    "'''",
    'parameters = json.loads(parameters_json)',
    'api_url = "https://api.socrates-soil.net/run"',
    'payload = {',
    "  'socrates' : socrates,",
    "  'parameters': parameters",
    "}",
    "response = requests.post(api_url, json=payload)",
    "results = response.json()",
    "results"
  ];
}

function isIterable(obj) {
  // checks for null and undefined
  if (obj == null) {
    return false;
  }
  return typeof obj[Symbol.iterator] === 'function';
}
</script>

<template>
  <div class="mx-4 min-w-[650px]" id="topOfInputPage">
    <el-row :gutter="30">
      <el-col :xl="5" :lg="5" :md="5" :sm="5" :xs="5">
        <el-row class="pt-2 sticky top-20 justify-center">
          <div class="px-4 py-3 w-100 sm-100 md-100 lg-200 xl-200">
            <div class="pb-3 sm:pb-4">
              <el-button class="w-full" @click="sendForm()" size="large" type="primary">Run</el-button>
            </div>
            <div class="pb-3 sm:pb-4">
              <el-button class="w-full" @click="store.showLoadDialog = true" size="large" type="primary">Load Data
              </el-button>
            </div>
            <div class="pb-3 sm:pb-4">
              <el-button class="w-full" @click="clearForm()" size="large" type="warning">Clear Form</el-button>
            </div>
            <div class="pb-3 sm:pb-4">
              <el-button class="w-full" @click="clearResults()" size="large" type="warning">Clear Results</el-button>
            </div>
            <div class="pb-3 sm:pb-4">
              <el-button class="w-full" @click="saveInputs()" size="large" type="info">Save Inputs</el-button>
            </div>
          </div>
        </el-row>
      </el-col>
      <el-col :xl="19" :lg="19" :md="19" :sm="19" :xs="19">
        <el-row class="min-w-[500px] max-w-[1200px]">
          <el-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
            <h2 class="center" style="word-break: break-all;">S.O.C.R.A.T.E.S.</h2>
          </el-col>
          <el-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24"
                  class="py-10" v-if="store.errors.length>0">
            <el-row class="">
              <div class="w-full bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
                <p class="font-bold">Error:</p>
                <p class="errorMessages" v-for="error of store.errors">{{ error }}</p>
              </div>
            </el-row>
          </el-col>
          <el-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
            <el-button @click="store.showParameters = !store.showParameters">
              {{ store.showParameters ? 'Hide Parameters' : 'Edit Parameters' }}
            </el-button>
            <el-drawer v-model="store.showParameters" title="Climate" :with-header="false"
                       direction="ltr" class="min-w-fit">
              <parameter-table/>
              <div class="flex flex-col justify-center items-center">
              </div>
              <template #footer>
                <div style="flex: auto">
                  <el-button @click="store.resetParameters()">Reset Parameters</el-button>
                  <el-button type="primary" @click="store.showParameters=false">Close</el-button>
                </div>
              </template>
            </el-drawer>
            <h3>Soil</h3>
            <el-row>
              <el-col class="py-1">
                <div class="px-1">
                  <span>Soil Properties</span>
                  <el-select v-model="store.soilProperties" class="m-2" placeholder="Select">
                    <el-option v-for="soil in soils"
                               :key="soil.id"
                               :label="soil.type"
                               :value="soil.id"/>
                  </el-select>
                </div>
              </el-col>
              <el-col class="py-1" :xl="8" :lg="8" :md="8" :sm="24" :xs="24">
                <div class="px-1">
                  <el-input v-model="store.clay" placeholder="Clay %"
                            :disabled="store.soilProperties !== 6">
                    <template #prepend>Clay %</template>
                  </el-input>
                </div>
              </el-col>
              <el-col class="py-1" :xl="8" :lg="8" :md="8" :sm="24" :xs="24">
                <div class="px-1">
                  <el-input v-model="store.cec" placeholder="CEC"
                            :disabled="store.soilProperties !== 7">
                    <template #prepend>CEC</template>
                  </el-input>
                </div>
              </el-col>
              <el-col class="py-1" :xl="8" :lg="8" :md="8" :sm="24" :xs="24">
                <div class="px-1">
                  <el-input v-model="store.initialOC" placeholder="OC">
                    <template #prepend>Initial OC %</template>
                  </el-input>
                </div>
              </el-col>
            </el-row>
            <h3>Simulation</h3>
            <el-row>
              <el-col class="py-1" :xl="8" :lg="8" :md="8" :sm="24" :xs="24">
                <div class="px-1">
                  <el-input v-model="store.startYear" placeholder="(eg. 1990)">
                    <template #prepend>Start year</template>
                  </el-input>
                </div>
              </el-col>
              <el-col class="py-1" :xl="8" :lg="8" :md="8" :sm="24" :xs="24">
                <div class="px-1">
                  <el-input v-model="store.periodLength" placeholder="Period">
                    <template #prepend>Simulation period in years</template>
                  </el-input>
                </div>
              </el-col>
              <el-col class="py-1" :xl="8" :lg="8" :md="8" :sm="24" :xs="24">
                <div class="px-1">
                  <el-input v-model="store.rotationLength"
                            placeholder="(eg. Peas - Wheat would be 2)"
                            @change="store.updateRotationLength">
                    <template #prepend>Length of rotation in years</template>
                  </el-input>
                </div>
              </el-col>
            </el-row>
            <div>
              <h3>Climate</h3>
              <el-row>
                <el-col class="py-1">
                  <el-row>
                    <el-col :xl="4" :lg="4" :md="4" :sm="24" :xs="24">
                      <div>Method of entering data</div>
                    </el-col>
                    <el-col :xl="20" :lg="20" :md="20" :sm="24" :xs="24">
                      <div>
                        <el-select v-model="store.climateMethodDataEntry" class="w-full" placeholder="Select">
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
                        <el-button v-if="store.climateMethodDataEntry===4"
                                   @click="store.toggleMonthlyClimate = !store.toggleMonthlyClimate">
                          {{
                            store.toggleMonthlyClimate ? 'Hide Monthly Rain/Temperature' : 'Show Monthly Rain/Temperature'
                          }}
                        </el-button>
                        <el-button class="my-2" v-if="store.climateMethodDataEntry===0"
                                   @click="store.toggleYearlyClimate = !store.toggleYearlyClimate">
                          {{ store.toggleYearlyClimate ? 'Hide Yearly Rain' : 'Show Yearly Rain' }}
                        </el-button>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col class="py-1">
            <span class="input-group-addon">
              <a href="#" id="climateEdit" rel="popover"><i class="glyphicon glyphicon-edit"></i></a>
            </span>
                </el-col>
                <el-col class="py-1" :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
                  <el-drawer title="Climate" v-if="store.climateMethodDataEntry===4"
                             v-model="store.toggleMonthlyClimate"
                             :with-header="false" direction="rtl" class="min-w-fit">
                    <monthly-table :monthRainTemp="store.monthRainTemp"
                                   :periodLength="store.periodLength"
                                   :startYear="store.startYear"
                                   @updateMonthRainTemps="store.updateMonthRainTemps"/>
                    <template #footer>
                      <div style="flex: auto">
                        <el-button type="primary" @click="store.toggleMonthlyClimate=false">Close</el-button>
                      </div>
                    </template>
                  </el-drawer>
                  <el-drawer title="Climate" v-if="store.climateMethodDataEntry===0"
                             v-model="store.toggleYearlyClimate"
                             direction="rtl" :with-header="false" class="min-w-fit">
                    <yearly-table :annualRainfall="store.annualRainfall"
                                  :periodLength="store.periodLength"
                                  :startYear="store.startYear"
                                  @updateAnnualRainfall="store.updateRainfall"/>
                    <template #footer>
                      <div style="flex: auto">
                        <el-button type="primary" @click="store.toggleYearlyClimate=false">Close</el-button>
                      </div>
                    </template>
                  </el-drawer>
                </el-col>
                <el-col class="py-1" :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
                  <div class="px-1">
                    <el-input v-model="store.averageAnnualRainFall" placeholder="Rain"
                              :disabled="store.climateMethodDataEntry===4 || store.climateMethodDataEntry===0">
                      <template #prepend>Average annual rainfall (mm)</template>
                    </el-input>
                  </div>
                </el-col>
                <el-col class="py-1" :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
                  <div class="px-1">
                    <el-input v-model="store.annualMeanTemperature" placeholder="Temperature"
                              :disabled="store.climateMethodDataEntry===4">
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
                    <el-select v-model="store.randomizeRainAndTemperature" class="m-2" placeholder="Select">
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
              <el-row :span="24" v-if="store.rotationTableMessage">{{ store.rotationTableMessage }}</el-row>
              <el-row class="border-solid border-1 border-b-0 border-gray-200">
                <el-col :span="1" class="p-2 text-center">Year</el-col>
                <el-col :span="5" class="p-2 text-center">Plant</el-col>
                <el-col :span="5" class="p-2 text-center">Stubble</el-col>
                <el-col :span="5" class="p-2 text-center">Graze</el-col>
                <el-col :span="5" class="p-2 text-center">Fertiliser</el-col>
                <el-col :span="3"></el-col>
              </el-row>
              <el-row v-for="(rotation, idx) of store.rotationTable" :key="idx"
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
                  <rotation-select :modelValue="rotation['stubble']" :year="rotation['year']" :name="'stubble'"
                                   :posibleValues="stubbles" @update:modelValue="(v)=>{rotation['stubble'] = v}"
                                   :nullify="rotation['plant'] === 5 || rotation['plant'] === 6 || rotation['plant'] === 7"/>
                </el-col>
                <el-col :span="5" class="p-2">
                  <rotation-select :modelValue="rotation['graze']" :year="rotation['year']" :name="'graze'"
                                   :posibleValues="grazes" @update:modelValue="(v)=>{rotation['graze'] = v}"
                                   :nullify="rotation['plant'] === 6 || rotation['stubble'] === 0"/>
                </el-col>
                <el-col :span="5" class="p-2">
                  <el-input v-model="rotation['fertiliser']"/>
                </el-col>
                <el-col :span="2" class="p-2">
                  <el-button
                      v-if="idx===store.rotationLength-1"
                      link
                      type="primary"
                      size="small"
                      class="w-full"
                      @click.prevent="store.deleteRotation(idx)">
                    Remove
                  </el-button>
                </el-col>
              </el-row>
              <el-row>
                <el-button class="mt-4 w-full" @click="store.addRotation">Add Rotation</el-button>
              </el-row>
              <div class="rotation-error"></div>
            </div>
            <div>
              <h3>Yields</h3>
              <el-row>
                <el-col class="py-1">
                  <el-row>
                    <el-col :xl="4" :lg="4" :md="4" :sm="24" :xs="24">
                      <div>
                        Method of entering yield
                      </div>
                    </el-col>
                    <el-col :xl="20" :lg="20" :md="20" :sm="24" :xs="24">
                      <div>
                        <el-select v-model="store.yieldsMethodDataEntry"
                                   class="w-full" placeholder="Select"
                                   @change="store.selectYield">
                          <el-option
                              label="Enter annual yields manually"
                              :value="0"/>
                          <el-option
                              label="The model will calculate annual yields"
                              :value="1"/>
                        </el-select>
                        <el-button class="my-2" v-if="store.yieldsMethodDataEntry===0"
                                   @click="store.toggleAnnualYields = !store.toggleAnnualYields">
                          {{ store.toggleAnnualYields ? 'Hide Annual Yields' : 'Show Annual Yields' }}
                        </el-button>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <el-drawer title="Annual Yields" v-model="store.toggleAnnualYields" direction="rtl" :with-header="false"
                         class="min-w-fit">
                <yields-table :annualYields="store.annualYields"
                              :startYear="store.startYear"
                              :periodLength="store.periodLength"
                              :rotationLenght="store.rotationTable.length"
                              :rotationTable="store.rotationTable"
                              :plants="plants"
                              @updateYields="store.updateYields"/>
                <template #footer>
                  <div style="flex: auto">
                    <el-button type="primary" @click="store.toggleAnnualYields=false">Close</el-button>
                  </div>
                </template>
              </el-drawer>
            </div>
            <el-col :span="24" :xl="20" :lg="20" :md="24" :sm="24" :xs="24"
                    class="py-10" v-if="store.errors.length>0">
              <el-row :span="24" class="flex flex-col justify-center items-center">
                <div class="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
                  <p class="font-bold">Error:</p>
                  <p class="errorMessages" v-for="error of store.errors">{{ error }}</p>
                </div>
              </el-row>
            </el-col>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <div id="resultsOfInputPage">
      <el-row :gutter="20" class="flex flex-col justify-center items-center"
              v-if="store.parametersEdited">
        <el-col :span="24" :xl="20" :lg="20" :md="20" :sm="24" :xs="24">
          <el-row class="pt-4"></el-row>
          <el-row>
            <div class="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md"
                 role="alert">
              <div class="flex">
                <div class="py-1">
                  <svg class="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg"
                       viewBox="0 0 20 20">
                    <path
                        d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/>
                  </svg>
                </div>
                <div>
                  <p class="font-bold">Note: You have modified the input parameters </p>
                  <p class="text-sm">Results will be affected and the model might return an error.
                    To restore or modify them <a class="cursor-pointer font-bold underline"
                                                 @click="store.showParameters = true">click here</a>
                    and re run the model.</p>
                </div>
              </div>
            </div>
          </el-row>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="flex flex-col justify-center items-center">
        <el-col :span="24" :xl="20" :lg="20" :md="20" :sm="24" :xs="24"
                v-if="store.results">
          <el-row>
            <div class="grid">
              <h3 class="justify-self-center text-3xl">Results</h3>
            </div>
          </el-row>
          <el-row :span="24" class="max-h-[600px] overflow-auto">
            <line-chart :label="'Organic Carbon (0-10cm)'" :x-axis="store.results.years"
                        :data="store.results.organic_carbon.data_points"/>
          </el-row>
        </el-col>
        <el-col :span="24" :xl="20" :lg="20" :md="20" :sm="24" :xs="24"
                v-if="store.results">
          <management-table :results="store.results"/>
        </el-col>
        <el-col :span="24" :xl="20" :lg="20" :md="20" :sm="24" :xs="24"
                v-if="store.results">
          <results-table :results="store.results" :initial-o-c="store.initialOC"/>
        </el-col>
        <el-col :span="24" :xl="20" :lg="20" :md="20" :sm="24" :xs="24"
                v-if="store.results">
          <pie-chart :label="'Total greenhouse gas emissions'"
                     :data="store.results"/>
        </el-col>
        <el-col :span="24" :xl="20" :lg="20" :md="20" :sm="24" :xs="24"
                class="py-10" v-if="store.results">
          <div>
            <el-button @click="saveResults()" data-toggle="modal" size="large" type="primary">Save Results</el-button>
            <el-button v-if="store.results" @click="howToNotebook()" size="large" type="primary">Run in notebook
            </el-button>
            <el-button @click="scrollToTop('topOfInputPage')" size="large" type="info">Scroll to Top</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog v-model="store.displayRunInNotebook"
               title="## Copy and Paste the following code in a jupyter notebook ##">
      <div class="overflow-x-scroll">
        <code>
          <ul class="list-none list-inside">
            <li v-for="row of store.jupyterSource" class="break-normal">{{ row }}</li>
          </ul>
        </code>
      </div>
      <template #footer>
        <div style="flex: auto">
          <el-button type="primary" @click="store.displayRunInNotebook=false">Close</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="store.showLoadDialog" title="Load Data">
      <el-form>
        <input type="file" @change="loadData($event)" @click="$event.target.value=''" accept="application/json"/>
      </el-form>
      <br/>
      <div class="is-align-center">or</div>
      <br/>
      <br/>
      <div>
        <el-button @click="loadSampleData()" size="large" type="primary">Load Example Data</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>

</style>
