<template lang="pug">
  div(class="vr-servers" v-if="ready")
    div(class="empty" v-if="serversRaw.length <= 0")
      h1 No servers yet
      p Create your first server by clicking the plus button below. Or switch to a different company by clicking your name on the top right.</p>
    div(v-else)
      h1 Servers
    vr-table(
      :source="servers"
      @action="chooseServer"
      @create="newServer"
      :creatable="true"
      :actionable="true"
    )
</template>

<script>
export default {
  name: 'vr-servers',
  props: ['company'],
  methods: {
    async load() {
      if (this.company.plan != 'free' && !this.company.isSubscriptionActive) {
        this.$router.push({ name: 'subscription-inactive' })
      }

      this.$notify.loading.start()
      try {
        this.serversRaw = await this.$api.servers.index()
        this.serversRaw.forEach((server, i) => {
          if (server.status != 'running') {
            this.checkServerStatus(server, i)
          }
        })
        this.ready = true
      } catch(error) {
        this.$notify.push({
          type: 'error',
          title: 'Could not load servers',
          message: error.message
        })
      } finally {
        this.$notify.loading.stop()
      }
    },
    chooseServer(server) {
      if (server.status != 'running') {
        this.$notify.info('Server not ready yet', 'Your newly created server is still being configured. This may take a few minutes.')
        return
      }
      this.$router.push({ name: 'servers.show', params: { serverID: server.id } })
    },
    newServer() {
      this.$router.push({ name: 'servers.create' })
    },
    checkServerStatus(server, i) {
      if (serverStatusTimers[server.id]) {
        return
      }
      console.log('Checking server status', server.id)
      serverStatusTimers[server.id] = setTimeout(() => {
        this.$api.servers.show(server.id).then(server => {
          this.serversRaw.splice(i, 1, server)
          serverStatusTimers[server.id] = null
          switch (server.status) {
          case 'creating', 'bootstrap':
            this.checkServerStatus(server, i)
            break
          case 'running':
            this.$notify.info('Server Running', 'Your newly created server is now running.')
          default:
            break
          }
        })
      }, 5000)
    },
  },
  async mounted() {
    if (this.company) {
      await this.load()
    }
  },
  computed: {
    servers() {
      return this.serversRaw.map(server => {
        var statusString = server.status
        var statusClass = null
        switch (server.status) {
        case 'running':
          statusString = 'Running'
          break
        case 'bootstrap':
          statusString = 'Configuring'
          statusClass = 'loading'
          break
        case 'creating':
          statusString = 'Creating'
          statusClass = 'loading'
          break
        default: break
        }

        var ipString = server.ipv4
        if (!server.ipv4) {
          ipString = '...'
        }
        return {
          item: server,
          view: [
            { key: 'Name', val: server.name },
            { key: 'Provider', val: server.provider.readable() },
            { key: 'IP Address', val: ipString },
            { key: 'Ubuntu version', val: server.ubuntuVersion },
            { key: 'Status', val: statusString, class: statusClass },
          ]
        }
      })
    }
  },
  watch: {
    async company() {
      this.ready = false
      this.serversRaw = null
      await this.load()
    }
  },
  data () {
    return {
      serversRaw: null,
      previousCompany: null,
      ready: false
    }
  }
}

var serverStatusTimers = {}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.vr-servers
  h1
    margin-top: 0
  .empty
    margin-bottom: 24px

</style>
