<template lang="pug">
  div(class="vr-apps" v-if="ready")
    div(class="empty" v-if="!apps.length")
      h1 No apps yet 
      p Create your first app by clicking the plus button below. Or switch to a different company by clicking your name on the top right.</p>
    div(v-else)
      h1 Apps
    vr-table(
      :source="apps"
      @action="choose"
      @create="$router.push({ name: 'apps.create' })"
      :actionable="true"
      :creatable="true"
    )
</template>

<script>
export default {
  name: 'vr-apps',
  props: [],
  async mounted() {
    await this.load()
  },
  methods: {
    async load() {
      this.$notify.loading.start()
      try {
        this.serversRaw = await this.$api.servers.index()
        this.appsRaw = await this.$api.apps.index()
        this.company = await this.$api.companies.view()
      } catch (error) {
        this.$notify.error('Could not load apps', error.message)
      } finally {
        this.$notify.loading.stop()
      }
      if (this.company.plan != 'free' && !this.company.isSubscriptionActive) {
        this.$router.push({ name: 'subscription-inactive' })
      }
      this.ready = true
    },
    choose(app) {
      this.$router.push({ name: 'apps.show', params: { 
        appID: app.id 
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
            'Server': this.serversRaw.filter((server) => server.id == app.serverID)[0].name,
            'Status': app.status.readable()
          }
        }
      })
    }
  },
  data () {
    return {
      company: null,
      serversRaw: null,
      appsRaw: null,
      ready: false
    }
  }
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.vr-apps
  h1
    margin-top: 0
</style>
