<template lang="html">
  <li @click="showOptions()" >
    <div class="list-item">
      <!-- <span class="list-item-section crypto-icon">
        <img :src="crypto.logoUrl"/>
      </span> -->

      <!-- <span class="list-item-section market-name">
        <a @click="openCryptoPage(crypto.cryptoUrl)">{{crypto.marketName}}</a>
      </span> -->

      <span class="list-item-section today-price">
        <a @click="openCryptoPage(crypto.cryptoUrl)">{{crypto.marketName}}</a>

        <small>
          {{currencyVal[1]}} {{ (crypto.last * currencyVal[0]) | toFixed4 }}
          <strong v-bind:class="{ up: status.isUp, down: status.isDown, still: status.isStill }">
            ({{ percentDifference(crypto) }})
          </strong>
        </small><br/>
        <small>{{crypto.baseCurrency}} {{crypto.last | toFixed8}}</small>
      </span>


    </div>

    <list-item-options v-if="isEditing" :crypto="crypto" @doneEditing="hideOptions"></list-item-options>
  </li>

</template>

<script>
import ListItemOptions from './ListItemOptions.vue'
export default {
  props: ["crypto", "loaded", "currencyVal"],
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
      // holdings: 0,
      // notification: {
      //   active: false,
      //   above: 0,
      //   below:: 0
      // }
    }
  },
  computed: {
    usdVolumePrice () {
      return (this.crypto.volume * this.currencyVal[0]).toFixed()
    }
  },
  methods: {
    showOptions (event) {
      this.isEditing = true
    },
    hideOptions (value) {
      // this.isEditing = false
      console.log(value);
    },
    openCryptoPage (url) {
      chrome.tabs.create({url: url});
    },
    percentDifference(crypto) {
      var last = crypto.last
      var prevDay = crypto.prevDay
      var decrease = (last - prevDay) / last * 100
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
      return `${decrease.toFixed(2)} %`
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
  .crypto-icon {
    width: 15%;
  }
  .market-name {
    width: 30%;
  }
  .today-price {
    width: 100%;
  }
  .volume {
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
