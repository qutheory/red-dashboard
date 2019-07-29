<template lang="pug">
.vr-header
  .menu-toggle
    a(href='#', @click='menuToggle')
      img(class="light" src='../assets/menu.png')
      img(class="dark" src='../assets/menu-dark.png')
  .search
    input(type='text', name='search', placeholder='Search')
  .user-container
    transition(name='appear-up')
      .menu(v-if='open', v-click-outside='closeUserMenu')
        .user-header
          .info
            span.name {{ user.firstName }} {{ user.lastName }}
            span.company {{ companyName }}
          .avatar
            span.initials {{ user.firstName[0] }}{{ user.lastName[0] }}
            .overlay
        hr
        a(href='#', @click="goAccount") Account
        hr
        a(href='#', @click='switchCompany(null, $event)') Personal
        a(
          href='#', 
          v-for='company in companies', 
          :key='company.id', 
          @click='switchCompany(company, $event)'
        ) {{ company.name }}
        a(href='#' @click="newCompany") New Company
        hr
        a(v-if="darkMode" @click="switchTheme") Light Mode
        a(v-else @click="switchTheme") Dark Mode
        hr
        a.logout(href='#', @click='logout') Logout
    a.user-header(@click='openUserMenu')
      .info
        span.name {{ user.firstName }} {{ user.lastName }}
        span.company {{ companyName }}
      .avatar
        span.initials {{ user.firstName[0] }}{{ user.lastName[0] }}
        .overlay
</template>

<script>
export default {
  name: 'vr-header',
  props: ['user', 'company', 'darkMode'],
  methods: {
    logout (e) {
      e.preventDefault()
      this.$emit('logout')
    },
    closeUserMenu () {
      this.open = false
    },
    goAccount(e) {
      e.preventDefault()
      this.open = false
      this.$router.push({ name: 'account' })
    },
    async openUserMenu(e) {
      e.preventDefault()
      e.stopPropagation()
      this.open = true
      await this.loadCompanies()
    },
    async menuToggle(e) {
      e.preventDefault()
      this.$emit('menu-toggle')
    },
    switchCompany(company, e) {
      e.preventDefault()
      this.open = false
      if (this.company == company) {
        return
      }
      this.$emit('switch-company', company)
    },
    switchTheme(e) {
      e.preventDefault()
      this.$emit('switch-theme')
    },
    newCompany(e) {
      e.preventDefault()
      this.open = false
      this.$router.push({ name: 'companies.create' })
    },
    async loadCompanies() {
      try {
        this.companies = await this.$api.companies.index()
      } catch(error) {
        this.$notify.error('Could not load companies', error.message)
      }
    }
  },
  computed: {
    companyName() {
      if (this.company) {
        return this.company.name
      } else {
        return 'Personal'
      }
    }
  },
  async mounted () {
    await this.loadCompanies()
  },
  data() {
    return {
      open: false,
      companies: []
    }
  }
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.vr-header
  height: 144px
  color: $color-black
  .vr-dark &
    color: $color-white
  position: relative
  padding-top: 64px

  @media only screen and (min-width: 700px)
    padding-top: 0
    height: 80px

  .menu-toggle
    position: absolute
    height: 80px
    top: 0
    left: 0
    padding: 16px
    display: flex
    align-items: center
    a
      height: 64px
      width: 64px
      display: flex
      align-items: center
      &:active
        top: 1px
      img
        margin-left: 16px
        height: 16px
        display: none
        &.dark
          .vr-dark &
            display: block
        &.light
          .vr-light &
            display: block
    @media only screen and (min-width: 700px)
      display: none

  .search
    flex-grow: 1
    display: none
    width: 300px
    margin-left: 16px

    @media only screen and (min-width: 700px)
      // display: block

    input
      height: 64px
      line-height: 32px
      margin-top: 8px
      padding: 16px
      width: 100%
      appearance: none
      outline: none
      background: none
      border: none
      font-size: 24px
      font-family: inherit
      color: $color-black
      &::placeholder
        font-size: 24px
        color: $color-gray

  .user-container
    height: 64px
    position: absolute
    top: 8px
    right: 16px
    display: flex
    align-items: center

    .menu
      z-index: 990
      position: absolute
      top: 0
      right: 0px
      border-radius: 8px
      border: 2px solid $color-light-gray
      background: $color-white
      .vr-dark &
        background: lighten($color-black, 10)
        border-color: $color-dark-gray
      width: 224px
      padding: 8px 0

      hr
        border-color: $color-light-gray
        .vr-dark &
          border-color: $color-dark-gray
        margin: 8px 0

      a
        font-weight: 500
        display: block
        padding: 0 16px
        line-height: 32px
        font-size: 16px
        &.logout
          color: $color-error
        opacity: 0.75
        &:hover
          opacity: 1

  .user-header
    display: flex
    align-items: center
    padding: 0 16px
    height: 100%

    color: $color-black
    .vr-dark &
      color: $color-white
    
    .info
      flex-grow: 1
      text-align: right
      margin-right: 8px
      span
        &.name
          font-size: 16px
          font-weight: 500
        &.company
          font-size: 14px
          font-weight: 300
        display: block

    .avatar
      width: 48px
      height: 48px
      background: black
      border-radius: 50%
      text-align: center
      background-image: linear-gradient(to right, $color-accent, $color-primary)
      position: relative
      overflow: hidden
      .vr-dark &
        background: $color-white

      .overlay
        position: absolute
        top: 0
        left: 0
        right: 0
        bottom: 0
        background-image: linear-gradient($color-black, rgba($color-black, 0.6))
        .vr-dark &
          display: none

      .initials
        position: relative
        z-index: 950
        line-height: 48px
        width: 48px
        color: $color-white
        .vr-dark &
          color: $color-black
        font-size: 20px
        font-weight: 700
  .menu
    .info
      text-align: left
</style>

