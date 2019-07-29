<template lang="pug">
.vr-subscription-inactive
  h1 Subscription Inactive
  p Your subscription is currently inactive. To activate your account, please change your billing information.
  vr-button(@action="$router.push({ name: 'billing.plan' })") Switch plan
</template>

<style scoped lang="sass">
.vr-subscription-inactive
  h1
    margin-top: 0
</style>
