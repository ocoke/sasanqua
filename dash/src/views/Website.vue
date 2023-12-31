<script setup lang="ts">
import { RouterLink, useRouter, useRoute } from 'vue-router'
import ListData from '../components/ListData.vue'
import { ref } from 'vue'
const route = useRoute()
const router = useRouter()
const id = route.params.id

const siteName = ref('')
const siteDomain = ref('')
const siteDescription = ref('')

const rangeText = ref('')
const rangeValue = ref(1 * 24 * 60 * 60 * 1000)

const timestamp = new Date().getTime()
const fromToday = timestamp - 86400000
const fromThisWeek = timestamp - 604800000

interface ViewsData {
    visitor: number,
    visit: number,
    visit_time: number,
}

interface DetailsData {
    visit: number,
    visitor: number,
    visit_time: number,
    data: object,
    language: object,
    screen: object,
    country: object,
    referrer: object,
    url: object,
    browser: object,
    os: object,
    device: object,
}

const todayData = ref(<ViewsData>{})
const thisWeekData = ref(<ViewsData>{})

const detailsData = ref(<DetailsData>{})

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
    fetch(`/api/data/results?id=${id}&from=${fromToday}&to=${timestamp}&query=visit,visitor,data,language,screen,visit_time,country,referrer,url,browser,os,device`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('sasanqua_token')
        },
    }).then(res => res.json()).then(res => {
        if (res.code == 200) {
            detailsData.value = res.data
        }
    })
}, 100)

const convertTime = (s) => {
    // input: seconds
    // output: m mins s secs
    const h = Math.floor(s / 3600)
    const m = Math.floor((s - h * 3600) / 60)
    const sec = s - h * 3600 - m * 60
    let result = ''
    if (m > 0) {
        result += Math.round(m) + ':'
    }
    if (sec > 0) {
        if (m <= 0) {
            result += Math.round(sec)
        } else {
            result += Math.round(sec) < 10 ? '0' + Math.round(sec) : Math.round(sec)
        }
    }
    if (result == '') {
        result = '0'
    }
    if (!result.includes(":")) {
        result += "s"
    }
    return result
}

const formatter = Intl.NumberFormat('en', { notation: 'compact' })

