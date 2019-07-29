<template lang="pug">
  div(class="vr-apps-docker-create" v-if="ready")
    h2 New Docker container
    vr-form(ref="form" @action="create")
      vr-form-select(
        name="type" 
        title="Type" 
        v-model="type"
        placeholder="Choose"
        required
        class="user"
      )
        option(value="dockerfile") Dockerfile
        option(value="redis") Redis

      div(v-if="type")
        vr-form-input(
          name="name" 
          title="Name" 
          v-model="name"
          placeholder="my-name"
          required
        )
        div(v-if="type == 'dockerfile'")
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
        vr-button(@action="$refs.form.submit()") Create container 
</template>

<script>
export default {
  name: 'vr-apps-docker-create',
  props: ['app', 'server'],
  async mounted() {
    this.ready = true
  },
  methods: {
    async create() {
      this.$notify.loading.start()
      try {
        await this.$api.apps.docker(this.app.id).create({
          name: this.name,
          type: this.type,
          dockerfile: this.dockerfile,
          dockerBuild: this.dockerBuild,
          dockerRun: this.dockerRun
        })
        this.$router.push({ name: 'apps.docker.index' })
      } catch(error) {
        this.$notify.error('Could not create container', error.message)
      } finally {
        this.$notify.loading.stop()
      }
    },
    async cancel() {
      this.$router.push({ name: 'apps.docker.index' })
    }
  },
  watch: { 
    type() {
      switch(this.type) {
        case 'redis':
          this.dockerfile = ''
          this.dockerBuild = ''
          this.dockerRun = 'docker run -p #(port):6379 -d -v /root/docker/#(name)/data:/data --restart unless-stopped --name #(name) redis --appendonly yes'
          break
        case 'dockerfile':
          this.dockerfile = 'Dockerfile'
          this.dockerBuild = 'docker build -t #(name) -f #(file) --build-arg env=production .'
          this.dockerRun = 'docker run -p #(port):80 -d #(dockerEnv) --restart unless-stopped --name #(name) #(name)'
          break
      }
    }
  },
  computed: { },
  data () {
    return {
      name: null,
      dockerfile: 'Dockerfile',
      dockerBuild: 'docker build -t #(name) -f #(file) --build-arg env=production .',
      dockerRun: 'docker run -p #(port):80 -d #(dockerEnv) --restart unless-stopped --name #(name) #(name)',
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
