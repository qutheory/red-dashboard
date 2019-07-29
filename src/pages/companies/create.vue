<template lang="pug">
  div(class="vr-settings-companies-create" v-if="ready")
    h1 New Company

    //- .titles
    //-   .title(v-bind:class="{selected: step1Active}")
    //-     h3 1. Company name
    //-   span.separator →
    //-   .title(v-bind:class="{selected: step2Active}")
    //-     h3 2. Select plan
    //-   span.separator →
    //-   .title(v-bind:class="{selected: step3Active}")
    //-     h3 3. Payment method
    //-   span.separator →
    //-   .title(v-bind:class="{selected: step4Active}")
    //-     h3 4. Confirmation

    vr-form(ref="form" @action="create")
      vr-form-input(name="name" title="Name" v-model="name" placeholder="My Company" required)
    .buttons
      vr-button(color="clear" @action="cancel") Cancel
      .spacer
      vr-button(@action="$refs.form.submit($event)") Create
    //- div(v-if="step1Active")
    //-   vr-form-input(name="name" title="Name" v-model="name" placeholder="My Company" required)
    //-   .buttons
    //-     vr-button(color="clear" @action="cancel") Cancel
    //-     .spacer
    //-     vr-button(@action="switchStep('step2')") Next
    //- div(v-else-if="step2Active")
    //-   vr-billing-plan(
    //-     name="Pro", 
    //-     planKey="pro",
    //-     price="45", 
    //-     :description=[
    //-       {"title": "Unlimited Applications", "has": true},
    //-       {"title": "Unlimited Servers", "has": true},
    //-       {"title": "Unlimited Deployments", "has": true},
    //-       {"title": "Support", "has": true},
    //-       {"title": "Teams", "has": true}
    //-     ],
    //-     :selected="true",
    //-     :company="company",
    //-     @action="step2",
    //-     :autoSelected="true"
    //-   )
    //-   div(style="clear:both;")
    //-   .buttons
    //-     vr-button(color="clear" @action="cancel") Cancel
    //-     .spacer
    //-     vr-button(@action="switchStep('step3')") Next
    //- div(v-else-if="step3Active")
    //-   vr-table(
    //-     :source="paymentMethods"
    //-     @create="checkout"
    //-     @delete="deletePaymentMethod"
    //-     :creatable="false"
    //-     :deletable="false"
    //-   )
    //-   .buttons
    //-     vr-button(color="clear" @action="cancel") Cancel
    //-     .spacer
    //-     vr-button(@action="switchStep('step4')") Next
</template>

<script>
export default {
  name: 'vr-companies-create',
  props: [],
  async mounted() {
    this.$notify.loading.start()
    try {
      this.paymentMethodsRaw = await this.$api.billing.paymentMethods().index()
      this.company = await this.$api.companies.view()
      this.ready = true
      this.step1Active = true
    } catch (error) {
      this.$notify.error('Could not load payment methods', error.message)
    } finally {
      this.$notify.loading.stop()
    }
  },
  methods: {
    switchStep(step) {
      switch(step) {
        case 'step2':
          this.step1Active = false
          this.step2Active = true
          break
        case 'step3':
          this.step2Active = false
          this.step3Active = true
          break
        case 'step4':
          this.step3Active = false
          this.step4Active = true
          break
      }
    },
    async create() {
      this.$notify.loading.start()
      try {
        await this.$api.companies.create({
          name: this.name,
          plan: 'business-standard'
        })
        this.$notify.push({ 
          type: 'info', 
          title: 'Company created', 
          message: 'You may now switch to the company. To activate the company, switch to the company, and go to Billing.' 
        })
        this.$router.push({ name: 'settings.index' })
      } catch(error) {
        this.$notify.push({ 
          type: 'error', 
          title: 'Could not create company', 
          message: error.message 
        })
      } finally {
        this.$notify.loading.stop()
      }
    },
    cancel(e) {
      e.preventDefault()
      this.$router.push({ name: 'settings.index' })
    }
  },
  computed: {
    paymentMethods() {
      if (!this.paymentMethodsRaw) {
        return null
      }

      return this.paymentMethodsRaw.map(paymentMethod => {
        return {
          item: paymentMethod,
          view: {
            'Card': 'xxxxxx' + paymentMethod.last4
          }
        }
      })
    }
  },
  data () {
    return {
      step1Active: false,
      step2Active: false,
      step3Active: false,
      step4Active: false,
      name: null,
      ready: false,
      company: null,
      paymentMethodsRaw: null,
    }
  }
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.titles
  width: 100%
  display: flex
  align-items: center
  overflow-x: auto
  padding-bottom: 16px
  .selected
    color: $color-primary

  .separator
    margin-left: 16px
    margin-right: 16px
    color: $color-gray
    font-size: 24px
    margin-top: -8px

  .title
    flex-shrink: 0
    h2
      margin: 0
    span
      color: $color-gray
      font-weight: 400
      font-size: 16px

.vr-settings-companies-create
  h1
    margin-top: 0
  .buttons
    display: flex
    .spacer
      flex-grow: 1
</style>