const changeRange = (e) => {
    const timestamp = new Date().getTime()
    const fromVal = timestamp - e.target.value
    fetch(`/api/data/results?id=${id}&from=${fromVal}&to=${timestamp}&query=visit,visitor,data,language,screen,visit_time,country,referrer,url,browser,os,device`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('sasanqua_token')
        },
    }).then(res => res.json()).then(res => {
        if (res.code == 200) {
            detailsData.value = res.data
        }
    })
}
</script>
<template>
    <div class="w-full max-w-5xl mx-auto" v-if="siteName && siteDomain">
        <p class="text-3xl text-gray-900 dark:text-white mb-3 font-bold">{{ siteName }}</p>
        <p class="text-xl text-gray-900 dark:text-white mb-6 opacity-70 font-mono">{{ siteDomain }}</p>
    </div>
    <div class="w-full max-w-5xl mx-auto" v-else>
        <div class="h-8 w-48 rounded skeleton"></div>
        <div class="h-5 w-48 rounded opacity-70 skeleton"></div>
    </div>
    <div class="w-full max-w-5xl mx-auto">
        <!-- cols: 2 -->
        <div class="grid sm:grid-cols-2 gap-4">
            <div class="bg-white border border-gray-200 rounded-lg px-6 py-4 dark:bg-gray-800 dark:border-gray-700">
                <p class="text-xl text-gray-900 dark:text-white mb-4 font-bold">Today</p>
                <p class="CardNumberTitle"><span class="CardNumber">{{ formatter.format(todayData.visit) || 0 }}</span>
                    Views</p>
                <p class="CardNumberTitle"><span class="CardNumber">{{ formatter.format(todayData.visitor) || 0 }}</span>
                    Visitors</p>
                <p class="CardNumberTitle" v-if="todayData.visit_time"><span class="CardNumber">{{
                    convertTime(todayData.visit_time) || 'N/A' }}</span> Avg Visit Time</p>
            </div>
            <div class="bg-white border border-gray-200 rounded-lg px-6 py-4 dark:bg-gray-800 dark:border-gray-700">
                <p class="text-xl text-gray-900 dark:text-white mb-4 font-bold">This Week</p>
                <p class="CardNumberTitle"><span class="CardNumber">{{ formatter.format(thisWeekData.visit) || 0 }}</span>
                    Views</p>
                <p class="CardNumberTitle"><span class="CardNumber">{{ formatter.format(thisWeekData.visitor) || 0 }}</span>
                    Visitors</p>
                <p class="CardNumberTitle" v-if="thisWeekData.visit_time"><span class="CardNumber">{{
                    convertTime(thisWeekData.visit_time) || 'N/A' }}</span> Avg Visit Time</p>
            </div>
        </div>
        <div class="mt-4">
            <div class="bg-white border border-gray-200 rounded-lg px-6 py-4 dark:bg-gray-800 dark:border-gray-700">
                <div class="text-xl text-gray-900 dark:text-white mb-3 font-bold flex items-center">
                    <span>Data</span>
                    <div class="ml-auto">
                        <select v-model="rangeValue" @input="changeRange" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option disabled>Range</option>
                        <option :value="1 * 24 * 60 * 60 * 1000" selected>Last 24 Hours</option>
                        <option :value="7 * 24 * 60 * 60 * 1000">Last 7 Days</option>
                        <option :value="30 * 24 * 60 * 60 * 1000">Last 30 Days</option>
                        <option :value="90 * 24 * 60 * 60 * 1000">Last 90 Days</option>
                        </select>
                    </div>
                </div>
               
                <div class="bg-white border border-gray-200 rounded-lg px-6 py-4 dark:bg-gray-800 dark:border-gray-700">
                    <p class="text-xl text-gray-900 dark:text-white mb-3 font-bold">Graphs</p>
                </div>
                <div class="grid sm:grid-cols-2 gap-4 mt-4">
                    <div class="bg-white border border-gray-200 rounded-lg px-6 py-4 dark:bg-gray-800 dark:border-gray-700">
                        <p class="text-xl text-gray-900 dark:text-white mb-3 font-bold">Pages</p>
                        <ListData :data="detailsData.url" :count="detailsData.visit" :id="id" type="url" v-if="detailsData.url"/>
                    </div>
                    <div class="bg-white border border-gray-200 rounded-lg px-6 py-4 dark:bg-gray-800 dark:border-gray-700">
                        <p class="text-xl text-gray-900 dark:text-white mb-3 font-bold">Referrers</p>
                        <ListData :data="detailsData.referrer" :count="detailsData.visit" :id="id" type="referrer" v-if="detailsData.referrer" />
                    </div>
                    <div class="bg-white border border-gray-200 rounded-lg px-6 py-4 dark:bg-gray-800 dark:border-gray-700">
                        <p class="text-xl text-gray-900 dark:text-white mb-3 font-bold">Countries</p>
                        <ListData :data="detailsData.country" :count="detailsData.visit" :id="id" type="country" v-if="detailsData.country" />
                    </div>
                    <div class="bg-white border border-gray-200 rounded-lg px-6 py-4 dark:bg-gray-800 dark:border-gray-700">
                        <p class="text-xl text-gray-900 dark:text-white mb-3 font-bold">Languages</p>
                        <ListData :data="detailsData.language" :count="detailsData.visit" :id="id" type="language" v-if="detailsData.language" />
                    </div>
                    <div class="bg-white border border-gray-200 rounded-lg px-6 py-4 dark:bg-gray-800 dark:border-gray-700">
                        <p class="text-xl text-gray-900 dark:text-white mb-3 font-bold">Browsers</p>
                        <ListData :data="detailsData.browser" :count="detailsData.visit" :id="id" type="browser" v-if="detailsData.browser" />
                    </div>
                    <div class="bg-white border border-gray-200 rounded-lg px-6 py-4 dark:bg-gray-800 dark:border-gray-700">
                        <p class="text-xl text-gray-900 dark:text-white mb-3 font-bold">OS</p>
                        <ListData :data="detailsData.os" :count="detailsData.visit" :id="id" type="os" v-if="detailsData.os" />
                    </div>
                    <div class="bg-white border border-gray-200 rounded-lg px-6 py-4 dark:bg-gray-800 dark:border-gray-700">
                        <p class="text-xl text-gray-900 dark:text-white mb-3 font-bold">Devices</p>
                        <ListData :data="detailsData.device" :count="detailsData.visit" :id="id" type="device" v-if="detailsData.device" />
                    </div>
                    <div class="bg-white border border-gray-200 rounded-lg px-6 py-4 dark:bg-gray-800 dark:border-gray-700">
                        <p class="text-xl text-gray-900 dark:text-white mb-3 font-bold">Screens</p>
                        <ListData :data="detailsData.screen" :count="detailsData.visit" :id="id" type="screen" v-if="detailsData.screen" />
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
<style>.CardNumber {
    @apply text-2xl font-bold mr-3 font-mono;
}

.CardNumberTitle {
    @apply text-gray-900 dark:text-white mb-3 font-bold flex items-center opacity-80;
}</style>