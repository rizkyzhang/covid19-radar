import ky from "ky";
import style from "!!raw-loader!./style.css";

const template = document.createElement("template");

template.innerHTML = `
  <style>
    ${style}
  </style>

  <section class="covid19-stats__box covid19-stats__cases">
    <p class="cases__title">Cases</p>
    <p class="cases__total">Loading...</p>
    <p class="cases__today">🔺Loading...</p>
  </section>

  <section class="covid19-stats__box covid19-stats__deaths">
    <p class="deaths__title">Deaths</p>
    <p class="deaths__total">Loading...</p>
    <p class="deaths__today">🔺Loading...</p>
  </section>

  <section class="covid19-stats__box covid19-stats__recovered">
    <p class="recovered__title">Recovered</p>
    <p class="recovered__total">Loading...</p>
    <p class="recovered__today">🔺Loading...</p>
  </section>

  <section class="covid19-stats__box covid19-stats__active">
    <p class="active__title">Active</p>
    <p class="active__total">Loading...</p>
  </section>

  <section class="covid19-stats__box covid19-stats__tests">
    <p class="tests__title">Tests</p>
    <p class="tests__total">Loading...</p>
  </section>
`;

class Covid19Stats extends HTMLElement {
  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.props = {
      selectedCountry: "Worldwide",
    };

    this.$totalCasesElement = this._shadowRoot.querySelector(".cases__total");
    this.$todayCasesElement = this._shadowRoot.querySelector(".cases__today");
    this.$totalDeathsElement = this._shadowRoot.querySelector(".deaths__total");
    this.$todayDeathsElement = this._shadowRoot.querySelector(".deaths__today");
    this.$totalRecoveredElement = this._shadowRoot.querySelector(".recovered__total");
    this.$todayRecoveredElement = this._shadowRoot.querySelector(".recovered__today");
    this.$totalActiveElement = this._shadowRoot.querySelector(".active__total");
    this.$totalTestsElement = this._shadowRoot.querySelector(".tests__total");
  }

  connectedCallback() {
    this._renderCovid19Stats(this.props.selectedCountry);
  }

  _renderCovid19Stats(selectedCountry) {
    Covid19Stats.fetchCovid19Stats(selectedCountry).then(covid19Stats => {
      const onStatsFetched = new CustomEvent("onStatsFetched", {
        bubbles: true,
        composed: true,
        detail: {
          lastUpdated: new Date(covid19Stats.updated).toLocaleString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          }),
        },
      });

      this.dispatchEvent(onStatsFetched);

      const totalCases = covid19Stats.cases.toLocaleString("en");
      const todayCases = covid19Stats.todayCases.toLocaleString("en");
      const totalDeaths = covid19Stats.deaths.toLocaleString("en");
      const todayDeaths = covid19Stats.todayDeaths.toLocaleString("en");
      const totalRecovered = covid19Stats.recovered.toLocaleString("en");
      const todayRecovered = covid19Stats.todayRecovered.toLocaleString("en");
      const totalActive = covid19Stats.active.toLocaleString("en");
      const totalTests = covid19Stats.tests.toLocaleString("en");

      this.$totalCasesElement.textContent = totalCases;
      this.$todayCasesElement.textContent = `🔺 ${todayCases}`;
      this.$totalDeathsElement.textContent = totalDeaths;
      this.$todayDeathsElement.textContent = `🔺 ${todayDeaths}`;
      this.$totalRecoveredElement.textContent = totalRecovered;
      this.$todayRecoveredElement.textContent = `🔺 ${todayRecovered}`;
      this.$totalActiveElement.textContent = totalActive;
      this.$totalTestsElement.textContent = totalTests;
    });
  }

  static async fetchCovid19Stats(selectedCountry) {
    const API =
      selectedCountry === "Worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${selectedCountry}`;
    const covid19Stats = await ky.get(API).json();

    return covid19Stats;
  }

  set selectedCountry(value) {
    this.props.selectedCountry = value;
    this._renderCovid19Stats(this.props.selectedCountry);
  }

  get selectedCountry() {
    return this.props.selectedCountry;
  }
}

customElements.define("covid19-stats", Covid19Stats);
