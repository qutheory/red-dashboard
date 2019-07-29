<template lang="pug">
  div(class="vr-apps-docker" v-if="ready")
    .vr-title
      h2 {{ docker.name }}
      span Docker container

    vr-box(v-if="docker.type == 'redis'")
      h2 Redis connection details
      .infos
        vr-info(title="Public Host/IP", :value="server.ipv4")
        vr-info(title="Private Host/IP", :value="server.privateIP")
        vr-info(title="Port", :value="docker.port")
      p For connecting from an app on the same server, use the Private Host/IP. If you want to connect from another server, use the Public details.

    //- vr-box
    //-   h2 Stats

    //-   vr-info-box(type='note' title='Info' value='When loading stats, the values will start updating automatically. Information is fetched directly from Docker')

    //-   div(v-if="!stats")
    //-     vr-button(@action="loadStats") Load stats
    //-   div(v-else)
    //-     div(class="log" style="height: 100px")
    //-       pre {{ stats }}

    vr-box
      h2 Container

      div(v-if="!rawLogs")
        div(class="buttons")
          vr-button(@action="loadLogs") Load logs
          vr-button(@action="edit") Edit container
      div(v-else)
        div(class="log")
          span(v-for="log in logs")
            pre(v-for="part in log.parts" :data-color="JSON.stringify(part.color)") {{ part.text }}

    vr-box
      h2 Delete container
      p The container will be removed from the server after next deploy
      vr-button(color="danger" @action="deleteContainer") Delete
</template>

<script>
const { parse } = require ('ansicolor')

export default {
  name: 'vr-app',
  props: ['app', 'server'],
  async mounted() {
    await this.load()
  },
  methods: {
    async load() {
      if (this.app) {
        this.$notify.loading.start()
        try {
          this.docker = await this.$api.apps.docker(this.app.id).view(this.$route.params.dockerID)
          this.ready = true
        } catch (error) {
          this.$notify.error('Could not load container', error.message)
        } finally {
          this.$notify.loading.stop()
        }
      }
    },
    async loadLogs() {
      this.$notify.loading.start()
      if (this.logsSocket != null) {
        this.logsSocket.close()
      }
      this.logsSocket = await this.$api.docker.logs(this.$route.params.dockerID, (log) => {
        if (!this.rawLogs) {
          this.rawLogs = []
          this.$notify.loading.stop()
        }
        this.rawLogs.push(log)
      })
    },
    edit () {
      this.$router.push({ name: 'apps.docker.edit', params: { 
        dockerID: this.$route.params.dockerID
      }})
    },
    async deleteContainer() {
      var question = `Deleting ${this.docker.name} will delete all data related to the container on both Vapor Red and ${this.server.provider.readable()}. Type the name of the app to confirm.`
      var answer = prompt(question)
      if (answer == null) {
        return
      }
      if (answer.toLowerCase() == this.docker.name.toLowerCase()) {
        this.$notify.loading.start()
        try {
          await this.$api.apps.docker(this.app.id).delete(this.docker.id)
          this.$notify.info('Destroying container', 'The container is now being destroyed.')
          this.$router.push({ name: 'apps.docker.index' })
        } catch(error) {
          this.$notify.error('Destroy container failed', error.message)
        } finally {
          this.$notify.loading.stop()
        }
      } else {
        await this.deleteContainer()
      }
    }
  },
  computed: {
    logs() {
      return this.rawLogs.filter(log => log.type == 'stdout').map(log => {
        var parsed = parse(log.text)
        return {
          type: log.type,
          parts: parsed.spans,
        }
      })
    }
  },
  data() {
    return {
      docker: null,
      logsSocket: null,
      rawLogs: null,
      ready: false
    }
  }
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.vr-apps-docker
  .infos
    display: flex
    margin: 16px 0
    .vr-info
      margin-right: 16px
  .vr-title
    h2
      margin: 0
    span
      font-size: 16px
      font-weight: 400
      color: $color-gray
  .terminal
    padding: 16px
    background: $color-black
    color: $color-white
    font-family: 'Roboto Mono', monospace
    border-radius: 8px
    font-size: 14px
    margin-bottom: 16px
  .log
    background: $color-black
    color: $color-white
    padding: 16px
    border-radius: 8px
    font-family: 'Roboto Mono', monospace
    font-size: 14px
    height: 256px
    overflow-y: auto
    overflow-x: hidden
    user-select: text
    margin-bottom: 16px
    pre
      font-family: 'Roboto Mono', monospace
      display: inline
      white-space: pre-wrap
      word-break: break-all
      margin: 0
      &[data-color="{\"name\":\"cyan\"}"]
        color: $color-primary
      &[data-color="{\"name\":\"yellow\"}"]
        color: $color-warning
      &[data-color="{\"name\":\"red\"}"]
        color: $color-error
  .buttons
    display: flex
    .vr-button
      margin-right: 16px
  .box
    margin-bottom: 16px
    padding: 16px
    padding-bottom: 0px
    border-radius: 8px
    border: 2px solid $color-light-gray
</style>