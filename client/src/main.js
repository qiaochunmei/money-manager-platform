import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import "./assets/css/reset.css"
import axios from './http'
import store from './store' 

Vue.use(ElementUI);

Vue.config.productionTip = false
Vue.prototype.$axios = axios // 挂载到全局

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
