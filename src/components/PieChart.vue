<script setup lang="js">
import {onMounted, onUpdated} from "vue";
import {Chart} from 'chart.js/auto';

const props = defineProps(['label', 'data']);
let chart;
let chartContext;
let data;
const labels = [
  {name: 'Soil C (0-30 cm)', color: 'rgb(44,55,166)'},
  {name: 'Nitrous Oxide (Fertiliser)', color: 'rgb(255, 99, 132)'},
  {name: 'Nitrous Oxide (Mineralised)', color: 'rgb(54, 162, 235)'},
  {name: 'Nitrous Oxide (Residues)', color: 'rgb(255, 205, 86)'},
  {name: 'Nitrous Oxide (Indirect)', color: 'rgb(79,73,79)'},
  {name: 'Nitrous Oxide (Urine)', color: 'rgb(206,58,31)'},
  {name: 'Methane (Animal)', color: 'rgb(217,109,62)'},
]

const renderChart = () => {
  chart = new Chart(chartContext, {
    type: 'pie',
    data: {
      labels: [
        'Soil C (0-30 cm)',
        'Nitrous Oxide (Fertiliser)',
        'Nitrous Oxide (Mineralised)',
        'Nitrous Oxide (Residues)',
        'Nitrous Oxide (Indirect)',
        'Nitrous Oxide (Urine)',
        'Methane (Animal)'
      ],
      datasets: [
        {
          label: ' ',
          backgroundColor: [
            'rgb(44,55,166)',
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(79,73,79)',
            'rgb(206,58,31)',
            'rgb(217,109,62)'
          ],
          fontSize: 24,
          // borderColor: 'rgb(53,148,126)',
          data: [
            props.data.co2[props.data.years.length - 1],
            props.data.n2o.fert[props.data.years.length - 1],
            props.data.n2o.min[props.data.years.length - 1],
            props.data.n2o.res[props.data.years.length - 1],
            props.data.n2o.indirect[props.data.years.length - 1],
            props.data.n2o.urine[props.data.years.length - 1],
            props.data.ch4.animal[props.data.years.length - 1]
          ]
        }
      ]
    },
    hoverOffset: 1,
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false,
        }
      }
    }
  });
};

onMounted(() => {
  chartContext = document.getElementById('pieChartCanvas');
  renderChart();
});

onUpdated(() => {
  chart.data = {
    labels: [
      'Soil C (0-30 cm)',
      'Nitrous Oxide (Fertiliser)',
      'Nitrous Oxide (Mineralised)',
      'Nitrous Oxide (Residues)',
      'Nitrous Oxide (Indirect)',
      'Nitrous Oxide (Urine)',
      'Methane (Animal)'
    ],
    datasets: [
      {
        label: ' ',
        backgroundColor: [
          'rgb(44,55,166)',
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
          'rgb(79,73,79)',
          'rgb(206,58,31)',
          'rgb(217,109,62)'
        ],
        // borderColor: 'rgb(53,148,126)',
        data: [
          props.data.co2[props.data.years.length - 1],
          props.data.n2o.fert[props.data.years.length - 1],
          props.data.n2o.min[props.data.years.length - 1],
          props.data.n2o.res[props.data.years.length - 1],
          props.data.n2o.indirect[props.data.years.length - 1],
          props.data.n2o.urine[props.data.years.length - 1],
          props.data.ch4.animal[props.data.years.length - 1]
        ]
      }
    ]
  }
  chart.update();
});


</script>
<template>
  <el-row :span="24" :gutter="10">
    <div class="flex flex-row p-2" v-for="l of labels">
      <div class="w-8 h-4" :style="`background-color: ${l.color}`"></div><span class="px-2">{{ l.name }}</span>
    </div>
  </el-row>
  <div class="sm:w-full md:w-40% lg:w-40% xl:w-40% 2xl:w-40%">
    <canvas id="pieChartCanvas"
            style="display: inline; position: relative; height:20vh; width:50vw"></canvas>
  </div>
</template>
