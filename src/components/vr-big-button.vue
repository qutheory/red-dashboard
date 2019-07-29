<template lang="pug">
  a(
    href="#" 
    class="vr-big-button" 
    :class="{ 'active': active, 'disabled': disabled }"
    @click="click"
  )
    slot
</template>

<script>
export default {
  name: 'vr-big-button',
  props: ['active', 'disabled'],
  methods: {
    click(e) {
      e.preventDefault()
      if (this.disabled) {
        return
      }
      this.$emit('action', e)
    }
  }
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.vr-big-button
  display: block
  box-shadow: $shadow-1
  padding: 16px
  border-radius: 8px
  border: 2px solid $color-white

  color: $color-black
  .vr-dark &
    color: $color-white
    border-color: $color-dark-gray

  &:hover
    border-color: $color-primary
  &:active
    box-shadow: inset 0 0 8px $color-primary
  &.active
    border-color: $color-gray
    box-shadow: inset $shadow-1
    .vr-dark &
      border-color: $color-white
    &:active
      top: 0
  &.disabled
    opacity: 0.8
    cursor: not-allowed
    border-color: $color-white
    background: rgba($color-gray, 0.1)
    &:active
      border-color: $color-white
      box-shadow: $shadow-1
      top: 0

</style>
