<template>
  <div id="app">1
    <h1>{{ msg }}</h1>
    <h2>Crypto ticker</h2>
    <table>
      <tr>
        <td></td>
        <td>Symbol</td>
        <td>Price</td>
        <td>prevDay</td>
        <td>volume</td>
      </tr>
      <tr v-for="crypto in byBaseCurrency">
        <td><img :src="crypto.logoUrl" width="20px"/></td>
        <td><a @click="openCryptoPage(crypto.cryptoUrl)">{{crypto.marketName}}</a></td>
        <td>{{crypto.last}}</td>
        <td>{{crypto.prevDay}}</td>
        <td>{{crypto.volume}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import axios from 'axios'
import _ from 'underscore'
import Crypto from './Crypto.js'

export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      cryptos: []
    }
  },
  beforeMount () {
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

          this.cryptos.push(c);
      }
    })
  },
  methods: { //0 getmarketsummaries
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
    }
  },
  computed: {
    byVolume () {
      return _.sortBy(this.cryptos, (item) => { return item.volume })
    },
    byBaseCurrency () {
      return _.where(this.cryptos, { baseCurrency: "BTC" })
    }
  }
  // filters: {
  //   byVolume: (cryptos) => {
  //     return _.sortBy(cryptos, (item) => { return item.Volume })
  //   }
  // }
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
}

</style>
