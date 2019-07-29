<template lang="pug">
  .vr-servers-dbservers-index(v-if="ready")
    vr-box.postgres.db
      h2 PostgreSQL
      div(v-if="postgres")
        .infos
          vr-info(title="Status", :value="postgres.status.readable()")
          vr-info(title="Created", :value="postgres.createdAt.ago()")
        vr-button(@action="chooseDBServer(postgres)") Details
        vr-button(color="danger", @action="deleteDBServer(postgres)") Destroy
      div(v-else)
        p PostgreSQL is not currently installed on this server.
        vr-button(@action="createDBServer('postgresql')") Install
    vr-box.mysql.db
      h2 MySQL
      div(v-if="mysql")
        .infos
          vr-info(title="Status", :value="mysql.status.readable()")
          vr-info(title="Created", :value="mysql.createdAt.ago()")
        vr-button(@action="chooseDBServer(mysql)") Details
        vr-button(color="danger", @action="deleteDBServer(mysql)") Destroy
      div(v-else)
        p MySQL is not currently installed on this server.
        vr-button(@action="createDBServer('mysql')") Install
    vr-box.redis.db
      h2 Redis
      div(v-if="redis")
        .infos
          vr-info(title="Status", :value="redis.status.readable()")
          vr-info(title="Created", :value="redis.createdAt.ago()")
        vr-button(color="danger", @action="deleteRedis") Destroy
      .div(v-else)
        p Redis is not currently installed on this server.
        vr-button(@action="createRedis") Install
</template>

<script>
export default {
  name: 'vr-servers-dbservers-index',
  props: ['server'],
  async mounted() {
    await this.load()
  },
  methods: {
    async load() {
      if (this.server) {
        this.$notify.loading.start()
        try {
          this.databaseServers = await this.$api.servers.databaseServers(this.server.id).index()
          try {
            this.redis = await this.$api.server(this.server.id).redis.show()
          } catch {
            // ignore
          }
          this.ready = true
        } catch(error) {
          this.$notify.error('Could not load database servers', error.message)
        } finally {
          this.$notify.loading.stop()
        }
        if (this.isCreating) {
          await this.check()
        }
      }
    },
    async check() {
      await new Promise(resolve => setTimeout(resolve, 2000))
      this.databaseServers = await this.$api.servers.databaseServers(this.server.id).index()
      try {
        this.redis = await this.$api.server(this.server.id).redis.show()
      } catch {
        // ignore
      }
      if (this.isCreating) {
        await this.check()
      }
    },
    chooseDBServer(databaseServer) {
      if (databaseServer.status == 'creating') {
        this.$notify.info('Database server not ready yet', 'Please wait while your database server is created')
        return
      }
      this.$router.push({ name: 'servers.dbservers.show', params: { databaseServerID: databaseServer.id }})
    },
    async createDBServer(type) {
      this.$notify.loading.start()
      try {
        await this.$api.servers.databaseServers(this.server.id).create({
          type: type
        })
        this.$notify.info('Creating database server', 'Please wait while your database server is created')
        await this.load()
      } catch (error) {
        this.$notify.error('Could not create database server', error.message)
      } finally {
        this.$notify.loading.stop()
      }
    },
    async createRedis() {
      this.$notify.loading.start()
      try {
        await this.$api.server(this.server.id).redis.create()
        this.$notify.info('Creating Redis server', 'Please wait while your Redis server is created')
        await this.load()
      } catch (error) {
        this.$notify.error('Could not create Redis server', error.message)
      } finally {
        this.$notify.loading.stop()
      }
    },
    async deleteDBServer(dbServer) {
      if (!confirm(`Are you sure you want to delete your ${dbServer.type.readable()} server?`)) {
        return
      }
      this.$notify.loading.start()
      try {
        await this.$api.databaseServers(dbServer.id).delete()
        this.$notify.info('Database server deleted', 'Your database server has been deleted')
        await this.load()
      } catch (error) {
        this.$notify.error('Could not delete database server', error.message)
      } finally {
        this.$notify.loading.stop()
      }
      await this.load()
    },
    async deleteRedis() {
      if (!confirm(`Are you sure you want to delete your Redis server?`)) {
        return
      }
      this.$notify.loading.start()
      try {
        await this.$api.redis(this.redis.id).delete()
        this.$notify.info('Redis server deleted', 'Your Redis server has been deleted')
        await this.load()
      } catch (error) {
        this.$notify.error('Could not delete Redis server', error.message)
      } finally {
        this.$notify.loading.stop()
      }
      await this.load()
    }
  },
  computed: {
    mysql() {
      if (!this.databaseServers) {
        return null
      }
      var res = this.databaseServers.filter(db => db.type == 'mysql')
      if (res.length) {
        return res[0]
      } else {
        return null
      }
    },
    postgres() {
      if (!this.databaseServers) {
        return null
      }
      var res = this.databaseServers.filter(db => db.type == 'postgresql')
      if (res.length) {
        return res[0]
      } else {
        return null
      }
    },
    isCreating() {
      if (!this.databaseServers) {
        return null
      }
      return this.databaseServers.filter(dbServer => dbServer.status == 'creating').length > 0
    }
  },
  data () {
    return {
      databaseServers: null,
      redis: null,
      ready: false
    }
  }
}
</script>

<style lang="sass">
@import "@/assets/base.sass"

.vr-servers-dbservers-index
  .db
    .vr-button
      margin-right: 8px
  .infos
    display: flex
    margin: 16px 0
    .vr-info
      margin-right: 16px
</style>
