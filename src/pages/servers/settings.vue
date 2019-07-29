<template lang="pug">
  div(class="vr-servers-settings" v-if="ready")
    //- vr-box
    //-   h2 Move server
    //-   vr-info-box(
    //-     type="warning" 
    //-     title="Warning" 
    //-     value="When moving a server, please note the credentials used to create the server is copied to the account/company where you move the server"
    //-   )
    //-   vr-form-select(name="type" title="What do you want to move the server to?" v-model="moveType" placeholder="Select type")
    //-     option(value="company") Company
    //-     option(value="account") User account

    //-   div(v-if="moveType == 'company'")
    //-     vr-form-select(name="moveCompany" title="Which company" placeholder="Select company")
    //-       option(value="Foo") Foo
    //-       option(value="Bar") Bar
    //-   div(v-else-if="moveType == 'account'")
    //-     vr-form-input(name="moveEmail" title="Email address of the account")
    //-   vr-button Move server
    vr-box
      h2 Server public key
      p To use a private Git repository, setup the following public key.
      code.key {{ server.publicKey }}
      br
    vr-box
      h2 Destroy Server
      p Irreversibly destroy the server and all associated information.
      vr-button(color="danger" @action="destroyServer") Destroy
</template>

<script>
export default {
  name: 'vr-servers-settings',
  props: ['server'],
  async mounted() {
    this.ready = true
  },
  methods: {
    async destroyServer() {
      var question = `Deleting ${this.server.name} will delete all data related to the server on both Vapor Red and ${this.server.provider.readable()}. Type the name of the server to confirm.`
      var answer = prompt(question)
      if (answer == null) {
        return
      }
      if (answer.toLowerCase() == this.server.name.toLowerCase()) {
        this.$notify.loading.start()
        try {
          await this.$api.servers.delete(this.server.id)
          this.$notify.info('Destroying Server', 'The server is now being destroyed.')
          this.$router.push({ name: 'servers.index' })
        } catch(error) {
          this.$notify.error('Destroy Server Failed', error.message)
        } finally {
          this.$notify.loading.stop()
        }
      } else {
        await this.destroyServer()
      }
    }
  },
  computed: { },
  data () {
    return {
      ready: false,
      moveType: 'company'
    }
  }
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.vr-servers-settings
  code
    font-family: 'Roboto Mono', monospace
    font-size: 14px
    .vr-dark &
      border: 2px solid $color-dark-gray
  .key
    display: block
    background: $color-black
    color: $color-light-gray
    padding: 16px
    border-radius: 8px
    line-height: 16px
    word-wrap: break-word
    word-break: break-all
    user-select: all
</style>
