<template lang="html">
  <li @click="showOptions()" >
    <div class="list-item">
      <!-- <span class="list-item-section crypto-icon">
        <img :src="crypto.logoUrl"/>
      </span> -->

      <span class="list-item-section market-name">
        <a @click="">{{crypto.MarketName}}</a>
      </span>



      <span class="list-item-section holdings">
        <span v-if="holdings > 0">
          {{holdings}}<br/>
          {{holdings * crypto.Last | toFixed8 }}
        </span>
      </span>

      <span class="list-item-section today-price">
        <small>
          {{currencyVal[1]}} {{ (crypto.Last * currencyVal[0]) | toFixed4 }}
          <strong v-bind:class="{ up: status.isUp, down: status.isDown, still: status.isStill }">
            ({{ percentDifference(crypto) }})
          </strong>
        </small><br/>
        <small>{{crypto.BaseCurrency}} {{crypto.Last | toFixed8}}</small>
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
    }
  },
  mounted() {
    let name = this.crypto.MarketName
    chrome.storage.local.get('portfolio', (data) => {
      let existing = _.find(data.portfolio, (item) => {
        return item.id == name
      })
      this.portfolioItem = existing
    })
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
      var last = crypto.Last
      var prevDay = crypto.PrevDay
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
