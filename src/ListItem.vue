<template lang="html">
  <li>
    <div class="list-item" @click="showOptions">
      <span class="list-item-section market-name">
        <small>
          <a @click="openCryptoPage('trade')">
            <strong>{{crypto.symbol}}</strong>
          </a><br/>
          <span class="x">
            <a @click="openCryptoPage('watch')">
              ={{this.crypto.lastPrice}}
            </a>
          </span>
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
        <small>{{ this.rates[this.currency]["symbol"] }} {{ calculatedPrice }}</small>
        <br/>
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
import { holdings, holdingsValue, calculatedPrice, percentDifference } from './shared.js'

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
    holdings,
    holdingsValue,
    calculatedPrice
  },
  methods: {
    showOptions () {
      this.isEditing = !this.isEditing
    },
    hideOptions () {
      this.isEditing = false
    },
    openCryptoPage (to) {
      var url = ""
      if (to == "watch") {
        url = `https://www.binance.com/trade.html?symbol=${this.crypto.symbol}`
      } else if (to == "trade") {
        url = `./watch.html?symbol=${this.crypto.symbol}`
      }
      chrome.tabs.create({url: url});
    },
    percentDifference
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
</style>
