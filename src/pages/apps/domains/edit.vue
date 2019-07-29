<template lang="pug">
  div(class="vr-apps-domains-edit" v-if="ready")
    h2 Edit Domain
    vr-form(ref="form" @action="update" v-if="domain")
      vr-form-input(
        name="domainName" 
        title="Domain Name" 
        v-model="domainName"
        placeholder="my.domain"
        required
        disabled
        detail="Domain name cannot be changed."
      )
      vr-form-select(
        title="Reverse Proxy" 
        name="reverseProxy" 
        placeholder="Choose" 
        v-model="reverseProxy" 
        required
        detail="Reverse proxy cannot be changed."
      )
        option(value="true") Yes
        option(value="false") No
      vr-form-input(
        name="rootLocation" 
        placeholder="/Public" 
        v-model="rootLocation" 
        title="Root Location"
        required
      )

      p Customize this domain's NGINX configuration:
      vr-code-editor(v-model="nginxConfig" mime="text/x-nginx-conf")

      div(class="buttons")
        vr-button(@action="cancel" color="clear") Cancel
        div(class="spacer")
        vr-button(@action="$refs.form.submit()") Update
</template>

<script>
export default {
  name: 'vr-apps-domains-edit',
  props: ['app'],
  async mounted() {
    this.$notify.loading.start()
    try {
      var domain = await this.$api.nginxSites.show(this.$route.params.domainID)
      this.domainName = domain.domain
      this.reverseProxy = domain.proxy ? 'true' : 'false'
      this.rootLocation = domain.rootLocation
      this.nginxConfig = domain.nginxConfig
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
      this.$notify.loading.start()
      try {
        await this.$api.nginxSites.update(this.domain.id, {
          proxy: this.reverseProxy == 'true',
          domain: this.domainName,
          rootLocation: this.rootLocation,
          nginxConfig: this.nginxConfig
        })
        this.$notify.info('Domain updated', `${this.domain.domain} has been updated.`)
        this.$router.push({ name: 'apps.domains.show' })
      } catch(error) {
        this.$notify.error('Could not update domain', error.message)
      } finally {
        this.$notify.loading.stop()
      }
    },
    cancel(e) {
      e.preventDefault()
      this.$router.push({ name: 'apps.domains.show' })
    }
  },
  data () {
    return {
      domain: null,
      domainName: null,
      reverseProxy: null,
      rootLocation: null,
      nginxConfig: null,
      ready: false
    }
  }
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.vr-apps-domains-edit
  .box
    margin-top: 16px

  .vr-code-editor
    margin-top: 16px

  .vr-form
    p
      margin-top: 16px
  .buttons
    margin-top: 16px
    display: flex
    .vr-button
      margin-right: 16px
      &:last-child
        margin-right: 0
    .spacer
      flex-grow: 1

  .box
    padding: 16px
    border-radius: 8px
    border: 2px solid $color-light-gray
    p
      margin: 0
      margin-top: 16px
      padding: 0

</style>
