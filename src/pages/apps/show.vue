<template lang="pug">
.vr-app(v-if='app && server')
  .titles
    .title.server-title(@click='viewServer')
      h2 {{ server.name }}
      span Server
    span.separator →
    .title
      h2 {{ app.name }}
      span App
  .vr-title-row
    .item
      span.key Git Remote
      span.val {{ app.gitURL }}
    .item
      span.key Git Branch
      span.val {{ app.gitBranch }}
    .item
      span.key Framework
      span.val {{ app.frameworkID }}
    .item
      span.key Port
      span.val {{ app.port }}
  vr-horizontal-nav
    router-link(:to="{ name: 'apps.deploys.index' }") Deploy
    router-link(:to="{ name: 'apps.commands.index' }") Commands
    router-link(:to="{ name: 'apps.domains.index' }") Domains
    router-link(:to="{ name: 'apps.docker.index' }") Docker
    router-link(:to="{ name: 'apps.settings' }") Settings
  div(class="content")
    transition(name='slide-up')
      router-view(class="view" :app="app", :server="server")
</template>

<script>
export default {
  name: 'vr-app',
  props: [],
  async mounted() {
    this.app = await this.$api.app(this.$route.params.appID)
    this.server = await this.$api.server(this.app.serverID).show()    
    if (this.$route.name == 'apps.show') {
      this.$router.push({ name: 'apps.deploys.index' })
    }
  },
  methods: {
    async load() { },
    async viewServer(e) {
      e.preventDefault()
      this.$router.push({ name: 'servers.show', params: { serverID: this.app.serverID }})
    }
  },
  watch: {
    async server() {
      await this.load()
    },
    '$route'() {
      if (this.$route.name == 'apps.show') {
        this.$router.push({ name: 'apps.deploys.index' })
      }
    }
  },
  computed: {  },
  data () {
    return {
      app: null,
      server: null
    }
  }
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.vr-app
  position: relative

  .content
    position: relative
    .view
      width: 100%

  .titles
    width: 100%
    display: flex
    align-items: center
    overflow-x: auto
    padding-bottom: 16px
    -webkit-overflow-scrolling: touch

    .server-title
      cursor: pointer
      &:hover
        h2, span
          color: $color-primary

    .separator
      margin-left: 16px
      margin-right: 16px
      color: $color-gray
      font-size: 24px

    .title
      flex-shrink: 0
      h2
        margin: 0
      span
        color: $color-gray
        font-weight: 400
        font-size: 16px

  .vr-title-row
    display: flex
    padding: 16px 0
    border-top: 2px solid $color-light-gray
    border-bottom: 2px solid $color-light-gray
    .vr-dark &
      border-color: $color-dark-gray
    overflow-x: auto
    -webkit-overflow-scrolling: touch

    .item
      flex-shrink: 0
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
        width: 200px
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
