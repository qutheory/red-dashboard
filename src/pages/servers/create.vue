<template lang="pug">
.vr-servers-new
  h1 New Server
  vr-form(ref="form", @action="create")
    vr-form-input(name="serverName" title="Server Name" v-model="name" placeholder="my-server" required)
    vr-form-select(title="Ubuntu version", name="ubuntuVersion", v-model="ubuntuVersion")
      option(value="18.04") 18.04
      option(value="16.04") 16.04
    .providers
      vr-big-button(:active="provider == 'digitalocean'" @action="provider = 'digitalocean'")
        div(class="provider digitalocean")
          img(class="light dark" src="@/assets/do.png")
          span Digital Ocean
      vr-big-button(:active="provider == 'aws'" @action="provider = 'aws'")
        div(class="provider aws")
          img(class="light" src="@/assets/aws.png")
          img(class="dark" src="@/assets/aws-dark.png")
          span Amazon
      vr-big-button(:active="provider == 'linode'" @action="provider = 'linode'")
        div(class="provider linode")
          img(class="light dark" src="@/assets/linode.png")
          span Linode

    transition(name="slide-up")
      div(v-if="credentials != null")
        div(v-if="credentials.length > 0")
          vr-form-select(title="Credentials" name="credentials" placeholder="Choose Credentials" v-model="credentialID")
            option(v-for="c in credentials" :value="c.id") {{ c.name }}
        div(v-else)
          vr-box
            div(v-if="provider == 'linode'")
              p Enter your Linode credentials
            div(v-if="provider == 'aws'")
              p Enter your AWS credentials. 
            div(v-if="provider == 'digitalocean'")
              p
                | Enter your Digital Ocean API key. 
                a(target="_blank" href="https://cloud.digitalocean.com/settings/api/tokens") Digital Ocean API settings ↗
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
              vr-button(@action="$refs.createCredential.submit()") Save

    transition(name="slide-up")
      div(v-if="provider && credentialID")
        vr-form-select(title="Server Region" v-model="regionID" placeholder="Choose Region" required)
          option(v-for="region in regions" :value="region.id") {{ region.name }}
        div(v-if="provider == 'aws'")
          vr-form-select(v-if="vpcs" title="VPC" v-model="vpcID" placeholder="Choose VPC" required)
            option(value="new") Create new
            option(v-for="vpc in vpcs" :value="vpc.id") {{ vpc.name }}
          vr-form-input(
            v-if="vpcID == 'new'"
            name="vpcName" 
            title="VPC Name" 
            v-model="vpcName" 
            required
          )
          vr-form-select(v-if="subnets" title="Subnet" v-model="subnetID" placeholder="Choose Subnet" required)
            option(v-for="subnet in subnets" :value="subnet.id") {{ subnet.name }}
          vr-form-select(v-if="azss" title="AZS" v-model="azsID" placeholder="Choose AZS" required)
            option(v-for="azs in azss" :value="azs.id") {{ azs.name }}
        vr-form-select(title="Server Size" name="serverSize" v-model="sizeID" placeholder="Choose Size" required)
          option(v-for="size in sizes" :value="size.id") {{ size.name }}
        div(v-if="provider == 'aws'")
          vr-form-input(
            name="discSize" 
            title="Disk Size (GB)" 
            v-model="discSize" 
            required
            placeholder="20"
          )
    .buttons
      vr-button(color="clear" @action="$router.push({ name: 'servers.index' })") Cancel
      .spacer
      vr-button(@action="$refs.form.submit($event)" :disabled="!ready") Create Server
</template>

