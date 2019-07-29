<template lang="pug">
  div(class="vr-apps-commands-index" v-if="ready")
    div(class="empty" v-if="!commands.length")
      h2 No commands yet
      p Create this app's first command by clicking the plus button below.</p>
    div(v-if="!isSupervisorInstalled")
      h2 Commands
      p Supervisor is not installed on this server. Supervisor must be installed to manage commands.
      vr-button(@action="installSupervisor") Install Supervisor
    div(v-else)
      vr-table(
        :source="commands"
        :creatable="true"
        :actionable="true"
        @action="$router.push({ name: 'apps.commands.show', params: { commandID: $event.id }})"
        @create="$router.push({ name: 'apps.commands.create' })"
      )
</template>

<script>
export default {
  name: 'vr-apps-commands-index',
  props: ['app', 'server'],
  async mounted() {
    await this.load()
  },
  methods: {
    async load() {
      if (this.app) {
        this.$notify.loading.start()
        this.commandsRaw = await this.$api.apps.supervisorCommands(this.app.id).index()
        this.$notify.loading.stop()
        this.tools = await this.$api.tools.index()
        this.serverTools = await this.$api.servers.tools(this.server.id).index()
        this.ready = true
      }
    },
    installSupervisor() {
      this.$router.push({ name: 'servers.tools.show', params: { serverID: this.server.id, toolName: 'supervisor' }})
    }
  },
  watch: {
    async server() {
      await this.load()
    }
  },
  computed: {
    commands() {
      return this.commandsRaw.map(command => {
        return {
          item: command,
          view: [
            { key: 'Name', val: command.name },
            { key: 'User', val: command.user }
          ]
        }
      })
    },
    isSupervisorInstalled() {
      return this.serverTools.map(serverTool => {
        serverTool.tool = this.tools.filter(tool => tool.id == serverTool.toolID)[0]
        return serverTool
      }).filter(serverTool => {
        return serverTool.tool.name == 'supervisor'
      }).length > 0
    }
  },
  data () {
    return {
      commandsRaw: [],
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


.vr-apps-commands-index
  p
    margin-bottom: 0
</style>
