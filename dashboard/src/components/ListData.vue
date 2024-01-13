<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
// get data from props
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

const sortObj = (obj: object): object => {
    const entries = Object.entries(obj);

    entries.sort((a, b) => b[1] - a[1]);

    const sortedObj = Object.fromEntries(entries);

    return sortedObj
}


const formatter = Intl.NumberFormat('en', { notation: 'compact' });
</script>
<template>
    <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700" >
        <li class="py-3 sm:py-4" v-for="(i, index) in sortObj(data)">
            <div class="flex items-center">
                <div class="flex-1 min-w-0 ms-4">
                    <p class="text-sm font-medium text-gray-900 truncate dark:text-white font-mono">
                        <span><router-link :to="`/websites/data/${id}?${type}=${encodeURIComponent(index)}`">
                            <span v-if="type == 'screen'">{{ index.replace(',', 'x') }}</span>
                            <span v-else-if="type == 'referrer' && (index == '' || index == 'undefined')">[None]</span>
                            <span v-else>{{ index }}</span>
                        </router-link></span>
                    </p>
                </div>
                <div class="inline-flex items-center text-base text-gray-900 dark:text-white me-4 font-mono">
                    <span class="font-semibold mr-1">{{ formatter.format(i) }}</span>
                    <span class="rounded text-sm p-1 ml-1 opacity-60">{{ Math.round(i / count * 100) }}%</span>
                </div>
            </div>
        </li>
    </ul>
</template>