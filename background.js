chrome.alarms.create('check_price', { delayInMinutes: 1, periodInMinutes: 1});

var getCryptos = () => {
  return axios.get("https://api.binance.com/api/v1/ticker/24hr").then((res) => {
    return _.sortBy(res.data, (item) => { return item.symbol })
  })
}

var getBtcPrice = () => {
  return axios.get("https://blockchain.info/ticker").then((res) => {
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
    chrome.storage.local.set({'storage_cryptos': data[0], 'rates': data[1], 'crypto_rates': crypto_rates }) })
}

var init = () => {
  Promise.all([
    getCryptos(),
    getBtcPrice()]).then((data) => {
      return data;
    }).then(data => {
      var cryptos = []
      var crypto_rates = {
        ethbtc: _.find(data[0], { symbol: "ETHBTC" }),
        usdtbtc: _.find(data[0], { symbol: "BTCUSDT" }),
        bnbbtc: _.find(data[0], { symbol: "BNBBTC" }),
      }
      chrome.storage.local.set({
        'currencyOpts': _.keys(data.rates),
        'storage_cryptos': data[0],
        'rates': data[1],
        'crypto_rates': crypto_rates,
        'timestamp': (new Date).getTime()
      });
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

var createNotification = (item, direction, value, curr, fvalue) => {
  chrome.notifications.create(
    {
      type: "basic",
      iconUrl: "../logo.png",
      title: `${item.symbol} is ${direction} ${value}`,
      message: `Current price is: ${curr} ${fvalue}`
    })
}

chrome.alarms.onAlarm.addListener((alarm) => {
    fetchNewData()
      chrome.storage.local.get(['storage_cryptos', 'portfolio', 'crypto_rates', 'rates', 'currency'], data => {
        var fvalue = 0
        var watch_items = _.filter(data.portfolio, (item) => {
              return item.notify == true
            })
        var watch_markets = _.map(_.filter(data.portfolio, (p) => {
              return p.notify == true
            }), (x) => { return x.id })
        var new_items = _.filter(data.storage_cryptos, (new_item) => {
          return _.contains(watch_markets, new_item.symbol)
        })

        for(var i = 0; i < watch_items.length; i++) {
          if (watch_items[i].notify_above == 'undefined') {
            return
          } else if (new_items[i].lastPrice > watch_items[i].notify_above) {
            fvalue = calcPrice(new_items[i], data)
            createNotification(new_items[i], "above",
              watch_items[i].notify_above, data.rates[data.currency]["symbol"], fvalue)
          }

          if (watch_items[i].notify_below == 'undefined') {
            return
          } else if (new_items[i].lastPrice < watch_items[i].notify_below) {
            fvalue = calcPrice(new_items[i], data)
            createNotification(new_items[i], "below",
              watch_items[i].notify_below, data.rates[data.currency]["symbol"], fvalue)
          }
        }
      })

});
