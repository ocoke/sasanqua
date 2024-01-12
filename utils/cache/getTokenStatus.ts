import jwt from 'jsonwebtoken'

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

export const getTokenStatus = cachedFunction(async (token: string) => {
    try {
        const storage = useStorage('sasanqua')

        const decoded: userJWT = jwt.verify(token, useRuntimeConfig().sasanquaSecret || '_sasanqua_')

        // check expiration time

        if (decoded.exp < Math.floor(Date.now() / 1000)) {
            return false
        }

        if (!decoded.data) {
            return false
        }

        if (!decoded.data.username || !decoded.data.password) {
            return false
        }

        const userData: userData = await storage.getItem("user:" + decoded.data.username)

        if (!userData) {
            return false
        }

        if (userData.password == decoded.data.password) {
            return true
        } else {
            return false
        }

        // check 
    } catch(e) {
        return false
    }
}, {
    // cache for 30 minutes
    maxAge: 30 * 60,
    name: 'cachedToken',
    getKey: (token: string) => token
})