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

    <list-items :cryptos="byTerm" :loaded="loaded" :currencyVal="currencyVal"></list-items>
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
        this.getMarkets(),
        this.getBtcPriceIn(this.currency)]).then(data => {
        console.log(data);
        return data; // many to assign o variable

      }).then(data =>{
        var cryptos = []
        this.loaded = false;

        this.currencyVal = data[2]
        for (var i = 0; i < data[0].length; i++) {
          var crypto = {
            holdings: 0,
            notify: false,
            notifications: {
              above: 'undefined',
              below: 'undefined'
            },
            marketCurrency: data[1][i].MarketCurrency,
            baseCurrency: data[1][i].BaseCurrency,
            marketName: data[0][i].MarketName,
            logoUrl: data[1][i].LogoUrl,
            last: data[0][i].Last,
            prevDay: data[0][i].PrevDay,
            cryptoUrl: `https://bittrex.com/Market/Index?MarketName=${data[0][i].MarketName}`
          }
            cryptos.push(crypto);
        }
        this.loaded = true;

        this.cryptos = cryptos;

        chrome.storage.local.get('storage_cryptos', (data) => {
          if (_.isEmpty(data.storage_cryptos)) {
            console.log("empt");
            chrome.storage.local.set({'storage_cryptos': this.cryptos});
          }
        });

        // console.log("set to chrome storage local");
        //
        // if (_.isEmpty)
        // chrome.storage.local.set({'data': storage_cryptos});

        // console.log("added the following fields");



        // chrome.storage.local.get('storage_cryptos', (d) => {
        //   console.log("inside get storage");
        //
        //     console.log(d);
        //     var copy = d.storage_cryptos
        //
        //     var t = _.find(copy, (item) => {
        //       return item.marketName == 'BTC-1ST'
        //     })
        //     t.holdings = 20000
        //
        //
        //
        //
        //
        //     var storage_cryptos = []
        //     var fields = ['marketName', 'logoUrl', 'holdings', 'notify', 'notified', 'notifications']
        //     chrome.storage.local.set({'storage_cryptos': copy});
        //
        //
        // });




      })


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
    searchForCrypto (event) {
      this.$emit('search', event.target.value);

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
    totalValue () {
      return _.reduce(this.cryptos, (acc, crypto) => { return acc + (crypto.holdings * crypto.last ) * this.currencyVal[0] }, 0)
    },
    byVolume () {
      return _.sortBy(this.cryptos, (item) => { return item.volume })
    },
    byBaseCurrency () {
      return _.where(this.cryptos, { baseCurrency: "BTC" })
    },
    byTerm () {
      return _.filter(this.byBaseCurrency, (crypto) => {
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
  width: 300px;
  height: 600px;
  overflow-y: scroll;
}


</style>
