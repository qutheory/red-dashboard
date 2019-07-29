import Vue from 'vue'
import Root from '@/root.vue'
import router from '@/router'
import '@/components/index'
import api from '@/api'
import notify from '@/notify'
import moment from 'moment'

Vue.prototype.$notify = notify
Vue.config.productionTip = false
Vue.prototype.$api = api

Vue.prototype.$version = require('../package.json').version

Vue.prototype.$stripeConfig = {
  "key": process.env.VUE_APP_STRIPE_KEY,
  "options": { }
}

Vue.directive('click-outside', {
  bind(el, binding, vnode) {
    el.clickOutsideEvent = (event) => {
      // here I check that click was outside the el and his childrens
      if (!(el == event.target || el.contains(event.target))) {
        // and if it did, call method provided in attribute value
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unbind: function (el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  },
})

Vue.config.errorHandler = function (err, vm)  {
  vm.$notify.push({ type: 'error', title: 'Application error', message: err.message })
};

String.prototype.readable = function() {
  switch (this) {
  case 'supervisor': return 'Supervisor'
  case 'swift': return 'Swift'
  case 'docker': return 'Docker'
  case 'nginx': return 'NGINX'
  case 'node': return 'Node'
  case 'php': return 'PHP'
  case 'completed': return 'Completed'
  case 'deploying': return 'Deploying'
  case 'created': return 'Created'
  case 'deleting': return 'Deleting'
  case 'digitalocean': return 'Digital Ocean'
  case 'linode': return 'Linode'
  case 'running': return 'Running'
  case 'creating': return 'Creating'
  case 'postgresql': return 'PostgreSQL'
  case 'mysql': return 'MySQL'
  case 'aws': return 'AWS'
  case 'pro': return 'Pro'
  case 'dev': return 'Dev'
  case 'free': return 'Free'
  case 'hobby': return 'Hobby'
  default: return this
  }
}

String.prototype.ago = function() {
  return moment(this).fromNow()
}

String.prototype.format = function(format) {
  return moment(this).format(format)
}

new Vue({
  router, render: h => h(Root),
}).$mount('#app')

Number.prototype.format = function(n, x, s, c) {
  var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
      num = this.toFixed(Math.max(0, ~~n));
  
  return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};
