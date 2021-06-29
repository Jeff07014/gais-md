import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Global from './components/Global.vue'
import axios from 'axios'

Vue.config.productionTip = false
Vue.prototype.$global = Global
Vue.prototype.$http = axios


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
