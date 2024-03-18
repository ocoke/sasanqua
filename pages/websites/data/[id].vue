<script setup lang="ts">
import {  getFilteredData,  } from '~/server/utils/scripts/filterResults'
import WorldMap from '~/components/WorldMap.vue'
import SpeedInsights from '~/components/SpeedInsights.vue'
const route = useRoute()
const router = useRouter()
const id = route.params.id
const filterQuery = route.query

const siteName = ref('')
const siteDomain = ref('')
const siteDescription = ref('')
const filterModal = ref(false)
const rangeValue = ref(1 * 24 * 60 * 60 * 1000)

const timestamp = new Date().getTime()
const fromToday = timestamp - 86400000

if (route.query.range) {
    try {
        rangeValue.value = parseInt(route.query.range)
        console.log(rangeValue.value)
    } catch (e) {
        rangeValue.value = 1 * 24 * 60 * 60 * 1000
    }
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
    chart: object,
}

const detailsData = ref(<DetailsData>{})
const rawData = ref(<DetailsData>{})

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
    fetch(`/api/data/results?id=${id}&from=${timestamp - rangeValue.value}&to=${timestamp}&query=data`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('sasanqua_token')
        },
    }).then(res => res.json()).then(res => {
        if (res.code == 200) {
            detailsData.value = getFilteredData(res.data, filter.value, new Date().getTime() - rangeValue.value, new Date().getTime())
            rawData.value = getFilteredData(res.data, [], new Date().getTime() - rangeValue.value, new Date().getTime())
        }
    })
}, 100)

const convertTime = (s: number) => {
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

const filter = ref([])

for (let i in filterQuery) {
    if (i == 'range') {
        continue
    }
    filter.value.push({
        type: "and",
        value: [
            {
                key: i,
                value: filterQuery[i],
                type: 'is'
            }
        ]
    })
}


const changeRange = (e) => {
    const timestamp = new Date().getTime()
    const fromVal = timestamp - e.target.value
    fetch(`/api/data/results?id=${id}&from=${fromVal}&to=${timestamp}&query=data`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('sasanqua_token')
        },
    }).then(res => res.json()).then(res => {
        if (res.code == 200) {
            detailsData.value = getFilteredData(res.data, filter.value, new Date().getTime() - rangeValue.value, new Date().getTime())
            rawData.value = getFilteredData(res.data, [], new Date().getTime() - rangeValue.value, new Date().getTime())
        }
    })
}

const toggleFilterModal = () => {
    filterModal.value = !filterModal.value
}

const getAvailableFilters = (data) => {
    let result = {}
    for (let i in data) {
        if (i == 'data' || i == 'chart') {
            continue
        }
        let resultKey = i == 'country' ? 'country_code'  : i
        const obj = data[i]
        for (let key in obj) {
            if (result[resultKey]) {
                result[resultKey].push(key)
            } else {
                result[resultKey] = [key]
            }
        }
    }
    return result
}


const uiText = {
    url: 'URL',
    referrer: 'Referrer',
    country_code: 'Country',
    language: 'Language',
    browser: 'Browser',
    os: 'OS',
    device: 'Device',
    screen: 'Screen',
}

const valAvailable = ref([])
const selectedKey = ref('')
const selectedIsNot = ref('')
const selectedValue = ref('')
const updateAvailableVal = (e) => {
    const val = e.target.value
    console.log(val)
    valAvailable.value = getAvailableFilters(detailsData.value)[val]
}

const deleteRule = (index) => {
    filter.value.splice(index, 1)
}

const addRule = (type, index) => {
    if (!type) {
        let data = filter.value[index]
        data.value.push({
            key: selectedKey.value,
            value: selectedValue.value,
            type: selectedIsNot.value == 'is' ? 'is' : 'not'
        })
    } else {
        filter.value.push({
            type,
            value: [
                {
                    key: selectedKey.value,
                    value: selectedValue.value,
                    type: selectedIsNot.value == 'is' ? 'is' : 'not'
                }
            ]
        })
    }
    selectedKey.value = selectedValue.value = selectedIsNot.value = ""

}

