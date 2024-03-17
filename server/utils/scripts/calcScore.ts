// source: https://www.desmos.com/calculator/dufar5rf4g

const Tas = (x: number) => {
    return 1 / (1 + 0.3275911 * Math.abs(x))
}


const Erf = (x: number) => {
    let signx = Math.sign(x)
    let tasx = Tas(x)
    return signx * (1 - ((((
        1.061405429 * tasx - 1.453152027
    ) * tasx) + 1.421413741) * tasx - 0.284496736) * tasx + 0.254829592) * tasx * Math.exp(- (x * x))
}

const C = (x: number, a: number, b: number) => {
    return 1 / 2 * (1 + Erf(Math.log(x) - b / a * (Math.sqrt(2))))
}
const Cc = (x: number, a: number, b: number) => {
    return 1 - C(x, a, b)
}

const v10 = {
    mobile: {
        FCP: { weight: 0.15, median: 3000, p10: 1800 },
        LCP: { weight: 0.30, median: 4000, p10: 2500 },
        INP: { weight: 0.30, median: 500, p10: 200 },
        CLS: { weight: 0.25, median: 0.25, p10: 0.1 },
    },
    // desktop: {
    //     FCP: { weight: 0.10, median: 1600, p10: 934 },
    //     SI: { weight: 0.10, median: 2300, p10: 1311 },
    //     LCP: { weight: 0.25, median: 2400, p10: 1200 },
    //     TBT: { weight: 0.30, median: 350, p10: 150 },
    //     CLS: { weight: 0.25, median: 0.25, p10: 0.1 },
    // },
}
const calc = (p: number, m: number, x: number) => {
    let b = Math.log(m)
    let a = (
        1 / 2 *
        Math.sqrt(1 -
            3 * Math.log(p / m) -
            Math.sqrt(Math.log((p / m) - 3) ^ 2 - 8)
        )
    )
    return Cc(x, a, b)
}

export const score = ()