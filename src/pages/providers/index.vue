<template lang="pug">
  .vr-providers(v-if='ready')
    h1 Cloud Providers
    p Add or remove credentials to your PaaS platform accounts. Vapor Red uses these credentials to manage servers on your behalf.
    .providers
      vr-big-button(:active="provider == 'digitalocean'" @action="switchProvider('digitalocean')")
        div(class="provider digitalocean")
          img(class="light dark" src="@/assets/do.png")
          span Digital Ocean
      vr-big-button(:active="provider == 'aws'" @action="switchProvider('aws')")
        div(class="provider aws")
          img(class="light" src="@/assets/aws.png")
          img(class="dark" src="@/assets/aws-dark.png")
          span Amazon
      vr-big-button(:active="provider == 'linode'" @action="switchProvider('linode')")
        div(class="provider linode")
          img(class="light dark" src="@/assets/linode.png")
          span Linode
    div(v-if="provider")
      vr-table(
          :source='providers', 
          :creatable='true',
          :deletable="true"
          @create="$router.push({ name: 'providers.create', query: { provider: provider} })" 
          @delete="deleteProvider"
      )
</template>

<script>
export default {
  name: 'vr-providers',
  async mounted() {
    await this.load()
  },
  methods: {
    switchProvider(provider) {
      this.$router.push({ name: 'providers.index', query: { provider: provider }})
      this.provider = provider
    },
    async load() {
      await this.loadCredentials()
    },
    async loadCredentials() {
      this.$notify.loading.start()
      try {
        this.providersRaw = await this.$api.credentials.index(this.provider)
        this.ready = true
      } catch (error) {
        this.$notify.error('Could not load Cloud providers', error.message)
      } finally {
        this.$notify.loading.stop()
      }
    },
    async deleteProvider(item) {
      var question = `Are you sure you want to delete the provider: '${item.name}'`
      var answer = confirm(question)
      if (!answer) {
        return
      }
      
      this.$notify.loading.start()

      try {
        await this.$api.credentials.delete(item.id)
        await this.load()
      } catch (error) {
        this.$notify.error('Could not delete provider', error.message)
      } finally {
        this.$notify.loading.stop()
      }
    }
  },
  computed: {
    providers() {
      return this.providersRaw.map(provider => {
        return {
          item: provider,
          view: {
            'Name': provider.name
          }
        }
      })
    }
  },
  watch: {
    async provider() {
      await this.loadCredentials()
    }
  },
  data() {
      return {
          providersRaw: [],
          ready: false,
          provider: (this.$route.query.provider) ? this.$route.query.provider : null
      }
  }
}
</script>

<style lang="sass" scoped>
@import "@/assets/base.sass"

.vr-providers
  h1
    margin-top: 0
  .providers
    .provider
      width: 96px
      img
        height: 48px
        display: block
        margin: 0 auto
        display: none
        &.dark
          .vr-dark &
            display: block
        &.light
          .vr-light &
            display: block
      span
        display: block
        font-size: 14px
        width: 100%
        text-align: center
        margin-top: 16px
        color: $color-dark-gray
        .vr-dark &
          color: $color-light-gray
  .providers
    margin-top: 16px
    margin-bottom: 24px
    display: flex
    .vr-big-button
      margin-right: 16px    
</style>
