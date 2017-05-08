<template>
  <div>{{value}}</div>
</template>
<script>
import Vue from 'vue';

export default Vue.extend({
  name : 'already-extended',
  data(){
    return {
      value : 'already extended'
    };
  }
})
</script>
