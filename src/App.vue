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

    <list-items v-if="!panel && filteredCryptos"
                      :cryptos="filteredCryptos"
                      :loaded="loaded"
                      :currency="currency"
                      :rates="rates"
                      :crypto_rates="crypto_rates"
                      :portfolio_items="portfolio"></list-items>

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
      timestamp: null
    }
  },
  beforeMount () {

  },
  mounted () {
    this.fetchStorage()
    chrome.storage.local.get('timestamp', (data) => {
      if (typeof data.timestamp === 'undefined') {
        this.fetchOrUpdate()
      } else {
        this.fetchStorage()
      }
    })
    chrome.alarms.onAlarm.addListener(() => {
      this.fetchStorage()
    })
  },
  methods: {
    fetchOrUpdate () {
      Promise.all([
        this.getCryptos(),
        this.getBtcPrice()]).then((data) => {
          return data;
        }).then(data => {
          var cryptos = []
          this.loaded = false;
          this.cryptos = data[0];
          var crypto_rates = {
            ethbtc: _.find(this.cryptos, { symbol: "ETHBTC" }),
            usdtbtc: _.find(this.cryptos, { symbol: "BTCUSDT" }),
            bnbbtc: _.find(this.cryptos, { symbol: "BNBBTC" }),
          }
          this.rates = data[1];
          this.crypto_rates = crypto_rates
          this.currencyOpts = Object.keys(data[1])
          chrome.storage.local.set({
            'storage_cryptos': data[0],
            'rates': data[1],
            'crypto_rates': crypto_rates,
            'timestamp': (new Date).getTime()
          });
          this.loaded = true;
        }).then(()=>{
          this.fetchStorage()
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
      chrome.storage.local.get(['storage_cryptos', 'rates', 'portfolio', 'crypto_rates', 'activeOnly', 'currency', 'timestamp'], (data) => {
        this.currency = data.currency || 'USD'
        this.rates = data.rates
        this.currencyOpts = _.keys(data.rates)
        this.cryptos = data.storage_cryptos
        this.crypto_rates = data.crypto_rates
        this.portfolio = data.portfolio
        this.activeOnly = data.activeOnly
        this.timestamp = data.timestamp
        this.loaded = true
      })
    },
    getCryptos () {
      return axios.get("https://api.binance.com/api/v1/ticker/24hr").then((res) => {
        return _.sortBy(res.data, (item) => { return item.symbol })
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
      var res = this.cryptos
      if (this.activeOnly) {
        res = _.filter(this.cryptos, (c) => {
                return _.find(this.portfolio, (p) => {
                  return c.symbol == p.id;
                })
              })
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
