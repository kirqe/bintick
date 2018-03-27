chrome.alarms.create('check_price', { delayInMinutes: 1, periodInMinutes: 1});

const binance_api = "https://api.binance.com/api/v1/ticker/24hr"
const blockchain_api = "https://blockchain.info/ticker"

var getCryptos = () => {
  return axios.get(binance_api).then((res) => {
    return res.data
  })
}

var getBtcPrice = () => {
  return axios.get(blockchain_api).then((res) => {
    return res.data
  })
}

var fetchNewData = () => {
  Promise.all([getCryptos(), getBtcPrice()])
  .then((res) => { return res })
  .then((data) => {
    var crypto_rates = {
      ethbtc: _.find(data[0], { symbol: "ETHBTC" }),
      usdtbtc: _.find(data[0], { symbol: "BTCUSDT" }),
      bnbbtc: _.find(data[0], { symbol: "BNBBTC" }),
    }

  var new_cryptos = data[0]
  var new_rates = data[1]

  chrome.storage.local.get(['storage_cryptos'], (data) => {
    var cryptosToSave = _.map(_.groupBy(_.union(data.storage_cryptos, new_cryptos), "symbol"), (item) => {
      return _.extendOwn(item[0], item[1])
    })
    chrome.storage.local.set({'storage_cryptos': cryptosToSave, 'rates': new_rates, 'crypto_rates': crypto_rates }) })
  })
}

var calcPrice = (crypto, data) => {
  var fvalue = 0

  if (crypto.symbol.endsWith("BTC")) {
    fvalue =
      crypto.lastPrice * data.rates[data.currency]["last"]
  }
  if (crypto.symbol.endsWith("ETH")) {
    fvalue =
      crypto.lastPrice *
      data.crypto_rates.ethbtc.lastPrice *
      data.rates[data.currency]["last"]
  }
  if (crypto.symbol.endsWith("USDT")) {
    fvalue = (crypto.lastPrice / data.crypto_rates.usdtbtc.lastPrice) *
      data.rates[data.currency]["last"]
  }
  if (crypto.symbol.endsWith("BNB")) {
      fvalue = crypto.lastPrice *
              data.crypto_rates.bnbbtc.lastPrice *
              data.rates[data.currency]["last"]
  }

  return fvalue.toFixed(4)
}

var createNotification = (item, direction, curr, fvalue) => {
  var value = ""
  if (direction == "above") {
    value = item.portfolio.notify_above
  } else {
    value = item.portfolio.notify_below
  }
  chrome.notifications.create(
    {
      type: "basic",
      iconUrl: "../logo.png",
      title: `${item.symbol} is ${direction} ${value}`,
      message: `Current price is: ${curr} ${fvalue}`
    })
}

var checkWatchItems = () => {
  chrome.storage.local.get(['storage_cryptos', 'crypto_rates', 'rates', 'currency'], data => {
    var fvalue = 0
    const storage_cryptos = data.storage_cryptos
    const watch_items = _.filter(storage_cryptos, (item) => {
      if (item.portfolio && item.portfolio.notify) {
        return item
      }
    })
    // console.log(watch_items);

    for(var i = 0; i < watch_items.length; i++) {
      if (typeof watch_items[i].portfolio.notify_above === 'undefined') {
        return
      } else if (watch_items[i].lastPrice > watch_items[i].portfolio.notify_above) {
        fvalue = calcPrice(watch_items[i], data)
        createNotification(watch_items[i], "above", data.rates[data.currency]["symbol"], fvalue)
      }

      if (typeof watch_items[i].portfolio.notify_below === 'undefined') {
        return
      } else if (watch_items[i].lastPrice < watch_items[i].portfolio.notify_below) {
        fvalue = calcPrice(watch_items[i], data)
        createNotification(watch_items[i], "below", data.rates[data.currency]["symbol"], fvalue)
      }
    }
  })
}

chrome.alarms.onAlarm.addListener((alarm) => {
  fetchNewData()
  checkWatchItems()
});
