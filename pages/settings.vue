<script setup lang="ts">
const settings = ref({})
const router = useRouter()
const route = useRoute()

setTimeout(() => {
    fetch('/api/dash/settings', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('sasanqua_token')
        },
    }).then(res => res.json()).then(res => res.data).then(res => {
        settings.value = res || {}
    }).catch(err => {
        console.log(err)
    })
}, 100)

const submit = async () => {
    const res = await fetch('/api/dash/settings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('sasanqua_token')
        },
        body: JSON.stringify({
            data: settings.value,
        })
    }).then(res => res.json()).catch(err => {
        console.log(err)
    })
    if (res.code == 200) {
        router.push('/dashboard')
    } else {
        alert(res.error)
    }
}
</script>
<template>
    <div class="w-full max-w-3xl mx-auto">
        <p class="text-3xl text-gray-900 dark:text-white mb-6 font-bold">Settings</p>
    </div>
    <div class="w-full max-w-3xl mx-auto">
        <div class="flex mb-6 items-center p-4 border border-gray-200 rounded dark:border-gray-700">
            <div class="flex items-center h-5">
                <input aria-describedby="helper-checkbox-text" type="checkbox" v-model="settings.enableSignup" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
            </div>
            <div class="ms-3 text-sm">
                <label for="helper-checkbox" class="font-medium text-gray-900 dark:text-gray-300">Enable Signing up</label>
                <p class="text-xs font-normal text-gray-500 dark:text-gray-300">Enable sign-up for this site.</p>
            </div>
        </div>


        <div class="flex">
            <button @click="submit" class="float-right ml-auto w-full px-4 py-2 text-base font-medium text-center text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Save</button>
        </div>
    </div>
</template>