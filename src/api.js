const API_KEY = "de17c513b59215152bd4fc1a150ae8a440f98184a93654bcbf936560fcec4d0a"



export let loadTicker = tickers =>
    fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${tickers.join(',')}&tsyms=USD&api_key=${API_KEY}`)
        .then(param => param.json())
        .then(param2 => Object.fromEntries( Object.entries(param2).map( ([key, value]) => [key, value.USD] )))

