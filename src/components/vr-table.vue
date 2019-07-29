<template lang="pug">
  div(
    class="vr-table" 
    :class="{'actionable': actionable,'editable': editable, 'creatable': creatable, 'deletable': deletable, 'customAction': customButton}"
  )
    div(class="wrapper" v-if="source && rows.length > 0")
      div(class="box" v-if="actionable")
        div(class="row" v-for="(row, i) in rows" :key="i")
          a(class="inner" href="#" @click="action(i, $event)")
            div(class="col" v-for="col in row" :style="{ 'width': width + '%' }" :key="col.key")
              span(class="key") {{ col.key }}
              span(
                class="val" 
                :class="{'error': col.class == 'error','loading': col.class == 'loading'}"
              ) {{ col.val }}

      div(class="box" v-else)
        div(class="row" v-for="(row, i) in rows" :key="i")
          div(class="inner")
            div(
              class="col" 
              v-for="col in row" 
              :style="{ 'width': width + '%' }" 
              :key="col.key"
            )
              span(class="key") {{ col.key }}
              span(
                class="val" 
                :class="{'error': col.class == 'error','loading': col.class == 'loading'}"
              ) {{ col.val }}
          div
            a(
              class="customButton" 
              v-if="customButton" 
              @click="customAction(i, $event)"
            ) {{ customButton }}
          a(class="edit" v-if="editable" @click="edit(i, $event)") Edit
          a(class="delete" v-if="deletable" @click="doDelete(i, $event)") Delete
      vr-new-button(
        v-if="creatable" 
        class="new" 
        @action="create"
      )
    div(v-else-if="source")
      vr-new-button(v-if="creatable" class="new" @action="create")
</template>

<script>
export default {
  name: 'vr-table',
  props: ['source', 'creatable', 'actionable', 'editable', 'deletable', 'customButton'],
  computed: {
    width() {
      let keys = Object.keys(this.source[0].view)
      return 100 / keys.length
    },
    rows() {
      return this.source.map(row => {
        if (Array.isArray(row.view)) {
          return row.view
        } else {
          return Object.keys(row.view).map(key => {
            return {
              key: key,
              val: row.view[key]
            }
          })
        }
      })
    }
  },
  watch: { },
  methods: {
    action(i, e) {
      e.preventDefault()
      this.$emit('action', this.source[i].item)
    },
    create(e) {
      e.preventDefault()
      this.$emit('create', e)
    },
    doDelete(i, e) {
      e.preventDefault()
      this.$emit('delete', this.source[i].item)
    },
    customAction(i, e) {
      e.preventDefault()
      this.$emit('customAction', this.source[i].item)
    },
    edit(i, e) {
      e.preventDefault()
      this.$emit('edit', this.source[i].item)
    }
  }
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.vr-table
  margin: 16px 0
  margin-top: 18px

  .box
    border: 2px solid $color-light-gray
    .vr-dark &
      border-color: $color-dark-gray
    border-radius: 8px

    p
      padding: 16px
      text-align: center
      color: $color-gray
      font-style: italic
    
  .new
    margin: 0 auto
    margin-top: 16px

  .row
    .link
      cursor: default
    .link:active
      top: 0px
    .col .val
      cursor: text
      user-select: text

  &.customAction .row 
    padding-right: 48px
    .customButton
      position: absolute
      top: 0
      right: 16px
      height: 48px
      width: 48px
      text-align: center
      line-height: 48px
      top: 8px
  &.editable .row 
    padding-right: 48px
    .edit
      position: absolute
      top: 0
      right: 0
      height: 48px
      width: 48px
      text-align: center
      line-height: 48px
      top: 8px
  &.deletable .row 
    padding-right: 48px
    .delete
      position: absolute
      top: 0
      right: 16px
      color: red
      height: 48px
      width: 48px
      text-align: center
      line-height: 48px
      top: 8px

  &.actionable .row
    cursor: pointer
    &:hover
      background: rgba($color-primary, 0.05)
    .inner:active
      top: 1px
    .col .val
      cursor: pointer
      user-select: none

  .row
    position: relative
    border-bottom: 1px solid $color-light-gray
    .vr-dark &
      border-bottom-color: $color-dark-gray
    &:last-child
      border: none
    .inner
      display: flex
      padding: 16px
      width: 100%
      height: 100%
    .col 
      min-width: 0
      flex-grow: 1
      margin-right: 8px
      &:last-child
        margin-right: 0
      span
        display: block
        text-overflow: ellipsis
        white-space: nowrap
        overflow: hidden
      .key
        color: $color-gray
        font-size: 12px
      .val
        color: $color-black
        .vr-dark &
          color: $color-white
        font-size: 16px
        font-weight: 500
        &.error
          color: $color-error
        &.loading
          color: $color-primary
</style>

