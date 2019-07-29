<template lang="pug">
.vr-app
  .overlay
  .container(v-if='user === null')
  vr-app-no-user.container(
    @login='login'
    v-if='user === false'
    :class='{ loading: loading }'
  )
  div(:class="[ darkMode ? 'vr-dark' : 'vr-light' ]")
    vr-app-user.container(
      v-if='user !== null && user !== false'
      :class='{ loading: loading }'
      :user='user'
      :company='company'
      :darkMode='darkMode'
      @logout='logout'
      @switch-company='switchCompany'
      @switch-theme='switchTheme'
    )
  vr-notification(:notification='notification')
  vr-loading-bar(:loading='loading')
  transition(name='appear-up')
    vr-cookie-disclaimer(v-if='cookieDisclaimerShow', @accept='cookieDisclaimerAccept')
  
</template>

<script>
export default {
  name: 'vr-app',
  methods: {
    switchTheme() {
      var darkMode = window.localStorage.getItem('dark-mode')
      
      if (darkMode) {
        window.localStorage.removeItem('dark-mode')
        this.darkMode = false
      } else {
        localStorage.setItem('dark-mode', true)
        this.darkMode = true
      }
    },
    async login (session) {
      this.$notify.loading.start()
      localStorage.setItem('vapor-red-session', JSON.stringify(session));
      this.$api.headers['authorization'] = 'Bearer ' + session.token
      try {
        this.user = await this.$api.me()
        this.company = await this.$api.companies.view()
      } catch(error) {
        this.$notify.push({
          type: 'error',
          title: 'Login failed',
          message: 'Could not login'
        })
        await this.logout()
      } finally {
        this.$notify.loading.stop()
      }
    },
    async logout () {
      window.localStorage.removeItem('vapor-red-session')
      this.user = false
      this.company = false
      this.$router.push({ name: 'login' })   
      this.$notify.loading.start()
      try {
        await this.$api.logout()   
        this.$notify.info('Logged out', 'You have succesfully logged out.')
      } catch(error) {
        this.$notify.error('Logged out failed', error.message)
      } finally {
        this.$notify.loading.stop()
      }
    },
    async switchCompany(company) {
      var name = ''
      var companyID = null
      if (company) {
        name = company.name
        companyID = company.id
      } else {
        name = 'your personal account'
      }

      var session = await this.$api.switchCompany(companyID)
      await this.login(session)

      this.$notify.push({
        type: 'info',
        title: 'Switched company',
        message: 'You have switched to ' + name
      })
      this.$router.push({ name: 'servers.index' })
    },
    cookieDisclaimerAccept() {
      localStorage.setItem('vapor-red-cookie-disclaimer', true)
      this.cookieDisclaimerShow = false
    },
    feedback() {
      let title = 'dashboard feedback'
      let body = `Expected behavior:%0AActual behavior:%0AURL: ${window.location.pathname}%0AUser ID: ${this.user.id}%0ACompany ID: ${this.company.id}`
      let url = `https://github.com/qutheory/red-feedback/issues/new?title=${title}&body=${body}`
      let win = window.open(url, '_blank')
      win.focus()
    }
  },
  async mounted () {
    this.$notify.push = (config) => {
      clearTimeout(this.notificationTimeout)
      this.notification = config
      this.notificationTimeout = setTimeout(() => { 
        this.notification = null
      }, 3000)
    }

    var app = this
    this.$notify.loading = {
      start() {
        app.loading = true
      },
      stop() {
        app.loading = false
      }
    }

    var sessionJSON = window.localStorage.getItem('vapor-red-session')
    if(sessionJSON) {
      try {
        var session = JSON.parse(sessionJSON)
        await this.login(session)
      } catch(error) {
        // invalid json
        alert('Invalid session: ' + error.message)
        await this.logout()
      }
    } else {
      this.user = false
    }

    if (!localStorage.getItem('vapor-red-cookie-disclaimer')) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      this.cookieDisclaimerShow = true
    }
  },
  data () {
    return {
      company: null,
      user: null,
      loading: false,
      notification: null,
      notificationTimeout: null,
      cookieDisclaimerShow: false,
      darkMode: (window.localStorage.getItem('dark-mode')) ? true : false
    }
  }
}
</script>

<style lang="sass">
@import "@/assets/base.sass"

.appear-up-enter-active, .appear-up-leave-active
  transition: opacity $animation-duration $animation-ease, transform $animation-duration $animation-ease
.appear-up-enter, .appear-up-leave-to
  opacity: 0
  transform: scale(0.9)

.appear-down-enter-active, .appear-down-leave-active
  transition: opacity $animation-duration $animation-ease, transform $animation-duration $animation-ease
.appear-down-enter, .appear-down-leave-to
  opacity: 0
  transform: scale(1.1)

.fade-enter-active, .fade-leave-active
  transition: opacity $animation-duration $animation-ease
.fade-enter, .fade-leave-to
  opacity: 0

.slide-up-leave-active
  position: absolute
.slide-up-enter-active, .slide-up-leave-active
  transition: opacity $animation-duration $animation-ease, transform $animation-duration $animation-ease
.slide-up-enter, .slide-up-leave-to
  opacity: 0
  transform: translate(0, 32px)

html, body
  margin: 0
  padding: 0 
  height: 100%
*
  box-sizing: border-box

hr
  display: block
  height: 1px
  border: 0
  border-top: 1px solid black
  margin: 16px 0
  padding: 0

p
  user-select: text
  margin-bottom: 16px 0

hr
  border-color: $color-light-gray

a
  text-decoration: none
  color: $color-primary
  position: relative
  cursor: pointer
  &:active
    top: 1px

h1, h2, h3, h4, h5, h6
  margin: 16px 0

h2
  font-size: 24px
h3
  font-size: 18px
</style>

<style scoped lang="sass">
@import "@/assets/base.sass"

.vr-app
  height: 100%
  width: 100%
  background-image: linear-gradient(to right, $color-primary, $color-accent)
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  // user-select: none
  overflow: hidden
  position: relative

  .pre-release-banner
    position: absolute
    z-index: 980
    bottom: 0
    left: 0
    right: 0
    background: lighten($color-primary, 25%)
    display: flex
    height: 48px
    justify-content: space-between
    align-items: center
    padding: 0 16px
    span
      @media only screen and (max-width: 600px)
        display: none
      font-family: 'Roboto Mono', monospace
      font-size: 14px
    .content
      display: flex
      align-items: center
      p, .vr-button
        margin: 0
      .vr-button
        height: 32px
        line-height: 32px
      p
        margin-right: 16px

  .vr-cookie-disclaimer
    position: absolute
    bottom: 0
    z-index: 999
    left: 0
    width: 100%
    @media only screen and (min-width: 300px)
      left: 50%
      width: 320px
      margin-left: -160px
    @media only screen and (min-width: 700px)
      bottom: 16px
      width: 600px
      margin-left: -300px
    border: 2px solid $color-light-gray

  .overlay
    position: absolute
    z-index: 100
    height: 100%
    top: 0
    left: 0
    right: 0
    bottom: 0
    background-image: linear-gradient($color-black, rgba($color-black, 0.75))

  .container
    position: absolute
    z-index: 500
    top: 0
    left: 0
    right: 0
    bottom: 0

    &.loading
      filter: saturate(25%)
      pointer-events: none
      cursor: wait
</style>
