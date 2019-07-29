<template lang="pug">
  .vr-billing-plan
    .name
      h2 {{ name }}
    .price
      h2 ${{ price }}
      |       /month
    div(style='clear:both;')
    hr
    div(v-for='item in description')
      div(v-if="item.has")
        div {{ item.title }}
      div(v-else)
        div
          strike {{ item.title }}
    hr
    center
      div(v-if="autoSelected")
        button(:class="{ 'button': true, 'disabled': selected }" @click="click(name, planKey, $event)") Choose plan
      div(v-else)
        div(v-if="showBtn")
          button(:class="{ 'button': true, 'disabled': selected }" @click="click(name, planKey, $event)") Choose plan
        div(v-else)
          p This plan can't be selected for this type

</template>

<script>
export default {
  name: 'vr-billing-plan',
  props: ['name', 'planKey', 'price', 'description', 'selected', 'company', 'autoSelected'],
  mounted() {
    if(this.company.isPersonal && this.planKey == 'pro') {
      this.showBtn = false
    }
    if(!this.company.isPersonal && this.planKey != 'pro') {
      this.showBtn = false
    }
  },
  methods: {
    click(name, key, e) {
      e.preventDefault()
      if (this.selected == 'selected') {
        return
      }
      this.$emit('action', name, key)
    }
  },
  data() {
    return {
      showBtn: true
    }
  }
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.vr-billing-plan
  float: left
  margin-right: 16px
  display: block
  border-radius: 8px
  border: 2px solid $color-light-gray
  padding: 16px
  width: 20%
  .name
    float: left
  .price
    float: right
    h2
      margin-bottom: 0px
      padding-bottom: 0px
  hr
    border-color: $color-light-gray
    margin-top: 16px
    margin-bottom: 16px

.button
  margin: auto
  margin-top: 8px
  position: absolute
  z-index: 600
  display: inline-block
  text-align: center
  border: 0
  background: $color-primary
  color: $color-white
  font-family: inherit
  font-size: 16px
  line-height: 40px
  padding: 0 16px
  border-radius: 8px
  box-shadow: 0 0 4px rgba($color-primary, 0.75)
  height: 40px
  cursor: pointer
  position: relative
  &.disabled
    opacity: 0.8
    cursor: not-allowed
    border-color: $color-white
    color: $color-black
    background: rgba($color-gray, 0.1)
  &:hover
    background: rgba(lighten($color-primary, 5%), 1)

</style>
