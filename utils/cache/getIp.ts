import maxmind, { CityResponse } from 'maxmind'
const lookup = await maxmind.open<CityResponse>('../../src/geoip/GeoLite2-City.mmdb')
export const getIp = cachedFunction(async (ip: string) => {
    return lookup.get(ip)
}, {
    // cached 7 days
    maxAge: 60 * 60 * 24 * 7,
    name: 'cachedIp',
    getKey: (ip: string) => ip
})