<template lang="pug">
  div(class="vr-billing-plan" v-if="ready")
    h1 Choose a Plan
    div(class="plans")
      vr-big-button(
        class="plan" 
        :active="plan == 'free'" 
        @action="changePlan('free')"
      )
        div(class="header")
          h3(class="name") Free
          span(class="price") $0
        div(class="features")
          span 1 Application
          span 1 Server
          span ∞ Deployments
          span.no Support
          span.no Teams
      vr-big-button(
        class="plan" 
        :active="plan == 'hobby'" 
        @action="changePlan('hobby')"
      )
        div(class="header")
          h3(class="name") Hobby
          span(class="price") $10
        div(class="features")
          span.change ∞ Applications
          span 1 Server
          span ∞ Deployments
          span.no Support
          span.no Teams
      vr-big-button(
        class="plan" 
        :active="plan == 'dev'" 
        @action="changePlan('dev')"
      )
        div(class="header")
          h3(class="name") Dev
          span(class="price") $20
        div(class="features")
          span ∞ Applications
          span.change ∞ Servers
          span ∞ Deployments
          span.no Support
          span.no Teams
      vr-big-button(
        class="plan" 
        :active="plan == 'pro'" 
        @action="changePlan('pro')"
      )
        div(class="header")
          h3(class="name") Pro
          span(class="price") $45
        div(class="features")
          span ∞ Applications
          span ∞ Servers
          span ∞ Deployments
          span.change Support
          span.change Teams

    div(v-if="plan == 'free' && !this.card")
      div(class="buttons")
        div(class="spacer")
        vr-button(@action="savePlan") Choose Plan
    div(v-else)
      h2 Payment Method
      div(v-if="card")
        p Use card ending in #[b {{ this.card.last4 }}].
        div(class="buttons")
          div(class="spacer")
          div(v-if="plan == 'free'")
            vr-button(color="clear", @action="changeCard") Remove Card
            vr-button(@action="savePlan") Choose Plan
          div(v-else)
            vr-button(color="clear", @action="changeCard") Change Card
            vr-button(@action="savePlan") Choose Plan
      div(v-else)
        vr-box(class="new-card")
          h3 Add New Card
          card(class="stripe-card"
            :class="{ complete }"
            :stripe="stripeConfig.key"
            :options="stripeConfig.options"
            @change="complete = $event.complete"
          )
          div(class="buttons")
            div(class="spacer")
            vr-button(@action="addCard" :disabled="!complete") Add Card
</template>

<script>
import { Card, createToken } from 'vue-stripe-elements-plus'

export default {
  name: 'vr-billing-plan',
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
    async load() {
      if (!this.company) {
        return
      }
      this.plan = this.company.plan
      await this.loadCard()
      this.ready = true
    },
    async loadCard() {
      this.$notify.loading.start()
      try {
        var paymentMethods = await this.$api.billing.paymentMethods().index()
        if (paymentMethods && paymentMethods.length > 0) {
          this.card = paymentMethods[0]
        } else {
          this.card = null
        }
      } catch(error) {
        this.$notify.error('Could not load payment methods', error.message)
      } finally {
        this.$notify.loading.stop()
      }
    },
    async changePlan(plan) {
      this.plan = plan
    },
    async savePlan() {
      this.$notify.loading.start()
      try {
        await this.$api.billing.plan().switchPlan({
          plan: this.plan
        })
        this.$notify.info('Plan updated', 'Your plan has been updated')
        this.$router.push({ name: 'billing.index' })
        // TODO: reload company
        window.location.reload()
      } catch (error) {
        this.$notify.error('Could not update', error.message)
      } finally {
        this.$notify.loading.stop()
      }
    },
    async changeCard() {
      if (!this.card) {
        return
      }

      var question = `Are you sure you want to remove the card ending in ${this.card.last4}`
      var answer = confirm(question)
      if (!answer) {
        return
      }
      
      this.$notify.loading.start()

      try {
        await this.$api.billing.paymentMethods().delete(this.card.id)
        await this.loadCard()
      } catch (error) {
        this.$notify.error('Could not delete payment method', error.message)
      } finally {
        this.$notify.loading.stop()
      }
    },
    async addCard() {
      this.$notify.loading.start()
      try {
        var res = await createToken()
        if (res.error) {
          throw new Error(res.error.message)
        } else if (res.token) {
          await this.$api.billing.paymentMethods().create({
            token: res.token.id 
          })
          this.addingPaymentMethod = false
          this.loadCard()
        } else {
          throw new Error('Invalid Stripe response')
        }
      } catch(error) {
        this.$notify.error('Could not create payment method', error.message)
      } finally {
        this.$notify.loading.stop()
      }
    }
  },
  data() {
    return {
      ready: false,
      historyRaw: [],
      complete: false,
      card: null,
      plan: null
    }
  },
  computed: {
    stripeConfig() {
      return this.$stripeConfig
    },
  },
  components: { Card }
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.vr-billing-plan
  h1
    margin-top: 0
  .buttons
    display: flex
    margin-top: 16px
    .spacer
      flex-grow: 1
  .stripe-card
    padding: 0 16px
  .new-card
    border-color: $color-primary
    color: $color-black
    background: $color-white
  .plans
    display: flex
    width: 100%
    flex-wrap: wrap
    .plan
      margin-right: 16px
      flex-grow: 1
      margin-bottom: 16px
      .header
        display: flex
        align-items: center
        .name
          font-size: 24px
          margin: 0
          flex-grow: 1
          margin-right: 16px
        .price
          font-size: 24px
          font-weight: 700
          &::after
            font-weight: 300
            content: '/mo'
            font-size: 14px
      .features
        margin-top: 16px
        padding-top: 16px
        border-top: 1px solid
        border-color: $color-light-gray
        .vr-dark &
          border-color: $color-dark-gray
        display: flex
        flex-direction: column
        span
          padding-bottom: 4px
          &.change
            font-weight: 700
          &.no
            text-decoration: line-through
            opacity: 0.25

</style>
