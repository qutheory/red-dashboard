<template lang="pug">
  .vr-servers-networks-index
    vr-table(
      :source="networks"
      @action="choose"
      @create="$router.push({ name: 'servers.networks.create' })"
      @delete="deleteNetwork"
      :actionable="false"
      :creatable="true"
      :deletable="true"
    )
</template>

<script>
export default {
  name: 'vr-servers-networks-index',
  props: ['server'],
  async mounted() {
    await this.load()
  },
  methods: {
    async load() {
      if (this.server) {
        this.$notify.loading.start()
        try {
          this.networksRaw = await this.$api.servers.networks(this.server.id).index()
        } catch(error) {
          this.$notify.error('Could not load networks', error.message)
        } finally {
          this.$notify.loading.stop()
        }
      }
    },
    choose(app) {
      this.$router.push({ name: 'networks.show', params: { 
        serverID: this.server.id, appID: app.id 
      }})
    },
    async deleteNetwork(item) {
      var question = `Are you sure you want to delete the firewall rule port: '${item.port}'`
      var answer = confirm(question)
      if (!answer) {
        return
      }
      
      this.$notify.loading.start()

      try {
        await this.$api.servers.networks().delete(item.id)
        await this.load()
      } catch (error) {
        this.$notify.error('Could not delete firewall rule', error.message)
      } finally {
        this.$notify.loading.stop()
      }
    },
  },
  watch: {
    async server() {
      await this.load()
    }
  },
  computed: {
    networks() {
      return this.networksRaw.map(network => {
        var sourceString = network.source
        if (!sourceString) {
          sourceString = 'All'
        }
        return {
          item: network,
          view: {
            'Protocol': network.proto,
            'Port': network.port,
            'Source': sourceString,
            'Description': network.description
          }
        }
      })
    }
  },
  data () {
    return {
      networksRaw: []
    }
  }
}
</script>

<style lang="sass">
@import "@/assets/base.sass"

.vr-servers-networks-index
</style>
