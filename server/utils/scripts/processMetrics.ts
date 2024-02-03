export const processMetrics = (data: SpeedType) => {
    for (let key in data) {
        let val = data[key]
        try {
            if (val == null) continue;
            data[key] = Number(val) <= 100000 ? Number(val) : null
        } catch(e) {
            console.warn(e)
            return false
        }
    }
    return data
}