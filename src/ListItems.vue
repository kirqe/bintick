<template lang="html">
  <div class="list-items-wrapper">
    <div v-if="!loaded" class="loader-wrap">
      <img src="./loader.gif" class="loader-i"/>
    </div>
    <ul class="list-items">
      <li>
        <div class="list-item">
          <span class="list-item-section crypto-icon"></span>

          <span class="list-item-section market-name"></span>

          <span class="list-item-section today-price"></span>

          <!-- <span class="list-item-section volume">Volume</span> -->
        </div>

      </li>
      <list-item v-for="crypto in cryptos" :crypto="crypto" :currencyVal="currencyVal"></list-item>
    </ul>
  </div>
</template>

<script>
import ListItem from './ListItem.vue'
export default {
  props: ["cryptos", "loaded", "currencyVal"],
  components: {
    ListItem
  }
}
</script>

<style lang="css">
</style>
