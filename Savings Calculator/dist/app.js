var app;
var config = {};
var lang = {};
var startApp = function () {
  app = new Vue({
    el: '#savingsCalc',
    template: /*html*/`
					<div class="appContainer">
						<div class="column one">
							<div class="inputWrapper">
								<label for="initialDeposit">Initial Deposit</label>
								<input id="initialDeposit" type="text">
							</div>

							<div class="inputWrapper">
								<label for="contribution">Monthly Contribution</label>
								<input id="contribution" type="text">
							</div>

							<div class="inputWrapper thirds">
								<label for="period">Over a period of: </label>
								<input id="period" type="text">

								<button id="periodTypeMonths" class="periodType" data-type="month" @click="togglePeriodType('month')" :disabled="periodType == 'month'">Months</button>
								<button id="periodTypeYears" class="periodType" data-type="year" @click="togglePeriodType('year')" :disabled="periodType == 'year'">Years</button>
							</div>

							<div class="inputWrapper halfs">
								<label for="interestRate">APY%</label>
								<input id="interestRate" type="text">

								<button @click="updateValues()">Calculate</button>
							</div>

						</div>
						<div class="column two">

							<div class="breakdownWrapper">
								<p>Total savings breakdown</p>
								<ul class='legend'>
									<li><p><span class="pallet grey"></span>Interest earned = $\{{toUSD(totalInterestEarned)}}</p></li>
									<li><p><span class="pallet black" :style="{backgroundColor: config.totalContributionsColor}"></span>Total contributions = $\{{toUSD(totalContributions)}}</p></li>
									<li><p><span class="pallet green" :style="{backgroundColor: config.initialDepositColor}"></span>Initial deposit = $\{{toUSD(totalInitialDeposit)}}</p></li>
								</ul>
							</div>

							<div class="chartWrapper">
							
								<canvas id="myChart" width="400" height="400"></canvas>

							</div>

							<div class="totalWrapper">

								<div class="inputWrapper">
									<label for="totalSavings">Your total savings:</label>
									<div class="fakeInput">$\{{toUSD(totalSavings)}}</div>
								</div>

							</div>

						</div>
					</div>
			`,
    data: {
      config: config,
      initialDeposit: 0,
      contribution: 0,
      period: 0,
      periodType: config.periodType,
      interestRate: 0,
      chart: {},
      initialDepositInput: {},
      contributionInput: {},
      interestRateInput: {},
      periodInput: {},
      totalSavings: 0,
      totalInterestEarned: 0,
      totalContributions: 0,
      totalInitialDeposit: 0
    },
    mounted() {
      this.buildChart();
      this.initialDepositInput = new AutoNumeric('#initialDeposit', {
        allowDecimalPadding: true,
        alwaysAllowDecimalCharacter: true,
        currencySymbol: "$",
        minimumValue: "0"
      });
      this.contributionInput = new AutoNumeric('#contribution', {
        allowDecimalPadding: true,
        alwaysAllowDecimalCharacter: true,
        currencySymbol: "$",
        minimumValue: "0"
      });
      this.periodInput = new AutoNumeric("#period", {
        minimumValue: "0",
        allowDecimalPadding: false,
        decimalPlaces: 0
      });
      this.interestRateInput = new AutoNumeric("#interestRate", {
        minimumValue: "0",
        allowDecimalPadding: true,
        alwaysAllowDecimalCharacter: true
      });
      this.initialDepositInput.set(this.config.initialDeposit);
      this.contributionInput.set(this.config.contribution);
      this.periodInput.set(this.config.period);
      this.interestRateInput.set(this.config.interestRate);
      this.updateValues();
    },
    updated() {
      console.log("update");
    },
    beforeUpdate() {},
    afterUpdate() {},
    computed: {
      totalYears: function () {
        if (this.periodType == "month") {
          return this.period / 12;
        } else {
          return this.period;
        }
      },
      getTotalInterestEarned: function () {
        return this.totalSavings - this.totalContributions - this.totalInitialDeposit;
      },
      getTotalContributions: function () {
        return this.totalYears * 12 * this.contribution;
      },
      getTotalSavings: function () {
        // ie FUTURE VALUE

        var r = parseFloat(this.interestRate) / 100 / 365,
          C = parseFloat(this.contribution),
          P = parseFloat(this.initialDeposit),
          y = parseFloat(this.totalYears),
          // need to update this
          d = 365 * y,
          n = parseFloat(30),
          // monthly
          nn = Math.floor(365 / n),
          total = P + C,
          //add initial contribution to account for loss of interest
          ri = 0;
        var yr = new Date().getFullYear(),
          count = 0,
          initialDeposit = true,
          z,
          zz;
        while (count++ < d) {
          z = new Date(yr, 0, count);
          zz = new Date(yr, 0, count + 1);
          if (count % n === 0) {
            if (!initialDeposit) {
              total += C;
            } else {
              initialDeposit = false;
            }
          }
          if (zz.getDate() < z.getDate()) {
            total += ri;
            ri = 0;
          }
          ri += total * r;
        }
        console.log(total);
        return total;
      }
    },
    methods: {
      updateValues() {
        this.initialDeposit = this.initialDepositInput.getNumber();
        this.contribution = this.contributionInput.getNumber();
        this.interestRate = document.getElementById("interestRate").value;
        this.period = document.getElementById("period").value;
        this.totalSavings = this.getTotalSavings;
        this.totalInitialDeposit = this.initialDeposit;
        this.totalContributions = this.getTotalContributions;
        this.totalInterestEarned = this.getTotalInterestEarned;
        this.chart.data.datasets[0].data[0] = this.initialDeposit;
        this.chart.data.datasets[1].data[0] = this.totalContributions;
        this.chart.data.datasets[2].data[0] = this.totalInterestEarned;
        this.chart.update();
      },
      togglePeriodType(type) {
        this.periodType = type;
      },
      buildChart() {
        var ctx = document.getElementById('myChart');
        var myChart = new Chart(ctx, {
          type: 'bar',
          data: {
            datasets: [{
              label: 'Initial Deposit',
              backgroundColor: this.config.initialDepositColor,
              data: [this.initialDeposit]
            }, {
              label: 'Total Contributions',
              backgroundColor: this.config.totalContributionsColor,
              data: [this.totalContributions]
            }, {
              label: 'Interest Earned',
              backgroundColor: "#E1E1E1",
              data: [this.totalInterestEarned]
            }]
          },
          options: {
            tooltips: {
              callbacks: {
                title: function (tooltipItem, data) {
                  return "";
                }
              }
            },
            scales: {
              xAxes: [{
                stacked: true,
                gridLines: {
                  display: false
                }
              }],
              yAxes: [{
                stacked: true,
                ticks: {
                  beginAtZero: true
                },
                type: 'linear'
              }]
            },
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              display: false
            }
          }
        });
        this.chart = myChart;
      },
      toUSD: function (num) {
        num = Math.round(num * 100) * 0.01;
        var currstring = num.toString();
        if (currstring.match(/\./)) {
          var curr = currstring.split('.');
        } else {
          var curr = [currstring, "00"];
        }
        curr[1] += "00";
        curr[2] = "";
        var returnval = "";
        var length = curr[0].length;

        // add 0 to decimal if necessary
        for (var i = 0; i < 2; i++) curr[2] += curr[1].substr(i, 1);

        // insert commas for readability
        for (i = length; i - 3 > 0; i = i - 3) {
          returnval = "," + curr[0].substr(i - 3, 3) + returnval;
        }
        returnval = curr[0].substr(0, i) + returnval + "." + curr[2];
        return returnval;
      }
    }
  });
  window.myapp = app;
};
function addCss(fileName) {
  var link = $("<link />", {
    rel: "stylesheet",
    type: "text/css",
    href: fileName
  });
  $('head').append(link);
}
var SAVINGSCALC = function (conf, langItems) {
  console.log("my app ready");
  window.jQuery = window.$;

  // Overrides for configuration
  Object.assign(config, conf);
  // Overrides for language
  Object.assign(lang, langItems);

  //addCss("http://localhost/ClientKit/clients/quickenloans/savingsCalculator/src/styles.css");

  addCss("https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.css");

  //	NGX.Dom.addScriptTag("https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.js","CHARTJS", function(){
  //	NGX.Dom.addScriptTag("https://cdn.jsdelivr.net/npm/autonumeric@4.1.0","AUTONUMERIC", function(){

  startApp();

  //		})

  //	})
}