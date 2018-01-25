<template>
  <div id="app">
    <div class="header-panel">
      <div class="is-pulled-left">
        <div class="control">
          <input @keyup="searchForCrypto"
                  v-model="searchTerm"
                  class="input is-small" type="text" placeholder="Search...">
        </div>
      </div>


      <div class="is-pulled-right mlr3">
        <div class="control">
          <!-- <a href="./about.html">i</a> -->
          <a href="./about.html" class="button is-small">i</a>
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
      <span class="tag is-info mlr3">Portfolio Value: {{currencyVal[1]}} {{totalValue.toFixed(4)}}</span>
    </div>

    <list-items :cryptos="byVolume" :loaded="loaded" :currency="currency" :rates="rates"></list-items>
  </div>
</template>

<script>
import axios from 'axios'
import _ from 'underscore'
import ListItems from './ListItems.vue'

export default {
  name: 'app',
  components: {
    ListItems
  },
  data () {
    return {
      cryptos: [],
      rates: [],
      searchTerm: '',
      currency: "USD",
      currencyVal: {
        symbol: '$',
        price: 0
      },
      currencyOpts: ['USD', 'EUR', 'CNY', 'GBP', 'RUB'],
      exchange: 'bittrex.com',
      exchanges: [],
      loaded: false,
    }
  },
  beforeMount () {
    // prents user from breaking api rulles
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

  },
  methods: { //0 getmarketsummaries
    fetchOrUpdate () {
      console.log("INSIDE FETCH");
      Promise.all([
        this.getCryptos(),
        this.getBtcPrice()]).then(data => {
        console.log(data);
        return data; // many to assign o variable

      }).then(data => {
        var cryptos = []
        this.loaded = false;

        // this.currencyVal = data[1] // fetched cryptos

        this.cryptos = data[0];
        this.rates = data[1];
        this.currencyOpts = Object.keys(data[1])
        console.log("SETTING STORAGE_CRYPTOS AND TIMESTAMP");
        chrome.storage.local.set({'storage_cryptos': data[0], 'rates': data[1], 'timestamp': (new Date).getTime() });
        this.loaded = true;

      })

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
        return res.data//[res.data[currency].last, res.data[currency].symbol]
      })
    },
    searchForCrypto (event) {
      this.$emit('search', event.target.value);

      var pair = event.target.value
      if (this.searchTerm === '') {
        return
      }

    },
    updatedCurrencyVal (currency) {
      // this.getBtcPriceIn(currency).then(data => {
        this.currency = data
      // })
    }
  },
  computed: {
    totalValue () {
      return _.reduce(this.cryptos, (acc, crypto) => { return acc + (crypto.holdings * crypto.Last ) * this.currencyVal[0] }, 0)
    },
    byVolume () {
      return _.sortBy(this.cryptos, (item) => { return item.Volume })
    },
    byBaseCurrency () {
      return _.where(this.cryptos, { baseCurrency: "BTC" })
    },
    byTerm () {
      return _.filter(this.byBaseCurrency, (crypto) => {
        return crypto.MarketName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1
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
  width: 450px;
  height: 600px;
  overflow-y: scroll;
}


</style>
