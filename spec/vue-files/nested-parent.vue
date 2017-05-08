<template>
  <div>
    <nested-child :value="value"/>
  </div>
</template>
<script>
import nestedChild from './nested-child';

export default {
  name : 'nested-parent',
  components : {nestedChild},
  data(){
    return {
      value : 'nested'
    };
  }
}
</script>
