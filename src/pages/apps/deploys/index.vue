<template lang="pug">
  div(class="vr-app-deploys")
    div(class="deploy" :class="{ 'deploying': deploying }")
      div(class="target source")
      div(class="target destination")
      transition(name="slide-up")
        a(class="button deploy" @click="deploy" v-if="!deploying && !lastDeployFailed") Deploy
        a(class="button deploy" @click="deploy" v-if="!deploying && lastDeployFailed") Try Again
      div(class="activity")
        div(class="bar a")
        div(class="bar b")
    div(class="log" ref="logs" v-if="deployLogs.length")
      pre(v-for="log in deployLogs") {{ log }}
      br
    h2 Deployments
    div(v-if="!deploys.length")
      p No deployments yet.
    vr-table(:source="deploys")
    br
</template>

<script>
export default {
  name: 'vr-app-deploys',
  props: ['app', 'server'],
  async mounted() {
    await this.load()
  },
  methods: {
    async cancelDeploy(item) {
      alert(item.status)
    },
    async load() {
      if (!this.app) { return }
      this.$notify.loading.start()
      this.deploysRaw = await this.$api.apps.deployments(this.app.id).index()
      this.$notify.loading.stop()
      if (this.deploying) {
        this.deployment = this.deploysRaw[0]
        await this.checkDeploy()
        await this.startLogs()
      }
    },
    async startLogs() {
      this.deployLogs = []
      this.$api.deployments.logs(this.deployment.id, (log) => {
        this.deployLogs.push(log)
      })
    },
    async deploy(e) {
      e.preventDefault()

      this.$notify.loading.start()
      try {      
        var deployment = await this.$api.apps.deployments(this.app.id).create({
          type: "deploy"
        })
        this.deployment = deployment
        this.deploysRaw.unshift(deployment)
        this.checkDeploy()
      } catch(error) {
        this.$notify.push({
          type: 'error',
          title: 'Could not deploy',
          message: error.message
        })
      } finally {
        this.$notify.loading.stop()
      }
      await this.startLogs()
    },
    timeout(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },
    async checkDeploy() {
      var currentDeployID = this.deploysRaw[0].id
      var deploy = await this.$api.deploy(this.app.id, currentDeployID)
      this.deploysRaw.splice(0, 1, deploy)
      if(deploy.status == "running") {
        await this.timeout(2000)
        this.checkDeploy()
      } else {
        this.$notify.loading.stop()
        if (deploy.status == "failed") {
          this.$notify.push({
            type: 'error',
            title: 'Deploy failed',
            message: 'Check logs for details'
          })
        } else {
          this.$notify.push({
            type: 'info',
            title: 'Deploy successful',
            message: 'Your application has been deployed'
          })
        }
      }
    }
  },
  watch: {
    async server() {
      await this.load()
    }
  },
  computed: {
    lastDeployFailed() {
      if (this.deploysRaw.length <= 0) {
        return false
      }
      return this.deploysRaw[0].status == 'failed'
    },
    deploying() {
      if (this.deploysRaw.length <= 0) {
        return false
      }
      return this.deploysRaw[0].status == 'running'
    },
    deploys() {
      return this.deploysRaw.map(deploy => {
        var statusText = deploy.status
        var statusClass = null
        var typeText = "N/A"

        switch (deploy.type) {
          case 'deploy':
            typeText = 'Code deploy'
          break
          case 'envUpdate':
            typeText = 'Environment update'
          break
        }

        switch (deploy.status) {
        case 'failed':
          statusText = 'Failed'
          statusClass = 'error'
          break
        case 'success':
          statusText = 'Success'
          statusClass = null
          break
        case 'running':
          statusText = 'Running'
          statusClass = 'loading'
          break
        default: break
        }
        return {
          item: deploy,
          view: [
            { key: 'When', val: deploy.createdAt.ago() },
            { key: 'Status', val: statusText, class: statusClass },
            { key: 'Type', val: typeText },
            { key: 'Git hash', val: (deploy.gitHash) ? deploy.gitHash : 'N/A' }
          ]
        }
      })
    }
  },
  data () {
    return {
      deployment: null,
      deploysRaw: [],
      deployLogs: []
    }
  },
  updated() {
    if (this.$refs.logs) {
      this.$refs.logs.scrollTop = this.$refs.logs.scrollHeight
    }
  }
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

@keyframes load
  0%
    left: 0px
  100%
    left: 10px


.vr-app-deploys
  padding-top: 16px
  .log
    background: $color-black
    color: $color-white
    .vr-dark &
      border: 2px solid $color-dark-gray
    border-radius: 8px
    font-size: 14px
    height: 256px
    overflow-y: auto
    user-select: text
    padding: 16px
    pre
      font-family: 'Roboto Mono', monospace
      display: block
      white-space: pre-wrap
      width: 100%
      word-break: break-all
      margin: 0
  h3
    margin-top: 16px
  .deploy
    height: 128px
    position: relative
    display: flex
    align-items: center
    justify-content: center
    margin-bottom: 8px

    &.deploying 
      .activity .bar
        animation: load 300ms infinite linear
        opacity: 1

    .button
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
      &:active
        top: 1px
      &:hover
        background: rgba(lighten($color-primary, 5%), 1)

    .activity
      z-index: 500
      position: absolute
      top: 50%
      left: 10px
      right: 10px
      height: 5px

      .bar
        position: absolute
        left: 0
        right: 0
        top: 0
        bottom: 0
        opacity: 0.1
        transition: opacity 300ms $animation-ease

        background-image: url('../../../assets/dot.png')
        background-position: 0
        background-repeat: repeat-x
        background-size: 20px 5px
        .vr-dark &
          background-image:  url('../../../assets/dot-dark.png')

    .target
      z-index: 600
      position: absolute
      top: 16px
      border-radius: 50%
      height: 96px
      width: 96px
      background: white
      background-position: center center
      background-repeat: no-repeat
      box-shadow: $shadow-1

      &.destination
        right: 0px
        background-image: url('../../../assets/server.svg')
        background-size: 36px auto
      &.source
        left: 0px
        background-image: url('../../../assets/vapor-red-logo.png')
        background-size: 48px auto
</style>
