import Vue from 'vue'
import axios from 'axios'
import _ from 'underscore'

window._ = require('underscore');
window.axios = require('axios');

import App from './App.vue'
import Watch from './Watch.vue'
import Styles from './styles.css'
window.background = require('../background');

new Vue({
  el: '#app',
  render: h => h(App)
})

new Vue({
  el: '#watch',
  render: h => h(Watch)
})
