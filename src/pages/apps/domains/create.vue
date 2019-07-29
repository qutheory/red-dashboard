<template lang="pug">
.vr-apps-domains-create(v-if="ready")
  h2 New Domain

  .buttons
    vr-big-button(:active="domainType == 'redDomain'" @action="domainType = 'redDomain'")
      div(class="domainBtn")
        span vapor.red domain
    vr-big-button(:active="domainType == 'custom'", @action="domainType = 'custom'")
      div(class="domainBtn")
        span custom domain
  vr-form(ref='form', @action='create')

    div(v-if="domainType == 'redDomain'")
      div(class="info")
        p(class="title") INFO:
        br
        span This option gives you a domain ending with 
        strong .vapor.red 
        span You can either choose e.g. 
        strong my-app.vapor.red 
        span or with one or multiple levels of nesting e.g.: 
        strong my-app.my-company.vapor.red 
        br
        strong Important:
        span due to DNS updates, it might take a little while before the domain can be used.
      br
      vr-form-input(name='domainName', title='Domain Name', v-model='domainName', placeholder='my-app', required='', detail='Without .vapor.red')
    div(v-if="domainType == 'custom'")
      div(class="info")
        p(class="title") INFO:
        br
        span Use custom domain to use your own domain e.g.: 
        strong example.com or www.example.com 
        br 
        span Please note you need to add a DNS record (A record) for your domain to your servers IP before it works.
      br
      vr-form-input(name='domainName', title='Domain Name', v-model='domainName', placeholder='my.domain', required='')

    vr-form-select(title='Domain link', name='domainLink', placeholder='Choose', v-model='domainLink', required='')
      option(value="app") Application
      option(v-for="item in docker" :value="item.id") {{ item.name }}

    vr-form-select(title='Reverse Proxy', name='reverseProxy', placeholder='Choose', v-model='reverseProxy', required='')
      option(:value='true') Yes
      option(:value='false') No
    vr-form-input(name='rootLocation', placeholder='/Public', v-model='rootLocation', title='Root Location', required='')
    .buttons
      vr-button(@action='cancel', color='clear') Cancel
      .spacer
      vr-button(@action='$refs.form.submit()') Create
</template>

<script>
export default {
  name: 'vr-apps-domains-create',
  props: ['app'],
  async mounted() {
    await this.load()
  },
  methods: {
    async load() {
      this.$notify.loading.start()
        try {
          this.docker = await this.$api.apps.docker(this.app.id).index()
          this.ready = true
        } catch (error) {
          this.$notify.error('Could not load docker', error.message)
        } finally {
          this.$notify.loading.stop()
        }
    },
    async create() {
      this.$notify.loading.start()
      try {
        var appDockerID = this.domainLink
        if (appDockerID == 'app') {
          appDockerID = null
        }
        await this.$api.apps.nginxSites(this.app.id).create({
          domain: this.domainName,
          proxy: this.reverseProxy == 'true',
          rootLocation: this.rootLocation,
          redDomain: (this.domainType == 'redDomain') ? true : false,
          appDockerID: appDockerID
        })
        this.$notify.push({
          type: 'info', 
          title: 'Domain created', 
          message: 'The domain has been created successfully.' 
        })
        this.$router.push({ name: 'apps.domains.index', params: { appID: this.app.id } })
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
    cancel(e) {
      e.preventDefault()
      this.$router.push({ name: 'apps.domains.index', params: { appID: this.app.id } })
    }
  },
  data () {
    return {
      ready: null,
      docker: null,
      domainLink: 'app',
      domainName: null,
      reverseProxy: null,
      rootLocation: null,
      domainType: 'redDomain'
    }
  }
}
</script>

<style lang="sass">
@import "@/assets/base.sass"

.vr-apps-domains-create
  .warning
    background: rgba(255,229,100,.3)
    padding: .1rem 1.5rem
    border-left-width: .5rem
    border-left-style: solid
    border-color: #e7c000
    color: #6b5900
    line-height: 1.7
    .title
      color: #b29400
      font-weight: 600
      margin-bottom: -1.7rem
  .info
    background: #f3f5f7
    padding: .1rem 1.5rem
    border-left-width: .5rem
    border-left-style: solid
    border-color: #42b983
    color: #6b5900
    line-height: 1.7
    .title
      font-weight: 600
      margin-bottom: -1.7rem
  .buttons
    display: flex
    margin-bottom: 24px
    margin-top: 16px
  .domainBtn
    text-align: center
    width: 130px
  .vr-big-button
      margin-right: 16px
  h3
    margin-bottom: 24px

  .buttons
    display: flex
    .spacer
      flex-grow: 1
</style>
