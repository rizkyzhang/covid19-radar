import ky from "ky";
import style from "!!raw-loader!./style.css";

const template = document.createElement("template");

template.innerHTML = `
  <style>
    ${style}
  </style>

  <section class="live-cases__worldwide">
    <h2 class="worldwide__title">Live Cases</h2>

    <ul class="worldwide__countries"></ul>
  </section>

  <section class="live-cases__indonesia">
    <h2 class="indonesia__title">Live Cases (ID)</h2>

    <ul class="indonesia__provinces"></ul>
  </section>

`;

class LiveCases extends HTMLElement {
  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._shadowRoot.appendChild(template.content.cloneNode(true));

    this.$worldwideLiveCasesElement = this._shadowRoot.querySelector(".worldwide__countries");
    this.$indonesiaLiveCasesElement = this._shadowRoot.querySelector(".indonesia__provinces");
  }

  connectedCallback() {
    this._renderWorldwideLiveCases();
    this._renderIndonesiaLiveCases();
  }

  _renderWorldwideLiveCases() {
    LiveCases.fetchWorldwideCovid19Stats().then(worldwideCovid19Stats => {
      worldwideCovid19Stats
        .sort((a, b) => b.cases - a.cases)
        .forEach(countryCovid19Stats => {
          const countryName = countryCovid19Stats.country;
          const countryLiveCases = countryCovid19Stats.cases.toLocaleString("en");
          const countryLiveCasesElement = document.createElement("li");

          this.$worldwideLiveCasesElement.appendChild(countryLiveCasesElement);
          countryLiveCasesElement.classList.add("worldwide__country");
          countryLiveCasesElement.textContent = `${countryName}: ${countryLiveCases}`;
        });
    });
  }

  _renderIndonesiaLiveCases() {
    LiveCases.fetchIndonesiaCovid19Stats().then(indonesiaCovid19Stats => {
      indonesiaCovid19Stats
        .sort((a, b) => b.kasusPosi - a.kasusPosi)
        .forEach(provinceCovid19Stats => {
          const provinceName = provinceCovid19Stats.provinsi;
          const provinceLiveCases = provinceCovid19Stats.kasusPosi.toLocaleString("en");
          const provinceLiveCasesElement = document.createElement("li");

          this.$indonesiaLiveCasesElement.appendChild(provinceLiveCasesElement);
          provinceLiveCasesElement.classList.add("indonesia__province");
          provinceLiveCasesElement.textContent = `${provinceName}: ${provinceLiveCases}`;
        });
    });
  }

  static async fetchWorldwideCovid19Stats() {
    const API = "https://disease.sh/v3/covid-19/countries";
    const worldwideLiveCases = await ky.get(API).json();

    return worldwideLiveCases;
  }

  static async fetchIndonesiaCovid19Stats() {
    const API = "https://indonesia-covid-19.mathdro.id/api/provinsi";
    const indonesiaLiveCases = await ky.get(API).json();

    return indonesiaLiveCases;
  }
}

customElements.define("live-cases", LiveCases);
