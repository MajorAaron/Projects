import Vue from 'vue';
import App from './App.vue';
import VueCompositionAPI from '@vue/composition-api'

Vue.use(VueCompositionAPI)

var config = {
    "test": "testkey"
}

var lang = {
    "testtrans": "transvalue"
}

export const EventBus = new Vue();


function handleEntryPage(){

	console.log("app ready")

  var myapp = new Vue({
	el: '#shoppingCart',
	data: {
		config: config,
		lang: lang
	},
    render: function(createElement){
		return createElement(App)
	},
  });
  
  window.myapp = myapp;

}

function handleConfirmationPage(){


  
}


export default function(conf,langItems){

	// Overrides for configuration
	Object.assign(config,conf);
	// Overrides for language
	Object.assign(lang,langItems);

//	if(document.body.className.indexOf('xConverted')>-1 || NGX.App.state.name==="confirmation"){
//		handleConfirmationPage();
//	} else {
		handleEntryPage();
//	}
	
}





