const basePort = process.env.SASANQUA_TEST_PORT || 3000

import { describe, expect, test } from 'vitest'

const server = `http://localhost:${basePort}/api`

const now = new Date().getTime()

let token: string = ""
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

describe('Sasanqua: Site', () => {
    test('Sign in', async () => {
        const response = await fetch(`${server}/user/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'test',
                password: 'test'
            })
        })
        const data = await response.json()
        expect(data.code).toEqual(200)
        expect(data.data).toBeTypeOf('string')
        token = data.data
    })

    test('Add Website', async () => {
        const response = await fetch(`${server}/site/edit`, {
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
        const data = await response.json()
        expect(data.code).toEqual(200)
        expect(data.data.id).toBeTypeOf('string')
        siteId = data.data.id
    })

    test('Get Website', async () => {
        const response = await fetch(`${server}/site/get`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                id: siteId
            })
        })
        const data = await response.json()
        expect(data.code).toEqual(200)
        expect(data.data.site).toBeTypeOf('object')
        expect(data.data.site).toBe(testSiteData)
    })

    test('Get Website List', async () => {
        const response = await fetch(`${server}/site/list`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        })
        const data = await response.json()
        expect(data.code).toEqual(200)
        expect(data.data).toBeTypeOf('object')
    })
})