import Vue from 'vue'
import axios from 'axios'
import _ from 'underscore'

window._ = require('underscore');
window.axios = require('axios');

import App from './App.vue'
import Styles from './styles.css'
window.background = require('../background');

new Vue({
  el: '#app',
  render: h => h(App)
})
