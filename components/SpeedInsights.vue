<script setup lang="ts">
const { data } = defineProps({
    data: {
        type: Object,
        required: true,
    },
})

const speedClass = ref(
    {
        res: 'text-gray-900',
        fcp: 'text-gray-900',
        lcp: 'text-gray-900',
        cls: 'text-gray-900',
        fid: 'text-gray-900',
        ttfb: 'text-gray-900',
    }
)

const formatter = Intl.NumberFormat('en', { notation: 'compact' })

const formatSpeed = (num: number, type: string) => {
    if (type) {
        switch (type) {
            case 'lcp':
                if (num <= 2.5) {
                    speedClass.value[type] = 'text-green-500'
                } else if (num <= 4) {
                    speedClass.value[type] = 'text-yellow-500'
                } else {
                    speedClass.value[type] = 'text-red-500'
                }
                break
            case 'fcp':
                if (num <= 1.8) {
                    speedClass.value[type] = 'text-green-500'
                } else if (num <= 3) {
                    speedClass.value[type] = 'text-yellow-500'
                } else {
                    speedClass.value[type] = 'text-red-500'
                }
                break
            case 'cls':
                if (num <= 0.1) {
                    speedClass.value[type] = 'text-green-500'
                } else if (num <= 0.25) {
                    speedClass.value[type] = 'text-yellow-500'
                } else {
                    speedClass.value[type] = 'text-red-500'
                }
                break
            case 'fid':
                if (num <= 100) {
                    speedClass.value[type] = 'text-green-500'
                } else if (num <= 300) {
                    speedClass.value[type] = 'text-yellow-500'
                } else {
                    speedClass.value[type] = 'text-red-500'
                }
                break
            case 'ttfb':
                if (num <= 0.8) {
                    speedClass.value[type] = 'text-green-500'
                } else if (num <= 1.8) {
                    speedClass.value[type] = 'text-yellow-500'
                } else {
                    speedClass.value[type] = 'text-red-500'
                }
                break
        }
    }
    return formatter.format(num)
}
</script>
<template>
    <div class="grid grid-cols-2 gap-2 mt-8" v-if="data.res || data.fcp || data.lcp || data.cls || data.fid || data.ttfb">
        <div class="CardNumberTitle"><span :class="'CardNumber ' + speedClass.res">{{ formatSpeed(data.res, 'res') }}</span>
            Real Experience Score</div>
        <div class="CardNumberTitle"><span :class="'CardNumber ' + speedClass.fcp">{{ formatSpeed(data.fcp / 1000, 'fcp')  }}s</span>
            First Contentful Paint</div>
        <div class="CardNumberTitle"><span :class="'CardNumber ' + speedClass.lcp">{{ formatSpeed(data.lcp / 1000, 'lcp') }}s</span>
            Largest Contentful Paint</div>
        <div class="CardNumberTitle"><span :class="'CardNumber ' + speedClass.cls">{{ formatSpeed(data.cls, 'cls') }}</span>
            Cumulative Layout Shift</div> 
        <div class="CardNumberTitle"><span :class="'CardNumber ' + speedClass.fid">{{ formatSpeed(data.fid, 'fid') }}<span class="mr-1"></span>ms</span>
            First Input Delay</div>
        <div class="CardNumberTitle"><span :class="'CardNumber ' + speedClass.ttfb">{{ formatSpeed(data.ttfb / 1000, 'ttfb') }}s</span>
            Time to First Byte</div>
    </div>
    <div v-else>
        <p class=text-center>
            No Data Available
        </p>
    </div>
</template>
<style scoped>
.CardNumber {
    @apply text-3xl font-bold font-mono;
}

.CardNumberTitle {
    @apply text-gray-900 dark:text-white mb-3 font-bold flex items-center;
    flex-direction: column;
}
</style>