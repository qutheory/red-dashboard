<template lang="pug">
  div(class="vr-servers-provisions-show" v-if="ready")
    h2 Provision
    p {{ provision.description }}
    div(class="log")
      pre(v-for="log in logs") {{ log }}
</template>

<script>

export default {
  name: 'vr-servers-provisions-show',
  props: ['server'],
  async mounted() {
    await this.load()
  },
  methods: {
    async load() {
      if (this.server) {
        this.provision = await this.$api.provisions.show(this.$route.params.provisionID)
        this.ready = true
        this.$api.provisions.logs(this.provision.id, (log) => {
          this.logs.push(log)
        })
      }
    },
  },
  watch: {
    async server() {
      await this.load()
    }
  },
  computed: { },
  data () {
    return {
      provision: null,
      ready: false,
      logs: []
    }
  }
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.vr-servers-provisions-show
  .log
    background: $color-black
    color: $color-white
    padding: 16px
    border-radius: 8px
    font-family: 'Roboto Mono', monospace
    font-size: 14px
    min-height: 128px
    overflow-y: auto
    overflow-x: hidden
    user-select: text
    margin-bottom: 16px
    pre
      display: block
      white-space: pre-wrap
      width: 100%
      word-break: break-all
      margin: 0
</style>
