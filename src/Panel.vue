<template lang="html">
  <div class="panel">
    <div class="field">
      <div class="control">
        <a @click="setFilter" class="button is-success is-outlined">{{activeOnlyText}}</a>
        <a @click="$emit('close')" class="button is-pulled-right">Close</a>
      </div>
    </div>
    <br/>
    <small>
      <b>What's this? </b><br/>
      Chrome extension for tracking cryptos<br/> with notifications support and some sort of<br/>
       portfolio functionality. <a href="https://github.com/kirqe/bintick" target="_blank">[git]</a><br/>
    </small>
    <br/>
    <a class="smt" href="https://binance.com/?ref=12573751" target="_blank">binance.com/?ref=12573751</a>
    <br/>
    <a @click="resetStorage" class="smt">reset extension data</a>
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
    },
    resetStorage() {
      chrome.storage.local.clear(function() {
        var error = chrome.runtime.lastError;
        if (error) {
          console.error(error);
        }
        window.close();
      });
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
    min-height: 250px;
    display: block;
    background: #fff;
    width: 100%;
    z-index: 9999;
    text-align: center;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    font-size: 0.8em;
    padding: 10px;
  }
  .smt {
    text-align: center;
    font-size: 10px;
  }
</style>
