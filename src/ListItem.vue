<template lang="html">
  <li>
    <div class="list-item" @click="showOptions">
      <span class="list-item-section market-name">
        <small>
          <a @click="openCryptoPage">
            <strong>{{crypto.symbol}}</strong>
          </a><br/>
          <span class="x">={{this.crypto.lastPrice}}</span>
        </small>
      </span>

      <span class="list-item-section holdings">
        <span v-if="holdingsValue > 0">
          <small>
            <span>{{ this.rates[this.currency]["symbol"] }}</span> {{ holdingsValue }}<br/>
            {{ holdings }}
          </small>
        </span>
      </span>

      <span class="list-item-section today-price">
        <small>
          {{ this.rates[this.currency]["symbol"] }} {{ calculatedPrice }}</small><br/>
          <strong v-bind:class="{ up: status.isUp,
                                  down: status.isDown,
                                  still: status.isStill }">
            {{ percentDifference(crypto) }}
          </strong>
      </span>
    </div>

    <list-item-options v-if="isEditing" :crypto="crypto" @done="hideOptions"></list-item-options>
  </li>
</template>

<script>
import ListItemOptions from './ListItemOptions.vue'
export default {
  props: ["crypto", "currency", "rates", "crypto_rates"],
  components: {
    ListItemOptions
  },
  data () {
    return {
      status: {
        isUp: false,
        isDown: false,
        isStill: true
      },
      isEditing: false
    }
  },
  computed: {
    holdings () {
      if (_.has(this.crypto.portfolio, "holdings")) {
        if (this.crypto.portfolio.holdings == 0) {
          return 0
        }
        return this.crypto.portfolio.holdings
      }
    },
    holdingsValue () {
      if (_.has(this.crypto.portfolio, "holdings")) {
        if (this.crypto.portfolio.holdings == 0) {
          return 0
        }
        return (this.crypto.portfolio.holdings * this.calculatedPrice).toFixed(4)
      }
    },
    calculatedPrice () {
      var price = 0
      if (this.crypto.symbol.endsWith("BTC")) {
        price = this.crypto.lastPrice * this.rates[this.currency]["last"]
      }
      if (this.crypto.symbol.endsWith("ETH")) {
        price = this.crypto_rates.ethbtc.lastPrice *
                this.crypto.lastPrice *
                this.rates[this.currency]["last"]
      }
      if (this.crypto.symbol.endsWith("USDT")) {
        price = (this.crypto.lastPrice / this.crypto_rates.usdtbtc.lastPrice) *
                this.rates[this.currency]["last"]
      }
      if (this.crypto.symbol.endsWith("BNB")) {
        price = this.crypto_rates.bnbbtc.lastPrice *
                this.crypto.lastPrice *
                this.rates[this.currency]["last"]
      }

      return price.toFixed(4);
    }
  },
  methods: {
    showOptions () {
      this.isEditing = !this.isEditing
    },
    hideOptions () {
      this.isEditing = false
    },
    openCryptoPage () {
      let url = `https://www.binance.com/trade.html?symbol=${this.crypto.symbol}`
      chrome.tabs.create({url: url});
    },
    percentDifference(crypto) {
      var decrease = crypto.priceChangePercent

      if (decrease > 0) {
        this.status.isUp = true
        this.status.isDown = false
        this.status.isStill = false
      } else if (decrease < 0) {
        this.status.isUp = false
        this.status.isDown = true
        this.status.isStill = false
      } else {
        this.status.isUp = false
        this.status.isDown = false
        this.status.isStill = true
      }
      return `${decrease} %`
    }
  }
}
</script>

<style lang="css">
  .market-name {
    width: 30%;
  }
  .today-price {
    width: 35%;
  }
  .holdings {
    width: 35%;
  }
  .x {
    font-size: 0.8em;
  }
  .up {
    background-color: #4caf50;
    padding: 2px 7px;
    color: #fff;
    border-radius: 3px;
    font-size: 0.7em;
  }
  .down {
    background-color: #f44336;
    padding: 2px 7px;
    color: #fff;
    border-radius: 3px;
    font-size: 0.7em;
  }
  .still {
    background-color: #607d8b;
    padding: 2px 7px;
    color: #fff;
    border-radius: 3px;
    font-size: 0.7em;
  }
</style>
