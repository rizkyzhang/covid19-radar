import "core-js/stable";
import "regenerator-runtime/runtime";

import "./style.css";
import "./components/CountrySelector";
import "./components/CountryInfo";
import "./components/CountryList";
import "./components/Covid19Stats";
import "./components/Covid19Chart";
import "./components/LiveCases";
import "./components/Covid19Info";

const template = document.createElement("template");

template.innerHTML = `
  <style>
    :host {
      display: block;
    }

    :host::-webkit-scrollbar {
      width: 20px;
    }

    :host::-webkit-scrollbar-track {
      background: #222;
    }

    :host::-webkit-scrollbar-thumb {
      background-color: #333;
      border-radius: 20px;
      border: 5px solid #222;
    }

    .app-title {
      margin-bottom: 2rem;

      color: var(--recovered-color);
      font-size: 2.7rem;
    }
    
    footer {
      background: var(--primary-color);
      padding: 1.5rem;
      border-radius: 10px;
      margin: 3rem 0;
      text-align: center;
    }

    .heart {
      color: red;
    }
  </style>

  <h1 class="app-title">COVID-19 RADAR</h1>

  <country-info></country-info>

  <country-selector></country-selector>

  <country-list></country-list>

  <covid19-stats></covid19-stats>

  <covid19-chart></covid19-chart>

  <live-cases></live-cases>

  <covid19-info></covid19-info>

  <footer>Created with <span class="heart">❤️</span> by Rizky</footer>
`;

class Covid19Radar extends HTMLElement {
  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._shadowRoot.appendChild(template.content.cloneNode(true));

    this.state = {
      selectedCountry: "",
      lastUpdated: "",
    };

    this.$countryInfo = this._shadowRoot.querySelector("country-info");
    this.$chevron = this._shadowRoot
      .querySelector("country-selector")
      .shadowRoot.querySelector(".country-selector__chevron");
    this.$countryList = this._shadowRoot.querySelector("country-list");
    this.$searchCountry = this._shadowRoot
      .querySelector("country-list")
      .shadowRoot.querySelector("header")
      .querySelector("input");
    this.$covid19Stats = this._shadowRoot.querySelector("covid19-stats");
    this.$covid19Chart = this._shadowRoot.querySelector("covid19-chart");

    this.addEventListener("onCountryChanged", this._updateSelectedCountry.bind(this));
    this.addEventListener("onStatsFetched", this._updateLastUpdated.bind(this));
    this.addEventListener("onDropdownToggle", () => {
      this.$chevron.classList.toggle("active");
      this.$countryList.classList.toggle("active");
      this.$searchCountry.focus();
    });
  }

  _updateSelectedCountry(event) {
    this.state.selectedCountry = event.detail.selectedCountry;
    this.$countryInfo.selectedCountry = this.state.selectedCountry;
    this.$covid19Stats.selectedCountry = this.state.selectedCountry;
    this.$covid19Chart.selectedCountry = this.state.selectedCountry;
  }

  _updateLastUpdated(event) {
    this.state.lastUpdated = event.detail.lastUpdated;
    this.$countryInfo.lastUpdated = this.state.lastUpdated;
  }
}

customElements.define("covid19-radar", Covid19Radar);
