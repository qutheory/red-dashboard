<template lang="pug">
  form(class="vr-form" @submit="callback")
    slot
    button(type="submit", style="display: none", ref="hiddenSubmit")
  </form>
</template>

<script>
export default {
  name: 'vr-form',
  methods: {
    submit () {
      this.$refs.hiddenSubmit.click()
    },
    callback (e) {
      e.preventDefault()
      this.$emit('action', e)
    }
  }
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"
.vr-form
  margin-top: 24px
</style>
