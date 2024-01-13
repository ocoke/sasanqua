export const getData = () => {
    const hostname = location.hostname || ''
    const language = navigator.language || ''
    const referrer = document.referrer || ''
    const screen = [window.screen.availWidth || window.innerWidth, window.screen.availHeight || window.innerHeight]
    const title = document.title
    const url = location.pathname
    const query = location.search
    return {
        hostname,
        language,
        referrer,
        screen,
        title,
        url,
        query,
    }
}