<template lang="pug">
  div(class="vr-app-domains" v-if="ready")
    div(v-if="!isNginxInstalled")
      h2 Domains
      p NGINX is not installed on this server. NGINX must be installed to manage domains.
      div(class="buttons")
        vr-button(@action="installNGINX") Install NGINX
    div(v-else-if="!domains.length" class="empty")
      h2 No domains yet
      p This app doesn't have any domains yet.
      .buttons
        vr-button(@action="$router.push({ name: 'apps.domains.create' })") Create Domain
    div(v-else)
      vr-table(
        :source="domains"
        :creatable="true"
        :actionable="true"
        @action="$router.push({ name: 'apps.domains.show', params: { domainID: $event.id }})"
        @create="$router.push({ name: 'apps.domains.create' })"
      )
</template>

<script>
export default {
  name: 'vr-app-domains',
  props: ['app', 'server'],
  async mounted() {
    await this.load()
  },
  methods: {
    async load() {
      if (this.app) {
        this.$notify.loading.start()
        this.domainsRaw = await this.$api.apps.nginxSites(this.app.id).index()
        this.dockerRaw = await this.$api.apps.docker(this.app.id).index()
        this.$notify.loading.stop()
        this.tools = await this.$api.tools.index()
        this.serverTools = await this.$api.servers.tools(this.server.id).index()
        this.ready = true
      }
    },
    installNGINX() {
      this.$router.push({ name: 'servers.tools.show', params: { serverID: this.server.id, toolName: 'nginx' }})
    }
  },
  watch: {
    async server() {
      await this.load()
    }
  },
  computed: {
    domains() {
      return this.domainsRaw.map(domain => {
        if (domain.appDockerID != null) {
          return {
            item: domain,
            view: [
              { key: 'Domain', val: domain.domain },
              { key: 'Status', val: domain.status.capitalize() },
              { key: 'Docker container', val: this.dockerRaw.filter((docker) => docker.id == domain.appDockerID)[0].name }
            ]
          }
        } else {
          return {
            item: domain,
            view: [
              { key: 'Domain', val: domain.domain },
              { key: 'Status', val: domain.status.capitalize() },
              { key: '', val: '' }
            ]
          }
        }
      })
    },
    isNginxInstalled() {
      return this.serverTools.map(serverTool => {
        serverTool.tool = this.tools.filter(tool => tool.id == serverTool.toolID)[0]
        return serverTool
      }).filter(serverTool => {
        return serverTool.tool.name == 'nginx'
      }).length > 0
    }
  },
  data () {
    return {
      domainsRaw: [],
      dockerRaw: [],
      tools: null,
      serverTools: null,
      ready: false
    }
  }
}
String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

@keyframes load
  0%
    left: 0px
  100%
    left: 10px


.vr-app-domains
  p
    margin-bottom: 0
  .buttons
    margin-top: 16px
</style>
