<template lang="html">
  <div id="watch">
    <section class="hero is-ddark is-fullheight has-text-centered">
      <div id="info">
        <a href="https://www.binance.com/?ref=12573751" target="_blank">binance.com/?ref=12573751</a>
      </div>
      <div class="hero-body">
        <div class="container" v-if="this.crypto && this.rates && this.currency">
          <div class="watch_symbol">
            <h1 class="title">
              <a :href="`https://www.binance.com/trade.html?symbol=${this.symbol}`">{{symbol}}</a>
            </h1>
          </div>
          <div class="watch_stats">
              <strong v-bind:class="{ up: status.isUp,
                                      down: status.isDown,
                                      still: status.isStill }">
                {{ percentDifference(crypto) }}
              </strong>
              <br/>
              {{ this.crypto.lastPrice }} ~ {{ this.rates[this.currency]["symbol"] }} {{ calculatedPrice }}
          </div>
          <div class="watch_holdings" v-if="this.crypto.portfolio.holdings > 0">
            <h3 class="subtitle is-3">
              {{holdings}} x {{ this.rates[this.currency]["symbol"] }} {{ calculatedPrice }}<br/>
              {{ this.rates[this.currency]["symbol"] }} {{holdingsValue}}
            </h3>
          </div>
        </div>
        <div class="container" v-else>
          <div class="watch_symbol">
            <h1 class="title">
              No such crypto. Check symbol again.
            </h1>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { holdings, holdingsValue, calculatedPrice, percentDifference } from './shared.js'
export default {
  data () {
    return {
      symbol: '',
      crypto: {},
      rates: {},
      currency: "",
      status: {
        isUp: false,
        isDown: false,
        isStill: true
      }
    }
  },
  mounted () {
    this.symbol = window.location.search.split("=")[1]
    this.fetchStorage()
    chrome.alarms.onAlarm.addListener(() => {
      this.fetchStorage()
    })
  },
  methods: {
    fetchStorage () {
      chrome.storage.local.get(['storage_cryptos', 'rates', 'crypto_rates', 'currency'], (data) => {
        this.rates = data.rates
        this.crypto_rates = data.crypto_rates
        this.currency = data.currency || 'USD'
        this.crypto = _.find(data.storage_cryptos, (c) => {
          return c.symbol == this.symbol
        })
      })
    },
    percentDifference
  },
  computed: {
    holdings,
    holdingsValue,
    calculatedPrice,
  }
}
</script>

<style lang="css">
  .watch_symbol {

  }
  .watch_symbol a, .watch_symbol a:hover {
    color: #f5f5f5;
  }
  .watch_stats {
    font-size: 2em;
  }
  .watch_holdings {

  }
  #info {
    position: absolute;
    left: 10px;
    top: 10px;
  }
  #info a {
    color: #363636;
  }
  .is-ddark {
    background: #0c0c0c;
  }
  .hero.is-ddark .title {
    color: #f5f5f5;
  }
  .hero.is-ddark .subtitle {
    color: rgba(245,245,245,.9);
  }
  ::-webkit-scrollbar {
    width: 0 !important;
  }
</style>
