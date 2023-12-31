<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { ref } from 'vue'
import md5 from 'blueimp-md5'
const username = ref('')
const password = ref('')
const reTypePassword = ref('')
const errorMessage = ref('')
const router = useRouter()
const submit = async () => {
    if (password.value != reTypePassword.value) {
        errorMessage.value = 'password does not match'
        return
    }
    const hashPassword = md5(password.value + 'SASANQUA')
    const res = await fetch('/api/user/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username.value,
            password: hashPassword
        })
    }).then(res => res.json())
    if (res.code == 200) {
        // sign in successfully
        localStorage.setItem('sasanqua_token', res.data)
        await router.push('/dashboard')
    } else {
        errorMessage.value = res.error
    }
}
</script>
<template>
    <main class="bg-gray-50 dark:bg-gray-900 h-screen">
      <div class="flex flex-col items-center justify-center px-6 pt-8 mx-auto h-screen pt:mt-0 dark:bg-gray-900">
        <!-- Card -->
        <div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 w-full max-w-xl" role="alert" v-if="errorMessage">
            <span class="font-medium">Error:</span> {{ errorMessage }}
        </div>
        <div class="w-full max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow dark:bg-gray-800">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                Sign up for <b>Sasanqua</b> 
            </h2>
            <form class="mt-8 space-y-6" @submit.prevent="submit">
                <div>
                    <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                    <input type="string" autocomplete="off" v-model="username" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required>
                </div>
                <div>
                    <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                    <input type="password" v-model="password" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required>
                </div>
                <div>
                    <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Retype Your Password</label>
                    <input type="password" v-model="reTypePassword" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required>
                </div>
                <div class="flex items-center">
                
                    <!--<div class="flex items-center h-5">
                        <input id="remember" aria-describedby="remember" name="remember" type="checkbox" class="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600" required>
                    </div>
                    <div class="ml-3 text-sm">
                        <label for="remember" class="font-medium text-gray-900 dark:text-white">Remember me</label>
                    </div>-->
                    <router-link to="/signin" class="text-sm text-primary-700 hover:underline dark:text-primary-500">Already have an account? Sign in.</router-link>
                    <button type="submit" class="ml-auto w-full px-4 float-right py-2 text-base font-medium text-center text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign up</button>
                </div>
                
                
            </form>
        </div>
    </div>
    
    </main>
    
    </template>