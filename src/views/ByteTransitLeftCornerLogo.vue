<script setup lang="ts">

const emits = defineEmits(["logoClick"]);

function onLogoClick(){
  emits("logoClick");
}

</script>

<template>
  <div class = 'bt-logo-wrapper'>
    <div @click="onLogoClick" class = 'bt-logo-inside'></div>
  </div>
</template>

<style scoped>
.bt-logo-inside{
  cursor: pointer;
  height: 100%;
  margin: 10px 0;
  content: url("@/assets/icons/logo.svg");
}
</style>