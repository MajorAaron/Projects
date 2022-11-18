<template>
  <div id="app" :class="$root.config.brandClass" :data-brand="$root.config.brandClass">
    <shopping-cart></shopping-cart>
    <WineList></WineList>
  </div>
</template>

<script>
import ShoppingCart from './components/shoppingCart.vue';


import WineList from './components/wineList.vue'

export default {

  components: {
    WineList,
    ShoppingCart
  },
  data(){
    return {
      test: "test"
    }
  },
  methods: {

  },
  mounted(){
  }
};
</script>

<style>

#app{
  position: relative;
}
</style>