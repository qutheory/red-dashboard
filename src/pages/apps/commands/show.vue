<template lang="pug">
  div(class="vr-apps-commands-show" v-if="ready")
    vr-box
      h2 {{ command.name }}
      div.terminal
        | $ {{ command.command }}
      p #[strong User:] {{ command.user }}#[br]#[strong Auto Start:] {{ command.autoStart }}#[br]#[strong Auto Restart:] {{ command.autoRestart }}
      div(class="buttons")
        vr-button(color="danger" @action="deleteCommand") Delete
    vr-box
      h2 Logs
      div(v-if="!rawLogs")
        p Supervisor logs for stdout and stderr.
        vr-button(@action="loadLogs") Load logs
      div(v-else)
        p Output (stdout):
        div(class="log")
          span(v-for="log in stdout")
            pre(v-for="part in log.parts" :data-color="JSON.stringify(part.color)") {{ part.text }}
        p Error Output (stderr):
        div(class="log")
          span(v-for="log in stderr")
            pre(v-for="part in log.parts" :data-color="JSON.stringify(part.color)") {{ part.text }}
</template>

<script>
const { parse } = require ('ansicolor')

export default {
  name: 'vr-apps-commands-show',
  props: ['app'],
  async mounted() {
    this.$notify.loading.start()
    try {
      var command = await this.$api.supervisorCommands.show(this.$route.params.commandID)
      this.command = command
      this.ready = true
    } catch(error) {
      this.$notify.error('Could not fetch command', error.message)
    } finally {
      this.$notify.loading.stop()
    }
  },
  beforeDestroy() {
    if (this.socket != null) {
      this.socket.close()
    }
  },
  methods: {
    async loadLogs() {
      this.$notify.loading.start()
      if (this.socket != null) {
        this.socket.close()
      }
      this.socket = await this.$api.supervisorCommands.logs(this.command.id, (log) => {
        if (!this.rawLogs) {
          this.rawLogs = []
          this.$notify.loading.stop()
        }
        this.rawLogs.push(log)
      })
    },
    async editCommand() {
      this.$router.push({ name: 'apps.commands.edit' })
    },
    async deleteCommand() {
      this.$notify.loading.start()
      try {
        await this.$api.supervisorCommands.delete(this.command.id)
        this.$notify.info('Command deleted', `${this.command.name} has been deleted.`)
        this.$router.push({ name: 'apps.commands.index' })
      } catch(error) {
        this.$notify.error('Could not delete command', error.message)
      } finally {
        this.$notify.loading.stop()
      }
    },
    cancel(e) {
      e.preventDefault()
      this.$router.push({ name: 'apps.commands.index' })
    }
  },
  computed: {
    stdout() {
      return this.rawLogs.filter(log => log.type == 'stdout').map(log => {
        var parsed = parse(log.text)
        return {
          type: log.type,
          parts: parsed.spans,
        }
      })
    },
    stderr() {
      return this.rawLogs.filter(log => log.type == 'stderr').map(log => {
        var parsed = parse(log.text)
        return {
          type: log.type,
          parts: parsed.spans,
        }
      })
    }
  },
  data () {
    return {
      command: null,
      ready: false,
      rawLogs: null,
      socket: null
    }
  }
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.vr-apps-commands-show
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
</style>
