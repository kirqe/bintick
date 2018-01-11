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

      <div class=" is-pulled-right">
        <div class="control">
          <div class="select is-small">
            <select>
              <option>Select currency</option>
              <option>With options</option>
            </select>
          </div>
        </div>
      </div>

      <div class=" is-clearfix"></div>
    </div>


    <table-items :cryptos="byTerm" :loaded="this.loaded"></table-items>
  </div>
</template>

<script>
import axios from 'axios'
import _ from 'underscore'
import Crypto from './Crypto.js'
import TableItems from './TableItems.vue'

export default {
  name: 'app',
  components: {
    TableItems
  },
  data () {
    return {
      cryptos: [],
      filteredCryptos: [],
      searchTerm: '',
      loaded: false
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
      Promise.all([this.getCryptos(), this.getMarkets(), this.getBtcPriceIn()]).then(data => {
        console.log(data);
        return data; // many to assign o variable

      }).then(data =>{

        for (var i = 0; i < data[0].length; i++) {
          var c = new Crypto(
            data[1][i].MarketCurrency,
            data[1][i].BaseCurrency,
            data[0][i].MarketName,
            data[1][i].LogoUrl,
            data[0][i].Last.toFixed(8) * data[2],
            data[0][i].PrevDay.toFixed(8) * data[2],
            data[0][i].Volume);

            cryptos.push(c);
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
    getBtcPriceIn (currency = "USD") {
      return axios.get("https://blockchain.info/ticker").then((res) => {
        return res.data[currency].last
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
  width: 700px;
  height: 600px;
  overflow : scroll;
}


</style>
