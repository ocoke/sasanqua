<script setup>
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
    <div v-else-if="type == 'country'">
        <img :src="'/icons/unknown.png'" class="inline-block mr-1 mb-[0.7px] w-[16px] h-[16px]" />
    </div>
</template>