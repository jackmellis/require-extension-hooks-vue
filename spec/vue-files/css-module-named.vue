<template>
  <div :class="red.color">Custom named CSS module in red.</div>
</template>

<script>
module.exports = {
};

</script>

<style module="red">
.color {
  color: red;
}
</style>
