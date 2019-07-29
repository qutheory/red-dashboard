<template lang="pug">
div(class="vr-server" v-if="ready")
  div(class="vr-title")
    h2 {{ server.name }}
    span Server
  div(class="vr-title-row")
    div(class="item")
      span(class="key") IPv4
      span(class="val") {{ server.ipv4 }}
    div(class="item")
      span(class="key") IPv6
      span(class="val") {{ server.ipv6 }}
    div(class="item")
      span(class="key") Private IP
      span(class="val") {{ server.privateIP }}
  vr-horizontal-nav
    router-link(:to="{ name: 'servers.apps.index', params: { serverID: $route.params.serverID } }") Apps
    router-link(:to="{ name: 'servers.provisions.index', params: { serverID: $route.params.serverID } }") Provisions
    router-link(:to="{ name: 'servers.keys.index', params: { serverID: $route.params.serverID } }") SSH
    router-link(:to="{ name: 'servers.networks.index', params: { serverID: $route.params.serverID } }") Network
    router-link(:to="{ name: 'servers.dbservers.index', params: { serverID: $route.params.serverID } }") Databases
    router-link(:to="{ name: 'servers.tools.index', params: { serverID: $route.params.serverID } }") Tools
    router-link(:to="{ name: 'servers.settings', params: { serverID: $route.params.serverID } }") Settings
  div(class="content")
    transition(name="slide-up")
      router-view(class="view" :server="server")
</template>

<script>
export default {
  name: 'vr-server',
  async mounted() {
    this.$notify.loading.start()
    try {
      this.server = await this.$api.server(this.$route.params.serverID).show()
      this.ready = true
    } catch(error) {
      this.$notify.push({
        type: 'error',
        title: 'Could not load server',
        message: error.message
      })
      this.$router.push({ name: 'servers.index' })
    } finally {
      this.$notify.loading.stop()
    }
    
    if (this.$route.name == 'servers.show') {
      this.$router.push({ name: 'servers.apps.index' })
    }
  },
  computed: { },
  data () {
    return {
      server: null,
      ready: false
    }
  }
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.vr-server
  .vr-title
    h2
      margin: 0
    span
      font-size: 16px
      font-weight: 400
      color: $color-gray

  .content
    position: relative
    .view
      width: 100%

  .vr-title-row
    display: flex
    padding: 16px 0
    margin-top: 16px
    border-top: 2px solid $color-light-gray
    border-bottom: 2px solid $color-light-gray
    .vr-dark &
      border-color: $color-dark-gray
    overflow-x: auto
    -webkit-overflow-scrolling: touch

    .item
      margin-right: 32px
      span
        display: block
        &.key
          font-size: 14px
          color: $color-gray
        &.val
          font-weight: 500
          user-select: text

    .sub-nav
      position: absolute
      left: 0
      z-index: 900
      background: $color-white
      
      @media only screen and (max-width: 700px)
        top: 0
        padding: 8px 16px
        display: flex
        width: 100%
        overflow-x: auto
        border-bottom: 2px solid $color-light-gray
        a
          margin-right: 16px

      @media only screen and (min-width: 700px)
        padding: 32px
        width: 160px
        height: 100%
        overflow-y: auto

      a
        font-size: 16px
        display: block
        padding-top: 4px
        padding-bottom: 4px
        color: $color-black
        opacity: 0.75
        &:hover
          opacity: 1

        &.router-link-active
          opacity: 1
          font-weight: 700
          color: $color-primary
</style>
