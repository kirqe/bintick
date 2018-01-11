import Vue from 'vue'


import $ from 'jquery';
window.jQuery = window.$ = require('jquery');

import App from './App.vue'
import Styles from './styles.css'


new Vue({
  el: '#app',
  render: h => h(App)
})
