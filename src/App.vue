<template>
  <div id="app">
    <div class="header-panel">
      <div class="is-pulled-left">
        <div class="control">
          <input v-model="searchTerm" class="input is-small" type="text" placeholder="Search...">
        </div>
      </div>

      <div class="is-pulled-right mlr3">
        <div class="control">
          <!-- <a href="./about.html">i</a> -->
          <a @click="panel = !panel"  class="button is-small">?</a>
        </div>
      </div>
      {{currency}}
      <div class="is-pulled-right mlr3">
        <div class="control">
          <div class="select is-small">
            <select v-model="currency">
              <option v-for="opt in currencyOpts">{{opt}}</option>
            </select>
          </div>
        </div>
      </div>


      <div class="is-clearfix"></div>
    </div>
    <div class="portfolio">
      <span class="tag is-info mlr3">Portfolio Value: {{totalValue}}</span>
    </div>
    <panel @close="panel = false" v-if="panel"></panel>
    <list-items v-if="!panel" :cryptos="filteredCryptos" :loaded="loaded" :currency="currency" :rates="rates"></list-items>

  </div>
</template>

<script>
import axios from 'axios'
import _ from 'underscore'
import ListItems from './ListItems.vue'
import Panel from './Panel.vue'

export default {
  name: 'app',
  components: {
    ListItems,
    Panel
  },
  data () {
    return {
      cryptos: [],
      portfolio: [],
      rates: [],
      searchTerm: '',
      currency: "USD",
      currencyOpts: ['USD', 'EUR', 'CNY', 'GBP', 'RUB'],
      loaded: false,
      panel: false
    }
  },
  beforeMount () {
    // prents user from hitting api too often
    chrome.storage.local.get('timestamp', (data) => {
      if (data.timestamp == null) {
        this.fetchOrUpdate()
      } else {
        var range = (new Date).getTime() - data.timestamp
        if (range >= 10000) {
          this.fetchOrUpdate()
        } else {
          chrome.storage.local.get(['storage_cryptos', 'rates'], (data) => {
            this.rates = data.rates
            this.currencyOpts = Object.keys(data.rates)
            this.cryptos = data.storage_cryptos
            this.loaded = true
          })
        }
      }
    })
  },
  mounted () {
    // if the extension window stays open we are just listerning
    // for alarms from background.js and fetching updated data from local storage
    chrome.alarms.onAlarm.addListener(() => {
      chrome.storage.local.get(['storage_cryptos', 'rates', 'portfolio'], (data) => {
        this.rates = data.rates
        this.currencyOpts = Object.keys(data.rates)
        this.cryptos = data.storage_cryptos
        this.portfolio = data.portfolio
        this.loaded = true
      })
    })
  },
  methods: {
    fetchOrUpdate () {
      if (navigator.onLine) {
        console.log("INSIDE FETCH");
        Promise.all([
          this.getCryptos(),
          this.getBtcPrice()]).then(data => {
          console.log(data);
          return data;

        }).then(data => {
          var cryptos = []
          this.loaded = false;

          // this.currencyVal = data[1] // fetched cryptos

          this.cryptos = data[0];
          this.rates = data[1];
          this.currencyOpts = Object.keys(data[1])
          console.log("SETTING STORAGE_CRYPTOS AND TIMESTAMP");
          chrome.storage.local.set({ 'storage_cryptos': data[0], 'rates': data[1], 'timestamp': (new Date).getTime() });
          this.loaded = true;

        })
      } else {
        chrome.storage.local.get(['storage_cryptos', 'rates'], (data) => {
          this.rates = data.rates
          this.currencyOpts = Object.keys(data.rates)
          this.cryptos = data.storage_cryptos
          this.loaded = true
        })
      }


    },
    fetchNew () {

    },
    getCryptos () {
      console.log("HITTING BINANCE");
      return axios.get("https://api.binance.com/api/v1/ticker/24hr").then((res) => {
        return _.sortBy(res.data, (item) => { return item.symbol })
      })
    },
    getBtcPrice () {
      return axios.get("https://blockchain.info/ticker").then((res) => {
        return res.data
      })
    },
    updatedCurrencyVal (currency) {
      // this.getBtcPriceIn(currency).then(data => {
        this.currency = data
      // })
    }
  },
  computed: {
    totalValue () {
      // Not cool ...
      var total = 0
      var crates = {
        ethbtc: {},
        usdtbtc: {},
        bnbbtc: {}
      }
      crates.ethbtc = _.find(this.cryptos, { symbol: "ETHBTC" })
      crates.usdtbtc = _.find(this.cryptos, { symbol: "BTCUSDT" })
      crates.bnbbtc = _.find(this.cryptos, { symbol: "BNBBTC" })

      chrome.storage.local.get(['portfolio', 'rates'], (data) => {
        _.each(data.portfolio, (c) => {
          if (c.id.endsWith("BTC")) {
            total += c.holdings * data.rates[this.currency]["last"]
          }
          if (c.id.endsWith("ETH")) {
            total += c.holdings * crates.ethbtc.lastPrice * data.rates[this.currency]["last"]
          }
          if (c.id.endsWith("USDT")) {
            total += c.holdings * crates.usdtbtc.lastPrice * data.rates[this.currency]["last"]
          }
          if (c.id.endsWith("BNB")) {
            total += c.holdings * crates.bnbbtc.lastPrice * data.rates[this.currency]["last"]
          }
        })
      })
      // console.log(total);
      return total.toFixed(8)
      // return _.reduce(data.portfolio, (acc, crypto) => { return acc + (crypto.holdings * crypto.Last ) * this.currencyVal[0] }, 0)
    },
    active() {
      console.log("active");
      var q = chrome.storage.local.get(['storage_cryptos', 'portfolio'], (data) => {
        return _.filter(data.storage_cryptos, function(c){
            _.find(data.portfolio, function(p){
                return c.symbol == p.id;
            });
        });
      })
      console.log(q);
    },
    byBaseCurrency () {
      return _.where(this.cryptos, { baseCurrency: "BTC" })
    },
    filteredCryptos () {
      // chrome.storage.local.get(['portfolio'], (data) => {
      //   return _.filter(this.cryptos, function(c){
      //       return _.find(data.portfolio, function(p){
      //           return c.symbol === p.id;
      //       });
      //   });
      // })
      return _.filter(this.cryptos, (crypto) => {
        return crypto.symbol.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1
      })
    }
  },
}
</script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  color: #2c3e50;
  width: 370px;
  max-height: 600px;
  overflow-y: scroll;
}


</style>
