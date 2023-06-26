<script setup lang="js">
import {onMounted, onUpdated} from "vue";
import {Chart} from 'chart.js/auto';

const props = defineProps(['label', 'xAxis', 'data']);
let chart;
let chartContext;
let data;
let options;

const renderChart = ({min, max}) => {
  chart = new Chart(chartContext, {
    type: 'line',
    data: {
      labels: props.xAxis,
      datasets: [
        {
          label: props.label,
          backgroundColor: 'rgba(220,220,220,0.26)',
          borderColor: 'rgb(53,148,126)',
          data: props.data
        },
        // {
        //   label: 'Data 2',
        //   backgroundColor: 'rgba(151, 187, 205, 0.2)',
        //   borderColor: 'rgba(151, 187, 205, 1)',
        //   data: [28, 48, 40, 19, 86, 27]
        // }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      lineTension: 0,
      scales: {
        y: {
          ticks: {
            beginAtZero: false,
            padding: 25
          },
          suggestedMin: min,
          suggestedMax: max
        },
        x: {}
      }
    }
  });
};

onMounted(() => {
  chartContext = document.getElementById('lineChartCanvas');

  const max = props.data[0] + props.data[0] * .01;
  const min = props.data[props.data.length - 1] - props.data[props.data.length - 1] * .01;
  renderChart({min, max, data: props.data});
});

onUpdated(() => {
  const max = props.data[0] + props.data[0] * .01;
  const min = props.data[props.data.length - 1] - props.data[props.data.length - 1] * .01;
  chart.options = {
    responsive: true,
    maintainAspectRatio: true,
    lineTension: 0,
    scales: {
      y: {
        ticks: {
          beginAtZero: false,
          padding: 25
        },
        suggestedMin: min,
        suggestedMax: max
      },
      x: {}
    }
  };
  chart.data = {
    labels: props.xAxis,
    datasets: [
      {
        label: props.label,
        backgroundColor: 'rgba(220,220,220,0.26)',
        borderColor: 'rgb(53,148,126)',
        data: props.data
      },
      // {
      //   label: 'Data 2',
      //   backgroundColor: 'rgba(151, 187, 205, 0.2)',
      //   borderColor: 'rgba(151, 187, 205, 1)',
      //   data: [28, 48, 40, 19, 86, 27]
      // }
    ]
  };
  chart.update();
});

</script>
<template>
  <div class="grid">
    <h3 class="justify-self-center text-3xl">Results</h3>
  </div>
  <div>
    <canvas id="lineChartCanvas"
            style="position: relative; height:40vh; width:80vw"></canvas>
  </div>
</template>
