import { describe, expect, test } from 'vitest'

import { setup, fetch, $fetch, url } from '@nuxt/test-utils/e2e'
import collect from '~/server/api/data/collect'


describe('Sasanqua Test', async () => {
    await setup({
        port: 3333,
        rootDir: '../',
    })


    let token: string = ""
    
    test('Sign up', async () => {
        const data = await $fetch(url(`/api/user/signup`), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'test',
                password: 'test'
            })
        })
        // const data = await response.json()
        expect(data.code).toEqual(200)
        expect(data.data).toBeTypeOf('string')
    })

    test('Sign in with correct data', async () => {
        const data = await $fetch(url(`/api/user/signin`), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'test',
                password: 'test'
            })
        })
        // const data = await response.json()
        expect(data.code).toEqual(200)
        expect(data.data).toBeTypeOf('string')
        token = data.data
        
    })

    test('Sign in with token', async () => {
        console.log(token)
        const data = await $fetch(url(`/api/user/token`), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        })
        // const data = await response.json()
        expect(data.code).toEqual(200)
    })

    test('Sign in with incorrect data', async () => {
        const data = await $fetch(url(`/api/user/signin`), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'test',
                password: 'test2'
            })
        })
        // const data = await response.json()
        expect(data.code).toEqual(400)
    })

    let siteId: string = ""
    const testSiteData = {
        name: "test",
        description: "test",
        domain: "test",
        features: {
            "visitTime": false,
            "speedInsights": true,
        }
    }

    const settings = {
        enableSignup: false
    }
    test('Sign in', async () => {
        const data = await $fetch(url(`/api/user/signin`), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'test',
                password: 'test'
            })
        })
        expect(data.code).toEqual(200)
        expect(data.data).toBeTypeOf('string')
        token = data.data
    })

    test('Add Website', async () => {
        const data = await $fetch(url(`/api/site/edit`), {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                id: null,
                data: testSiteData
            })
        })
        expect(data.code).toEqual(200)
        expect(data.data.id).toBeTypeOf('string')
        siteId = data.data.id
    })

    test('Get Website Data', async () => {
        const data = await $fetch(url(`/api/site/get`), {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                id: siteId
            })
        })
        expect(data.code).toEqual(200)
        expect(data.data.site).toStrictEqual(testSiteData)
    })

    test('Get Website List', async () => {
        const data = await $fetch(url(`/api/site/list`), {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        })
        expect(data.code).toEqual(200)
        expect(data.data).toBeTypeOf('object')
    })

    // edit website
    testSiteData.name = "test2"
    testSiteData.description = "hello world"

    test('Add Website', async () => {
        const data = await $fetch(url(`/api/site/edit`), {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                id: siteId,
                data: testSiteData
            })
        })
        expect(data.code).toEqual(200)
        expect(data.data.id).toBeTypeOf('string')
        siteId = data.data.id
    })

    test('Get Website Data', async () => {
        const data = await $fetch(url(`/api/site/get`), {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                id: siteId
            })
        })
        expect(data.code).toEqual(200)
        expect(data.data.site).toStrictEqual(testSiteData)
    })

    // Settings

    test('Edit Settings: Disable Signing up', async () => {
        const data = await $fetch(url(`/api/dash/settings`), {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                data: settings
            })
        })
        expect(data.code).toEqual(200)
    })

    test('Get Settings', async () => {
        const data = await $fetch(url(`/api/dash/settings`), {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        })
        expect(data.code).toEqual(200)
        expect(data.data).toStrictEqual(settings)
    })

    test('Sign up (Disabled)', async () => {
        const data = await $fetch(url(`/api/user/signup`), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'test2',
                password: 'test2'
            })
        })
        expect(data.code).toEqual(400)
    })


    const generateCollectData = () => {
        return {
            hostname: 'example.com',
            language: 'en-US',
            referrer: 'https://example.com',
            screen: [1920, 1080],
            title: 'Example.com',
            url: '/',
            query: '?test=' + Math.random(),
        }
    }
    test('Collect Data', async () => {
        const data = await $fetch(url(`/api/data/collect`), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: siteId,
                payload: {
                    data: generateCollectData(),
                }
            })
        })
        expect(data.code).toEqual(200)
    })
})
