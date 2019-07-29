<template lang="pug">
  div(class="vr-billing" v-if="ready")
    h1 Billing
    vr-box
      h2 {{ company.plan.readable() }} Plan
      p(v-if="isActive") Plan is currently active.
      p(v-else-if="company.planExpire") Plan is active and expires on {{ company.planExpire.format('MMMM DD, YYYY') }}.
      p(v-else) Plan is currently inactive.
      div(class="buttons")
        vr-button(@action="changePlan()") Change Plan
    vr-horizontal-nav
      router-link(:to="{ name: 'billing.history' }") History
    div(class="content")
      transition(name='slide-up')
        router-view(
          class="view"
          :user='user'
          :company='company'
        )
</template>

<script>
export default {
  name: 'vr-billing',
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
      if (this.$route.name == 'billing.index') {
        this.$router.push({ name: 'billing.history' })
      }
    },
    changePlan() {
      this.$router.push({ name: 'billing.plan'})
    }
  },
  computed: {
    isActive() {
      return this.company.plan == 'free' || this.company.isSubscriptionActive
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

.vr-billing
  .content
    position: relative
    .view
      width: 100%
  h1
    margin: 0

</style>
