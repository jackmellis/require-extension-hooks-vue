<template>
  <div>
    <div :class="$style.color">{{message}}</div>
    <div :class="green.color">This should be green.</div>
  </div>
</template>

<script>
module.exports = {
  computed: {
    message() {
      return "I should be displayed in red."
    }
  }
};

</script>

<style module>
.color {
  color: red;
}
</style>

<style module="green">
.color {
  color: green;
}
</style>
