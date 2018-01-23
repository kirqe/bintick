<template lang="html">
  <div class="list-item-options">
    <div class="field">
      <label class="label is-small">Holdings:</label>
      <div class="control">
        <input class="input is-small" v-model="editedItem.holdings" type="number" placeholder="Quantity">
      </div>
      <!-- <p class="help">This is a help text</p> -->
    </div>

    <div class="field">
      <label class="label is-small">Show notification when price is: </label>
      <div class="control">
        <input class="input is-small" type="number"
        :placeholder="this.placeholderAbove"
        v-model="editedItem.notifications.above"
        @focus="setAboveDefault()">
      </div>
      <!-- <p class="help">This is a help text</p> -->
    </div>

    <div class="field">
      <div class="control">
        <input class="input is-small" type="number"
        :placeholder="this.placeholderBelow"
        v-model="editedItem.notifications.below"
        @focus="setBelowDefault()">
      </div>
      <!-- <p class="help">This is a help text</p> -->
    </div>

    <div class="field">
      <div class="control">
        <!-- <div class="select is-small">
          <select v-model="editedItem.notify" @change="setNotification(noption)">
            <option v-for="noption in notifyOptions">{{noption}}</option>
          </select>
        </div> -->
        <input type="checkbox" id="checkbox" v-model="editedItem.notify">
        <label for="checkbox">Show notifications</label>
          <a class="button is-info is-small is-pulled-right" @click="save(editedItem)">Save</a>
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
      storageItem: {},
      editedItem: {
        marketName: "",
        holdings: 0,
        notify: false,
        notifications: {
          above: 'undefined',
          below: 'undefined'
        }
      }
    }
  },
  computed: {
    placeholderAbove () {
      return `above ${(this.crypto.last + 0.00000001).toFixed(8)} ${this.crypto.baseCurrency}`
    },
    placeholderBelow () {
      return `below ${(this.crypto.last - 0.00000001).toFixed(8)} ${this.crypto.baseCurrency}`
    },
    storageHoldings () {
      chrome.storage.local.get(this.crypto.marketName, (item) => {

        return item[Object.keys(item)[0]].holdings
        // var newItem = baseItem
        // newItem.holdings = 1000
        //
        // console.log(baseItem);
        // console.log(newItem);
        //
        // chrome.storage.local.set({[`${baseItem.marketName}`]: Object.assign(baseItem, newItem)});


      });
    }
  },
  methods: {
    setAboveDefault () {
      console.log("set above");
      console.log(this.editedItem);
      if (this.editedItem.notifications.above <= 0 ||
         this.editedItem.notifications.above == 'undefined') {
        this.editedItem.notifications.above = (this.crypto.last + 0.00000001).toFixed(8)
      }
    },
    setBelowDefault () {
      console.log("set below");
      console.log(this.editedItem)
      if (this.editedItem.notifications.below <= 0 ||
         this.editedItem.notifications.below == 'undefined') {
        this.editedItem.notifications.below = (this.crypto.last - 0.00000001).toFixed(8)
      }
    },
    setNotification () {

    },
    save (crypto) {
      console.log("as");
      // chrome.alarms.create('check_price', { delayInMinutes: 0.5, periodInMinutes: 0.5});


      this.$emit('doneEditing', crypto)


// var c =  this.crypto.marketName
      chrome.storage.local.get('storage_cryptos', (cryptos) => {
        console.log("inside get storage");

          console.log(cryptos);
          var copy = cryptos.storage_cryptos

          var t = _.find(copy, (item) => {
            return item.marketName == this.editedItem.marketName
          })
          Object.assign(t, this.editedItem)



          // var storage_cryptos = []
          // var fields = ['marketName', 'logoUrl', 'holdings', 'notify', 'notified', 'notifications']
          chrome.storage.local.set({'storage_cryptos': copy});


      });


    }

  },
  mounted() {
    var c =  this.crypto.marketName
    chrome.storage.local.get('storage_cryptos', (data) => {
      var baseItem = _.find(data.storage_cryptos, function(item) {
        return item.marketName == c
      })
      Object.assign(this.editedItem, baseItem)
    })
  }

}
</script>

<style lang="css">
</style>
