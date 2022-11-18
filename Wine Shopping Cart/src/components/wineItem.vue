<template>
  <li class="wineItemContainer">
    <div class="detailsContainer">
        <div class="xMediaContainer">
            <img :src="getImgSrc(productDetails.PrimaryImageUrl)">
        </div>
        <div class="details">
            <h1 class="ava xByline">{{productDetails.AttributeValues.find(value => value.KeyName == "SLRAppellation").TextValue}}</h1>
            <h2 class="xHeading">{{productDetails.Name}}</h2>
            <!--<p class="tastingNotes xCopy">{{productDetails.AttributeValues.find(value => value.KeyName == "TastingNotes").TextValue}}</p>-->
            <truncate class="tastingNotes xCopy" clamp="...Show More" :length="$root.config.truncateCharNumber" less="Show Less" :text='productDetails.AttributeValues.find(value => value.KeyName == "TastingNotes").TextValue'></truncate>

            <div class="actionContainer">
                <span class="price">{{formatPrice(productDetails.Price)}}</span>
                <item-counter :defaultCount="1" ref="counterRef"></item-counter>
            </div>
        </div>
    </div>
    <div class="buttonContainer">
        <button v-on:click="addToCart" class="xButton xCTA"><span>Add To Cart</span></button>
    </div>
    <div class="toastMessage" >
    <transition name="fade">
        <div v-if="toastMessage != ''" >{{toastMessage}}</div>
    </transition>
    </div>
  </li>
</template>

<script>
import itemCounter from "./itemCounter.vue"
import { EventBus } from '../app.js';
import util from "./util.vue";
import truncate from 'vue-truncate-collapsed';


export default {
    components: { 
        itemCounter,
        truncate
    },
    mixins: [util],
    data() {
        return {
            toastMessage: ""
        }
    },
    props: {
        productDetails: Object
    },
    methods: {
        getImgSrc(name){
//            return `https://images-us-prod.cms.commerce.dynamics.com/cms/api/mhtmhnbtbn/imageFileData/search?fileName=/${name}&w=0&h=236&q=80&m=6&f=png`
            return `https://images-us-prod.cms.commerce.dynamics.com/cms/api/mhtmhnbtbn/imageFileData/search?fileName=/${name}&w=0&h=400&q=100&m=6&f=png`
        },
        showToast(message){
            this.toastMessage = message;
            var vue = this;
            setTimeout(function(){
                vue.toastMessage = "";
            },vue.$root.config.addToCartTime || 3000)
        },
        addToCart(){
            
            var items = []
            var itemsCount = this.$refs.counterRef.$data.count;
            
            for (var i = 0; i < itemsCount; i++){
                items.push(this.productDetails)
            }


          //(this.$refs.counterRef.$data.count)
            EventBus.$emit('addToCart', {items: items})

            this.showToast(`${itemsCount} ${itemsCount == 1 ? "item" : "items"} added to your cart.`)

        }
    }
}
</script>

<style>




.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

li.wineItemContainer{
    list-style: none;
    margin-bottom: 20px;
    border: 1px solid grey;
    padding: 5px;
    display: inline-block;
    width: 32%;
    vertical-align: top;
}

.wineItemContainer .actionContainer{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.wineItemContainer .xMediaContainer{
    display: inline-block;
    width: 30%;    
}

.wineItemContainer .details{
    display: inline-block;
    width: 65%;
}

.wineItemContainer .xMediaContainer img{
    padding: 9px;
    max-height: 200px;
    vertical-align: top;
}

.wineItemContainer .xButton{
    width: 100%;
}


</style>