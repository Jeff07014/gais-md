<template>
  <div class="about">
    <h1>This is an about page</h1>
    <InputBox/>
  </div>
</template>

<script>
import InputBox from '@/components/InputBox.vue'

export default {
  name: 'About',

  components: {
    InputBox,
  }
}

</script>

<style>
.about {
  text-align: center;
}
</style>
