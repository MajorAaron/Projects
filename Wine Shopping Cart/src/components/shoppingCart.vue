<template>
  <div class="cartContainer" :class='{"open": open}' ref="cartContainer">
      <div v-if="!open" @click="open = !open" class="cartIcon"> <img src="https://us-a.wayin.com/images/2036/2b6f9124-8139-4b38-9de3-26e049172abb/cart-icon.png"> <strong>{{itemCount}}</strong></div>
      <div v-if="open" class="cart">
          <div class="closeCart" @click="open = false">&times;</div>
          <callout :heading="$root.lang.cartCallout.heading" :byline="$root.lang.cartCallout.byline" :description="$root.lang.cartCallout.description" ></callout>
          <h2 v-if="items.length == 0">{{$root.lang.zeroItemsInCart}}</h2>
          <ul>
              <cart-item v-for="(item, index) in items" :key="index" :product="item.info" :count="item.quantity"></cart-item>
          </ul>
          <div v-if="items.length > 0" class="cartTotal">Total: {{formatPrice(totalCost)}}</div>
          <div v-if="items.length > 0" class="cartDisclaimer">Tax and shipping will be calculated at checkout</div>
          <div class="buttonContainer">
              <button @click="open = false" class="xButton xBackToCart"><span>Back To Shop</span></button>
              <button v-if="items.length > 0" class="xButton xToCheckout"><span><a target="_blank" :href="checkoutURL">Proceed To Checkout</a></span></button>
          </div>
      </div>
  </div>
</template>

<script>

import Callout from './callout.vue';
import { EventBus } from '../app.js';
import cartItem from "./cartItem.vue";
import util from "./util.vue";


export default {
    
    components: {cartItem,Callout},
    data() {
        return {
            items: [],
            open: false
        }
    },
    mixins: [util],
    computed: {
        itemCount(){
            var count = 0; 
            this.items.map(function(item){
                    count += item.quantity;
            })
            return count;
        },
        totalCost(){
            var cost = 0; 
            this.items.map(function(item){
                    cost += item.info.Price * item.quantity;
            })
            return cost; 
        },
        checkoutURL(){
            var base = this.$root.config.checkoutURL + "&add=";
            var quantityArray = [];

            this.items.map(function(item){
                var stringInfo = item.id + ":" + item.quantity;
               quantityArray.push(stringInfo);
            })

            return base.concat(quantityArray.join(","));
        }
    },
    watch: {
        open: function(){
          //  var cartHeight = this.$refs.cartContainer.offsetHeight;
          //  console.log(cartHeight);
            
        }
    },
    created(){
        var that = this;
        EventBus.$on('addToCart', function(data){
            that.addItemsToCart(data.items);
            
        });

        EventBus.$on('removeFromCart', function(data){
            that.removeFromCart(data);
            
        });

        EventBus.$on('updateCart', function(data){
            that.updateCart(data.id,data.quantity)
        });
    

    },
    updated(){
            if(this.open){
                document.querySelector(".wineList").classList.add("xHidden");

            }else{
                document.querySelector(".wineList").classList.remove("xHidden");
            }

            if(this.$root.config.onUpdate){
                NGX.App.api.resizeParent()
                this.$root.config.onUpdate()
            }
    },
    methods:{
        updateCart(id, quantity){
            this.items.find(function(item){ return item.id == id}).quantity = quantity;
        },
        removeFromCart(id){
            var itemsSlot = this.items.findIndex(function(item){
                return item.id == id;
            })
            this.items.splice(itemsSlot, 1);
        },
        addItemsToCart(list){

            var itemsSlot = this.items.findIndex(function(item){
                return item.id == list[0].RecordId;
            })

            if(itemsSlot != -1){
                this.items[itemsSlot].quantity += list.length
            }else{
                this.items.push({
                    info: list[0],
                    id: list[0].RecordId,
                    quantity: list.length
                })
            }
        }
    }
}
</script>

<style>
/*
 .cartContainer {
     position: absolute;
     top: 0;
     right: 0;
     padding-top: 40px;
 }
*/

 .cartContainer .closeCart,
  .cartContainer .cartIcon{
     cursor: pointer;
     position: absolute;
     top: 0;
     right: 0;

 }

 .cartContainer .buttonContainer{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

 .cartContainer.open {
    width: 100%;
    height: 100%;
    background-color: white;
    z-index: 200;
}

 .cartContainer .cartDisclaimer,
 .cartContainer .cartTotal{
    width: 100%;
    text-align: right;
}
</style>