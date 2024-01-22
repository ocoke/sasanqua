<script setup>
import svgMap from 'svgmap';
import 'svgmap/dist/svgMap.min.css'
const { data, count, id, type } = defineProps({
    data: {
        type: Object,
        required: true,
    },
    count: {
        type: Number,
        required: true,
    },
    id: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    }
})
const formatter = Intl.NumberFormat('en', { notation: 'compact' });
const convertMapFormat = (data) => {
    const res = {}
    for (const [key, value] of Object.entries(data)) {
        res[key.toUpperCase()] = {
            views: formatter.format(value),
        }
    }
    return res
}
onMounted(() => {
    setTimeout(() => {
        const map = new svgMap({
            targetElementID: 'svgMap',
            hideFlag: true,
            colorMax: '#1E3A8A',
            colorMin: '#EFF6FF',
            data: {
                data: {
                    views: {
                        name: 'Views',
                        format: '{0}',
                        // thousandSeparator: ',',
                    },
                },
                applyData: 'views',
                values: convertMapFormat(data)
            }
        }, 100);
    })
})


</script>

<template>
    <div id="svgMap"></div>
</template>

<style>
.svgMap-map-container,
.svgMap-container,
#svgMap,
.svgMap-map-wrapper {
    height: 100%;
    background-color: transparent;
}

#svgMap {
    border-right: 1px solid #e5e7eb;
}</style>