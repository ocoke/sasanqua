<script setup>

import "/node_modules/flag-icons/css/flag-icons.min.css";

import osCodes from '../scripts/osCodes.ts'
const { data, type } = defineProps({
    data: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    }
})

</script>
<template>
    <div v-if="type == 'url'"></div>
    <div v-else-if="type == 'referrer'">
        <img :src="'/api/dash/favicon?domain='+ data" class="inline-block mr-1 mb-[0.7px] w-[16px] h-[16px]" />
    </div>
    <div v-else-if="type == 'browser'">
        <img :src="'/icons/browsers/'+ (data.toLowerCase().replaceAll(' ', '-')) +'/16x16.png'" class="inline-block mr-1 mb-[0.7px] w-[16px] h-[16px]" onerror="this.src='/icons/unknown.png'" />
    </div>
    <div v-else-if="type == 'country_code'">
        <img :src="'/icons/unknown.png'" class="inline-block mr-1 mb-[0.7px] w-[16px] h-[16px]" v-if="data == 'Reserved' || data == 'Unknown'"/>
        <span :class="'mr-1 fi fi-' + data.toLowerCase()" v-else></span>
    </div>
    <div v-else-if="type == 'language'">
        <img :src="'/icons/unknown.png'" class="inline-block mr-1 mb-[0.7px] w-[16px] h-[16px]" v-if="data.split('-').length == 1"/>
        <span :class="'mr-1 fi fi-' + (data.split('-')[1]).toLowerCase()" v-else></span>
    </div>
    <div v-else-if="type == 'os'">
        <img :src="'/icons/unknown.png'" class="inline-block mr-1 mb-[0.7px] w-[16px] h-[16px]" v-if="!osCodes[data]"/>
        <img :src="'/icons/os/' + osCodes[data] + '.png'" class="inline-block mr-1 mb-[0.7px] w-[16px] h-[16px]" v-else/>
    </div>
</template>