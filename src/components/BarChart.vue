<script setup lang="js">
import {onMounted, onUpdated, reactive, watch} from "vue";
import {Chart} from 'chart.js/auto';

const props = defineProps(['label', 'data']);
let chart;
let chartContext;

let data = reactive({
  bar: [
    props.data.co2[props.data.years.length - 1],
    props.data.n2o.fert[props.data.years.length - 1],
    props.data.n2o.min[props.data.years.length - 1],
    props.data.n2o.res[props.data.years.length - 1],
    props.data.n2o.indirect[props.data.years.length - 1],
    props.data.n2o.urine[props.data.years.length - 1],
    props.data.ch4.animal[props.data.years.length - 1]
  ],
  labels: [
    {name: 'Soil C (0-30 cm)', color: 'rgb(44,55,166)', unit: 'kg CO<sub>2</sub>-eq/ha'},
    {name: 'Nitrous Oxide (Fertiliser)', color: 'rgb(255, 99, 132)', unit: 'kg CO<sub>2</sub>-eq/ha'},
    {name: 'Nitrous Oxide (Mineralised)', color: 'rgb(54, 162, 235)', unit: 'kg CO<sub>2</sub>-eq/ha'},
    {name: 'Nitrous Oxide (Residues)', color: 'rgb(255, 205, 86)', unit: 'kg CO<sub>2</sub>-eq/ha'},
    {name: 'Nitrous Oxide (Indirect)', color: 'rgb(79,73,79)', unit: 'kg CO<sub>2</sub>-eq/ha'},
    {name: 'Nitrous Oxide (Urine)', color: 'rgb(206,58,31)', unit: 'kg CO<sub>2</sub>-eq/ha'},
    {name: 'Methane (Animal)', color: 'rgb(217,109,62)', unit: 'kg CO<sub>2</sub>-eq/ha'},
  ]
});

const renderChart = () => {
  chart = new Chart(chartContext, {
    type: 'bar',
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
      },
      scales: {
        y: {
          beginAtZero: true,  // Ensure y-axis starts at zero
          suggestedMin: getMin(),
          // min: getMin(),  // Minimum value for y-axis
          max: getMax() // Maximum value for y-axis
        }
      }
    }
  });
};

onMounted(() => {
  chartContext = document.getElementById('barChartCanvas');
  renderChart();
});

const getMax = () => {
  return Math.max(...data.bar);
}
const getMin = () => {
  let min = Math.min(...data.bar);
  if (min >= 0) {
    min = 0;
  } else {
    min = min - 100;
  }
  return min;
}

watch(() => props.data, (first, second) => {
  if (chart) {
    data.bar = [
      props.data.co2[props.data.years.length - 1],
      props.data.n2o.fert[props.data.years.length - 1],
      props.data.n2o.min[props.data.years.length - 1],
      props.data.n2o.res[props.data.years.length - 1],
      props.data.n2o.indirect[props.data.years.length - 1],
      props.data.n2o.urine[props.data.years.length - 1],
      props.data.ch4.animal[props.data.years.length - 1]
    ];
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
          data: data.bar
        }
      ]
    }
    chart.options.scales = {y: {suggestedMin: getMin(), max: getMax()}};
    chart.update();
  }
})

</script>
<template>
  <el-row :span="24" :gutter="10">
    <div class="flex flex-row p-2" v-for="(l, index) in data.labels">
      <div class="w-8 h-4" :style="`background-color: ${l.color}`"></div>
      <span class="pl-2">{{ l.name }}</span>
      <span class="pl-2">{{ data.bar[index] }}</span>
      <span class="px-2" v-html="l.unit"/>
    </div>
  </el-row>
  <div class="sm:w-full md:w-full lg:w-full xl:w-40% 2xl:w-40%">
    <canvas id="barChartCanvas" height="400"></canvas>
  </div>
</template>
