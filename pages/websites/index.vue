<script setup lang="ts">
const router = useRouter()
const first5Websites = ref([])
const fetchResults = ref({})
setTimeout(() => {
    fetch('/api/site/list', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('sasanqua_token')
        },
    }).then(res => res.json()).then(res => {
        if (res.code == 200) {
            fetchResults.value = res
            for (let i in res.data) {
                first5Websites.value.push({id: i, name: res.data[i][0], domain: res.data[i][1]})
            }
        } else {
            router.push('/signin')
        }
    })
}, 100);
</script>
<template>
    <div class="w-full max-w-3xl mx-auto flex items-center">
        <p class="text-3xl text-gray-900 dark:text-white mb-6 font-bold flex-1">{{$t('websites.websites')}}</p>
        <button type="button" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" @click="router.push('/edit')">{{ $t('websites.add') }}</button>
    </div>
    <div class="w-full mx-auto max-w-3xl bg-white border border-gray-200 rounded-lg px-6 py-1 dark:bg-gray-800 dark:border-gray-700">
    <!-- <div class="flex items-center justify-between mb-4">
        <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Websites</h5>
        <router-link to="/websites" class="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
            View all
        </router-link>
   </div> -->
   <div class="flow-root">
        <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700" v-if="fetchResults.data">
            <li class="py-3 sm:py-4" v-for="i in first5Websites">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <img class="w-8 h-8 rounded-full" :src="'/api/dash/favicon?domain=' + i.domain" alt="Site Icon">
                    </div>
                    <div class="flex-1 min-w-0 ms-4">
                        <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                            {{ i.name }}
                        </p>
                        <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                            {{ i.domain }}
                        </p>
                    </div>
                    <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        <button type="button" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" @click="router.push('/websites/' + i.id)">
                            {{$t('dashboard.viewdetails')}}
                        </button>
                    </div>
                </div>
            </li>
            
        </ul>
        <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700" v-else>
            <li class="py-3 sm:py-4" v-for="i in 3">
                <div class="flex items-center ">
                    <div class="flex-shrink-0">
                        <div class="h-8 skeleton w-8 rounded-full"></div>
                    </div>
                    <div class="flex-1 min-w-0 ms-4">
                        <div class="h-4 skeleton w-32 rounded"></div>
                        <div class="h-2 skeleton w-16 rounded" style="margin-bottom: 0;"></div>
                    </div>
                    <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        <div class="h-8 skeleton w-24 rounded-full" style="margin-bottom: 0;"></div>
                    </div>
                </div>
            </li>
        </ul>

   </div>
</div>
</template>