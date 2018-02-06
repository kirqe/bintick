<template lang="html">
  <div class="list-item-options">
    <div class="field">
      <label class="label is-small">Holdings:</label>
      <div class="control">
        <input class="input is-small" v-model="crypto.portfolio.holdings" type="number" placeholder="Quantity" :min="0.00000000">
      </div>
    </div>

    <div class="field">
      <label class="label is-small">Show notification when price is: </label>
      <div class="control">
        <input class="input is-small" type="number" :step="0.00000001" :min="0.00000000"
        placeholder="above this value (base crypto)"
        v-model="crypto.portfolio.notify_above"
        @focus="setAboveDefault()">
      </div>
    </div>

    <div class="field">
      <div class="control">
        <input class="input is-small" type="number" :step="0.00000001" :min="0.00000000"
        placeholder="below this value (base crypto)"
        v-model="crypto.portfolio.notify_below"
        @focus="setBelowDefault()">
      </div>
    </div>

    <div class="field">
      <div class="control">
        <input type="checkbox" :symbol="crypto.symbol" v-model="crypto.portfolio.notify">
        <label :for="crypto.symbol">Show notifications</label>
        <div class="is-pulled-right">
          <a v-if="crypto.portfolio.holdings > 0 || crypto.portfolio.notify" class="button is-danger is-small" @click="clear">Clear</a>
          <a class="button is-info is-small" @click="save">Save</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
    },
    clear () {
      chrome.storage.local.get('storage_cryptos', (data) => {
        var newData = _.map(data.storage_cryptos, (item) => {
          if (item.symbol == this.crypto.symbol) {
            return _.extendOwn(this.crypto, { portfolio: { holdings: 0, notify: false, notify_above: null, notify_below: null } })
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
