<template lang="pug">
  div(class="vr-apps-domains-show" v-if="ready")
    vr-box
      .infos
        vr-info(title="Domain", :value="domain.domain")
        vr-info(title="Reverse Proxy", :value="domain.proxy ? 'Yes' : 'No'")
        vr-info(title="Public Folder", :value="domain.rootLocation")
      div(class="buttons")
        vr-button(@action="editDomain") Edit
        vr-button(color="danger" @action="deleteDomain") Delete
    vr-box
      h3 Transport Layer Security (SSL)
      div(v-if="!domain.tlsLocation")
        p Enable Let's Encrypt TLS for this domain.
        vr-button(@action="createTLS") Configure TLS
      div(v-else)
        p Let's Encrypt TLS is currently configured.
        div(class="buttons")
          vr-button(@action="createTLS") Update Certificate
          vr-button(color="danger" @action="deleteTLS") Delete
</template>

<script>
export default {
  name: 'vr-apps-domains-show',
  props: ['app'],
  async mounted() {
    this.$notify.loading.start()
    try {
      var domain = await this.$api.nginxSites.show(this.$route.params.domainID)
      this.domain = domain
      this.ready = true
    } catch(error) {
      this.$notify.error('Could not fetch domain', error.message)
    } finally {
      this.$notify.loading.stop()
    }
  },
  methods: {
    async update() {
      await this.$api.nginxSites.update(this.domain.id, {
        proxy: this.reverseProxy == 'true',
        domain: this.domainName,
        rootLocation: this.rootLocation,
        nginxConfig: this.nginxConfig
      })
      this.$notify.info('Domain updated', `${this.domain.domain} has been updated.`)
      this.$router.push({ name: 'apps.domains.index' })
    },
    async deleteDomain() {
      this.$notify.loading.start()
      try {
        await this.$api.nginxSites.delete(this.domain.id)
        this.$router.push({ name: 'apps.domains.index', params: { appID: this.app.id }})
      } catch(error) {
        this.$notify.error('Could not delete domain', error.message)
      } finally {
        this.$notify.loading.stop()
      }
    },
    async createTLS() {
      this.$notify.loading.start()
      try {
        await this.$api.nginxSites.tls(this.domain.id).create()
        this.$router.push({ name: 'servers.provisions.index', params: { serverID: this.app.serverID }})
      } catch(error) {
        this.$notify.error('Could not create TLS', error.message)
      } finally {
        this.$notify.loading.stop()
      }
    },
    async deleteTLS() {
      this.$notify.loading.start()
      try {
        await this.$api.nginxSites.tls(this.domain.id).delete()
        this.$router.push({ name: 'servers.provisions.index', params: { serverID: this.app.serverID }})
      } catch(error) {
        this.$notify.error('Could not delete TLS', error.message)
      } finally {
        this.$notify.loading.stop()
      }
    },
    async editDomain() {
      this.$router.push({ name: 'apps.domains.edit' })
    },
    cancel(e) {
      e.preventDefault()
      this.$router.push({ name: 'apps.domains.index' })
    }
  },
  data () {
    return {
      domain: null,
      ready: false
    }
  }
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.vr-apps-domains-show
  .infos
    display: flex
    margin: 16px 0
    .vr-info
      margin-right: 16px
  .buttons
    display: flex
    .vr-button
      margin-right: 16px
</style>
