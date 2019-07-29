<template lang="pug">
  div(class="vr-apps-settings" v-if="ready")
    vr-box
      h2 Environment
      p Add or remove keys in this application's environment.
      vr-info-box(
        type="note" 
        title="Info" 
        value="Please note, at the moment, environment variables can't contain double quotes <b>(\")</b> instead, use single quotes <b>(')</b><br /><br />For example <b>MY_KEY='MY VALUE'</b>"
      )

      vr-code-editor(v-model="environment" mime="text/x-nginx-conf")

      vr-info-box(
        type="note" 
        title="Info" 
        value="Save will just save the changes, and will affect the project during next Deploy. Save and update will save the changes and update the project with the new environment settings."
      )
      
      vr-button(@action="updateEnvironment(false)") Save
      span &nbsp;&nbsp;
      vr-button(@action="updateEnvironment(true)") Save and Update
    vr-box
      h2 Deploy Script
      p Make changes to this application's deploy script.
      vr-code-editor(v-model="script" mime="text/x-nginx-conf")
      vr-button(@action="updateScript") Update
    vr-box
      h2 Deploy Hook
      p Trigger automatic deployments by making an HTTP request to this endpoint.
      pre.code
        | https://api.vapor.red/v1/apps/{{ app.id }}/deployments/trigger?token={{ app.token }}
    vr-box
      h2 Delete App
      p Irreversibly delete the app and all associated information.
      vr-button(color="danger" @action="destroyApp") Delete
</template>

<script>
export default {
  name: 'vr-apps-settings',
  props: ['server', 'app'],
  async mounted() {
    this.script = this.app.script
    this.environment = this.app.environment
    this.ready = true
  },
  methods: {
    async updateScript() {
      this.$notify.loading.start()
      try {
        await this.$api.apps.update(this.app.id, {
          script: this.script
        })
        this.$notify.info('Deploy script updated', 'This app\'s deploy script has been updated.')
      } catch (error) {
        this.$notify.error('Could not update', error.message)
      } finally {
        this.$notify.loading.stop()
      }
    },
    async updateEnvironment(push) {
      // if (push) {
      //   alert('Push changes')
      // } else {
      //   alert('Dont push changes')
      // }
      this.$notify.loading.start()
      try {
        await this.$api.apps.update(this.app.id, {
          environment: this.environment
        })
        this.$notify.info('Environment updated', 'This app\'s environment has been updated.')
        if (push) {
          await this.$api.apps.deployments(this.app.id).create({
            type: "envUpdate"
          })
          this.$router.push({ name: 'apps.deploys.index' })
        }
      } catch (error) {
        this.$notify.error('Could not env', error.message)
      } finally {
        this.$notify.loading.stop()
      }
    },
    async destroyApp() {
      var question = `Deleting ${this.app.name} will delete all data related to the app on both Vapor Red and ${this.server.provider.readable()}. Type the name of the app to confirm.`
      var answer = prompt(question)
      if (answer == null) {
        return
      }
      if (answer.toLowerCase() == this.app.name.toLowerCase()) {
        this.$notify.loading.start()
        try {
          await this.$api.apps.delete(this.app.id)
          this.$notify.info('Destroying app', 'The app is now being destroyed.')
          this.$router.push({ name: 'apps.index' })
        } catch(error) {
          this.$notify.error('Destroy app failed', error.message)
        } finally {
          this.$notify.loading.stop()
        }
      } else {
        await this.destroyApp()
      }
    }
  },
  computed: { },
  data () {
    return {
      environment: null,
      script: null,
      ready: false
    }
  }
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.vr-apps-settings
  .warning
    background: rgba(255,229,100,.3)
    padding: .1rem 1.5rem
    border-left-width: .5rem
    border-left-style: solid
    border-color: #e7c000
    color: #6b5900
    line-height: 1.7
    .title
      color: #b29400
      font-weight: 600
      margin-bottom: -1.7rem
  .info
    background: #f3f5f7
    padding: .1rem 1.5rem
    border-left-width: .5rem
    border-left-style: solid
    border-color: #42b983
    color: #6b5900
    line-height: 1.7
    .title
      font-weight: 600
      margin-bottom: -1.7rem
  .code
    font-family: 'Roboto Mono', monospace
    background: $color-black
    color: $color-white
    .vr-dark &
      border: 2px solid $color-dark-gray
    padding: 16px
    font-size: 14px
    border-radius: 8px
    overflow-x: auto
    user-select: all
  .vr-code-editor
    height: 256px
    .vr-dark &
      border: 2px solid $color-dark-gray
</style>
