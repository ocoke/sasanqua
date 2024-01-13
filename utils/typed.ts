
interface CollectedSiteData {
    [key: string]: {
        data: CollectData,
        geo: GeoIp,
        ua: UaData,
        sid: string,
        visitTime: number,
        date: number,
    }[],
}
interface CollectData {
    data: {
        hostname: string,
        language: string,
        referrer: string,
        screen: number[],
        title: string,
        url: string,
    },
    speed: {
        FCP: number,
        TTFB: number,
        LCP: number,
        CLS: number,
        FID: number,
        INP: number,
        score: number,
    }
}
interface GeoIp {
    country: string,
    city: string,
    country_code: string,
}

interface UaData {
    browser: {
        name: string,
        version: string,
    },
    os: {
        name: string,
        version: string,
    },
    mobile: boolean,
}


interface GeoIp {
    country: string,
    city: string,
    country_code: string,
}

interface UaData {
    browser: {
        name: string,
        version: string,
    },
    os: {
        name: string,
        version: string,
    },
    mobile: boolean,
}
interface EditSiteData {
    name: string,
    description: string,
    domain: string,
    features: {
        [key: string]: boolean,
    }
}
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

interface ListData {
    [key: string]: string,
}

