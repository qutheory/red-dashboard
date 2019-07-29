<template lang="pug">
div(class="vr-support" v-if="ready")
  h1 Support  
  vr-box
    h2 Get Help
    div(v-if="company.plan == 'pro'")
      p Submit a support ticket to Vapor Red. 
      vr-button(:disabled="true") Coming Soon
    div(v-else)
      p Upgrade to Pro to submit support tickets. This feature is coming soon.
      vr-button(@action="upgrade") Upgrade Plan
  vr-box
    h2 Feedback
    p Give direct feedback on the dashboard, documentation, or API to the Vapor Red team. Use this to report bugs or request features.
    div(class="buttons")
      vr-button(@action="feedback") Open Issue
  vr-box
    h2 Status
    div(class="buttons")
      p Check Vapor Red dashboard and API system status over time. Find more information about incidents or scheduled maintenance. 
      vr-button(@action="status") Check Status
</template>

<script>
export default {
  name: 'vr-support',
  props: ['user', 'company'],
  mounted() {
    this.load()
  },
  watch: {
    company() {
      this.load()
    }
  },
  methods: {
    load() {
      if (this.company) {
        this.ready = true
      }
    },
    feedback() {
      var title = 'dashboard feedback'
      var body = `Expected behavior:
Actual behavior:
URL: ${window.location.pathname}
User ID: ${this.user.id}
Company ID: ${this.company.id}
version: ${this.$version}`
      let url = `https://github.com/qutheory/red-feedback/issues/new?title=${title}&body=${body}`
      let win = window.open(encodeURI(url), '_blank')
      win.focus()
    },
    status() {
      var win = window.open('https://status.vapor.red/', '_blank')
      win.focus()
    },
    upgrade() {
      this.$router.push({ name: 'billing.plan' })
    }
  },
  data() {
    return { 
      ready: false
    }
  }
}
</script>

<style lang="sass">
@import "@/assets/base.sass"

.vr-support
  h1
    margin: 0
</style>
