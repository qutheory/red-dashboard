<template lang="pug">
  div(class="vr-horizontal-nav")
    slot
</template>

<script>
export default {
  name: 'vr-horizontal-nav'
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.vr-horizontal-nav
  margin-top: -2px
  display: flex
  box-shadow: inset 0 -2px 0 $color-light-gray
  overflow-y: auto
  -webkit-overflow-scrolling: touch
  .vr-dark &
    box-shadow: inset 0 -2px 0 $color-dark-gray

  a
    margin-top: 2px
    padding: 14px
    display: block
    &:active
      top: 0

    color: $color-black
    .vr-dark &
      color: $color-white

    position: relative
    border-bottom: 2px solid rgba(0,0,0,0)

    opacity: 0.75
    &:hover
      opacity: 1
      border-color: $color-gray
      .vr-dark &
        border-color: $color-gray
    &.router-link-active
      opacity: 1
      color: $color-primary
      border-color: $color-primary!important


</style>
