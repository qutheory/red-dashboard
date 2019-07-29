<template>
  <a class="vr-new-button" @click="action">+</a>
</template>

<script>
export default {
  name: 'vr-new-button',
  props: [''],
  methods: {
    async action(e) {
      e.preventDefault()
      this.$emit('action', e)
    }
  },
  async mounted() { }
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.vr-new-button
  background: $color-primary
  border-radius: 50%
  width: 48px
  height: 48px
  box-shadow: 0 0 8px rgba($color-primary, 1)
  &:active
    bottom: 15px
  &:hover
    background: rgba(lighten($color-primary, 5%), 1)
  display: block
  line-height: 48px
  color: $color-white
  text-align: center
  font-size: 32px
  font-weight: 300

</style>
