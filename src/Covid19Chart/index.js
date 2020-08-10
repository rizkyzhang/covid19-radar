import Chart from "chart.js";
import ky from "ky";
import style from "!!raw-loader!./style.css";

const template = document.createElement("template");

template.innerHTML = `
  <style>
    ${style}
  </style>

  <canvas></canvas>
`;

class Covid19Chart extends HTMLElement {
  constructor() {
    super();

    this.props = {
      selectedCountry: "Worldwide",
    };

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._shadowRoot.appendChild(template.content.cloneNode(true));
    this.$ctx = this._shadowRoot.querySelector("canvas").getContext("2d");
    this.$covid19Chart = null;
  }

  connectedCallback() {
    this._renderCovid19Chart(this.props.selectedCountry);
  }

  _renderCovid19Chart(selectedCountry) {
    Covid19Chart.fetchHistoricalCovid19Stats(selectedCountry).then(historicalCovid19Stats => {
      const historicalTotalCases = historicalCovid19Stats.cases
        ? historicalCovid19Stats.cases
        : historicalCovid19Stats.timeline.cases;
      const historicalTotalDeaths = historicalCovid19Stats.deaths
        ? historicalCovid19Stats.deaths
        : historicalCovid19Stats.timeline.deaths;
      const historicalTotalRecovered = historicalCovid19Stats.recovered
        ? historicalCovid19Stats.recovered
        : historicalCovid19Stats.timeline.recovered;

      if (this.$covid19Chart !== null) this.$covid19Chart.destroy();

      this.$covid19Chart = new Chart(this.$ctx, {
        type: "line",
        data: {
          labels: [...Object.keys(historicalTotalCases)],
          datasets: [
            {
              label: "Cases",
              data: [...Object.values(historicalTotalCases)],
              borderColor: "#FFB74D",
              borderWidth: 1,
            },
            {
              label: "Deaths",
              data: [...Object.values(historicalTotalDeaths)],
              borderColor: "#FC5857",
              borderWidth: 1,
            },
            {
              label: "Recovered",
              data: [...Object.values(historicalTotalRecovered)],
              borderColor: "#4AD578",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    });
  }

  static async fetchHistoricalCovid19Stats(selectedCountry) {
    const API =
      selectedCountry === "Worldwide"
        ? "https://disease.sh/v3/covid-19/historical/all?lastdays=30"
        : `https://disease.sh/v3/covid-19/historical/${selectedCountry}`;
    const historicalCovid19Stats = await ky.get(API).json();

    return historicalCovid19Stats;
  }

  set selectedCountry(value) {
    this.props.selectedCountry = value;
    this._renderCovid19Chart(this.props.selectedCountry);
  }

  get selectedCountry() {
    return this.props.selectedCountry;
  }
}

customElements.define("covid19-chart", Covid19Chart);
