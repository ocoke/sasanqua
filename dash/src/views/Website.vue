<script setup lang="ts">
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'
const route = useRoute()
const router = useRouter()
const id = route.params.id

const siteName = ref('')
const siteDomain = ref('')
const siteDescription = ref('')

const timestamp = new Date().getTime()
const fromToday = timestamp - 86400000
const fromThisWeek = timestamp - 604800000

interface ViewsData {
    visitor: number,
    visit: number,
    visit_time: number,
}

const todayData = ref(<ViewsData>{})
const thisWeekData = ref(<ViewsData>{})

setTimeout(() => {
    fetch('/api/site/get', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('sasanqua_token')
        },
        body: JSON.stringify({
            id,
        })
    }).then(res => res.json()).then(res => {
        if (res.code == 200) {
            siteName.value = res.data.site.name
            siteDomain.value = res.data.site.domain
            siteDescription.value = res.data.site.description
        } else {
            router.push('/signin')
        }
    })
    fetch(`/api/data/results?id=${id}&from=${fromToday}&to=${timestamp}&query=visit,visitor,visit_time`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('sasanqua_token')
        },
    }).then(res => res.json()).then(res => {
        if (res.code == 200) {
            todayData.value = res.data
        }
    })
    fetch(`/api/data/results?id=${id}&from=${fromThisWeek}&to=${timestamp}&query=visit,visitor,visit_time`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('sasanqua_token')
        },
    }).then(res => res.json()).then(res => {
        if (res.code == 200) {
            thisWeekData.value = res.data
        }
    })
}, 100)
</script>
<template>
    <div class="w-full max-w-3xl mx-auto" v-if="siteName && siteDomain">
        <p class="text-3xl text-gray-900 dark:text-white mb-3 font-bold">{{ siteName }}</p>
        <p class="text-xl text-gray-900 dark:text-white mb-6 opacity-70 font-mono">{{ siteDomain }}</p>
    </div>
    <div class="w-full max-w-3xl mx-auto" v-else>
        <div class="h-8 w-48 rounded skeleton"></div>
        <div class="h-5 w-48 rounded opacity-70 skeleton" ></div>
    </div>
    <div class="w-full max-w-3xl mx-auto">
        <!-- cols: 2 -->
        <div class="grid sm:grid-cols-2 gap-4">
            <div class="bg-white border border-gray-200 rounded-lg px-6 py-4 dark:bg-gray-800 dark:border-gray-700">
                <p class="text-xl text-gray-900 dark:text-white mb-3 font-bold">Today</p>
                <p class="CardNumberTitle"><span class="CardNumber">{{ todayData.visit || 0 }}</span> Views</p>
                <p class="CardNumberTitle"><span class="CardNumber">{{ todayData.visitor || 0 }}</span> Visitors</p>
                <p class="CardNumberTitle" v-if="todayData.visit_time"><span class="CardNumber">{{
                    Math.round(todayData.visit_time) || 'N/A' }}s</span> Avg Visit Time</p>
            </div>
            <div class="bg-white border border-gray-200 rounded-lg px-6 py-4 dark:bg-gray-800 dark:border-gray-700">
                <p class="text-xl text-gray-900 dark:text-white mb-3 font-bold">This Week</p>
                <p class="CardNumberTitle"><span class="CardNumber">{{ thisWeekData.visit || 0 }}</span> Views</p>
                <p class="CardNumberTitle"><span class="CardNumber">{{ thisWeekData.visitor || 0 }}</span> Visitors</p>
                <p class="CardNumberTitle" v-if="thisWeekData.visit_time"><span class="CardNumber">{{
                    Math.round(thisWeekData.visit_time) || 'N/A' }}s</span> Avg Visit Time</p>
            </div>
        </div>
        <div class="mt-4">
            <div class="bg-white border border-gray-200 rounded-lg px-6 py-4 dark:bg-gray-800 dark:border-gray-700">
                <p class="text-xl text-gray-900 dark:text-white mb-3 font-bold">Data</p>
                <div class="bg-white border border-gray-200 rounded-lg px-6 py-4 dark:bg-gray-800 dark:border-gray-700">
                        <p class="text-xl text-gray-900 dark:text-white mb-3 font-bold">Graphs</p>
                    </div>
                <div class="grid sm:grid-cols-2 gap-4 mt-4">
                    <div class="bg-white border border-gray-200 rounded-lg px-6 py-4 dark:bg-gray-800 dark:border-gray-700">
                        <p class="text-xl text-gray-900 dark:text-white mb-3 font-bold">Pages</p>
                    </div>
                    <div class="bg-white border border-gray-200 rounded-lg px-6 py-4 dark:bg-gray-800 dark:border-gray-700">
                        <p class="text-xl text-gray-900 dark:text-white mb-3 font-bold">Referrers</p>
                    </div>
                    <div class="bg-white border border-gray-200 rounded-lg px-6 py-4 dark:bg-gray-800 dark:border-gray-700">
                        <p class="text-xl text-gray-900 dark:text-white mb-3 font-bold">Countries</p>
                    </div>
                    <div class="bg-white border border-gray-200 rounded-lg px-6 py-4 dark:bg-gray-800 dark:border-gray-700">
                        <p class="text-xl text-gray-900 dark:text-white mb-3 font-bold">Browsers</p>
                    </div>
                    <div class="bg-white border border-gray-200 rounded-lg px-6 py-4 dark:bg-gray-800 dark:border-gray-700">
                        <p class="text-xl text-gray-900 dark:text-white mb-3 font-bold">OS</p>
                    </div>
                    <div class="bg-white border border-gray-200 rounded-lg px-6 py-4 dark:bg-gray-800 dark:border-gray-700">
                        <p class="text-xl text-gray-900 dark:text-white mb-3 font-bold">Devices</p>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
<style>
.CardNumber {
    @apply text-2xl font-bold mr-3;
}

.CardNumberTitle {
    @apply text-gray-900 dark:text-white mb-3 font-bold flex items-center font-mono opacity-80;
}</style>