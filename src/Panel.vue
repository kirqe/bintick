<template lang="html">
  <div class="panel">
    <div class="field">
      <div class="control">
        <a @click="setFilter" class="button is-success is-outlined">Show only items with holdings > 0 </a>
        <a @click="$emit('close')" class="button is-pulled-right">Close</a>
      </div>
    </div>

    <br/>
    <small>
      <b>What's this: </b><br/>
      Chrome extension for tracking cryptos<br/> with notifications support and some sort of<br/>
       portfolio functionality. <br/>
      <!-- <a href="#" target="_blank">[source code]</a> -->
      <br/><br/>
      <b>Donations always welcome :) </b><br/>
      BTC: 1DcDVWdWsPiqNhtsgZgUHg1jtkmMuCr3Qd<br/>
      LTC: LP5wEmKc7vjTKAwkbU4fJeMFUhE8pCmbHo<br/>
      ZEC: t1bym8jLN25iAHxnkmU96kUTaPpcu4XMwXv<br/>
      XRP: rNKBi8ZPTGgBytZokUhT3QYWabrTtZSVjy<br/>
      XVG: DJiKRUWzdaQyhJtnrFjvTa7Tqyufnt2gKE<br/>
    </small>
  </div>
</template>

<script>
export default {
  methods: {
    setFilter() {
      var showAllCryptos = !
      chrome.storage.get('activeOnly', (data) => {
        if (typeof data.activeOnly === 'undefined') {
          chrome.storage.local.set({'activeOnly': showAllCryptos})
        }
      })

    }
  }
}
</script>

<style lang="css">
  .panel {
    background: #fff;
    height: 100%;
    width: 100%;
    top: 0;
    position: absolute;
    z-index: 9999;
    text-align: center;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    color: #2c3e50;

    font-size: 0.8em;
    padding: 10px;
    border: 3px solid #209cee;
  }
</style>
