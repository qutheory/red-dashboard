<template>
  <div class="vr-servers-provisions-index" v-if="ready">
    <div class="empty" v-if="!provisions.length">
      <h3>No provisions yet</h3>
      <p>Provisions will appear here when they are created.</p>
    </div>
    <vr-table 
      :source="provisions"
      @action="choose"
      :actionable="true"
    ></vr-table>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'vr-servers-provisions-index',
  props: ['server'],
  async mounted() {
    await this.load()
  },
  methods: {
    async load() {
      if (this.server) {
        this.provisionsRaw = await this.$api.servers.provisions(this.server.id).index()
        this.ready = true
      }
    },
    choose(provision) {
      this.$router.push({ name: 'servers.provisions.show', params: { provisionID: provision.id }})
    }
  },
  watch: {
    async server() {
      await this.load()
    }
  },
  computed: {
    provisions() {
      if (!this.provisionsRaw) {
        return null
      }
      return this.provisionsRaw.map(provision => {
        return {
          item: provision,
          view: [
            { key: 'Description', val: provision.description },
            { key: 'When', val: moment(provision.createdAt).fromNow() },
            { key: 'Status', val: provision.status.readable() }
          ]
        }
      })
    }
  },
  data () {
    return {
      provisionsRaw: null,
      ready: false
    }
  }
}
</script>

<style lang="sass">
@import "@/assets/base.sass"

.vr-servers-provisions-index
</style>
