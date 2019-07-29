<template>
  <codemirror 
    class="vr-code-editor"
    :options="options" 
    :value="value" 
    @input="$emit('input', $event)"
  ></codemirror>
</template>

<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/base16-dark.css'
import 'codemirror/mode/nginx/nginx.js'

export default {
  name: 'vr-box',
  props: ['value', 'mime'],
  methods: { },
  data() {
    return {
      options: { 
        theme: 'base16-dark',
        lineNumbers: true,
        line: true,
        mode: this.mime
      }
    }
  },
  components: { codemirror }
}
</script>

<style lang="sass">
@import "@/assets/base.sass"

.vr-code-editor
  border-radius: 8px
  overflow-y: hidden
  .CodeMirror
    height: 100%
  margin-bottom: 16px
  span
    font-family: 'Roboto mono', monospace
    font-size: 14px
    line-height: 18px
</style>
