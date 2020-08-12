import style from "!!raw-loader!./style.css";

const template = document.createElement("template");

template.innerHTML = `
  <style>
    ${style}
  </style>

  <p class="current-country"></p>
  <p class="last-updated">Loading...</p>
`;

class CountryInfo extends HTMLElement {
  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._shadowRoot.appendChild(template.content.cloneNode(true));

    this.props = {
      selectedCountry: "Worldwide",
      lastUpdated: "",
    };

    this.$currentCountry = this._shadowRoot.querySelector(".current-country");
    this.$lastUpdated = this._shadowRoot.querySelector(".last-updated");
  }

  connectedCallback() {
    this._renderCountryInfo();
  }

  _renderCountryInfo() {
    this.$currentCountry.textContent = this.props.selectedCountry;
    this.$lastUpdated.textContent = `Last Updated: ${this.props.lastUpdated}`;
  }

  set selectedCountry(value) {
    this.props.selectedCountry = value;
    this._renderCountryInfo();
  }

  get selectedCountry() {
    return this.props.selectedCountry;
  }

  set lastUpdated(value) {
    this.props.lastUpdated = value;
    this._renderCountryInfo();
  }

  get lastUpdated() {
    return this.props.lastUpdated;
  }
}

customElements.define("country-info", CountryInfo);
