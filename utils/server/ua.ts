
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
        mobile: UAParserResult.device.is("mobile"),
    }
}