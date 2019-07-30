<template lang="pug">
  .vr-servers-tools-index(v-if="ready")
    vr-table(
      :source="allTools"
      @action="choose"
      :actionable="true"
    )
  </div>
</template>

<script>
export default {
  name: 'vr-servers-tools-index',
  props: ['server'],
  async mounted() {
    await this.load()
  },
  methods: {
    async load() {
      if (this.server) {
        this.$notify.loading.start()
        try {
          var tools = await this.$api.tools.index()
          var serverTools = await this.$api.servers.tools(this.server.id).index()

          this.serverToolsRaw = serverTools.map(serverTool => {
            var match = tools.filter(tool => {
              return tool.id == serverTool.toolID
            })
            serverTool.tool = match[0]
            return serverTool
          })

          this.toolsRaw = tools
          this.ready = true
        } catch (error) {
          this.$notify.error('Could not load tools', error.message)
        } finally {
          this.$notify.loading.stop()
        }
        if (this.needsReloading) {
          await new Promise(resolve => setTimeout(resolve, 2000))
          if (!this._isDestroyed) {
            await this.load()
          }
        }
      }
    },
    choose(tool) {
      if (tool.status == 'installing') {
        this.$notify.info('Tool installing', 'This tool is still installing. Please wait.')
        return
      }

      if (tool.status == 'uninstalling') {
        this.$notify.info('Tool uninstalling', 'This tool is still unstalling. Please wait.')
        return
      }

      this.$router.push({ name: 'servers.tools.show', params: { 
        serverID: this.server.id, toolName: tool.name
      }})
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
      case 'prometheusGrafana': return 'Prometheus and Grafana'
      }
    }
  },
  watch: {
    async server() {
      await this.load()
    }
  },
  computed: {
    allTools() {
      if (!this.serverTools || !this.tools) {
        return null
      }
      return this.serverTools.concat(this.tools)
    },
    tools() {
      if (!this.toolsRaw) {
        return null
      }
      var versions = {}
      var os = 'ubuntu' + this.server.ubuntuVersion
      os = os.replace('.', '')
      return this.toolsRaw.filter(tool => {
        return tool.osSupport.includes(os)
      }).filter(tool => {
        var match = this.serverToolsRaw.filter(serverTool => serverTool.tool.name == tool.name)
        return match.length == 0
      }).filter(tool => {
        if (versions[tool.name]) {
          versions[tool.name].push(tool.version)
          return false
        } else {
          versions[tool.name] = [tool.version]
          return true
        }
      }).map(tool => {
        return {
          item: tool,
          view: {
            'Name': this.toolNameString(tool.name),
            'Versions': versions[tool.name].map(version => {
              return this.versionString(version)
            }).join(', '),
            'Status': 'Uninstalled'
          }
        }
      })
    },
    serverTools() {
      if (!this.serverToolsRaw) {
        return null
      }
      return this.serverToolsRaw.map(serverTool => {
        var statusString = ''
        var statusClass = null
        switch (serverTool.status) {
        case 'installed': 
          statusString = 'Installed'
          break
        case 'installing':
          statusString = 'Installing'
          statusClass = 'loading'
          break
        case 'uninstalling':
          statusString = 'Uninstalling'
          statusClass = 'loading'
          break
        }
        serverTool.tool.status = serverTool.status
        return {
          item: serverTool.tool,
          view: [
            { key: 'Name', val: this.toolNameString(serverTool.tool.name) },
            { key: 'Version', val: this.versionString(serverTool.tool.version) },
            { key: 'Status', val: statusString, class: statusClass }
          ]
        }
      })
    },
    needsReloading() {
      return this.serverToolsRaw.filter(serverTool => {
        return serverTool.status != 'installed' || serverTool.status != "uninstalling"
      }).length > 0
    }
  },
  data () {
    return {
      toolsRaw: null,
      serverToolsRaw: null,
      ready: false
    }
  }
}

</script>

<style lang="sass">
@import "@/assets/base.sass"

.vr-servers-tools-index
</style>
