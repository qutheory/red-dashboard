<template>
  <div class="vr-dashboard"></div>
</template>

<script>
export default {
  name: 'vr-dashboard',
  props: { },
  methods: { },
  mounted() {
    this.$router.push({ name: 'servers.index' })
  },
  data () {
    return {}
  }
}
</script>

<style scoped lang="sass">
@import "@/assets/base.sass"

.vr-dashboard

</style>
