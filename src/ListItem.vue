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
        <span v-if="holdings > 0">
          <small>
          {{holdings}}<br/>
          {{(holdings * crypto.lastPrice) | toFixed8 }}
          </small>
        </span>
      </span>

      <span class="list-item-section today-price">
        <small>
          {{ this.rates[this.currency]["symbol"] }} {{ calculatedPrice | toFixed4 }}<br/>
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
  props: ["crypto", "loaded", "currency", "rates", "crates"],
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
        return this.portfolioItem.holdings;
      }
    },
    calculatedPrice () {
      var price = 0
      if (this.crypto.symbol.endsWith("BTC")) {
        price = this.crypto.lastPrice * this.rates[this.currency]["last"]
      }
      if (this.crypto.symbol.endsWith("ETH")) {
        price = this.crates.ethbtc.lastPrice * this.crypto.lastPrice * this.rates[this.currency]["last"]
      }
      if (this.crypto.symbol.endsWith("USDT")) {
        price = this.crates.usdtbtc.lastPrice * this.crypto.lastPrice * this.rates[this.currency]["last"]
      }
      if (this.crypto.symbol.endsWith("BNB")) {
        price = this.crates.bnbbtc.lastPrice * this.crypto.lastPrice * this.rates[this.currency]["last"]
      }

      return price;

    }
  },
  mounted() {
    this.fetchPortFolioItem()
  },
  methods: {
    fetchPortFolioItem () {
      var name = this.crypto.symbol
      chrome.storage.local.get(['portfolio'], (data) => {
        var existing = _.find(data.portfolio, (item) => {
          return item.id == name
        })
        this.portfolioItem = existing
      })
    },
    showOptions () {
      this.isEditing = !this.isEditing
      console.log(`set ${this.isEditing}`);
    },
    hideOptions () {
      this.isEditing = false
      console.log(`set ${this.isEditing}`);
      this.fetchPortFolioItem()
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
  },
  filters: {
    toFixed8(val) {
      return val.toFixed(8)
    },
    toFixed4(val) {
      return val.toFixed(4)
    },
    toFixed2(val) {
      return val.toFixed(2)
    }
  }
}
</script>

<style lang="css">
  .market-name {
    width: 20%;
  }
  .today-price {
    width: 40%;
  }
  .holdings {
    width: 40%;
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
