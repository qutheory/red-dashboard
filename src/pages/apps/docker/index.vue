<template lang="pug">
  div(class="vr-apps-docker" v-if="ready")
    div(v-if="!isDockerInstalled")
      h2 Docker containers
      p Docker is not installed on the server. Please install Docker first
      vr-button(@action="installDocker") Install Docker
    div(v-else)
      h2 Docker containers
      p You can create multiple Docker containers for your application, each with their own Dockerfile.
      vr-info-box(
        type="note" 
        title="Info" 
        value="Be aware that the more docker containers can slow down the deployment."
      )

      div(v-if="!stats" style="float:right;")
        vr-button(@action="loadStats" style="margin-bottom:0px;") Load stats
      div(v-else)
        vr-button(@action="closeStats" style="margin-bottom:0px; float:right") Close stats
        div(style="clear:both;")
        div(class="log" style="height: 100px")
          pre {{ stats }}

      div(style="clear:both;")

      vr-table(
        :source="docker"
        @create="$router.push({ name: 'apps.docker.create' })"
        @action="choose"
        :creatable="true"
        :actionable="true"
      )
</template>

<script>
const { strip } = require ('ansicolor')

export default {
  props: ['app', 'server'],
  async mounted() {
    await this.load()
  },
  methods: {
    async closeStats() {
      if (this.statsSocket != null) {
        this.statsSocket.close()
      }
      this.stats = null
    },
    async loadStats() {
      this.$notify.loading.start()
      if (this.statsSocket != null) {
        this.statsSocket.close()
      }
      this.statsSocket = await this.$api.docker.stats(this.app.id, (stats) => {
        if (!this.stats) {
          this.stats = ''
          this.$notify.loading.stop()
        }
        this.stats = strip(stats)
      })
    },
    async load() {
      if (this.app) {
        this.$notify.loading.start()
        try {
          this.dockerRaw = await this.$api.apps.docker(this.app.id).index()
          this.serverTools = await this.$api.servers.tools(this.server.id).index()
          this.tools = await this.$api.tools.index()
          this.ready = true
        } catch (error) {
          this.$notify.error('Could not load apps', error.message)
        } finally {
          this.$notify.loading.stop()
        }
      }
    },
    choose(docker) {
      this.$router.push({ name: 'apps.docker.show', params: { 
        dockerID: docker.id 
      }})
    },
    installDocker() {
      this.$router.push({ name: 'servers.tools.show', params: { serverID: this.server.id, toolName: 'docker' }})
    }
  },
  computed: {
    docker() {
      if (!this.dockerRaw) {
        return null
      }

      return this.dockerRaw.map(docker => {
        if(docker.type == 'dockerfile') {
          return {
            item: docker,
            view: {
              'Name': docker.name,
              'Type': docker.type,
              'port': docker.port,
              'Dockerfile': docker.dockerfile
            }
          }
        } else {
          return {
            item: docker,
            view: {
              'Name': docker.name,
              'Type': docker.type,
              'port': docker.port,
              '': ''
            }
          }
        }
      })
    },
    isDockerInstalled() {
      return this.serverTools.map(serverTool => {
        serverTool.tool = this.tools.filter(tool => tool.id == serverTool.toolID)[0]
        return serverTool
      }).filter(serverTool => {
        return serverTool.tool.name == 'docker'
      }).length > 0
    }
  },
  data() {
    return {
      statsSocket: null,
      ready: false,
      stats: null,
      dockerRaw: null,
      tools: null,
      serverTools: null,
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/assets/base.sass"

</style>
