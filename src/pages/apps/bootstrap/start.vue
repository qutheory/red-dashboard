<template lang="pug">
  div(class="vr-apps-bootstrap-start")
    h2 Creating App
    p Please wait while the application is configured.
</template>

<script>
export default {
  name: 'vr-apps-bootstrap-start',
  props: [],
  async mounted() {
    this.$notify.loading.start()
    this.checkAppStatus()
  },
  methods: {
    checkAppStatus() {
      this.$api.apps.show(this.$route.params.appID).then(app => {      
        if (app.status == 'created') {
          this.$router.push({ name: 'apps.bootstrap.tools' })
          this.$notify.loading.stop()
          this.$notify.info('App created', 'Your application has been successfully created.')
        } else {
          setTimeout(() => {
            this.checkAppStatus()
          }, 2000)
        }
      })
    }
  },
  watch: { },
  computed: {  },
  data () {
    return {
      app: null
    }
  }
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.vr-apps-bootstrap-start
</style>
