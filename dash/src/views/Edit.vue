<script setup lang="ts">
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'

const name = ref('')
const domain = ref('')
const enablePerformance = ref(false)
const enableVisitingTime = ref(false)

const router = useRouter()
const route = useRoute()

const id = route.query.id

setTimeout(() => {
    if (id) {
        fetch('/api/site/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('sasanqua_token')
            },
            body: JSON.stringify({
                id
            })
        }).then(res => res.json()).then(res => res.data.site).then(res => {
            name.value = res.name
            domain.value = res.domain
            enablePerformance.value = res.features.speedInsights
            enableVisitingTime.value = res.features.visitTime
        }).catch(err => {
            console.log(err)
        })
    }
}, 100)

const submit = async () => {
    const res = await fetch('/api/site/edit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('sasanqua_token')
        },
        body: JSON.stringify({
            data: {
                name: name.value,
                domain: domain.value,
                features: {
                    speedInsights: enablePerformance.value,
                    visitTime: enableVisitingTime.value
                },
            },
            id: id ? id : null,
        })
    }).then(res => res.json())
    if (res.code == 200) {
        router.push('/websites/' + res.data.id)
    } else {
        alert(res.error)
    }
}
</script>
<template>
    <div class="w-full max-w-xl mx-auto">
        <p class="text-3xl text-gray-900 dark:text-white mb-6 font-bold"><span v-if="id">Edit</span><span v-else>Add</span> Website</p>
    </div>
    <div class="w-full max-w-xl mx-auto">
        <div class="mb-6">
            <label for="default-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
            <input type="text" v-model="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        </div>
        <div class="mb-6">
            <label for="default-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Domain</label>
            <input type="text" v-model="domain" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        </div>
        
        
        <div class="flex mb-6 items-center p-4 border border-gray-200 rounded dark:border-gray-700">
            <div class="flex items-center h-5">
                <input aria-describedby="helper-checkbox-text" type="checkbox" v-model="enablePerformance" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
            </div>
            <div class="ms-3 text-sm">
                <label for="helper-checkbox" class="font-medium text-gray-900 dark:text-gray-300">Enable Collecting Performance Metrics</label>
                <p class="text-xs font-normal text-gray-500 dark:text-gray-300">Collecting performance metrics may increase the usage of the database.</p>
            </div>
        </div>


        <div class="flex mb-6 items-center p-4 border border-gray-200 rounded dark:border-gray-700">
            <div class="flex items-center h-5">
                <input aria-describedby="helper-checkbox-text" type="checkbox" v-model="enableVisitingTime" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
            </div>
            <div class="ms-3 text-sm">
                <label for="helper-checkbox" class="font-medium text-gray-900 dark:text-gray-300">Enable Collecting Visiting Time</label>
                <p class="text-xs font-normal text-gray-500 dark:text-gray-300">Collecting visiting time may increase the usage of the database.</p>
            </div>
        </div>

        <div class="flex">
            <button @click="submit" class="float-right ml-auto w-full px-4 py-2 text-base font-medium text-center text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Save</button>
        </div>
    </div>
</template>