<template lang="pug">
.vr-server-keys(v-if='ready')
  vr-box
    p SSH keys allow you to connect directly to your server. Add your computer's public key, then run the following command.
    .vr-code(v-if='server') ssh red@{{ server.ipv4 }}
  .empty(v-if='!keys.length')
    p No SSH keys have been added yet. Click the plus button below to add one:
  vr-table(:source='keys', @action='choose', :creatable='true', :deletable="true", @create='create', @delete="deleteKey")
</template>

<script>
export default {
  name: 'vr-server-keys',
  props: ['server'],
  async mounted() {
    await this.load()
  },
  methods: {
    async load() {
      if (this.server) {
        this.$notify.loading.start()
        try {
          this.keysRaw = await this.$api.serverKeys(this.server.id)
          this.ready = true
        } catch (error) {
          this.$notify.error('Could not load SSH keys', error.message)
        } finally {
          this.$notify.loading.stop()
        }
      }
    },
    create() {
      this.$router.push({ name: 'servers.keys.create' })
    },
    async deleteKey(item) {
      var question = `Are you sure you want to delete the key: '${item.name}'`
      var answer = confirm(question)
      if (!answer) {
        return
      }
      
      this.$notify.loading.start()

      try {
        await this.$api.deleteServerKey(item.id)
        await this.load()
      } catch (error) {
        this.$notify.error('Could not delete key', error.message)
      } finally {
        this.$notify.loading.stop()
      }
    },
    choose() { }
  },
  watch: {
    async server() {
      await this.load()
    }
  },
  computed: {
    keys() {
      return this.keysRaw.map(key => {
        return {
          item: key,
          view: {
            'Name': key.name
          }
        }
      })
    }
  },
  data () {
    return {
      keysRaw: [],
      ready: false
    }
  }
}
</script>

<style lang="sass">
@import "@/assets/base.sass"

.vr-server-keys
  .vr-code
    background: $color-black
    .vr-dark &
      border: 2px solid $color-dark-gray
    border-radius: 8px
    color: white
    font-family: 'Roboto Mono', monospace;
    font-size: 14px
    padding: 16px
    box-shadow: $shadow-1
    margin-bottom: 16px
    user-select: text
    margin-bottom: 24px
</style>
