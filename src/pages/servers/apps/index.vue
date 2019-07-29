<template>
  <div class="vr-server-apps" v-if="ready">
    <div class="empty" v-if="!apps.length">
      <h3>No apps yet</h3>
      <p>Create this server's first app by clicking the plus button below.</p>
    </div>
    <vr-table 
      :source="apps"
      @action="choose"
      @create="$router.push({ name: 'apps.create' })"
      :actionable="true"
      :creatable="true"
    ></vr-table>
  </div>
</template>

<script>
export default {
  name: 'vr-server-apps',
  props: ['server'],
  async mounted() {
    await this.load()
  },
  methods: {
    async load() {
      if (this.server) {
        this.appsRaw = await this.$api.serverApps(this.server.id)
        this.ready = true
      }
    },
    choose(app) {
      this.$router.push({ name: 'apps.show', params: { 
        serverID: this.server.id, appID: app.id 
      }})
    }
  },
  watch: {
    async server() {
      await this.load()
    }
  },
  computed: {
    apps() {
      if (!this.appsRaw) {
        return null
      }
      return this.appsRaw.map(app => {
        return {
          item: app,
          view: {
            'Name': app.name,
            'Status': app.status.readable()
          }
        }
      })
    }
  },
  data () {
    return {
      appsRaw: null,
      ready: false
    }
  }
}
</script>

<style lang="sass">
@import "@/assets/base.sass"

.vr-server-apps
</style>
