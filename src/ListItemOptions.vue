<template lang="html">
  <div class="list-item-options">
    <div class="field">
      <label class="label is-small">Holdings:</label>
      <div class="control">
        <input class="input is-small" v-model="portfolioItem.holdings" type="number" placeholder="Quantity">
      </div>
      <!-- <p class="help">This is a help text</p> -->
    </div>

    <div class="field">
      <label class="label is-small">Show notification when price is: </label>
      <div class="control">
        <input class="input is-small" type="number" :step="0.00000001" :min="0.00000000"
        placeholder="above this value (btc)"
        v-model="portfolioItem.notify_above"
        @focus="setAboveDefault()">
      </div>
      <!-- <p class="help">This is a help text</p> -->
    </div>

    <div class="field">
      <div class="control">
        <input class="input is-small" type="number" :step="0.00000001" :min="0.00000000"
        placeholder="below this value (btc)"
        v-model="portfolioItem.notify_below"
        @focus="setBelowDefault()">
      </div>
      <!-- <p class="help">This is a help text</p> -->
    </div>

    <div class="field">
      <div class="control">
        <input type="checkbox" :id="portfolioItem.id" v-model="portfolioItem.notify">
        <label :for="portfolioItem.id">Show notifications</label>
        <a class="button is-info is-small is-pulled-right" @click="save()">Save</a>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'underscore'
export default {
  props: ["crypto"],
  data () {
    return {
      portfolioItem: {
        id: "",
        holdings: 0,
        notify: false,
        notify_above: 'undefined',
        notify_below: 'undefined'
      }
    }
  },
  computed: {
    holdingsValue () {
      // TODO: holdings * btcvalue * currency
    }
  },
  methods: {
    setAboveDefault () {
      console.log("set above");
      console.log(this.portfolioItem);
      if (this.portfolioItem.notify_above <= 0 ||
         this.portfolioItem.notify_above == 'undefined') {
        this.portfolioItem.notify_above = (this.crypto.Last + 0.00000001).toFixed(8)
      }
    },
    setBelowDefault () {
      console.log("set below");
      console.log(this.portfolioItem)
      if (this.portfolioItem.notify_below <= 0 ||
         this.portfolioItem.notify_below == 'undefined') {
        this.portfolioItem.notify_below = (this.crypto.Last - 0.00000001).toFixed(8)
      }
    },
    save () {
      console.log("as");

      var portfolioItems = []
      chrome.storage.local.get('portfolio', (data) => {
        var exists = _.find(data.portfolio, (item) => {
          return item.id == this.crypto.MarketName
        })
        if (exists == undefined) {
          console.log("ADDING NEW");
          data.portfolio.push(Object.assign(this.portfolioItem, {id: this.crypto.MarketName}))
          chrome.storage.local.set(data)
        } else {
          console.log("UPDATING OLD");
          var updatedData = _.map(data.portfolio, (item) => {
            if (item.id == exists.id) {
              item = Object.assign(item, this.portfolioItem)
            }
            return item
          })
          console.log(updatedData);
           chrome.storage.local.set({ 'portfolio': updatedData })
        }

      })

      // this.$emit('doneEditing', crypto)

    }

  },
  mounted() {
    let name = this.crypto.MarketName
    chrome.storage.local.get('portfolio', (data) => {
      let existing = _.find(data.portfolio, (item) => {
        return item.id == name
      })
      this.portfolioItem = existing || Object.assign(this.portfolioItem, {id: this.crypto.MarketName})
    })
  }

}
</script>

<style lang="css">
</style>
