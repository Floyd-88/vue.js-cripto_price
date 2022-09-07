const API_KEY = "de17c513b59215152bd4fc1a150ae8a440f98184a93654bcbf936560fcec4d0a"

let tickersHandler = new Map()

let loadTicker = () => {
    if (tickersHandler.size === 0) {
        return
    }
    fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[...tickersHandler.keys()].join(',')}&tsyms=USD&api_key=${API_KEY}`)
        .then(param => param.json())
        .then(param2 => {
            let updatePrices = Object.fromEntries(Object.entries(param2).map(([key, value]) => [key, value.USD]));

            Object.entries(updatePrices).forEach(([key, value]) => {
                let n = tickersHandler.get(key) ?? [];
                n.forEach(fn => fn(value))
            })
            },
        )
}

export let subscribeToTicker = (ticker, cb) => {
    let subscribers = tickersHandler.get(ticker) || [];
    tickersHandler.set(ticker, [...subscribers, cb])
}
export let unsubscribeToTicker = (ticker) => {
    tickersHandler.delete(ticker)
// let subscribers = tickersHandler.get(ticker) || [];
//     tickersHandler.set(ticker, subscribers.filter(i => i !== cb))
}

setInterval(loadTicker, 3000)