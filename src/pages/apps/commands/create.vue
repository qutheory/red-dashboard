<template lang="pug">
  div(class="vr-apps-commands-create" v-if="ready")
    h2 New Command
    vr-form(ref="form" @action="create")
      vr-form-input(
        name="name" 
        title="Name" 
        v-model="name"
        placeholder="my-command"
        required
      )
      vr-form-input(
        name="command" 
        title="Command" 
        v-model="command"
        placeholder="path/to/exec run"
        required
        class="command"
        detail="Use #(port) to get this app's port dynamically"
      )
      vr-form-select(
        name="user" 
        title="Privilege" 
        v-model="user"
        placeholder="Choose"
        required
        class="user"
      )
        option(value="red") normal
        option(value="root") sudo (root)

      div(class="buttons")
        vr-button(@action="cancel" color="clear") Cancel
        div(class="spacer")
        vr-button(@action="$refs.form.submit()") Create Command 
</template>

<script>
export default {
  name: 'vr-apps-commands-create',
  props: ['app', 'server'],
  async mounted() {
    this.ready = true
  },
  methods: {
    async create() {
      this.$notify.loading.start()
      try {
        await this.$api.apps.supervisorCommands(this.app.id).create({
          name: this.name,
          command: this.command,
          user: this.user,
          autoStart: true,
          autoRestart: true,
          startRetries: 3,
          workers: 1,
          useEnvironment: true
        })
        this.$router.push({ name: 'apps.commands.index' })
      } catch(error) {
        this.$notify.error('Could not create command', error.message)
      } finally {
        this.$notify.loading.stop()
      }
    },
    async cancel() {
      this.$router.push({ name: 'apps.commands.index' })
    }
  },
  watch: { },
  computed: { },
  data () {
    return {
      name: null,
      command: null,
      user: null,
      ready: false
    }
  }
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.vr-apps-commands-create
  .buttons
    display: flex
    .spacer
      flex-grow: 1
</style>
