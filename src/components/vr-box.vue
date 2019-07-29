<template lang="pug">
  .vr-box
    slot
</template>

<script>
export default {
  name: 'vr-box'
}
</script>

<style lang="sass">
@import "@/assets/base.sass"

.vr-box
  overflow: hidden
  padding: 0 16px
  margin: 16px 0
  border-radius: 8px
  border: 2px solid $color-light-gray
  .vr-dark &
    border: 2px solid $color-dark-gray
</style>
