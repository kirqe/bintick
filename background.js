
// alarm every 30 sec
chrome.alarms.create('check_price', { delayInMinutes: 0.5, periodInMinutes: 0.5});

var getCryptos = () => {
  console.log("HITTING BINANCE");
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
  console.log("fetching new data using background.js#fetchNewData");
  Promise.all([getCryptos(), getBtcPrice()])
  .then((res) => { return res })
  .then((data) => { chrome.storage.local.set({'storage_cryptos': data[0], 'rates': data[1]}) })
}

// var createNotification = (symbol, direction) => {
//   chrome.notifications.create(
//     {
//       type: "basic",
//       iconUrl: "../logo.png",
//       title: `${new_items[i].MarketName} is above ${watch_items[i].notifications.above} BTC`,
//       message: `Current price is ${new_items[i].Last} BTC`
//     })
// }


// fetchNewData() === window;

chrome.alarms.onAlarm.addListener((alarm) => {
    fetchNewData()
    //
    // chrome.storage.local.get('cryptos', (data) => {
    //   var watch_items = _.filter(data.portfolio, (item) => {
    //     return item.notify == true
    //   })
    //   console.log("watch_items");
    //   console.log(watch_items);

      chrome.storage.local.get(['storage_cryptos', 'portfolio'], data => {
        var res = []
        var watch_items = _.filter(data.portfolio, (item) => {
            return item.notify == true
          })
        var watch_markets = _.map(_.filter(data.portfolio, (p) => { return p.notify == true }), (x) => {return x.id})
        // _.map(watch_items, (item) => {
        //   return item.MarketName
        // })

        console.log(watch_markets);

        var new_items = _.filter(data.cryptos, (new_item) => {
          return _.contains(watch_markets, new_item.symbol)
        })

        for(var i = 0; i < watch_items.length; i++) {
          console.log("inside loop");
          if (watch_items[i].notify_above == 'undefined') {
            return
          } else if (new_items[i].lastPrice > watch_items[i].notify_above) {
            console.log("abote to send msg");
            chrome.notifications.create(
              {
                type: "basic",
                iconUrl: "../logo.png",
                title: `${new_items[i].symbol} is above ${watch_items[i].notify_above} BTC`,
                message: `Current price is ${new_items[i].lastPrice} BTC`
              })


            var xq = _.map(data.portfolio, (x) => {
              if (x === watch_items[i]) {
                x = Object.assign(x, {notify: false})
              }
              return x
            })
            chrome.storage.local.set({'portfolio': xq})

            console.log(xq);

          }

          if (watch_items[i].notify_below == 'undefined') {
            return
          } else if (new_items[i].lastPrice < watch_items[i].notify_below) {
            chrome.runtime.sendMessage(
              {
                title: `${new_items[i].symbol} is below ${watch_items[i].notify_below} BTC`,
                message: `Current price is ${new_items[i].lastPrice} BTC`
              }, (response) => { console.log(response)})
          }
        }
      })

    // });
});


chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    console.log("wuttttt");

    var opt = {
      type: "basic",
      iconUrl: "../logo.png",
      title: `${message.title}`,
      message: `${message.message}`
    }

    chrome.notifications.create(opt);

  }
);

chrome.runtime.onInstalled.addListener(function(details){
  getCryptos()
});
