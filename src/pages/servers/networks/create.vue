<template>
  <div class="vr-servers-firewall-rules-create">
    <h3>New Firewall Rule</h3>
    <vr-form ref="form" @action="create">
      <vr-form-select 
        name="proto" 
        title="Protocol" 
        v-model="proto"
        placeholder="Choose protocol"
        required
      >
        <option value="tcp">TCP</option>
        <option value="udp">UDP</option>
      </vr-form-select>
      <vr-form-input
        name="port"
        title="Port"
        v-model="port"
        placeholder="80"
        required
      >
      </vr-form-input>
      <vr-form-input
        name="source"
        title="Source"
        v-model="source"
        placeholder="0.0.0.0/0"
        required
      >
      </vr-form-input>
      <vr-form-input
        name="description"
        title="Description"
        v-model="description"
        placeholder="http"
        required
      >
      </vr-form-input>
      <div class="buttons">
        <vr-button @action="cancel" color="clear">Cancel</vr-button>
        <div class="spacer"></div>
        <vr-button @action="$refs.form.submit()">Create Rule</vr-button>
      </div>
    </vr-form>
  </div>
</template>

<script>
export default {
  name: 'vr-servers-firewall-rules-create',
  props: ['server'],
  async mounted() { },
  methods: {
    async create() {
      this.$notify.loading.start()
      try {
        await this.$api.servers.networks(this.server.id).create({
          proto: this.proto,
          port: this.port,
          source: this.source,
          description: this.description
        })
        this.$notify.push({ 
          type: 'info', 
          title: 'Firewall rule created', 
          message: 'Firewall rule succesfully created' 
        })
        this.$router.push({ name: 'servers.networks.index', params: { id: this.server.id } })
      } catch(error) {
        this.$notify.push({ 
          type: 'error', 
          title: 'Could not create firewall rule', 
          message: error.message 
        })
      } finally {
        this.$notify.loading.stop()
      }
    },
    cancel(e) {
      e.preventDefault()
      this.$router.push({ name: 'servers.networks.index', params: { id: this.server.id } })
    }
  },
  data () {
    return {
      proto: null,
      port: null,
      source: null,
      description: null
    }
  }
}
</script>

<style lang="sass">
@import "@/assets/base.sass"

.vr-servers-firewall-rules-create
  .buttons
    margin-top: 16px
    display: flex
    .spacer
      flex-grow: 1
  .key 
    margin-top: 16px

    code
      font-size: 14px
      font-family: 'Roboto Mono', monospace

    textarea
      width: 100%
      outline: 0
      margin-top: 0
      background: black
      border-radius: 8px
      color: $color-white
      padding: 8px 16px
      line-height: 18px
      font-size: 14px
      height: 160px
      resize: none
      border: none
      word-break: break-all
      &:focus
        border: none
      font-family: 'Roboto Mono', monospace
</style>
