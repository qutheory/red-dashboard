<template lang="pug">
div(class="vr-team-invite" v-if="ready")
  h1 Invite Team Member
  p Invite a team member to {{ company.name }}
  vr-form(ref="invite" @action="invite")
    vr-form-input(
      title="Email" 
      name="email" 
      type="email" 
      v-model="inviteEmail" 
      placeholder="user@example.com"
    )
  .buttons
    vr-button(color="clear" @action="$router.push({ name: 'team.index' })") Cancel
    .spacer
    vr-button(@action="$refs.invite.submit()") Invite
</template>

<script>
export default {
  props: ['company'],
  async mounted() {
    this.load()
  },
  methods: {
    load() {
      if (!this.company) {
        return
      }
      this.ready = true
    },
    async invite() {
      this.$notify.loading.start()
      try {
        await this.$api.companies.invites.create({
          email: this.inviteEmail
        })
        this.$notify.info('Team member invited', 'Your colleague has been invited successfully.')
        this.inviteEmail = null
        this.$router.push({ name: 'team.index' })
      } catch(error) {
        var message = error.message
        var title = 'Could not invite team member'
        if (message == 'Not Found') {
          message = 'Make sure your colleague has already signed up for Vapor Red.'
          title = 'User not found'
        }
        this.$notify.error(title, message)
      } finally {
        this.$notify.loading.stop()
      }
    }
  },
  watch: {
    company() {
      this.load()
    },
  },
  data() {
    return {
      inviteEmail: null,
      ready: false
    }
  }
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.vr-team-invite
  h1
    margin-top: 0
  .buttons
    display: flex
    .spacer
      flex-grow: 1
</style>