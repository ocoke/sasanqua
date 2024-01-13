<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const id = route.params.id

const siteName = ref('')
const siteDomain = ref('')
const siteDescription = ref('')
const rangeValue = ref(1 * 24 * 60 * 60 * 1000)

const timestamp = new Date().getTime()
const fromToday = timestamp - 86400000


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
    chart: object,
}

const detailsData = ref(<DetailsData>{})

const getDataQueryParams = () => {
    const query = route.query
    return encodeURIComponent(JSON.stringify(query))
}

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
    fetch(`/api/data/results?id=${id}&from=${fromToday}&to=${timestamp}&query=visit,visitor,data,language,screen,visit_time,country,referrer,url,browser,os,device,chart&filter=${getDataQueryParams()}`, {
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
    fetch(`/api/data/results?id=${id}&from=${fromVal}&to=${timestamp}&query=visit,visitor,data,language,screen,visit_time,country,referrer,url,browser,os,device,chart&filter=${getDataQueryParams()}`, {
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
        <p class="text-3xl text-gray-900 dark:text-white mb-3 font-bold flex items-center"><span>{{ siteName }}</span></p>
        <p class="text-xl text-gray-900 dark:text-white mb-6 opacity-70 font-mono">{{ siteDomain }}</p>
    </div>
    <div class="w-full max-w-5xl mx-auto" v-else>
        <div class="h-8 w-48 rounded skeleton"></div>
        <div class="h-5 w-48 rounded opacity-70 skeleton"></div>
    </div>
    <div class="w-full max-w-5xl mx-auto">
        <!-- cols: 1 -->
        <div class="mt-4">
            <div class="sasanqua-item-card">
                <div class="text-xl text-gray-900 dark:text-white font-bold flex items-center">
                    <span>Data</span>
                    <div class="ml-auto">
                        <select v-model="rangeValue" @input="changeRange"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option disabled>Range</option>
                            <option :value="1 * 24 * 60 * 60 * 1000" selected>Last 24 Hours</option>
                            <option :value="7 * 24 * 60 * 60 * 1000">Last 7 Days</option>
                            <option :value="30 * 24 * 60 * 60 * 1000">Last 30 Days</option>
                            <option :value="90 * 24 * 60 * 60 * 1000">Last 90 Days</option>
                            <option :value="365 * 24 * 60 * 60 * 1000">Last Year</option>
                        </select>
                    </div>
                </div>



            </div>



            <div class="grid gap-4 mt-4 max-w-full w-full overflow-hidden">
                <div class="sasanqua-item-card">
                    <p class="text-xl text-gray-900 dark:text-white mb-3 font-bold">Charts</p>
                    <BarGraphs :data="detailsData.chart" :id="id" />
                </div>

                <div class="sasanqua-item-card">
                    <p class="text-xl text-gray-900 dark:text-white mb-3 font-bold">Pages</p>
                    <ListData :data="detailsData.url" :count="detailsData.visit" :id="id" type="url"
                        v-if="detailsData.url" />
                </div>
                <div class="sasanqua-item-card">
                    <p class="text-xl text-gray-900 dark:text-white mb-3 font-bold">Referrers</p>
                    <ListData :data="detailsData.referrer" :count="detailsData.visit" :id="id" type="referrer"
                        v-if="detailsData.referrer" />
                </div>
                <div class="sasanqua-item-card">
                    <p class="text-xl text-gray-900 dark:text-white mb-3 font-bold">Countries</p>
                    <ListData :data="detailsData.country" :count="detailsData.visit" :id="id" type="country"
                        v-if="detailsData.country" />
                </div>
                <div class="sasanqua-item-card">
                    <p class="text-xl text-gray-900 dark:text-white mb-3 font-bold">Languages</p>
                    <ListData :data="detailsData.language" :count="detailsData.visit" :id="id" type="language"
                        v-if="detailsData.language" />
                </div>
                <div class="sasanqua-item-card">
                    <p class="text-xl text-gray-900 dark:text-white mb-3 font-bold">Browsers</p>
                    <ListData :data="detailsData.browser" :count="detailsData.visit" :id="id" type="browser"
                        v-if="detailsData.browser" />
                </div>
                <div class="sasanqua-item-card">
                    <p class="text-xl text-gray-900 dark:text-white mb-3 font-bold">OS</p>
                    <ListData :data="detailsData.os" :count="detailsData.visit" :id="id" type="os" v-if="detailsData.os" />
                </div>
                <div class="sasanqua-item-card">
                    <p class="text-xl text-gray-900 dark:text-white mb-3 font-bold">Devices</p>
                    <ListData :data="detailsData.device" :count="detailsData.visit" :id="id" type="device"
                        v-if="detailsData.device" />
                </div>
                <div class="sasanqua-item-card">
                    <p class="text-xl text-gray-900 dark:text-white mb-3 font-bold">Screens</p>
                    <ListData :data="detailsData.screen" :count="detailsData.visit" :id="id" type="screen"
                        v-if="detailsData.screen" />
                </div>
            </div>
        </div>

    </div>
</template>
<style>
.CardNumber {
    @apply text-2xl font-bold mr-3 font-mono;
}

.CardNumberTitle {
    @apply text-gray-900 dark:text-white mb-3 font-bold flex items-center opacity-80;
}

.sasanqua-item-card {
    @apply bg-white border border-gray-200 rounded-lg px-6 py-4 dark:bg-gray-800 dark:border-gray-700 max-w-full overflow-hidden;
}</style>