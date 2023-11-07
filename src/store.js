import { defineStore } from 'pinia'
import Defaults from './defaults';

export const useStore = defineStore({
  id: 'input',
  state: () => ({
    version: Defaults.version,
    soilProperties: null,
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
    parameters: Defaults.getParameters(),
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
    rotationTableMessage: null,
    displayRunInNotebook: false,
    jupyterNotebook: [],
    showLoadDialog: false,
    selectedFile: null,
    socratesOld: {}, //To suport old versions of the json input file
    errors: []
  }),
  actions: {
    // Define your actions here
    deleteRotation(index) {
      this.rotationTable.splice(index, 1);
      this.rotationLength--;
    },
    updateRotation(event) {
      if (event) {
        this.rotationLength = parseInt(event);
        for (let e = 0; e < this.rotationLength; e++) {
          this.rotationTable.push({
            year: e + 1,
            plant: '',
            stubble: '',
            graze: '',
            fertiliser: ''
          });
        }
      }
    },
    addRotation() {
      this.rotationLength++;
      this.rotationTable.push({
        year: this.rotationLength,
        plant: '',
        stubble: '',
        graze: '',
        fertiliser: ''
      });
    },
    updateRotationLength(event) {
      if (this.rotationTable.length !== event) {
        this.rotationTable = []; // This will clear the rotation table
        this.updateRotation(event);
        this.rotationTableMessage = null;
      } else {
        this.rotationTableMessage = 'Rotation Length differs from rotation table, please adjust';
      }
    },
    selectYield(yieldOption) {
      this.yieldsMethodDataEntry = yieldOption;
    },
    updateRainfall({annualRainfall}) {
      this.annualRainfall = annualRainfall;
    },
    updateYields({annualYields}) {
      this.annualYields = annualYields;
    },
    updateMonthRainTemps({monthRainTemp}) {
      this.monthRainTemp = monthRainTemp;
    },
    resetParameters() {
      this.parameters = Defaults.getParameters();
    }
  },
});
