<template lang="html">
  <div class="list-items-wrapper">
    <div v-if="!loaded" class="loader-wrap">
      <img src="./loader.gif" class="loader-i"/>
    </div>
    <ul class="list-items">
      <li>
        <div class="list-item">
          <span class="list-item-section market-name">Symbol</span>
          <span class="list-item-section holdings">Holdings</span>
          <span class="list-item-section today-price">Price</span>
        </div>
      </li>
      <list-item v-for="crypto in cryptos" :crypto="crypto" :currency="currency" :rates="rates" :crates="crates"></list-item>
    </ul>
  </div>
</template>

<script>
import ListItem from './ListItem.vue'
export default {
  props: ["cryptos", "loaded", "rates", "currency"],
  components: {
    ListItem
  },
  computed: {
    crates() {
      var crates = {
        ethbtc: {},
        usdtbtc: {},
        bnbbtc: {}
      }
      crates.ethbtc = _.find(this.cryptos, { symbol: "ETHBTC" })
      crates.usdtbtc = _.find(this.cryptos, { symbol: "BTCUSDT" })
      crates.bnbbtc = _.find(this.cryptos, { symbol: "BNBBTC" })

      console.log(crates);
      return crates
    }
  }
}
</script>

<style lang="css">
</style>
