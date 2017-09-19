<template>
  <div>
    <div :class="$style.color">Default CSS-module in red.</div>
    <div :class="green.color">Custom named CSS-module in green.</div>
    <div :class="blue.color">Another one custom named CSS-module in blue.</div>
    <div class="color">Scoped style in yellow.</div>
    <div class="global-color">Global style in orange.</div>
  </div>
</template>

<script>
module.exports = {
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

<style module="blue">
.color {
  color: blue;
}
</style>

<style scoped>
.color {
  color: yellow
}
<style>

<style>
.global-color {
  color: orange
}
<style>
