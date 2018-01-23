import Vue from 'vue'

import axios from 'axios'
import _ from 'underscore'
import $ from 'jquery';

window.jQuery = window.$ = require('jquery');
window._ = require('underscore');
window.axios = require('axios');

import App from './App.vue'
import Styles from './styles.css'
window.background = require('../background');

// require('../background.js')

new Vue({
  el: '#app',
  render: h => h(App)
})
