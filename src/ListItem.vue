<template lang="html">
  <li>
    <div class="list-item" @click="showOptions">
      <span class="list-item-section market-name">
        <a @click="openCryptoPage">{{crypto.symbol}}</a><br/>
        <strong v-bind:class="{ up: status.isUp, down: status.isDown, still: status.isStill }">
          {{ percentDifference(crypto) }}
        </strong>
      </span>

      <span class="list-item-section holdings">
        <span >
          <small>
          {{ holdings }}<br/>
          {{ holdingsValue }}
          </small>
        </span>
      </span>

      <span class="list-item-section today-price">
        <small>
          ~ {{ this.rates[this.currency]["symbol"] }} {{ calculatedPrice }}<br/>
          {{crypto.baseCurrency}} {{crypto.lastPrice }}
        </small>
      </span>
    </div>

    <list-item-options v-if="isEditing" :crypto="crypto" @done="hideOptions"></list-item-options>
  </li>
</template>

<script>
import ListItemOptions from './ListItemOptions.vue'
export default {
  props: ["crypto", "loaded", "currency", "rates", "crypto_rates", "portfolio_items"],
  components: {
    ListItemOptions
  },
  data () {
    return {
      portfolioItem: {},
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
      if (_.has(this.portfolioItem, "holdings")) {
        if (this.portfolioItem.holdings == 0) {
          return 0
        }
        return this.portfolioItem.holdings
      }
    },
    holdingsValue () {
      if (_.has(this.portfolioItem, "holdings")) {
        if (this.portfolioItem.holdings == 0) {
          return 0
        }
        return (this.portfolioItem.holdings * this.crypto.lastPrice).toFixed(8)
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
        price = this.crypto_rates.usdtbtc.lastPrice *
                this.crypto.lastPrice *
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
  mounted() {
    this.fetchPortFolioItem()
  },
  methods: {
    fetchPortFolioItem () {
      chrome.storage.local.get('portfolio', (data) => {
        this.portfolioItem = _.find(data.portfolio, (item) => {
          return item.id == this.crypto.symbol
        })
      })
    },
    showOptions () {
      this.isEditing = !this.isEditing
      console.log(`set ${this.isEditing}`);
    },
    hideOptions () {
      this.$emit('updatePortfolio')

      this.fetchPortFolioItem()

      this.isEditing = false
      console.log(`set ${this.isEditing}`);

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
    width: 25%;
  }
  .today-price {
    width: 35%;
  }
  .holdings {
    width: 35%;
  }
  .up {
    color: #4caf50;
  }
  .down {
    color: #f44336;
  }
  .still {
    color: #607d8b;
  }
</style>
