<template>
  <div class="wineList">
       <callout :heading="$root.lang.homeCallout.heading" :byline="$root.lang.homeCallout.byline" :description="$root.lang.homeCallout.description" ></callout>

        <ul data-items-per-page="itemsPerPage">
            <wineItem v-for="(item) in currentItems" :key="item.RecordId" :productDetails="item" v-bind:class="{ featured: item.RecordId == config.featuredId }" ></wineItem>
        </ul>
        <pagination-component @changePage="changePage" :currentPage="currentPage" :totalPages="Math.ceil(sortedWineItems.length / itemsPerPage)" :totalResults="sortedWineItems.length"></pagination-component>

  </div>
</template>

<script>

var axios = require('axios');
import wineItem from './wineItem.vue';
import PaginationComponent from './paginationComponent.vue';
import Callout from './callout.vue';

export default {
  components: { wineItem,PaginationComponent,Callout},
    data() {
        return {
            itemsPerPage: this.$root.config.itemsPerPage || 3,
            currentPage: 1,
            wineItems: [],
            config: this.$root.config
        }
    },
    mounted(){
        this.getWineItemsFromAPI();
    },
    updated(){
        if(this.config.onUpdate()){
            this.config.onUpdate()
        }
    },
    computed: {
        sortedWineItems(){
            var uniqueList = _.uniq(this.wineItems)

            if(this.config.sortBy){
                return _.sortBy(uniqueList, this.config.sortBy)
            }else{
                return uniqueList;
            }   
        },
        currentItems(){
            var startingPoint = (this.currentPage - 1) * this.itemsPerPage;
           return this.sortedWineItems.slice(startingPoint, startingPoint + this.itemsPerPage)
    
        }
    },
    methods: {
        changePage(page) {
            this.currentPage = page
        },
        getImgSrc(name){
//            return `https://images-us-prod.cms.commerce.dynamics.com/cms/api/mhtmhnbtbn/imageFileData/search?fileName=/${name}&w=0&h=236&q=80&m=6&f=png`
            return `https://images-us-prod.cms.commerce.dynamics.com/cms/api/mhtmhnbtbn/imageFileData/search?fileName=/${name}`
        },
        getWineItemsFromAPI(){
            var vue = this;
            var localURL = "http://localhost:5001/wayin-svcs/us-central1/getProducts";
            var prodURL = "https://us-central1-wayin-svcs.cloudfunctions.net/us-smwe-search-by-criteria";


           


            var channel = this.config.channelID;
            var oun = this.config.oun;


            if(this.config.categoryIds){

                 this.config.categoryIds.forEach(function(categoryID){


                    var options = {
                        method: "GET",
                        url: `${prodURL}?categories=${categoryID}&channelid=${channel}&oun=${oun}`,
                    };

                    axios(options)
                    .then(function (response) {
                        response.data.value.map(function(item){
                            if(item.RecordId == vue.config.featuredId){
                                vue.wineItems.unshift(item);
                            }else{
                                vue.wineItems.push(item)
                            }
                        })                })
                    .catch(function (error) {
             //       console.log(error);
                    });


                })
               
            }
            
            if(this.config.productIds){
              //  console.log("get product info")

                var options = {
                    url: `${prodURL}?ids=${vue.config.productIds}&channelid=${channel}&oun=${oun}`,
                };

                axios(options)
                .then(function (response) {
                    response.data.value.map(function(item){
                            if(item.RecordId == vue.config.featuredId){
                                vue.wineItems.unshift(item);
                            }else{
                                vue.wineItems.push(item)
                            }
                    })
                })
                .catch(function (error) {
              //  console.log(error);
                });
            }
            




        }
    }
};
</script>
