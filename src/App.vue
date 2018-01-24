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

      <div class="is-pulled-right mlr3">
        <div class="control">
          <div class="select is-small">
            <select v-model="currency" @change="updatedCurrencyVal(currency)">
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

    <list-items :cryptos="byVolume" :loaded="loaded" :currencyVal="currencyVal"></list-items>
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
    this.fetchOrUpdate()
  },
  mounted () {
    setInterval(() => {

    }, 5000)
  },
  methods: { //0 getmarketsummaries
    fetchOrUpdate () {
      Promise.all([
        this.getCryptos(),
        this.getBtcPriceIn(this.currency)]).then(data => {
        console.log(data);
        return data; // many to assign o variable

      }).then(data =>{
        var cryptos = []
        this.loaded = false;

        this.currencyVal = data[1] // fetched cryptos

        this.cryptos = data[0];
        this.loaded = true;
        chrome.storage.local.get('storage_cryptos', (data) => {
          if (_.isEmpty(data.storage_cryptos)) {
            console.log("empt");
            chrome.storage.local.set({'storage_cryptos': this.cryptos});
          }
        });
      })

    },
    getCryptos () {
      return axios.get("https://bittrex.com/api/v1.1/public/getmarketsummaries").then((res) => {
        return _.sortBy(res.data.result, (item) => { return item.MarketName })
      })
    },
    getBtcPriceIn (currency) {
      return axios.get("https://blockchain.info/ticker").then((res) => {
        this.currencyOpts = Object.keys(res.data)
        return [res.data[currency].last, res.data[currency].symbol]
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
      this.getBtcPriceIn(currency).then(data => {
        this.currencyVal = data
      })
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
