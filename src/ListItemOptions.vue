<template lang="html">
  <div class="list-item-options">
    <div class="field">
      <label class="label is-small">Holdings:</label>
      <div class="control">
        <input class="input is-small" v-model="crypto.portfolio.holdings" type="number" placeholder="Quantity" :min="0.00000000">
      </div>
      <!-- <p class="help">This is a help text</p> -->
    </div>

    <div class="field">
      <label class="label is-small">Show notification when price is: </label>
      <div class="control">
        <input class="input is-small" type="number" :step="0.00000001" :min="0.00000000"
        placeholder="above this value (base crypto)"
        v-model="crypto.portfolio.notify_above"
        @focus="setAboveDefault()">
      </div>
      <!-- <p class="help">This is a help text</p> -->
    </div>

    <div class="field">
      <div class="control">
        <input class="input is-small" type="number" :step="0.00000001" :min="0.00000000"
        placeholder="below this value (base crypto)"
        v-model="crypto.portfolio.notify_below"
        @focus="setBelowDefault()">
      </div>
      <!-- <p class="help">This is a help text</p> -->
    </div>

    <div class="field">
      <div class="control">
        <input type="checkbox" :symbol="crypto.symbol" v-model="crypto.portfolio.notify">
        <label :for="crypto.symbol">Show notifications</label>
        <a class="button is-info is-small is-pulled-right" @click="save">Save</a>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'underscore'
export default {
  props: ["crypto"],
  methods: {
    setAboveDefault () {
      if (this.crypto.portfolio.notify_above <= 0 ||
          this.crypto.portfolio.notify_above == 'undefined') {
            this.crypto.portfolio.notify_above = (parseFloat(this.crypto.lastPrice) + 0.00000001).toFixed(8)
      }
    },
    setBelowDefault () {
      if (this.crypto.portfolio.notify_below <= 0 ||
          this.crypto.portfolio.notify_below == 'undefined') {
            this.crypto.portfolio.notify_below = (parseFloat(this.crypto.lastPrice) - 0.00000001).toFixed(8)
      }
    },
    save () {
      chrome.storage.local.get('storage_cryptos', (data) => {
        var newData = _.map(data.storage_cryptos, (item) => {
          if (item.symbol == this.crypto.symbol) {
            return this.crypto
          } else {
            return item
          }
        })
        chrome.storage.local.set({'storage_cryptos': newData})
        this.$emit('done')
      })
    }
  }
}
</script>

<style lang="css">
</style>
