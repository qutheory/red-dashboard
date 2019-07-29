<template lang="pug">
div(:class="type + ' vr-info-box'")
  div.title {{ title }}
  p(v-html="value")
</template>

<script>
export default {
  name: 'vr-info',
  props: ['type', 'title', 'value']
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.vr-info-box
  box-shadow: 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12), 0 3px 1px -2px rgba(0,0,0,.2)
  position: relative
  margin: 1.5625em 0
  padding: 0 .6rem
  border-left: .2rem solid #448aff
  border-radius: .1rem
  font-size: 14px
  overflow: auto
  .title
    background-color: rgba(68,138,255,.1)
    border-bottom: .05rem solid rgba(68,138,255,.1)
    margin: 0 -.6rem
    padding: .4rem .6rem .4rem .6rem
    font-weight: 700
.warning
  border-left: .2rem solid #ff9100
  .title
    background-color: rgba(255,145,0,.1)
    border-bottom: .05rem solid rgba(68,138,255,.1)
.tip
  border-left: .2rem solid #00bfa5
  .title
    background-color: rgba(0,191,165,.1)
    border-bottom: .05rem solid rgba(0,191,165,.1)
.danger
  border-left: .2rem solid #ff1744
  .title
    background-color: rgba(255,23,68,.1)
    border-bottom: .05rem solid rgba(255,23,68,.1)
</style>
