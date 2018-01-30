<template lang="html">
  <div class="panel">
    <div class="field">
      <div class="control">
        <a @click="setFilter" class="button is-small is-success is-outlined">{{activeOnlyText}}</a>
        <a @click="$emit('close')" class="button is-small is-pulled-right">Close</a>
      </div>
    </div>
    <!-- <br/> -->
    <small>
      <b>What's this? </b><br/>
      Chrome extension for tracking cryptos<br/> with notifications support and some sort of<br/>
       portfolio functionality. <br/>
      <a href="https://github.com/kirqe/bintick" target="_blank">[source code yeee]</a>
      <br/><br/>
      <b>Where do you get the data from? </b><br/>
      The extension fetches data directly from biance api.<br/> Why binance?<br/> Because it seems to be a really nice exchange.<br/>
      If you haven't registered yet here's my ref link :)<br/>
      <a href="https://www.binance.com/?ref=12573751" target="_blank">binance.com/?ref=12573751</a>
      <br/><br/>
      <b>Donations always welcome :) </b><br/>
      BTC: 1DcDVWdWsPiqNhtsgZgUHg1jtkmMuCr3Qd<br/>
      LTC: LP5wEmKc7vjTKAwkbU4fJeMFUhE8pCmbHo<br/>
      ZEC: t1bym8jLN25iAHxnkmU96kUTaPpcu4XMwXv<br/>
      XRP: rNKBi8ZPTGgBytZokUhT3QYWabrTtZSVjy<br/>
      XVG: DJiKRUWzdaQyhJtnrFjvTa7Tqyufnt2gKE<br/>
    </small>
    <br/>
    <span style="color: #e25555;">&#9829;</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeOnly: false
    }
  },
  methods: {
    setFilter() {
      this.activeOnly = !this.activeOnly
      chrome.storage.local.set({'activeOnly': this.activeOnly})
      this.$emit('activeChanged')
    }
  },
  mounted () {
    chrome.storage.local.get('activeOnly', (data) => {
      if (typeof data.activeOnly === 'undefined') {
        chrome.storage.local.set({'activeOnly': false})
        this.activeOnly = false
      } else {
        this.activeOnly = data.activeOnly
      }
    })
  },
  computed: {
    activeOnlyText() {
      return (this.activeOnly == true) ? "Show all cryptos" : "Show only the cryptos that I own"
    }
  }
}
</script>

<style lang="css">
  .panel {
    height: 600px;
    display: block;
    background: #fff;
    /* height: 100%; */
    width: 100%;
    top: 0;
    position: relative;
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
