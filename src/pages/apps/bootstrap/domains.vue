<template lang="pug">
  div.vr-apps-bootstrap-domains(v-if="ready")
    h2 Configure Domains
    p Finally, let's configure a domain to access your application.
    vr-form(ref='form', @action='createDomain')
      vr-form-input(name='domainName', title='Domain Name', v-model='domainName', placeholder='my.domain', required)
      div(v-if="app.frameworkID == 'vapor-3'")
      div(v-else-if="app.framework == 'vue-2'")
      div(v-else)
        vr-form-select(title='Reverse Proxy', name='reverseProxy', placeholder='Choose', v-model='reverseProxy', required)
          option(:value='true') Yes
          option(:value='false') No
        vr-form-input(name='rootLocation', placeholder='/Public', v-model='rootLocation', title='Root Location', required)
      vr-button(@action="$refs.form.submit()") Finish
      vr-button(color="clear") Skip
</template>

<script>
export default {
  name: 'vr-apps-bootstrap-domains',
  props: [],
  async mounted() {
    await this.load()
  },
  methods: {
    async load() {
      this.$notify.loading.start()
      try {
        this.app = await this.$api.apps.show(this.$route.params.appID)
        this.ready = true
      } catch (error) {
        this.$notify.error('Could not load tools', error.message)
      } finally {
        this.$notify.loading.stop()
      }
    },
    async createDomain() {
      var reverseProxy = this.reverseProxy
      var rootLocation = this.rootLocation
      if (this.app.frameworkID == 'vapor-3') {
        reverseProxy = true
        rootLocation = '/Public'
      }
      if (this.app.frameworkID == 'vue-2') {
        reverseProxy = false
        rootLocation = '/dist'
      }
      if (reverseProxy == 'true') {
        reverseProxy = true
      }
      if (reverseProxy == 'false') {
        reverseProxy = false
      }
      this.$notify.loading.start()
      try {
        this.domain = await this.$api.apps.nginxSites(this.app.id).create({
          domain: this.domainName,
          proxy: reverseProxy,
          rootLocation: rootLocation
        })
        var networks = await this.$api.servers.networks(this.app.serverID).index()
        var httpNetworks = networks.filter(network => network.port == 80)
        if (!httpNetworks.length) {
          await this.$api.servers.networks(this.app.serverID).create({
            proto: 'http',
            port: 80,
            source: '0.0.0.0/0',
            description: 'http'
          })
          this.$notify.push({ 
            type: 'info', 
            title: 'Domain and firewall rule created', 
            message: 'Your domain and an HTTP firewall rule have been created successfully.' 
          })
        } else {        
          this.$notify.push({
            type: 'info', 
            title: 'Domain created', 
            message: 'Your domain has been created successfully.' 
          })
        }
        this.$router.push({ name: 'apps.show', params: { appID: this.app.id } })
      } catch(error) {
        this.$notify.push({ 
          type: 'error', 
          title: 'Could not create domain', 
          message: error.message 
        })
      } finally {
        this.$notify.loading.stop()
      }
    },
  },
  watch: { },
  computed: {  },
  data () {
    return {
      app: null,
      ready: false,
      domainName: null,
      reverseProxy: null,
      rootLocation: null,
      domain: null
    }
  }
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.vr-apps-bootstrap-domains
</style>
