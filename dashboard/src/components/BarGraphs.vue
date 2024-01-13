<script setup lang="ts">
import { ref, computed, watch, defineProps, toRefs, shallowRef } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { generateLabels } from '../scripts/generateLabels'


ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

// get props data
const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
    id: {
        type: String,
        required: true,
    },
})

const { data, id } = toRefs(props)


const graphData = computed(() => {
    if (!data.value) {
        return {
            labels: [],
            datasets: [],
        }
    }
    const visitorsData = data.value.visitors
    const viewsData = data.value.visits
    return {
        labels: generateLabels(data.value),
        datasets: [
            {
                label: 'Visitors',
                data: visitorsData,
                backgroundColor: '#3B82F6',
                borderColor: '#3B82F6',
                borderWidth: 1,
                // stack: 'combined',
            },
            {
                label: 'Views',
                data: viewsData,
                // light blue
                backgroundColor: '#93C5FD',
                borderColor: '#93C5FD',
                borderWidth: 1,
                // stack: 'combined',
            }
        ],
    }
})

const chartOptions = {
    responsive: true
}



</script>
<template>
    <Bar :data="graphData" :options="chartOptions" ref="chart" />
</template>