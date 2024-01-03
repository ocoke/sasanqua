
export function UAParse(UAParserResult) {
    return {
        browser: {
            name: UAParserResult.browser.name,
            version: UAParserResult.browser.major,
        },
        os: {
            name: UAParserResult.os.name,
            version: UAParserResult.os.version,
        },
        device: UAParserResult.device.type || 'Device',
    }
}