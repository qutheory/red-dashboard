<template lang="pug">
  .vr-servers-dbservers-databases-show(v-if="ready")
    vr-box
      .infos
        vr-info(title="Database", :value="databaseServer.type.readable()")
        vr-info(title="Status", :value="database.status.readable()")
        vr-info(title="Created", :value="database.createdAt.ago()")
    vr-box      
      .infos
        vr-info(title="IP", :value="server.ipv4")
        vr-info(title="Port", :value="port")
        vr-info(title="Database", :value="database.database")
        vr-info(title="Username", :value="database.username")
        vr-info(title="Password", :value="password")
      p Use the connect URL to quickly connect applications to your database.
      pre.code {{ databaseServer.type }}://{{ database.username }}:{{ password }}@{{ server.ipv4 }}:{{ port }}/{{ database.database }}
      div(v-if="showCredentials")
        vr-button(@action="showCredentials = false") Hide password
      div(v-else)
        vr-button(@action="showCredentials = true") Show password
    vr-box
      div(v-if="dbNetwork")
        .infos
          vr-info(title="External Access", value="Allowed")
          vr-info(title="Source", :value="dbNetwork.source")
        p This server's firewall is configured to allow TCP on port {{ port }}. This means you can access this database from the internet.
      div(v-else)
        .infos
          vr-info(title="External Access", value="Not Allowed")
        p No firewall rule is currently configured for TCP on port {{ port }}. This means you will not be able to access this database from the internet.
      vr-button(@action="network") Firewall rules
    vr-button(color="clear" @action="back") Back
</template>

<script>
export default {
  name: 'vr-servers-dbservers-databases-show',
  props: ['server'],
  async mounted() {
    this.$notify.loading.start()
    try {
      this.database = await this.$api.databases(this.$route.params.databaseID).show()
      this.databaseServer = await this.$api.databaseServers(this.$route.params.databaseServerID).show()
      this.networks = await this.$api.servers.networks(this.server.id).index()
      this.ready = true
    } catch(error) {
      this.$notify.error('Could not load database', error.message)
    } finally {
      this.$notify.loading.stop()
    }
  },
  methods: {
    back() {
      this.$router.push({ name: 'servers.dbservers.show' })
    },
    network() {
      this.$router.push({ name: 'servers.networks.index' })
    }
  },
  computed: {
    port() {
      if (this.databaseServer.type == 'postgresql') {
        return 5432
      } else {
        return 3306
      }
    },
    password() {
      if (this.showCredentials) {
        return this.database.password
      } else {
        return '••••••••'
      }
    },
    dbNetwork() {
      var networks = this.networks.filter(network => {
        return network.proto == 'tcp' && network.port == this.port
      })
      if (networks.length) {
        return networks[0]
      } else {
        return null
      }
    }
  },
  data () {
    return {
      database: null,
      databaseServer: null,
      ready: false,
      showCredentials: false,
      networks: null
    }
  }
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.vr-servers-dbservers-databases-show
  .infos
    overflow-y: auto
    display: flex
    margin: 16px 0
    .vr-info
      margin-right: 16px

  .code
    overflow-y: auto
    font-family: 'Roboto Mono', monospace
    font-size: 14px
    background: $color-black
    color: $color-white
    padding: 16px
    border-radius: 8px
    user-select: all
</style>
