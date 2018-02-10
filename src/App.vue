<template>
  <div id="app">
    <div class="header-panel" v-if="!panel">
      <div class="is-pulled-left">
        <div class="control">
          <input v-model="searchTerm" class="input is-small" type="text" placeholder="Search...">
        </div>
      </div>

      <div class="is-pulled-right mlr3">
        <div class="control">
          <a @click="panel = !panel" class="button is-small">?</a>
        </div>
      </div>

      <div class="is-pulled-right mlr3">
        <div class="control">
          <div class="select is-small">
            <select v-model="currency" v-on:change="setCurrency">
              <option v-for="opt in currencyOpts">{{opt}}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="is-clearfix"></div>
    </div>

    <panel @close="panel = false" @activeChanged = "setFilter" v-if="panel"></panel>

    <list-items v-if="!panel && cryptos"
                      :cryptos="filteredCryptos"
                      :loading="loading"
                      :currency="currency"
                      :rates="rates"
                      :crypto_rates="crypto_rates"></list-items>

    <div class="init-btn-w" v-if="!cryptos">
      <a class="button is-info is-small" v-bind:class="{'is-loading': loading}"
      @click="fetchNewData">Fetch and set initial data</a>
    </div>

    <span class="is-warning notify" v-if="this.notice">{{notice}}</span>
  </div>
</template>

<script>
import ListItems from './ListItems.vue'
import Panel from './Panel.vue'
export default {
  name: 'app',
  components: {
    ListItems,
    Panel
  },
  data () {
    return {
      cryptos: [],
      rates: [],
      crypto_rates: [],
      searchTerm: '',
      currency: "USD",
      currencyOpts: ['USD', 'EUR', 'CNY', 'GBP', 'RUB'],
      loading: false,
      activeOnly: false,
      panel: false,
      notice: ""
    }
  },
  mounted () {
    if (!navigator.onLine) {
      this.notice = "you are not connected to the internet"
    }

    this.fetchStorage()
    chrome.alarms.onAlarm.addListener(() => {
      this.fetchStorage()
    })
  },
  methods: {
    fetchNewData () {
      if (navigator.onLine) {
        this.loading = true
        Promise.all([this.getCryptos(), this.getBtcPrice()])
          .then((data) => {
            return data;
          })
          .then(data => {
            this.currency = "USD"
            this.currencyOpts = _.keys(data[1])
            chrome.storage.local.set({'storage_cryptos': _.sortBy(data[0], "symbol"),
                                      'rates': data[1],
                                      'crypto_rates': {
                                        ethbtc: _.find(data[0], { symbol: "ETHBTC" }),
                                        usdtbtc: _.find(data[0], { symbol: "BTCUSDT" }),
                                        bnbbtc: _.find(data[0], { symbol: "BNBBTC" }),
                                      },
                                      'currency': "USD"})
            this.fetchStorage()
            this.loading = false;
          })
        }
    },
    setFilter () {
      this.fetchStorage()
      this.panel = false
    },
    setCurrency() {
      chrome.storage.local.set({'currency': this.currency})
      this.fetchStorage()
    },
    fetchStorage () {
      chrome.storage.local.get(['storage_cryptos', 'rates', 'crypto_rates', 'activeOnly', 'currency'], (data) => {
        this.rates = data.rates
        this.currencyOpts = _.keys(data.rates)
        this.crypto_rates = data.crypto_rates
        this.currency = data.currency || 'USD'
        this.cryptos = data.storage_cryptos
        this.activeOnly = data.activeOnly
        this.loading = false
      })
    },
    getCryptos () {
      return axios.get("https://api.binance.com/api/v1/ticker/24hr").then((res) => {
        var prt = { portfolio: { holdings: 0, notify: false, notify_above: null, notify_below: null } }
        return _.map(res.data, (item) => { return _.extend(item, prt)})
      })
    },
    getBtcPrice () {
      return axios.get("https://blockchain.info/ticker").then((res) => {
        return res.data
      })
    }
  },
  computed: {
    filteredCryptos () {
      var res = []
      if (this.activeOnly) {
        res = _.filter(this.cryptos, (c) => {
                if (typeof c.portfolio !== 'undefined') {
                  return c.portfolio.holdings > 0 || c.portfolio.notify
                }
              })
      } else {
        res = this.cryptos
      }

      return _.filter(res, (crypto) => {
        return crypto.symbol.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1
      })
    }
  }
}
</script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 370px;
  max-height: 600px;
}
.init-btn-w {
  text-align: center;
  padding: 20px;
}
.notify {
  display: block;
  background-color: #ffdd57;
  text-align: center;
  font-size: 0.75em;
}
</style>
