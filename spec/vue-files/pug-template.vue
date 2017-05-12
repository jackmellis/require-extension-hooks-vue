<template lang="pug">
div {{value}}
</template>

<script>
  export default {
    name : 'pug-esm',
    data(){
      return {
        value : 'I am a pug component'
      };
    }
  }
</script>