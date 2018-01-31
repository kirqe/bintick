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
          <a @click="panel = !panel" class="button is-small">?</a>
        </div>
      </div>

      <div class="is-pulled-right mlr3">
        <div class="control">
          <div class="select is-small">
            <select v-model="currency" v-on:change="setCurrency">
              <option v-for="opt in currencyOpts">{{opt}}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="is-clearfix"></div>
    </div>

    <!-- <div class="portfolio">
      <span class="tag is-info mlr3">Portfolio Value: {{totalValue}}</span>
    </div> -->

    <panel @close="panel = false" @activeChanged = "setFilter" v-if="panel"></panel>

    <list-items v-if="!panel"
                      :cryptos="filteredCryptos"
                      :loaded="loaded"
                      :currency="currency"
                      :rates="rates"
                      :crypto_rates="crypto_rates"></list-items>

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
      crypto_rates: [],
      searchTerm: '',
      currency: "USD",
      currencyOpts: ['USD', 'EUR', 'CNY', 'GBP', 'RUB'],
      loaded: false,
      activeOnly: false,
      panel: false,
      ts: null
    }
  },
  mounted () {
    chrome.storage.local.get('ts', (data) => {
      if (new Date().getTime() - data.ts <= 10000) {
        this.fetchStorage()
      } else {
        this.fetchOrUpdate()
      }
    })

    chrome.alarms.onAlarm.addListener(() => {
      chrome.storage.local.get(['storage_cryptos', 'rates', 'crypto_rates', 'currency'], (data) => {
        this.cryptos = data.storage_cryptos
        this.rates = data.rates
        this.crypto_rates = data.crypto_rates
      })
    })
  },
  methods: {
    fetchOrUpdate () {
      Promise.all([this.getCryptos(), this.getBtcPrice()])
        .then((data) => {
          return data;
        })
        .then(data => {
          var cryptos = []
          this.loaded = false
          this.currency = "USD"
          this.currencyOpts = _.keys(data[1])
          this.rates = data[1];
          this.crypto_rates = {
            ethbtc: _.find(data[0], { symbol: "ETHBTC" }),
            usdtbtc: _.find(data[0], { symbol: "BTCUSDT" }),
            bnbbtc: _.find(data[0], { symbol: "BNBBTC" }),
          }
          this.cryptos = data[0]
          chrome.storage.local.get(['storage_cryptos', 'rates', 'crypto_rates', 'activeOnly', 'currency', 'ts'], (data) => {
            this.ts = data.ts
            this.activeOnly = data.activeOnly || false

            if (typeof data.storage_cryptos === 'undefined') {
              chrome.storage.local.set({'storage_cryptos': this.cryptos, 'rates': this.rates, 'crypto_rates': this.crypto_rates, currency: this.currency})
              this.fetchOrUpdate()
            } else {
              this.currency = data.currency
              this.cryptos = _.map(_.groupBy(_.union(this.cryptos, data.storage_cryptos), "symbol"), (item) => {
                return _.extendOwn(item[0], _.omit(item[1], 'portfolio'))
              })
              this.cryptos = data.storage_cryptos
            }
          })
          chrome.storage.local.set({'ts': new Date().getTime()})
          this.loaded = true;
        })

    },
    setFilter () {
      this.fetchStorage()
      this.panel = false
    },
    setCurrency() {
      chrome.storage.local.set({'currency': this.currency})
      this.fetchStorage()
    },
    fetchStorage () {
      chrome.storage.local.get(['storage_cryptos', 'rates', 'crypto_rates', 'activeOnly', 'currency'], (data) => {
        this.cryptos = data.storage_cryptos
        this.currency = data.currency || 'USD'
        this.rates = data.rates
        this.currencyOpts = _.keys(data.rates)
        this.crypto_rates = data.crypto_rates
        this.activeOnly = data.activeOnly
        this.loaded = true
      })
    },
    getCryptos () {
      return axios.get("https://api.binance.com/api/v1/ticker/24hr").then((res) => {
        console.log("HITTING");
        var prt = { portfolio: { holdings: 0, notify: false, notify_above: null, notify_below: null } }
        return _.map(res.data, (item) => { return _.extend(item, prt)})
      })
    },
    getBtcPrice () {
      return axios.get("https://blockchain.info/ticker").then((res) => {
        return res.data
      })
    }
  },
  computed: {
    filteredCryptos () {
      var res = []
      if (this.activeOnly) {
        res = _.filter(this.cryptos, (c) => {
                return c.portfolio.holdings > 0
              })
      } else {
        res = this.cryptos
      }

      return _.filter(res, (crypto) => {
        return crypto.symbol.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1
      })
    }
  }
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

#app::-webkit-scrollbar-track
{
	-webkit-box-shadow: inset 0 0 2px rgba(0,0,0,0.3);
	background-color: #F5F5F5;
}

#app::-webkit-scrollbar
{
	width: 2px;
	background-color: #F5F5F5;
}

#app::-webkit-scrollbar-thumb
{
	background-color: #000000;
	border: 2px solid #555555;
}
</style>
