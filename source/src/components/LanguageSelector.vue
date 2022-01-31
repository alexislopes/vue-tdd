<template>
  <img
    src="https://www.countryflags.io/br/flat/24.png"
    title="Português"
    @click="$i18n.locale = 'ptbr'"
  >
  <img
    src="https://www.countryflags.io/gb/flat/24.png"
    title="English"
    @click="$i18n.locale = 'en'"
  >
</template>

<script>
export default {};
</script>

<style scoped>
img {
  cursor: pointer;
}
</style>