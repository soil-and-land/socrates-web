<script setup lang="js">
import {onMounted, onUpdated} from "vue";
import {Chart} from 'chart.js/auto';

const props = defineProps(['label', 'data']);
let chart;
let chartContext;
let data;

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
      maintainAspectRatio: true
    }
  });
};

onMounted(() => {
  chartContext = document.getElementById('pieChartCanvas');
  renderChart();
});

onUpdated(() => {
  chart.update();
});

</script>
<template>
  <h3 class="center text-3xl">{{ props.label }}</h3>
  <canvas id="pieChartCanvas"
          style="position: relative; height:20vh; width:60vw"></canvas>
</template>
