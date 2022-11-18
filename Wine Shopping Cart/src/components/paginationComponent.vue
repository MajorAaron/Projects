/<template>
  <div class="paginationContainer">
        <ul class="pager" v-if="totalPages > 1">

        <li class="page-item first" v-if="currentPage != 1">
            <a @click="setPage(1)" class="page-link first">First</a>
        </li>

        <li class="page-item previous" v-if="currentPage > 1">
            <a @click="setPage(currentPage - 1)" class="page-link previous">Previous</a>
        </li>

        <li v-for="(page) in pagesToShow" :key="page" class="page-item" :class="{active: page === currentPage}">
            <a @click="setPage(page)" class="page-link">{{page}}</a>
        </li>

        <li class="page-item next" v-if="currentPage < totalPages">
            <a @click="setPage(currentPage + 1)" class="page-link next">Next</a>
        </li>

        <li class="page-item last" v-if="currentPage != totalPages">
            <a @click="setPage(totalPages)" class="page-link last">Last</a>
        </li>
                
        </ul>
  </div>
</template>

<script>

export default {
    props: {
        currentPage: Number,
        totalPages: Number,
        totalResults: Number
    },
    data(){
        return {
            lowerLimit: 0,
            upperLimit: 0
        }
    },
    computed: {

        pagesToShow(){
				var pages = [];
				this.lowerLimit = this.currentPage - 2;
				this.upperLimit = this.currentPage + 2;

				for (let i = 1; i < this.totalPages + 1; i++) {
					
					if(i >= this.lowerLimit && i <= this.upperLimit ){
				//		console.log("lower push")
						pages.push(i);
					}
				}

				return pages;
        }
    },
    methods:{
        setPage(pageNumber){
            this.$emit('changePage', pageNumber);
        },
    }
}
</script>

<style>

</style>