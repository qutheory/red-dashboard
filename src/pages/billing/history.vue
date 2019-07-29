<template lang="pug">
  div(class="vr-billing-history" v-if="ready")
    div(class="empty" v-if="!history || history.length <= 0")
      p No billing history yet.
    vr-table(
      :source="history"
      :creatable="false"
      :deletable="false"
    )
</template>

<script>
export default {
  name: 'vr-billing-history',
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

      this.$notify.loading.start()
      try {
        this.historyRaw = await this.$api.billing.history().index()
      } catch (error) {
        this.$notify.error('Could not load billing history', error.message)
      } finally {
        this.$notify.loading.stop()
        this.ready = true
      }
    },
  },
  data() {
    return {
      ready: false,
      historyRaw: []
    }
  },
  computed: {
    history() {
      if (!this.historyRaw['data']) {
        return null
      }

      return this.historyRaw['data'].map(history => {
        var amount = history.amount / 100
        return {
          item: history,
          view: {
            'Date': history.created.format('MMMM DD, YYYY'),
            'Description': history.description,
            'Paid': (history.paid) ? 'Yes' : 'No',
            'Amount': '$' + amount.format(2, 3, ',', '.')
          }
        }
      })
    },
  }
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.vr-billing-history
</style>
