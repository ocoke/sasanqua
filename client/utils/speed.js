import { onCLS, onFCP, onFID, onLCP, onTTFB } from 'web-vitals'

export const reportWebVitals = (onPerfEntry) => {
    if (onPerfEntry && onPerfEntry instanceof Function) {
        onTTFB(onPerfEntry)
        onFCP(onPerfEntry)
        onLCP(onPerfEntry)
        onCLS(onPerfEntry)
        onFID(onPerfEntry)
    }
}