<template lang="pug">
div(class="vr-team-index" v-if="ready")
  h1 Team
  vr-table(
    :source='members', 
    :creatable='true',
    :deletable="true"
    @create="invite" 
    @delete="deleteMember"
  )
</template>

<script>
export default {
  name: 'vr-team',
  props: ['company'],
  async mounted() {
    await this.load()
  },

  methods: {
    async load() {
      await this.loadTeam()
    },

    async loadTeam() {
      this.$notify.loading.start()
      try {
        this.membersRaw = await this.$api.companies.invites.index()
        this.ready = true
      } catch (error) {
        this.$notify.error('Could not load team', error.message)
      } finally {
        this.$notify.loading.stop()
      }
    },

    invite() {
      if (this.company.plan == 'free') {
        this.$notify.info('Upgrade Plan', 'Upgrade your plan to invite team members')
        this.$router.push({ name: 'billing.plan'})
        return
      }
      this.$router.push({ name: 'team.invite' })
    },

    async deleteMember(item) {
      var question = `Are you sure you want to delete the user: '${item.email}'`
      var answer = confirm(question)
      if (!answer) {
        return
      }
      
      this.$notify.loading.start()

      try {
        await this.$api.companies.invites.delete(item.id)
        this.$notify.info('Team member deleted', 'The team member is now removed from your company.')
        await this.load()
      } catch (error) {
        this.$notify.error('Could not delete member', error.message)
      } finally {
        this.$notify.loading.stop()
      }
    }
  },

  computed: {
    members() {
      return this.membersRaw.map(member => {
        return {
          item: member,
          view: {
            'Name': member.firstName + ' ' + member.lastName,
            'Email': member.email
          }
        }
      })
    }
  },

  watch: {
    async member() {
      await this.loadTeam()
    }
  },

  data() {
      return {
          membersRaw: [],
          ready: false,
      }
  }
}
</script>

<style scoped lang="sass">
.vr-team-index
  h1
    margin-top: 0
</style>