const updateData = () => {
    // close tab
    if (filter.value.length == 0 && selectedKey.value && selectedValue.value && selectedIsNot.value) {
        addRule('and')
    }
    toggleFilterModal()
    detailsData.value = getFilteredData(rawData.value, filter.value, new Date().getTime() - rangeValue.value, new Date().getTime())
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
                    <div class="grid gap-2">
                        <span>{{ $t('website.data')}}</span>
                        <div class="text-sm font-medium">
                            <div class="mb-2" v-for="i in filter">
                                
                                <span v-for="(item, index) in i.value" >
                                    <span v-if="index != 0">{{ i.type }}</span>
                                    <code class="bg-gray-100 dark:bg-gray-900 p-1 rounded mx-1">{{ item.key }} {{ item.type == 'is' ? '=' : '!=' }} {{ item.value }}</code>
                                </span>
                               
                            </div>
                        </div>
                    </div>
                    
                    <div class="ml-auto grid gap-2">
                        <select v-model="rangeValue" @input="changeRange"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option disabled>Range</option>
                            <option :value="1 * 24 * 60 * 60 * 1000" selected>{{ $t('website.timeRange.last24h')}}</option>
                            <option :value="7 * 24 * 60 * 60 * 1000">{{ $t('website.timeRange.last7')}}</option>
                            <option :value="30 * 24 * 60 * 60 * 1000">{{ $t('website.timeRange.last30')}}</option>
                            <option :value="90 * 24 * 60 * 60 * 1000">{{ $t('website.timeRange.last90')}}</option>
                            <option :value="365 * 24 * 60 * 60 * 1000">{{ $t('website.timeRange.lasty')}}</option>
                        </select>
                        <button type="button" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                            @click="toggleFilterModal"
                        >{{ $t('data.addFilter') }}</button>
                    </div>
                </div>
                <div class="grid grid-cols-3 gap-2 mt-8">
                    <!-- views / visitors / avg visiting time / score -->
                    <div class="CardNumberTitle"><span class="CardNumber">{{ formatter.format(detailsData.visit) || 0 }}</span>
                        {{ $t('website.views')}}</div>
                    <div class="CardNumberTitle"><span class="CardNumber">{{ formatter.format(detailsData.visitor) || 0 }}</span>
                        {{ $t('website.visitors')}}</div>
                    <div class="CardNumberTitle"><span class="CardNumber">{{
                        convertTime(detailsData.visit_time) || 'N/A' }}</span> {{ $t('website.avgtime')}}</div>
                </div>
            </div>
            <div class="sasanqua-item-card mt-4">
                <div class="text-xl text-gray-900 dark:text-white font-bold flex items-center">
                    <div class="grid gap-2">
                        <span>{{ $t('data.speedInsights')}}s</span>
                    </div>

                </div>
                <SpeedInsights :data="detailsData" />
            </div>

            

            <div class="grid gap-4 mt-4 max-w-full w-full overflow-hidden">
                <div class="sasanqua-item-card">
                    <p class="text-xl text-gray-900 dark:text-white mb-3 font-bold">{{ $t('website.charts')}}</p>
                    <BarGraphs :data="detailsData.chart" :id="id" />
                </div>

                <div class="sasanqua-item-card">
                    <p class="text-xl text-gray-900 dark:text-white mb-3 font-bold">{{ $t('website.pages')}}</p>
                    <ListData :data="detailsData.url" :count="detailsData.visit" :id="id" type="url"
                        v-if="detailsData.url" />
                </div>
                <div class="sasanqua-item-card">
                    <p class="text-xl text-gray-900 dark:text-white mb-3 font-bold">{{ $t('website.titles')}}</p>
                    <ListData :data="detailsData.title" :count="detailsData.visit" :id="id" type="title"
                        v-if="detailsData.title" />
                </div>
                <div class="sasanqua-item-card">
                    <p class="text-xl text-gray-900 dark:text-white mb-3 font-bold">{{ $t('website.queries')}}</p>
                    <ListData :data="detailsData.query" :count="detailsData.visit" :id="id" type="query"
                        v-if="detailsData.query" />
                </div>
                <div class="sasanqua-item-card">
                    <p class="text-xl text-gray-900 dark:text-white mb-3 font-bold">{{ $t('website.referrers')}}</p>
                    <ListData :data="detailsData.referrer" :count="detailsData.visit" :id="id" type="referrer"
                        v-if="detailsData.referrer" />
                </div>
                <div class="sasanqua-item-card">
                    <p class="text-xl text-gray-900 dark:text-white mb-3 font-bold">{{ $t('website.countries')}}</p>
                    <div class="lg:flex lg:min-h-[400px]">
                        <div class="lg:w-3/5">
                            <WorldMap :data="detailsData.country" :count="detailsData.visit" :id="id" :key="detailsData.country" type="country_code"
                            v-if="detailsData.country"/>
                        </div>
                        <div class="lg:w-2/5">
                            <ListData :data="detailsData.country" :count="detailsData.visit" :id="id" type="country_code"
                        v-if="detailsData.country" />
                        </div>
                        
                        
                    </div>
                </div>
                <div class="sasanqua-item-card">
                    <p class="text-xl text-gray-900 dark:text-white mb-3 font-bold">{{ $t('website.languages')}}</p>
                    <ListData :data="detailsData.language" :count="detailsData.visit" :id="id" type="language"
                        v-if="detailsData.language" />
                </div>
                <div class="sasanqua-item-card">
                    <p class="text-xl text-gray-900 dark:text-white mb-3 font-bold">{{ $t('website.browsers')}}</p>
                    <ListData :data="detailsData.browser" :count="detailsData.visit" :id="id" type="browser"
                        v-if="detailsData.browser" />
                </div>
                <div class="sasanqua-item-card">
                    <p class="text-xl text-gray-900 dark:text-white mb-3 font-bold">{{ $t('website.os')}}</p>
                    <ListData :data="detailsData.os" :count="detailsData.visit" :id="id" type="os" v-if="detailsData.os" />
                </div>
                <div class="sasanqua-item-card">
                    <p class="text-xl text-gray-900 dark:text-white mb-3 font-bold">{{ $t('website.devices')}}</p>
                    <ListData :data="detailsData.device" :count="detailsData.visit" :id="id" type="device"
                        v-if="detailsData.device" />
                </div>
                <div class="sasanqua-item-card">
                    <p class="text-xl text-gray-900 dark:text-white mb-3 font-bold">{{ $t('website.screens')}}</p>
                    <ListData :data="detailsData.screen" :count="detailsData.visit" :id="id" type="screen"
                        v-if="detailsData.screen" />
                </div>
            </div>
        </div>

    </div>


    <div v-show="filterModal" tabindex="-1" aria-hidden="true" class="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-2xl max-h-full">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <!-- Modal header -->
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                    {{$t('data.addFilter')}}
                </h3>
                <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" @click="toggleFilterModal">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
            <!-- Modal body -->
            <div class="p-4 md:p-5 space-y-4">
                <div class="bg-gray-100 py-2 rounded-lg" v-for="(item, itemIndex) in filter">
                    <div class="flex items-center mt-2" v-for="(i, index) in item.value">
                        <span v-if="index != 0">{{ item.type }}</span>
                        <select class="inline-select w-auto" @change="updateAvailableVal">
                            <option default>{{ uiText[i.key] }}</option>
                        </select>
                        <!-- select is/not -->
                        <select class="inline-select w-auto">
                            <option default>{{ i.type == 'is' ? $t('data.is') : $t('data.isNot') }}</option>
                        </select>
                        <select class="inline-select w-full">
                            <option default>{{ i.value }}</option>
                        </select>
                    </div>
                    <div class="flex items-center mt-2">
                        <select class="inline-select w-auto" @change="updateAvailableVal" v-model="selectedKey">
                            <option default></option>
                            <option v-for="(val, key) in getAvailableFilters(detailsData)" :value="key">{{ uiText[key] }}</option>
                        </select>
                        <!-- select is/not -->
                        <select class="inline-select w-auto" v-model="selectedIsNot">
                            <option default></option>
                            <option value="is">{{ $t('data.is') }}</option>
                            <option value='is not'>{{ $t('data.isNot') }}</option>
                        </select>
                        <select class="inline-select w-full" v-model="selectedValue">
                            <option default></option>
                            <option v-for="v in valAvailable">{{ v }}</option>
                        </select>
                    </div>
                    <div class="flex">
                        <span class="flex-1"></span>
                        <div>
                            <button type="button" class="filter-action ml-auto mt-2" @click="addRule(false, itemIndex)">
                                + {{ item.type.slice(0, 1).toUpperCase() + item.type.slice(1)  }}
                            </button>
                            <button type="button" class="filter-action ml-auto mt-2" @click="deleteRule(itemIndex)">
                                {{ $t('data.delete') }}
                            </button>
                        </div>
                    </div>
                </div>
                <div class="flex items-center">
                    <select class="inline-select w-auto" @change="updateAvailableVal" v-model="selectedKey">
                        <option default></option>
                        <option v-for="(val, key) in getAvailableFilters(detailsData)" :value="key">{{ uiText[key] }}</option>
                    </select>
                    <!-- select is/not -->
                    <select class="inline-select w-auto" v-model="selectedIsNot">
                        <option default></option>
                        <option value="is">{{ $t('data.is') }}</option>
                        <option value="is not">{{ $t('data.isNot') }}</option>
                    </select>
                    <select class="inline-select w-full" v-model="selectedValue">
                        <option default></option>
                        <option v-for="v in valAvailable">{{ v }}</option>
                    </select>
                </div>
                <div>
                    <!-- 2btns: and/or -->
                    <button type="button" class="filter-action" @click="addRule('and')">
                        + {{ $t('data.and') }}
                    </button>
                    <button type="button" class="filter-action" @click="addRule('or')">
                        + {{ $t('data.or') }}
                    </button>
                </div>
            </div>
            <!-- Modal footer -->
            <div class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button data-modal-hide="default-modal" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ml-auto"
                @click="updateData">{{ $t('data.save') }}</button>
            </div>
        </div>
    </div></div>
    <div v-show="filterModal" class="bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40"></div>
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