<template lang="pug">
  .vr-servers-databases-show(v-if="ready")
    vr-box
      .infos
        vr-info(title="Database Server", :value="database.type.readable()")
        vr-info(title="Status", :value="database.status.readable()")
        vr-info(title="Databases", :value="databasesRaw.length")
        vr-info(title="Administrative user", :value="user")
        vr-info(title="Administrative password", :value="password")

      div(v-if="showCredentials")
        vr-button(@action="showCredentials = false") Hide password
      div(v-else)
        vr-button(@action="showCredentials = true") Show password
    vr-table(
      :source="databases"
      @create="createDatabase"
      :creatable="true"
      @action="showDatabase"
      :actionable="true"
    )
</template>

<script>
export default {
  name: 'vr-servers-databases-show',
  props: ['server'],
  async mounted() {
    await this.load()
  },
  methods: {
    async load() {
      if (this.server) {
        this.$notify.loading.start()
        try {
          this.database = await this.$api.databaseServers(this.$route.params.databaseServerID).show()
          this.databasesRaw = await this.$api.databaseServers(this.$route.params.databaseServerID).databases.index()
          this.ready = true
        } catch(error) {
          this.$notify.error('Could not load database server', error.message)
        } finally {
          this.$notify.loading.stop()
        }
      }
    },
    createDatabase() {
      this.$router.push({ name: 'servers.dbservers.databases.create' })
    },
    showDatabase(db) {
      this.$router.push({ name: 'servers.dbservers.databases.show', params: { databaseID: db.id } })
    }
  },
  computed: {
    databases() {
      return this.databasesRaw.map( database => {
        return {
          item: database,
          view: {
            'Database': database.database,
            'Username': database.username,
            'Status': database.status.readable(),
          }
        }
      })
    },
    password() {
      if (this.showCredentials) {
        return this.database.rootPassword
      } else {
        return '••••••••'
      }
    },
    user() {
      if (this.database.type == 'postgresql') {
        return 'postgres'
      } else if(this.database.type == 'mysql') { 
        return 'root'
      } else {
        return 'Not found'
      }
    }
  },
  data () {
    return {
      database: null,
      databasesRaw: null,
      ready: false,
      showCredentials: false
    }
  }
}
</script>

<style lang="sass">
@import "@/assets/base.sass"

.vr-servers-databases-show
  .infos
    display: flex
    margin: 16px 0
    .vr-info
      margin-right: 16px
</style>
