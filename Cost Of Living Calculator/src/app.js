const axios = require('axios').default;
//import AdvancedSearch from 'vue-advanced-search'
import vSelect from 'vue-select'
import VueCurrencyInput from 'vue-currency-input'

import cities from "./cities.js"

const pluginOptions = {
	/* see config reference */
	globalOptions: { currency: 'USD'}
  }

import Vue from 'vue';
var app;

var config = {

}

var lang = {

}

var startApp = function () {

	Vue.component('v-select', vSelect)
	Vue.use(VueCurrencyInput, pluginOptions)


	Vue.component('TabComponent',{
		template: /*html*/`
			<div class="tabs-container">
				<ul class="tab-heads">
					<li 
						class="tab-head"
						:data-tab-name="tab"  
						v-for="tab in tabs" 
						:key="tab" 
						v-bind:class="{'tab-head--active': activeTab === tab}"
						v-on:click="switchTab(tab)"
					>
					<slot :name="tabHeadSlotName(tab)">{{ tab }} </slot>

					</li>
				</ul>
				<div class="tab-content-container">
					<div class="tab-content">
						<slot :name="tabContentSlotName"></slot>
					</div>
				</div>
				
			</div>
		`,
		props: {
			initialTab: String,
			tabs: Array
		},
		data(){
			return{
				"activeTab": this.initialTab
			}
		},
		mounted(){
			console.log("mounted");
		},
		updated(){
		},
		computed: {
			tabContentSlotName(){
				return `tab-content-${this.activeTab}`
			}
		},
		methods:{
		    tabHeadSlotName(tabName) {
				return `tab-head-${tabName}`;
			},
		
			switchTab(tabName) {
				this.activeTab = tabName;
			}	
		}
	})


	Vue.component('salary-comparison', {
		props: ['data','income'],	
		template: /*html*/`
			<div class="salary-comparison">
				<p class="comparison-intro">To maintain your standard of living in <span>{{ data.toPlaceName }},{{ data.toPlaceState }}</span>, you need to earn:</p>
				<h2 class="comparison-figure">{{ data.comparativeSalary }}</h2>
				<p class="comparison-summary">The cost of living is <span :class="comparativeDirection">{{percentHigher}}% {{comparativeDirection}} </span> in {{ data.toPlaceName }}</p>
			</div>
		`,
		methods: {
		},
		computed: {
			percentHigher(){

				if(this.income == 0){ return 0;}

				var comparativeSalaryNumber = Number(this.data.comparativeSalary.replace(/[^0-9.-]+/g,""));

			//	console.log(`comparative salary = ${comparativeSalaryNumber}`)
		    //  console.log(`current income = ${this.income}`)
		    //  console.log(`comparative direction = ${this.comparativeDirection}`)

				if(this.comparativeDirection == "Lower"){
					var percentInt = 1 - (comparativeSalaryNumber / this.income);
				}else{
					var percentInt = (comparativeSalaryNumber / this.income) - 1;
				}

			console.log(percentInt);
				
				return Math.ceil(percentInt * 100)
			},
			comparativeDirection(){
				if(this.income == 0){ return "Lower"}

				var comparativeSalaryNumber = Number(this.data.comparativeSalary.replace(/[^0-9.-]+/g,""));

				if(comparativeSalaryNumber > this.income){
					return "Higher"
				}else{
					return "Lower"
				}
			}
		}
	})


	app = new Vue({
		el: '#colCalc',
		template: /*html*/`
					<div class="appContainer">

						<div class="controlsContainer">

							<div class="controlWrapper">
								<label>I currently live in:</label>
								<v-select :filterBy="filterBy" class="fromCity" :clearable="false" v-model="from" :options="cities" :selectable="option => option.code != 'NA'"></v-select>
							</div>
							<div class="controlWrapper">
								<label>I want to live in:</label>
								<v-select :filterBy="filterBy" class="toCity" :clearable="false" v-model="to" :options="cities" :selectable="option => option.code != 'NA'"></v-select>
								</div>
							<div class="controlWrapper">
							<label>My current pre-tax household income:</label>
							<currency-input id="inputIncome" v-model="income" currency="USD" locale="en" :allowNegative="false"/>
						
								<!--<input type="number" id="inputIncome" v-model="income">-->
							</div>

						</div>

						<div class="resultsContainer" v-if="categoryList.length > 0">
						

							<salary-comparison :data="salaryData" :income="income"></salary-comparison>
							
							<TabComponent :tabs='categoryList' :initialTab="'Grocery'">

								<template v-for="(category,index) in categoryList" :slot='"tab-head-"+category' :data-tab-name="category" >
									<div class="tabInner">
										<img v-bind:src="'https://a.wayin.com/images/5355/21c86c23-5a6b-44b2-a13a-1ce778f7300b/' + category + '.png'">
									</div>
								</template>


								<template v-for="(category,index) in categoryList" :slot='"tab-content-"+category'>
									<h3 class="category-name">{{category}} costs</h3>
									<div class="category-comparison" :class="categoryData[index].DifferenceType">{{ categoryData[index].PercentageDifference }} {{ categoryData[index].DifferenceType }}</div>
									<div class="category-info">
											<table>	
												<tr>
													<th></th>
													<th>{{from.label}}</th>
													<th>{{to.label}}</th>
												<tr>
												<tr v-for="(item,index) in filteredPriceData(category).slice(0,5)">
													<td>{{ item.Category_Name }}  </td><td>{{ item.FromPlaceCost }}   </td><td>{{ item.ToPlaceCost }}</td>
												</tr>
											</table>
									</div>
								</template>

							</TabComponent>
						</div>
					</div>
				</div>
			`,
		data: {
			config: config,
			apiKey: '{C2084354-7D38-4A90-AB3C-147322E642E7}',
			baseAPIUrl: "https://api.c2er.org/costofliving/v3.0/api/api/",
			from: {code:cities[0].code, label:cities[0].label},
			to: {code:cities[0].code, label:cities[0].label},
			fromValue: "",
			toValue: "",
			income: 50000,
			resultData: {},
			priceData: [],
			salaryData: {},
			categoryData: [],
			cities: cities
		},
		watch: {
			income: function(){
				this.getAllApiData();
			},
			from: function (val) {
				this.fromValue = val.code || "";
				this.getAllApiData();
			  },
			to: function (val) {
				this.toValue = val.code || "";
				this.getAllApiData();
			},
		},
		created() {
			//this.getAllApiData();
		},
		updated() {

		},
		beforeUpdate() {

		},
		mounted(){
			this.$nextTick(function () {
				// Code that will run only after the
				// entire view has been re-rendered'
				setTimeout(function(){
					console.log("resize on timeout")
					NGX.App.api.resizeParent()
				}, 2000)
				NGX.App.api.resizeParent();
				console.log("resize mount")
			  })
		},
		afterUpdate() {

			this.$nextTick(function () {
				// Code that will run only after the
				// entire view has been re-rendered'
				NGX.App.api.resizeParent();
				console.log("resize on update")
			  })
		},
		computed: {
			categoryList() {
				return _.pluck(this.categoryData,"Category");
			}
		},

		methods: {
			filterBy(option, label, search){

				if(option.state){

					return option.state.toLowerCase().includes(search.toLowerCase()) || label.toLowerCase().includes(search.toLowerCase())

				}else{


					return label.toLowerCase().includes(search.toLowerCase())

				}

			},
			getAllApiData(){
				if(this.to.code != "" && this.from.code != ""){
					this.GetAveragePriceComparison();
					this.GetSalaryComparison();
					this.GetExpenditureCategoryComparison();
				}
			},
			GetAveragePriceComparison(){
				var vue = this;

				var config = {
					method: 'get',
					url: `${vue.baseAPIUrl}GetAveragePriceComparison?licenseeGuid=${this.apiKey}&indexType=1&fromPlace=${vue.fromValue}&toPlace=${vue.toValue}`,
				};

				axios(config)
				.then(function (response) {
					vue.priceData = response.data.dataSet.Table1;
				})
				.catch(function (error) {
					console.log(error);
				});
			},
			GetSalaryComparison(){
				var vue = this;

				var config = {
					method: 'get',
					url: `${vue.baseAPIUrl}GetSalaryComparison?licenseeGuid=${this.apiKey}&indexType=1&placeType=2&fromPlaceID=${vue.fromValue}&toPlaceId=${vue.toValue}&currentBaseSalary=${vue.income}`,
				};

				axios(config)
				.then(function (response) {
					vue.salaryData = response.data;
				})
				.catch(function (error) {
					console.log(error);
				});
			},
			GetExpenditureCategoryComparison(){
				var vue = this;

				var config = {
					method: 'get',
					url: `${vue.baseAPIUrl}GetExpenditureCategoryComparison?licenseeGuid=${this.apiKey}&indexType=1&fromPlace=${vue.fromValue}&toPlace=${vue.toValue}`,
				};

				axios(config)
				.then(function (response) {
					vue.categoryData = response.data.dataSet.Table1;
				})
				.catch(function (error) {
					console.log(error);
				});
			},
			filteredPriceData(category){

				var vue = this;
					return this.priceData.filter(function(item){
						return item.Expenditure_Name == category && !vue.config.blacklistedItems.includes(item.Category_Name)
					})
			}
		}
	})
	window.myapp = app;






}


function addCss(fileName) {
	var link = $("<link />",{
	  rel: "stylesheet",
	  type: "text/css",
	  href: fileName
	})
	$('head').append(link);
 }
 




export default function (conf, langItems) {

	// Overrides for configuration
	Object.assign(config, conf);
	// Overrides for language
	Object.assign(lang, langItems);

	addCss("https://unpkg.com/vue-select@latest/dist/vue-select.css");


	startApp();

}
