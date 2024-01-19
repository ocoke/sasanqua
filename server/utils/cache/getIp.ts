// import { CityResponse, Reader } from 'maxmind'
export const getIp = cachedFunction(async (ip: string) => {
    // const db = await useStorage('assets:server').getItem('GeoLite2-City.mmdb')
    // const lookup = new Reader<CityResponse>(db);
    // const geo = lookup.get(ip)
    // return {
    //     country_code: geo.country.iso_code || 'Unknown',
    //     country: geo.country.names.en || 'Unknown',
    //     city: geo.city.names.en || 'Unknown',
    // }

    // if (ip == "::1" || ip == "127.0.0.1" || !ip || ip == "localhost" || ip == "::ffff:127.0.0.1") {
    //     return {
    //         country_code: 'Unknown',
    //         country: 'Unknown',
    //         city: 'Unknown',
    //     }
    // }

    if (!ip) {
        return {
            country_code: 'Unknown',
            country: 'Unknown',
            city: 'Unknown',
        }
    }

    try {
        const geo = await $fetch("https://ipapi.co/" + ip + "/json")
        if (geo.reserved) {
            return {
                country_code: 'Reserved',
                country: 'Reserved',
                city: 'Reserved',
            }
        }
        return {
            city: geo.city || 'Unknown',
            country: geo.country_name || 'Unknown',
            country_code: geo.country_code || 'Unknown',
        }
    } catch(e) {
        console.warn(e)
        return {
            country_code: 'Unknown',
            country: 'Unknown',
            city: 'Unknown',
        }
    }

}, {
    maxAge: 1 * 60,
    name: 'cachedIp',
    getKey: (ip: string) => ip
})