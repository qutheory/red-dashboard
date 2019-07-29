<template lang="pug">
div(class="vr-providers-create")
  div(v-if="provider == 'aws'")
    h1 Add AWS Provider
    p Enter your AWS credentials. 
  div(v-if="provider == 'digitalocean'")
    h1 Add Digital Ocean Provider
    p
      | Enter your Digital Ocean API key. 
      a(target="_blank" href="https://cloud.digitalocean.com/settings/api/tokens") Digital Ocean API settings ↗      
  div(v-if="provider == 'linode'")
    h1 Add Linode Provider
    p Enter your Linode personal access token. 
  vr-form(ref="createCredential" @action="createCredential")
    vr-form-input(
      name="credentialName" 
      title="Name" 
      v-model="credentialName" 
      required
      detail="Give these credentials a memorable name."
    )
    div(v-if="provider == 'aws'")
      vr-form-input(
        name="credentialAPIToken" 
        title="Access Key" 
        v-model="credentialAccessKey" 
        required
      )
      vr-form-input(
        name="credentialAPIToken" 
        title="Secret Key" 
        v-model="credentialSecretKey" 
        required
        detail="We'll save this access key for next time."
      )
    div(v-if="provider == 'digitalocean'")
      vr-form-input(
        name="credentialAPIToken" 
        title="API Token" 
        v-model="credentialAccessKey" 
        required
        detail="We'll save this API token for next time."
      )
    div(v-if="provider == 'linode'")
      vr-form-input(
        name="credentialAPIToken" 
        title="API Token" 
        v-model="credentialAccessKey" 
        required
        detail="We'll save this API token for next time."
      )
  .buttons
    vr-button(color="clear" @action="$router.push({ name: 'providers.index', query: { provider: provider } })") Cancel
    .spacer
    vr-button(@action="$refs.createCredential.submit()") Save
</template>

<script>
export default {
  methods: {
    async createCredential() {
        this.$notify.loading.start()
        try {
          await this.$api.credentials.create({ 
            name: this.credentialName,
            provider: this.provider,
            accessKey: this.credentialAccessKey,
            secretKey: this.credentialSecretKey
          })
          
          this.$router.push({ name: 'providers.index', query: { provider: this.provider } })
          this.$notify.push({ type: 'info', title: 'Credential created', message: 'You may now use them to create servers.' })
        } catch(error) {
          this.$notify.push({ type: 'error', title: 'Could not create credential', message: error.message })
        } finally {
          this.$notify.loading.stop()
        }
    },
  },
  data() {
    return {
      provider: this.$route.query.provider,
      credentialName: null,
      credentialAccessKey: null,
      credentialSecretKey: null,
    }
  }
}
</script>

<style lang="sass" scoped>
.vr-providers-create
  h1
    margin-top: 0
  .buttons
    display: flex
    .spacer
      flex-grow: 1
</style>