import requestIp from 'request-ip'
import geoip from 'geoip-lite'
export async function getGeoIp(req) {
    const ip = requestIp.getClientIp(req)
    const geo = geoip.lookup(ip)
    return {
        country: geo.country,
        region: geo.region,
        city: geo.city,
    }
}
