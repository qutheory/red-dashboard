<template lang="pug">
  div(class="vr-servers-tools-show" v-if="ready")
    vr-box
      h2 {{ toolName.readable() }}
      div(v-if="serverTool")
        div(v-if="serverTool.status == 'installed'")
          p Version #[code {{ versionString(tool.version) }}] is currently installed.
          div.buttons
            vr-button(color="danger") Uninstall
        div(v-else)
          p Version #[code {{ versionString(tool.version) }}] is currently installing. Please wait.
      div(v-else)
          p {{ toolName.readable() }} is not installed on this server. Choose a compatible version to install.
          vr-form(ref="installForm" @action="install")
            vr-form-select(
              v-model="installToolID" 
              placeholder="Choose version" 
              title="Version" 
              required
            )
              option(v-for="tool in compatibleTools" :value="tool.id") {{ versionString(tool.version) }}
            vr-button(@action="$refs.installForm.submit()") Install
</template>

<script>
export default {
  name: 'vr-servers-tools-show',
  props: ['server'],
  async mounted() {
    await this.load()
  },
  methods: {
    async load() {
      if (this.server) {
        this.$notify.loading.start()
        var serverTools = await this.$api.servers.tools(this.server.id).index()
        var serverTools = serverTools.filter(serverTool => {
          return serverTool.toolID.startsWith(this.toolName)
        })
        if (serverTools.length > 0) {
          this.tool = await this.$api.tools.show(serverTools[0].toolID)
          this.serverTool = serverTools[0]
        }
        this.toolsRaw = await this.$api.tools.index()
        this.ready = true
        this.$notify.loading.stop()
      }
    },
    async install() {
      await this.$api.servers.tools(this.server.id).create({
        toolID: this.installToolID
      })
      this.$notify.info('Installing ' + this.toolName.readable(), 'Please wait while the tool installs.')
      this.$router.push({ name: 'servers.tools.index' })
    },
    versionString(version) {
        var versionString = `${version.major}.${version.minor}`
        if (version.patch) {
          versionString += `.${version.patch}`
        }
        return versionString
    },
    toolNameString(name) {
      switch (name) {
      case 'supervisor': return 'Supervisor'
      case 'swift': return 'Swift'
      case 'docker': return 'Docker'
      case 'nginx': return 'NGINX'
      case 'node': return 'Node'
      case 'php': return 'PHP'
      }
    }
  },
  watch: {
    async server() {
      await this.load()
    }
  },
  computed: {
    toolName() {
      return this.$route.params.toolName
    },
    compatibleTools() {
      if (!this.toolsRaw) {
        return null
      }
      var versions = {}
      var os = 'ubuntu' + this.server.ubuntuVersion
      os = os.replace('.', '')
      return this.toolsRaw.filter(tool => {
        return tool.osSupport.includes(os)
      }).filter(tool => {
        return tool.name == this.toolName
      })
    }
  },
  data () {
    return {
      serverTool: null,
      tool: null,
      toolsRaw: null,
      installToolID: null,
      ready: false
    }
  }
}

</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.vr-servers-tools-show
  .buttons
    .vr-button
      margin-right: 8px
  p
    code
      font-size: 16px
</style>
