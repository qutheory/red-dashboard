<template lang="pug">
  .vr-servers-dbservers-databases-create
    h2 Create Database
    vr-form(@action="create" ref="form")
      vr-form-input(
        title="Name" 
        v-model="database" 
        placeholder="my-database" 
        name="databaseName"
        required
      )
      vr-form-input(
        title="Username" 
        name="databaseUsername"
        v-model="username" 
        placeholder="my-username" 
        required
      )
      vr-form-input(
        name="databasePassword"
        title="Password" 
        type="password"
        v-model="password" 
        required
      )
    .buttons
      vr-button(
        color="clear" 
        @action="$router.push({ name: 'servers.dbservers.show' })"
      ) Cancel
      .spacer
      vr-button(
        @action="$refs.form.submit()"
      ) Create
</template>

<script>
export default {
  name: 'vr-servers-dbservers-databases-create',
  props: ['server'],
  async mounted() { },
  methods: {
    async create() {
      this.$notify.loading.start()
      try {
        await this.$api.databaseServers(this.$route.params.databaseServerID).databases.create({
          database: this.database,
          username: this.username,
          password: this.password
        })
        this.$notify.info('Database created', 'Your new database has been created')
        this.$router.push({ name: 'servers.dbservers.show' })
      } catch (error) {
        this.$notify.error('Could not create database', error.message)
      } finally {
        this.$notify.loading.stop()
      }
    }
  },
  computed: { },
  data () {
    return {
      database: null,
      username: null,
      password: null,
    }
  }
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.vr-servers-dbservers-databases-create
  .buttons
    display: flex
    .spacer
      flex-grow: 1
</style>
