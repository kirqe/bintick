<template lang="html">
  <div class="list-items-wrapper">
    <div v-if="!loaded" class="loader-wrap">
      <img src="./loader.gif" class="loader-i"/>
    </div>
    <ul class="list-items">
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
