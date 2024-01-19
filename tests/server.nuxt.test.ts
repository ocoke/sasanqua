import { describe, expect, test } from 'vitest'

import { setup, fetch, $fetch, url } from '@nuxt/test-utils/e2e'


describe('Sasanqua: User', async () => {
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

})

describe('Sasanqua: Site', async () => {
    await setup({
        port: 3333,
    })
    let siteId: string = ""
    let token: string = ""
    const testSiteData = {
        name: "test",
        description: "test",
        domain: "test",
        features: {
            "visitTime": false,
            "speedInsights": true,
        }
    }
    test('Sign in', async () => {
        const data = await fetch(url(`/api/user/signin`), {
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
        const data = await fetch(url(`/api/site/edit`), {
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

    test('Get Website', async () => {
        const data = await fetch(url(`/api/site/get`), {
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
        expect(data.data.site).toBeTypeOf('object')
        expect(data.data.site.name).toEqual(testSiteData.name)
        expect(data.data.site.description).toEqual(testSiteData.description)
        expect(data.data.site.domain).toEqual(testSiteData.domain)
        expect(data.data.site.features.speedInsights).toEqual(testSiteData.features.speedInsights)
        expect(data.data.site.features.visitTime).toEqual(testSiteData.features.visitTime)
    })

    test('Get Website List', async () => {
        const data = await fetch(url(`/api/site/list`), {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        })
        expect(data.code).toEqual(200)
        expect(data.data).toBeTypeOf('object')
    })
})