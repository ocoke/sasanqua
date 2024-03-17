import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals'

export const reportWebVitals = (onPerfEntry) => {
    if (onPerfEntry && onPerfEntry instanceof Function) {
        onTTFB(onPerfEntry)
        onFCP(onPerfEntry)
        onLCP(onPerfEntry)
        onCLS(onPerfEntry)
        onINP(onPerfEntry)
    }
}