const hoursLabels = [
    '12AM', '1AM', '2AM', '3AM', '4AM', '5AM', '6AM', '7AM', '8AM', '9AM', '10AM', '11AM',
    '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM','11PM',
]
const monthsLabel = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct',
    'Nov', 'Dec',
]

export const generateLabels = (data) => {
    if (!data) {
        return []
    }
    const labels = []
    if (data.type == "hours") {
        const nowHour = new Date(data.to).getHours()
        for (let i = 0; i < 24; i++) {
            const hour = nowHour - i
            const index = hour < 0 ? hour + 24 : hour
            labels.unshift(hoursLabels[index])
        }
    } else if (data.type == "days") {
        let now = data.to
        for (let i = 0; i < data.visitors.length; i++) {
            const date = (new Date(now).getMonth() + 1) + '/' + new Date(now).getDate()
            labels.unshift(date)
            now = now - 86400000
        }
    } else if (data.type == "months") {
        let now = data.to
        for (let i = 0; i < data.visitors.length; i++) {
            const date = monthsLabel[new Date(now).getMonth()]
            labels.unshift(date)
            now = now - (data.months[new Date(now).getMonth()]) * 86400000
        }
    }
    return labels
}