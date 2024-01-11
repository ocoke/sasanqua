<script setup lang="ts">
import { ref, computed, watch, defineProps, toRefs, shallowRef } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
const hoursLabels = [
    '12AM', '1AM', '2AM', '3AM', '4AM', '5AM', '6AM', '7AM', '8AM', '9AM', '10AM', '11AM',
    '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM','11PM',
]
const monthsLabel = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct',
    'Nov', 'Dec',
]
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

// watch(data, (x) => {
//     console.log(x)

// })
// const chart = ref()
// console.log(chart.value)

const generateLabels = (data) => {
    if (!data) {
        return []
    }
    const labels = []
    if (data.type == "hours") {
        const nowHour = new Date(data.to).getHours()
        for (let i = 0; i < 24; i++) {
            const hour = nowHour - i
            const index = hour < 0 ? hour + 24 : hour
            labels.unshift(hoursLabels[index])
        }
    } else if (data.type == "days") {
        let now = data.to
        for (let i = 0; i < data.visitors.length; i++) {
            const date = (new Date(now).getMonth() + 1) + '/' + new Date(now).getDate()
            labels.unshift(date)
            now = now - 86400000
        }
    } else if (data.type == "months") {
        let now = data.to
        for (let i = 0; i < data.visitors.length; i++) {
            const date = monthsLabel[new Date(now).getMonth()]
            labels.unshift(date)
            now = now - (data.months[new Date(now).getMonth()]) * 86400000
        }
    }
    return labels
}
</script>
<template>
    <Bar :data="graphData" :options="chartOptions" ref="chart" />
</template>