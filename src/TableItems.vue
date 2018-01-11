<template lang="html">
  <div class="results">
    <div v-if="!loaded" class="loader-wrap">
      <img src="./loader.gif" class="loader-i"/>
    </div>

    <table v-if="loaded" class="table is-fullwidth is-hoverable">
      <thead>
        <tr>
          <th></th>
          <th>Symbol</th>
          <th>Price</th>
          <th>prevDay</th>
          <th>volume</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="crypto in cryptos">
          <td class="crypto-icon"><img :src="crypto.logoUrl"/></td>
          <td><a @click="openCryptoPage(crypto.cryptoUrl)">{{crypto.marketName}}</a></td>
          <td>{{crypto.last}}</td>
          <td>{{crypto.prevDay}}</td>
          <td>{{crypto.volume}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: ["cryptos", "loaded"],
  methods: {
    openCryptoPage (url) {
      chrome.tabs.create({url: url});
    }
  }
}
</script>

<style lang="css">
</style>
