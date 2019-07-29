<template lang="pug">
.vr-info
  span.title {{ title }}
  span.value {{ value }}
</template>

<script>
export default {
  name: 'vr-info',
  props: ['title', 'value']
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.vr-info
  span
    display: block
  .title
    display: block
    font-size: 14px
    color: $color-gray
  .value
    margin-top: 4px
    font-size: 18px
    font-weight: 500
</style>
