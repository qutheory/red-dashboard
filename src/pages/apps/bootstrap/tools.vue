<template lang="pug">
  div(class="vr-apps-bootstrap-tools" v-if="ready")
    h2 Configure Tools
    p Let's configure the required tools for {{ framework.name.capitalize() }} {{ framework.majorVersion }}.

    h3 Required Tools
    div(v-if="todoSource.length")
      p The following tools are required:
      vr-table(:source="todoSource")

    div(v-if="toolsInstalled.length")
      p The following compatible tools are already installed:
      vr-table(:source="toolsInstalledSource")

    div(v-if="toolsIncompatible.length")
      h3 Incompatible Tools
      p This server has incompatible tools installed:
      vr-table(:source="toolsIncompatibleSource")

    p(v-if="toolsIncompatible.length > 0") The application cannot be configured due to incompatible tools.
    p(v-if="toolsInstalling.length > 0") Please wait while the tool installs.

    div.buttons
      .spacer
      vr-button(
        @action="start" 
        :disabled="toolsIncompatible.length > 0 || toolsInstalling.length > 0"
        v-if="toolsNotInstalled.length > 0"
      ) Install {{ toolsNotInstalled[0].name.capitalize() }}
      vr-button(
        @action="next"
        :disabled="toolsIncompatible.length > 0 || toolsInstalling.length > 0"
        v-if="toolsNotInstalled.length == 0"
      ) Finish
      vr-button(color="clear") Skip
</template>

<script>
export default {
  name: 'vr-apps-bootstrap-tools',
  props: [],
  async mounted() {
    await this.load()
  },
  methods: {
    async start() {
      var tool = this.toolsNotInstalled[0]
      var res = await this.$api.servers.tools(this.server.id).create({
        toolID: tool.id
      })
      this.$notify.info('Installing ' + tool.name.capitalize(), 'Please wait while this tool is installed.')
      await this.load()
    },
    timeout(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },
    async next() {
      // this.$router.push({ name: 'apps.bootstrap.domains' })
      this.$router.push({ name: 'apps.show', params: { appID: this.app.id } })
    },
    async load() {
      this.$notify.loading.start()
      try {
        this.app = await this.$api.apps.show(this.$route.params.appID)
        this.framework = await this.$api.frameworks.show(this.app.frameworkID)
        this.server = await this.$api.servers.show(this.app.serverID)
        this.serverTools = await this.$api.servers.tools(this.app.serverID).index()
        this.tools = await this.$api.tools.index()
        this.ready = true
      } catch (error) {
        this.$notify.error('Could not load tools', error.message)
      } finally {
        this.$notify.loading.stop()
      }

      if (this.toolsInstalling.length > 0) {
        await this.timeout(5000)
        await this.load()
      }
    },
    versionString(version) {
      var versionString = version.major + '.' + version.minor
      if (version.patch) {
        versionString += '.' + version.patch
      }
      return versionString
    },
  },
  watch: { },
  computed: {
    todoSource() {
      return this.toolsNotInstalledSource.concat(this.toolsInstallingSource)
    },
    toolsNotInstalledSource() {
      return this.toolsNotInstalled.map(tool => {
        return {
          item: null,
          view: [
            { key: 'Name', val: tool.name.readable() },
            { key: 'Latest Version', val: this.versionString(tool.version) },
            { key: 'Status', val: 'Not Installed' }
          ]
        }
      })
    },
    toolsInstalledSource() {
      return this.toolsInstalled.map(tool => {
        return {
          item: null,
          view: [
            { key: 'Name', val: tool.name.readable() },
            { key: 'Version', val: this.versionString(tool.version) },
            { key: 'Status', val: 'Installed' }
          ]
        }
      })
    },
    toolsInstallingSource() {
      return this.toolsInstalling.map(tool => {
        return {
          item: null,
          view: [
            { key: 'Name', val: tool.name.readable() },
            { key: 'Version', val: this.versionString(tool.version) },
            { key: 'Status', val: 'Installing', class: 'loading' }
          ]
        }
      })
    },
    toolsIncompatibleSource() {
      return this.toolsIncompatible.map(tool => {
        return {
          item: null,
          view: [
            { key: 'Name', val: tool.name.readable() },
            { key: 'Version', val: this.versionString(tool.version) },
            { key: 'Status', val: 'Incompatible', class: 'Danger' }
          ]
        }
      })
    },


    toolsNotInstalled() {
      var results = []

      Object.keys(this.requiredTools).forEach(toolName => {
        var tools = this.requiredTools[toolName]

        var found = false
        tools.forEach(tool => {
          this.serverTools.forEach(serverTool => {
            if (tool.id == serverTool.toolID) {
              found = true
            }
          })
        })

        if (!found) {
          // no server tool, pick latest version
          results.push(tools[0])
        }
      })

      return results
    },
    toolsInstalled() {
      var results = []

      Object.keys(this.requiredTools).forEach(toolName => {
        var tools = this.requiredTools[toolName]
        this.serverTools.forEach(serverTool => {
          tools.forEach(tool => {
            if (tool.id == serverTool.toolID) {
              tool.status = serverTool.status
              if (tool.status == 'installed') {
                results.push(tool)
              }
            }
          })
        })
      })

      return results
    },
    toolsInstalling() {
      var results = []

      Object.keys(this.requiredTools).forEach(toolName => {
        var tools = this.requiredTools[toolName]
        this.serverTools.forEach(serverTool => {
          tools.forEach(tool => {
            if (tool.id == serverTool.toolID) {
              tool.status = serverTool.status
              if (tool.status == 'installing') {
                results.push(tool)
              }
            }
          })
        })
      })

      return results
    },
    toolsIncompatible() {
      var results = []

      Object.keys(this.requiredTools).forEach(toolName => {
        var tools = this.requiredTools[toolName]

        var serverTools = this.serverTools.map(serverTool => {
          serverTool.tool = this.tools.filter(tool => {
            return tool.id == serverTool.toolID
          })[0]
          return serverTool
        })

        this.serverTools.forEach(serverTool => {
          var match = false
          var exactMatch = false

          tools.forEach(tool => {
            if (tool.name == serverTool.name) {
              match = true
            }
            if (tool.id == serverTool.id) {
              exactMatch = true
            }
          })

          if (match && !exactMatch) {
            results.push(serverTool.tool)
          }
        })

      })

      return results
    },
    requiredTools() {
      var results = {}

      Object.keys(this.framework.requiredTools).forEach(toolName => {
        var tools = this.framework.requiredTools[toolName].map(toolID => {
          return this.tools.filter(tool => {
            return tool.id == toolID
          })[0]
        })

        // sort by latest version
        tools.sort((a, b) => {
          if (a.major >= b.major && a.minor >= b.minor && a.patch >= b.patch) {
            return -1
          } else {
            return 1
          }
        })
        results[toolName] = tools
      })

      return results
    },
  },
  data () {
    return {
      app: null,
      framework: null,
      server: null,
      serverTools: null,
      tools: null,

      ready: false
    }
  }
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.vr-apps-bootstrap-tools
  .vr-table
    margin-top: 16px
  p
    margin-bottom: 0
  h3
    margin-top: 16px

  .buttons
    margin-top: 16px
    display: flex
    .spacer
      flex-grow: 1
</style>
