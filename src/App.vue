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

      <span class="tag is-light">Portfolio Total Value: 00.00</span>
      <span class="tag is-light">1 BTC = {{currencyVal[1]}} {{currencyVal[0]}}</span>

      <div class="is-pulled-right">
        <div class="control">

          <div class="select is-small">
            <select v-model="currency" @change="updatedCurrencyVal(currency)">
              <option v-for="opt in currencyOpts">{{opt}}</option>
            </select>
          </div>
        </div>
      </div>

      <div class=" is-clearfix"></div>
    </div>

    <!-- <table-items :cryptos="byTerm" :loaded="loaded" :currencyVal="currencyVal"></table-items> -->
    <list-items :cryptos="byTerm" :loaded="loaded" :currencyVal="currencyVal"></list-items>
  </div>
</template>

<script>
import axios from 'axios'
import _ from 'underscore'
import Crypto from './Crypto.js'
import TableItems from './TableItems.vue'
import ListItems from './ListItems.vue'

export default {
  name: 'app',
  components: {
    TableItems,
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
      loaded: false,
    }
  },
  beforeMount () {
    this.fetchData()
  },
  mounted () {
    // setInterval(() => {
    //   this.updateStats()
    // }, 5000)

  },
  methods: { //0 getmarketsummaries
    fetchData () {
      var cryptos = []
      this.loaded = false;
      Promise.all([this.getCryptos(), this.getMarkets(), this.getBtcPriceIn(this.currency)]).then(data => {
        console.log(data);
        return data; // many to assign o variable

      }).then(data =>{
        this.currencyVal = data[2]
        for (var i = 0; i < data[0].length; i++) {
          var crypto = {
            marketCurrency: data[1][i].MarketCurrency,
            baseCurrency: data[1][i].BaseCurrency,
            marketName: data[0][i].MarketName,
            logoUrl: data[1][i].LogoUrl,
            last: data[0][i].Last,
            prevDay: data[0][i].PrevDay,
            volume: data[0][i].Volume,
            cryptoUrl: `https://bittrex.com/Market/Index?MarketName=${data[0][i].MarketName}`
          }

          // var c = new Crypto(
          //   data[1][i].MarketCurrency,
          //   data[1][i].BaseCurrency,
          //   data[0][i].MarketName,
          //   data[1][i].LogoUrl,
          //   data[0][i].Last,
          //   data[0][i].PrevDay,
          //   data[0][i].Volume);

            cryptos.push(crypto);
        }
        this.loaded = true;
      })
      this.cryptos = cryptos;

    },
    updateStats () {
      Promise.all([this.getCryptos(), this.getBtcPriceIn()]).then(data => {
        console.log(data);
        return data; // many to assign o variable
      }).then(data =>{

        _.each(data[0], (updatedCrypto) => {
          return _.each(this.cryptos, (crypto) => { return crypto.updateStats(updatedCrypto.Last, updatedCrypto.PrevDay, updatedCrypto.Volume) })
        })
        // this.cryptos = _.map(this.cryptos, (crypto) => { crypto.update(data[0][i].Last, data[0][i].PrevDay, data[0][i].Volume) })
      })
    },
    getCryptos () {
      return axios.get("https://bittrex.com/api/v1.1/public/getmarketsummaries").then((res) => {
        return _.sortBy(res.data.result, (item) => { return item.MarketName })
      })
    },
    getMarkets () { //1 getmarkets logo
      return axios.get("https://bittrex.com/api/v1.1/public/getmarkets").then((res) => {
        return _.sortBy(res.data.result, (item) => { return item.MarketName })
      })
    },
    getBtcPriceIn (currency) {
      return axios.get("https://blockchain.info/ticker").then((res) => {
        this.currencyOpts = Object.keys(res.data)
        return [res.data[currency].last, res.data[currency].symbol]
      })
    },
    openCryptoPage (url) {
      chrome.tabs.create({url: url});
    },
    searchForCrypto (event) {
      this.$emit('search', event.target.value);

      // var cr = this.cryptos
      //
      //
      var pair = event.target.value
      if (this.searchTerm === '') {
        return
      }
      //
      // var filtered = _.filter(cr, (crypto) => {
      //   return crypto.marketName.toLowerCase().indexOf(pair.toLowerCase()) !== -1
      // })
      // this.cryptos = filtered
    },
    updatedCurrencyVal (currency) {

      this.getBtcPriceIn(currency).then(data => {
        this.currencyVal = data
      })
    }
  },
  computed: {
    byVolume () {
      return _.sortBy(this.cryptos, (item) => { return item.volume })
    },
    byBaseCurrency () {
      return _.where(this.cryptos, { baseCurrency: "BTC" })
    },
    byTerm () {
      return _.filter(this.cryptos, (crypto) => {
        return crypto.marketName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1
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
  width: 600px;
  height: 600px;
  overflow : scroll;
}


</style>
