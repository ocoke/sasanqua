import requestIp from 'request-ip'
import { getIp } from '../cache/getIp'
// import geoip from 'geoip-lite'

export async function getGeoIp(req) {
    const ip = requestIp.getClientIp(req)
    const geo = await getIp(ip) || {}
    return {
        country_code: geo.country.iso_code || 'Unknown',
        country: geo.country.names.en || 'Unknown',
        city: geo.city.names.en || 'Unknown',
    }
}
