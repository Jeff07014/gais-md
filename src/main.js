import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import router from './router'
import Global from './components/Global.vue'
import axios from 'axios'
import GAuth from 'vue-google-oauth2'

import createPersistedState from 'vuex-persistedstate'
import * as Cookies from 'js-cookie'

Vue.use(Vuex)
Vue.config.productionTip = false
Vue.prototype.$global = Global
Vue.prototype.$http = axios
Vue.use(GAuth, {clientId: '417578352473-90ueqki5ddsok1747ukrvog34sbbg28g.apps.googleusercontent.com', scope: 'profile email'})


/*
Session {
  cookie: {
    path: '/',
    _expires: 2021-08-04T06:16:47.260Z,
    originalMaxAge: 60000,
    httpOnly: true
  },
  passport: { user: '60ed646cf03badd0fd521a5b' }
}
*/
const store = new Vuex.Store({
  state: {
    Session:{
      cookie: {
        path: { type: String},
        _expires: { type: String },
        originalMaxAge: { type: Number },
        httpOnly: { type: Boolean },
      },
      passport: { user: { type: String } },
    },
    filelist: [],
    isLogin: false,
  },
  

  // define method to return data states
  getters: {
    isLogined: state => {
      return state.isLogin
    },
    getFileList: state => {
      return state.filelist
    }
  },

  // for Update Data state
  mutations: {
    dataSetting (state, payload) {
      // console.log("dataSetting");
      state.Session = payload.session;
      state.filelist = payload.filelist;
      state.isLogin = ( payload.session.passport != null )
    },
    dataSetting2 (state, payload) {
      state.Session = payload.session;
      state.filelist = payload.filelist;
      state.isLogin = true;
    },
    dataRemoving (state) {
      state.Session = null;
      state.filelist = null;
      state.isLogin = false;
    }
  },

  plugins : [
    createPersistedState({
      getItem: (key) => Cookies.get(key),
      // Please see https://github.com/js-cookie/js-cookie#json, on how to handle JSON.
      setItem: (key, value) =>
        Cookies.set(key, value, { expires: 1/1440, secure: true }),
      removeItem: (key) => Cookies.remove(key),
    })
  ]
})

new Vue({
  router,
  render: h => h(App),
  store
}).$mount('#app')
