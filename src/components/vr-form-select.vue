<template lang="pug">
  div(class="vr-form-select" :class="{ 'empty': empty }")
    div(class="box")
      label(:for="name") {{ title }}
      select( 
        :name="name" 
        type="text" 
        :placeholder="placeholder" 
        :value="value"
        :required="required"
        :disabled="disabled"
        @input="input"
      )
        option(:value="null") {{ placeholder }}
        slot
    small(v-if="detail") {{ detail }}
</template>

<script>
export default {
  name: 'vr-form-select',
  props: ['name', 'title', 'placeholder', 'value', 'required', 'disabled', 'detail'],
  mounted() {
    this.updateEmpty()
  },
  methods: {
    input(e) {
      this.$emit('input', e.target.value)
      this.updateEmpty()
    },
    updateEmpty() {
      if (this.value === null) {
        this.empty = true
      } else {
        this.empty = false
      }
    }
  },
  watch: {
    value() {
      this.updateEmpty()
    }
  },
  data() {
    return { empty: true }
  }
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.vr-form-select
  margin-top: 8px
  margin-bottom: 16px
  width: 100%
  position: relative
  display: block

  .box
    padding-top: 2px
    border-radius: 8px
    border: 2px solid $color-light-gray
    .vr-dark &
      border-color: $color-dark-gray

  &.empty select
    color: $color-gray

  small
    margin-left: 8px
    font-size: 12px
    color: $color-dark-gray

  label
    position: absolute
    left: 8px
    top: -8px
    line-height: 16px
    font-size: 14px
    font-family: 'Roboto', sans-serif
    padding: 0 8px
    background: $color-white
    color: $color-dark-gray
    border-radius: 4px
    .vr-dark &
      color: $color-light-gray
      background: $color-black
  select
    cursor: pointer
    appearance: none
    width: 100%
    height: 48px
    line-height: 48px
    display: block
    font-size: 16px
    font-family: 'Roboto', sans-serif
    padding: 0 14px
    border: 0
    background: none
    outline: none
    color: $color-black
    .vr-dark &
      color: $color-white
    &:disabled
      cursor: not-allowed
      color: $color-dark-gray
    &::placeholder
      .vr-dark &
        color: $color-white
    // firefox stuff
    &:invalid
      box-shadow: none
</style>
