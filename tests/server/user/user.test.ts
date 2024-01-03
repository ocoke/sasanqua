// get server api from environment

const basePort = process.env.SASANQUA_TEST_PORT || 3000

import { describe, expect, test } from 'vitest'

const server = `http://localhost:${basePort}/api`

const now = new Date().getTime()

let token: string = ""


describe('Sasanqua: User', () => {
    test('Sign up', async () => {
        const response = await fetch(`${server}/user/signup`, {
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
    })

    test('Sign in with correct data', async () => {
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

    test('Sign in with token', async () => {
        console.log(token)
        const response = await fetch(`${server}/user/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        })
        const data = await response.json()
        expect(data.code).toEqual(200)
    })

    test('Sign in with incorrect data', async () => {
        const response = await fetch(`${server}/user/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'test',
                password: 'test2'
            })
        })
        const data = await response.json()
        expect(data.code).toEqual(400)
    })

})