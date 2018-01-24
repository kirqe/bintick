chrome.alarms.create('check_price', { delayInMinutes: 0.5, periodInMinutes: 0.5});


var fetchNewData = () => {
  console.log("fetching new data using background.js#fetchNewData");
  Promise.resolve(axios.get("https://bittrex.com/api/v1.1/public/getmarketsummaries")
  .then((res) => { return res.data.result }))
  .then((data) => { chrome.storage.local.set({'storage_cryptos': data}); })
}

// fetchNewData() === window;

chrome.alarms.onAlarm.addListener((alarm) => {
    fetchNewData()

    chrome.storage.local.get('storage_cryptos', (data) => {
      var watch_items = _.filter(data.storage_cryptos, (item) => {
        return (item.notify == true)
      })
      console.log("watch_items");
      console.log(watch_items);

      chrome.storage.local.get('storage_cryptos', data => {
        var res = []
        var watch_markets = ["BTC-1ST"]
        // _.map(watch_items, (item) => {
        //   return item.MarketName
        // })

        console.log(watch_markets);

        var new_items = _.filter(data.storage_cryptos, (new_item) => {
          return _.contains(watch_markets, new_item.MarketName)
        })

        for(var i = 0; i < watch_items.length; i++) {
          console.log("inside loop");
          if (watch_items[i].notifications.above == 'undefined') {
            return
          } else if (new_items[i].Last > watch_items[i].notifications.above) {
            console.log("abote to send msg");
            chrome.notifications.create(
              {
                type: "basic",
                iconUrl: "../logo.png",
                title: `${new_items[i].MarketName} is above ${watch_items[i].notifications.above} BTC`,
                message: `Current price is ${new_items[i].Last} BTC`
              })
          }

          if (watch_items[i].notifications.below == 'undefined') {
            return
          } else if (new_items[i].Last < watch_items[i].notifications.below) {
            chrome.runtime.sendMessage(
              {
                title: `${new_items[i].MarketName} is below ${watch_items[i].notifications.below} BTC`,
                message: `Current price is ${new_items[i].Last} BTC`
              }, (response) => { console.log(response)})
          }
        }
      })


      //
    });



});


// TODO: Fix notifications. They only work if I create a message directly
// with chrome.notifications.create(opt);
// but it should work by reacting on sendMessage

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
