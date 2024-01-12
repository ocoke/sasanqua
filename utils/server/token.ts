import jwt from 'jsonwebtoken'
import { getTokenStatus } from '../cache/getTokenStatus'

interface userJWT {
    exp: number,
    iat: number,
    data: {
        username: string,
        password: string
    },
}

interface userData {
    username: string,
    password: string,
}

export async function checkUserToken(token: string) {
    try {
        // const storage = useStorage('sasanqua')

        // const decoded: userJWT = jwt.verify(token, useRuntimeConfig().sasanquaSecret || '_sasanqua_')

        // // check expiration time

        // if (decoded.exp < Math.floor(Date.now() / 1000)) {
        //     return false
        // }

        // if (!decoded.data) {
        //     return false
        // }

        // if (!decoded.data.username || !decoded.data.password) {
        //     return false
        // }

        // const userData: userData = await storage.getItem("user:" + decoded.data.username)

        // if (!userData) {
        //     return false
        // }

        // if (userData.password == decoded.data.password) {
        //     return true
        // } else {
        //     return false
        // }

        // check 

        return getTokenStatus(token).catch(e => {
            return false
        })
    } catch(e) {
        return false
    }
}
