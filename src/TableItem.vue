<template lang="html">
  <tr v-for="crypto in byBaseCurrency">
    <td class="crypto-icon"><img :src="item.logoUrl"/></td>
    <td><a @click="openCryptoPage(item.cryptoUrl)">{{item.marketName}}</a></td>
    <td>{{item.last}}</td>
    <td>{{item.prevDay}}</td>
    <td>{{item.volume}}</td>
  </tr>
</template>

<script>
export default {
  props: ["item"]
},
methods: {
  openCryptoPage (url) {
    chrome.tabs.create({url: url});
  }
}
</script>

<style lang="css">
</style>
