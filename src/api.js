const API_KEY = "de17c513b59215152bd4fc1a150ae8a440f98184a93654bcbf936560fcec4d0a"

let tickersHandler = new Map()
let socket = new WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`)
const AGREGATE_INDEX = '5'

socket.addEventListener('message', e => {
        let {TYPE: type, FROMSYMBOL: ticker, PRICE: newPrice} = JSON.parse(e.data);
        if (type !== AGREGATE_INDEX || newPrice === undefined) {
            return
        }

        let handler = tickersHandler.get(ticker) || []
        handler.forEach(fn => fn(newPrice))
    }
)

// let loadTicker = () => {
//     if (tickersHandler.size === 0) {
//         return
//     }
//     fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[...tickersHandler.keys()].join(',')}&tsyms=USD&api_key=${API_KEY}`)
//         .then(param => param.json())
//         .then(param2 => {
//             let updatePrices = Object.fromEntries(Object.entries(param2).map(([key, value]) => [key, value.USD]));
//
//             Object.entries(updatePrices).forEach(([key, value]) => {
//                 let n = tickersHandler.get(key) ?? [];
//                 n.forEach(fn => fn(value))
//             })
//             },
//         )
// }
function sendToWebSocket(message) {
    let stringifyMessage = JSON.stringify(message)
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(stringifyMessage);
        return;
    } else {
        socket.addEventListener("open", () => {
            socket.send(stringifyMessage)
        }, {once: true})
    }
}

function subscribeTickerWS(ticker) {
    sendToWebSocket(
        {
            "action": "SubAdd",
            "subs": [`5~CCCAGG~${ticker}~USD`]
        }
    )
}

function unsubscribeTickerWS(ticker) {
    sendToWebSocket(JSON.stringify({
            "action": "SubRemove",
            "subs": [`5~CCCAGG~${ticker}~USD`]
        })
    )
}

export let subscribeToTicker = (ticker, cb) => {
    let subscribers = tickersHandler.get(ticker) || [];
    tickersHandler.set(ticker, [...subscribers, cb])
    subscribeTickerWS(ticker)
}
export let unsubscribeToTicker = (ticker) => {
    tickersHandler.delete(ticker)
    unsubscribeTickerWS(ticker)
// let subscribers = tickersHandler.get(ticker) || [];
//     tickersHandler.set(ticker, subscribers.filter(i => i !== cb))
}

// setInterval(loadTicker, 3000)