<template lang="pug">
div(class="vr-account")
  h1 Account
  vr-box.account
    p.name {{ user.firstName }} {{ user.lastName }}
    p.email {{ user.email }}
  vr-box
    h2 Update Password
    p If you can't remember your password, logout and use reset password.
    vr-form(ref="updatePasswordForm" @action="updatePassword")
      vr-form-input(
        name="currentPassword" 
        type="password"
        title="Current Password" 
        v-model="currentPassword" 
        autocomplete="current-password"
        required
      )
      vr-form-input(
        name="newPassword"
        type="password"
        title="New Password" 
        v-model="newPassword"
        autocomplete="new-password"
        required
      )
    div(class="buttons")
      vr-button(@action="$refs.updatePasswordForm.submit()") Update
</template>

<script>
export default {
  name: 'vr-account',
  props: ['user'],
}
</script>

<style lang="sass">
@import "@/assets/base.sass"

.vr-account
  h1
    margin: 0
  .account
    .name
      font-weight: 700
      margin-bottom: 0
    .email
      margin-top: 0

</style>
