<template>
  <div class="vr-server-keys-new">
    <h3>New SSH Key</h3>
    <vr-form ref="form" @action="create">
      <vr-form-input 
        name="sshKeyName" 
        title="Name" 
        v-model="name"
        placeholder="my-ssh-key"
        required
      ></vr-form-input>
      <div class="key">
        <p>Paste your SSH key below. This is usually located in <code>~/.ssh/id_rsa.pub</code>.</p>
        <textarea 
          class="key" 
          spellcheck="false" 
          name="key" 
          placeholder="ssh-rsa AAA... user@computer.home" 
          v-model="key" 
          required
        ></textarea>
      </div> 
      <div class="buttons">
        <vr-button @action="cancel" color="clear">Cancel</vr-button>
        <div class="spacer"></div>
        <vr-button @action="$refs.form.submit()">Create Key</vr-button>
      </div>
    </vr-form>
  </div>
</template>

<script>
export default {
  name: 'vr-server-keys-new',
  props: ['server'],
  async mounted() { },
  methods: {
    async create() {
      this.$notify.loading.start()
      try {
        await this.$api.createServerKey(this.server.id, {
          name: this.name,
          key: this.key
        })
        this.$notify.push({ 
          type: 'info', 
          title: 'SSH key created', 
          message: 'You may now use it to access your server' 
        })
        this.$router.push({ name: 'servers.keys.index', params: { id: this.server.id } })
      } catch(error) {
        this.$notify.push({ 
          type: 'error', 
          title: 'Could not create SSH key', 
          message: error.message 
        })
      } finally {
        this.$notify.loading.stop()
      }
    },
    cancel(e) {
      e.preventDefault()
      this.$router.push({ name: 'servers.keys.index', params: { id: this.server.id } })
    }
  },
  data () {
    return {
      name: null,
      key: null
    }
  }
}
</script>

<style lang="sass">
@import "@/assets/base.sass"

.vr-server-keys-new
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
