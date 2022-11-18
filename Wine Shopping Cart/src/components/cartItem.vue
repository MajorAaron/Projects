<template>
  <li class="cartItem">
    <div class="detailsContainer">
        <div class="details">
            <span class="productInfo">
               <h1 class="ava xByline">{{product.AttributeValues.find(value => value.KeyName == "SLRAppellation").TextValue}}</h1>
               <h2 class="xHeading">{{product.Name}}</h2>
            </span>
            <span class="price">{{formatPrice(product.Price)}}</span>
            <span class="actionContainer"><item-counter  v-on:changeValue="updateCart" :defaultCount="count" ref="counterRef"></item-counter> <span class="removeItem" v-on:click="removeFromCart(product.RecordId)">&times;</span> </span>
            <span class="total">{{formatPrice(count * product.Price)}}</span>
            
        </div>
    </div>
  </li>
</template>

<script>
import itemCounter from "./itemCounter.vue"
import { EventBus } from '../app.js';
import util from "./util.vue";

export default {
    components: { 
        itemCounter
    },
    mixins: [util],
    data() {
        return {}
    },
    props: {
        product: Object,
        count: Number
    },
    updated(){
       // console.log(" cart item updated");
    },
    methods: {
        updateCart(data){
       //     console.log("update cart");
       //     console.log(data);
            
            EventBus.$emit('updateCart', {
                id: this.product.RecordId,
                quantity: data.count
            })
            
        },
        removeFromCart(id){
            EventBus.$emit('removeFromCart', id)
        }
    }
}
</script>

<style>

.cartItem .details {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.cartItem .counter{
    vertical-align: middle;
}

.cartItem span.productInfo {
    width: 30%;
}

.cartItem .total{
    font-weight: bold;
}

.cartItem{
    list-style: none;
    margin-bottom: 20px;
}

</style>