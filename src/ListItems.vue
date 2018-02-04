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
      <list-item v-for="crypto in cryptos"
        :crypto="crypto"
        :currency="currency"
        :rates="rates"
        :crypto_rates="crypto_rates"></list-item>
    </ul>
  </div>
</template>

<script>
import ListItem from './ListItem.vue'
export default {
  props: ["cryptos", "loaded", "rates", "currency", "crypto_rates"],
  components: {
    ListItem
  }
}
</script>

<style lang="css">
.list-items-wrapper{
  width: 370px;
  max-height: 600px;
  overflow-y: scroll;
}
.list-items-wrapper::-webkit-scrollbar-track
{
	-webkit-box-shadow: inset 0 0 2px rgba(0,0,0,0.3);
	background-color: #F5F5F5;
}

.list-items-wrapper::-webkit-scrollbar
{
	width: 2px;
	background-color: #F5F5F5;
}

.list-items-wrapper::-webkit-scrollbar-thumb
{
	background-color: #000000;
	border: 2px solid #555555;
}
</style>