<script>
export default {
  name: 'vr-servers-new',
  props: [],
  methods: {
    async create() {
      this.$notify.loading.start()
      
      try {
        var data = { 
          name: this.name,
          provider: this.provider,
          serverSize: this.sizeID,
          credentials: this.credentialID,
          discSize: parseInt(this.discSize),
          region: this.regionID,
          vpcName: this.vpcName,
          vpcs: this.vpcID,
          ubuntuVersion: this.ubuntuVersion,
          azs: this.azsID,
          subnet: this.subnetID
        }
        this.server = await this.$api.createServer(data)
        this.$notify.info('Creating server', 'Your server is being created.')
        this.$router.push({ name: 'servers.index' })
      } catch(error) {
        this.$notify.push({ type: 'error', title: 'Could not create server', message: error.message })
      } finally {
        this.$notify.loading.stop()
      }
    },
    async createCredential() {
        this.$notify.loading.start()
        try {
          await this.$api.credentials.create({ 
            name: this.credentialName,
            provider: this.provider,
            accessKey: this.credentialAccessKey,
            secretKey: this.credentialSecretKey
          })
          await this.loadCredentials()
          this.$notify.push({ type: 'info', title: 'Credential created', message: 'You may now use them to create servers.' })
        } catch(error) {
          this.$notify.push({ type: 'error', title: 'Could not create credential', message: error.message })
        } finally {
          this.$notify.loading.stop()
        }
    },
    cancel(e) {
      e.preventDefault()
      this.$router.push({ name: 'servers.index' })
    },
    async loadCredentials() {
      if (!this.provider) {
        return null
      }
      this.$notify.loading.start()
      try {      
        this.credentials = await this.$api.credentials.index(this.provider)
        if(this.credentials.length == 1) {
          this.credentialID = this.credentials[0].id
        }
      } catch(error) {
        this.$notify.push({ type: 'error', title: 'Could not load credentials', message: error.message })
      } finally {
        this.$notify.loading.stop()
      }
    },
    async loadRegions() {
      if (!this.provider) {
        return null
      }
      this.$notify.loading.start()
      try {      
        this.regions = await this.$api.regions.index(this.provider)
      } catch(error) {
        this.$notify.push({ type: 'error', title: 'Could not load regions', message: error.message })
      } finally {
        this.$notify.loading.stop()
      }
    },
    async loadSizes() {
      if (!this.provider) {
        return null
      }
      this.$notify.loading.start()
      try {      
        this.sizes = await this.$api.sizes.index(this.provider)
        this.sizes = this.sizes.sort((a, b) => {
          if (a.cpu < b.cpu && a.memory < b.memory) {
            return -1
          } else {
            return 1
          }
        })
      } catch(error) {
        this.$notify.push({ type: 'error', title: 'Could not load sizes', message: error.message })
      } finally {
        this.$notify.loading.stop()
      }
    },
    async loadVPCs() {
      if (this.provider != 'aws') {
        return
      }

      if (!this.credentialID || !this.regionID) {
        return null
      }

      this.$notify.loading.start()
      try {      
        this.vpcs = await this.$api.vpcs.index(this.credentialID, this.regionID)
      } catch(error) {
        this.$notify.push({ type: 'error', title: 'Could not load VPCs', message: error.message })
      } finally {
        this.$notify.loading.stop()
      }
    },
    async loadAZSs() {
      if (this.provider != 'aws') {
        return
      }

      if (!this.credentialID || !this.regionID) {
        return null
      }

      this.$notify.loading.start()
      try {      
        this.azss = await this.$api.azss.index(this.credentialID, this.regionID)
      } catch(error) {
        this.$notify.push({ type: 'error', title: 'Could not load AZSs', message: error.message })
      } finally {
        this.$notify.loading.stop()
      }
    },
    async loadSubnets() {
      if (this.provider != 'aws') {
        return
      }

      if (!this.credentialID || !this.regionID || !this.vpcID) {
        return null
      }

      if(this.vpcs == 'new') {
        return null
      }

      this.$notify.loading.start()
      try {      
        this.subnets = await this.$api.subnets.index(this.credentialID, this.regionID, this.vpcID)
      } catch(error) {
        this.$notify.push({ type: 'error', title: 'Could not load subnets', message: error.message })
      } finally {
        this.$notify.loading.stop()
      }
    },
    async load() {
      try {
        await this.$api.companies.capacity('createServer')
      } catch(error) {
        this.$notify.info('Upgrade Plan', 'Upgrade your plan to create more servers')
        this.$router.push({ name: 'billing.plan' })
      }
    },
  },
  async mounted() {
    await this.load()
  },
  computed: {
    ready() {
      return this.provider != null && this.credentials != null
    },
  },
  watch: {
    async provider() {
      this.credentials = null
      this.regions = []
      this.sizes = []

      await this.loadCredentials()
      await this.loadRegions()
      await this.loadSizes()
    },
    async credentialID() {
      await this.loadVPCs()
      await this.loadAZSs()
      await this.loadSubnets()
    },
    async regionID() {
      await this.loadVPCs()
      // await this.loadAZSs()
      // await this.loadSubnets()
    },
    async vpcID() {
      if (this.vpcID == 'new') {
        await this.loadAZSs()
        this.subnets = null
      } else {
        await this.loadSubnets()
        this.azss = null
      }
    }
  },
  data () {
    return {
      name: null,
      ubuntuVersion: '18.04',
      provider: null,
      credentialID: null,
      sizeID: null,
      regionID: null,
      discSize: null,
      vpcName: null,
      vpcID: null,
      azsID: null,
      subnetID: null,

      credentials: null,

      credentialName: null,
      credentialAccessKey: null,
      credentialSecretKey: null,

      azss: null,
      vpcs: null,
      subnets: null,
      sizes: [],
      regions: []
    }
  }
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.vr-servers-new
  h1
    margin-top: 0
  position: relative
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
  .providers
    margin-top: 16px
    margin-bottom: 24px
    display: flex
    .vr-big-button
      margin-right: 16px
  .buttons
    display: flex
    margin-top: 16px
    .spacer
      flex-grow: 1
</style>
