<template lang="pug">
  div(class="vr-apps-docker-create" v-if="ready")
    h2 Update Docker container
    vr-form(ref="form" @action="create")
      vr-form-input(
        name="name" 
        title="Name" 
        v-model="name"
        disabled="true"
        placeholder="my-name"
        required
      )
      vr-form-input(
        name="dockerfile"
        title="Dockerfile"
        v-model="dockerfile"
        required
      )
      vr-form-input(
        name="dockerBuild"
        title="Docker build command"
        v-model="dockerBuild"
        required
      )
      vr-form-input(
        name="dockerRun"
        title="Docker run command"
        v-model="dockerRun"
        required
      )

      div(class="buttons")
        vr-button(@action="cancel" color="clear") Cancel
        div(class="spacer")
        vr-button(@action="$refs.form.submit()") Update container 
</template>

<script>
export default {
  name: 'vr-apps-docker-create',
  props: ['app', 'server'],
  async mounted() {
    this.$notify.loading.start()
    try {
      var docker = await this.$api.apps.docker(this.app.id).view(this.$route.params.dockerID)
      this.name = docker.name
      this.dockerfile = docker.dockerfile
      this.dockerBuild = docker.dockerBuild
      this.dockerRun = docker.dockerRun
      this.ready = true
    } catch(error) {
      this.$notify.error('Could not load container', error.message)
    } finally {
      this.$notify.loading.stop()
    }
  },
  methods: {
    async create() {
      this.$notify.loading.start()
      try {
        await this.$api.apps.docker(this.app.id).update(this.$route.params.dockerID, {
          dockerfile: this.dockerfile,
          dockerBuild: this.dockerBuild,
          dockerRun: this.dockerRun
        })
        this.$notify.info('Container updated', 'Your container have now been updated. To reflect the changes, redeploy your app.')
        this.$router.push({ name: 'apps.docker.show', params: { 
          dockerID: this.$route.params.dockerID
        }})
      } catch(error) {
        this.$notify.error('Could not edit container', error.message)
      } finally {
        this.$notify.loading.stop()
      }
    },
    async cancel() {
      this.$router.push({ name: 'apps.docker.show', params: { 
        dockerID: this.$route.params.dockerID
      }})
    }
  },
  computed: { },
  data () {
    return {
      name: null,
      dockerfile: null,
      dockerBuild: null,
      dockerRun: null,
      ready: false,
      type: ''
    }
  }
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.vr-apps-docker-create
  .buttons
    display: flex
    .spacer
      flex-grow: 1
</style>
