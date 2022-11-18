/<template>
  <div class="counter">
      <span v-on:click="decreaseCounter" class="circle">-</span>
      <span class="inputWrapper"><input type=number readOnly v-model="count"></span>
      <span v-on:click="increaseCounter" class="circle">+</span>
  </div>
</template>

<script>

export default {
    props: {
        defaultCount: Number
    },
    data(){
        return {
            count: this.defaultCount
        }
    },
    watch: {
        count(val){
            this.$emit('changeValue', {
                count: val
            });
        }
    },
    updated(){
       // console.log("counter updtaed");
    },
    mounted(){
      //  console.log("counter mounted");
    },
    methods: {
        increaseCounter(){
            this.count ++;
        },
        decreaseCounter(){
            if(this.count > 1){
                this.count --;
            }
        }
    }
}

</script>

<style>
    .counter{
        display:inline-block;
    }

     .counter .circle{
        border: 1px solid #ad7b2e;
        border-radius: 50%;
        padding: 5px;
        width: 25px;
        height: 25px;
        padding: 0px;
        display: inline-block;
        text-align: center;
        font-size: 2rem;
        cursor: pointer;
    }
    .counter .inputWrapper{
        display: inline-block;
        width: 20px;
        height: 25px;
        vertical-align: middle;
    }
   .counter input{
        display: inline-block;
        padding: 0;
        text-align: center;
        border: 0;
    }
</style>