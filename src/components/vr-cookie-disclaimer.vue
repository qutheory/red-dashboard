<template lang="pug">
  div.vr-cookie-disclaimer
    p dashboard.vapor.red uses cookies to remember your login session and preferences. By continuing to use this app, you accept these cookies, our #[a(href="//vapor.red/privacy") privacy policy], and #[a(href="//vapor.red/tos") terms of service].
    vr-button(@action="$emit('accept')") OK
</template>

<script>
export default {
  name: 'vr-cookie-policy',
  props: [],
  methods: { },
  data() {
    return { }
  },
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.vr-cookie-disclaimer
  background: $color-white
  border-radius: 8px
  overflow: hidden
  margin-bottom: 16px
  font-size: 14px
  display: flex
  align-items: center
  padding: 0 16px
  .vr-button
    margin-left: 16px
  span
    font-family: 'Roboto mono', monospace
    font-size: 14px
    line-height: 18px
</style>
