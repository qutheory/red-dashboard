<template>
  <div class="vr-notification">
    <transition name="appear-up">
      <div 
        class="box" 
        v-if="notification" 
        :class="{ 'info': notification.type == 'info', 'error': notification.type == 'error' }"
      >
        <span class="title">{{ notification.title }}</span>
        <span class="message">{{ notification.message }}</span>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'vr-notification',
  props: ['notification']
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.vr-notification
  position: fixed
  z-index: 990
  top: 0
  left: 50%
  margin-left: -160px
  width: 320px

  .box
    display: block
    border-radius: 8px
    padding: 16px
    margin-top: 16px
    color: $color-black
    position: relative
    z-index: 999
    box-shadow: $shadow-1
    background: white
    border-left: 16px solid $color-black
    width: 100%

    .title
      font-size: 16px
      font-weight: 700
      margin-bottom: 4px
      display: block

    .message
      font-size: 14px
      font-weight: 300
      color: $color-dark-gray

    &.error
      .title
        color: $color-error
      border-color: $color-error
    &.info
      .title
        color: $color-primary
      border-color: $color-primary
</style>
