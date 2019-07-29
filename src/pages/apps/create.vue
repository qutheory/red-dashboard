<template lang="pug">
  .vr-apps-create
    h1 New Application
    vr-form(ref="form" @action="create")
      vr-form-select(name="server" title="Server" v-model="serverID" placeholder="Choose Server" required)
        option(v-for="server in servers" :key="server.id" :value="server.id") {{ server.name }}
      vr-box(v-if="!ready && server")
        h2 Detect Project
        p Enter your project's Git URL to detect settings.
        vr-form(ref="detect" @action="detect")
          vr-form-input(name="gitURL" title="Git URL" v-model="url" placeholder="https://github.com/user/repo.git" required)
        vr-button(@action="$refs.detect.submit()") Next
        vr-button(color="clear" @action="ready = true") Skip
      transition(name="slide-up")
        div(v-if="ready")
          vr-form-input(name="appName" title="Name" v-model="appName" placeholder="my-app" required)
          vr-form-input(name="gitURL" title="Git Remote" v-model="gitRemote" placeholder="git@github.com:user/project.git" required)
          transition(name="slide-up")
            .ssh(v-if="isSSH && server")
              p
                | It looks like you are using an SSH git URL. Make sure to add 
                code {{ server.name }}
                | 's public key to your Git account:
              code.key {{ server.publicKey }}
          vr-form-input(name="gitBranch" title="Git Branch" v-model="gitBranch" placeholder="master" required)
          vr-form-select(
            name="framework" 
            title="Framework" 
            v-model="framework" 
            placeholder="Choose framework" 
            required 
            v-if="frameworks"
          )
            option(v-for="framework in frameworks" :value="framework.id") {{ framework.name.capitalize() }} {{ framework.majorVersion }}
      .buttons
        vr-button(color="clear" @action="$router.push({ name: 'apps.index' })") Cancel
        .spacer
        vr-button(@action="$refs.form.submit($event)" :disabled="!ready || !server") Create App
</template>

<script>
import axios from 'axios'

export default {
  name: 'vr-apps-create',
  props: [],
  async mounted() {
    try {
      await this.$api.companies.capacity('createApplication')
    } catch(error) {
      this.$notify.info('Upgrade Plan', 'Upgrade your plan to create more applications')
      this.$router.push({ name: 'billing.plan' })
    }
    this.servers = await this.$api.servers.index()
    this.frameworks = await this.$api.frameworks.index()
  },
  methods: {
    async create() {
      this.$notify.loading.start()
      try {
        if (this.gitRemoteIsGitHub) {
          await this.validateGitHubBranch()
        }
        var app = await this.$api.servers.apps(this.serverID).create({
          name: this.appName,
          gitURL: this.gitRemote,
          gitBranch: this.gitBranch,
          frameworkID: this.framework
        })
        this.$notify.info('App created', 'Application successfully created.')
        this.$router.push({ name: 'apps.bootstrap.start', params: { appID: app.id }})
      } catch(error) {
        this.$notify.error('Could not create app', error.message)
      } finally {
        this.$notify.loading.stop()
      }
    },
    async validateGitHubBranch() {
      var parts = this.gitRemote.url().pathname.split('.git')[0].split('/')
      if (parts.length != 3) {
        throw new Error('Invalid GitHub url.')
      }
      var org = parts[1]
      var repo = parts[2]
      var url = 'https://api.github.com/repos/' + org + '/' + repo + '/branches'
      var res = await axios.create().get(url)
      var matches = res.data.filter(branch => {
        return branch.name == this.gitBranch
      })
      if (matches.length <= 0) {
        throw new Error(`No branch named '${this.gitBranch}' found.`)
      }
    },
    detect() {
      var parsed = this.url.url()
      var namePieces = this.url.split('.git')[0].split('/')
      var name = namePieces[namePieces.length - 1]
      this.appName = name
      if (parsed.hostname == 'github.com') {
        this.ready = true
        this.gitRemote = this.url
      } else {
        this.ready = true
        this.gitRemote = this.url
      }
    },
  },
  computed: {
    server() {
      if (this.serverID == null) {
        return null
      }
      return this.servers.filter(server => server.id == this.serverID)[0]
    },
    isSSH() {
      if (!this.gitRemote) {
        return false
      }
      return this.gitRemote.startsWith('git@')
    }
  },
  watch: {},
  data () {
    return {
      appName: null,
      gitRemote: null,
      serverID: null,
      gitBranch: null,
      framework: null,

      url: null,

      frameworks: null,
      servers: null,
      ready: false
    }
  }
}

String.prototype.url = function() {
    var l = document.createElement('a')
    l.href = this
    return l
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.vr-apps-create
  .box
    border: 2px solid $color-light-gray
    padding: 16px
    border-radius: 8px
    padding-bottom: 0
    margin-bottom: 16px

  .buttons
    display: flex
    .spacer
      flex-grow: 1

  p
    font-size: 14px
    padding: 0 2px
  .ssh
    margin-bottom: 16px
    code
      font-family: 'Roboto Mono', monospace
      font-size: 14px
    .key
      display: block
      background: $color-black
      color: $color-light-gray
      padding: 16px
      border-radius: 8px
      line-height: 16px
      word-wrap: break-word
      word-break: break-all
      user-select: all
</style>
