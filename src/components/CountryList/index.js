import style from "!!raw-loader!./style.css";
import countryListJson from "../../data/countries.json";

const template = document.createElement("template");

template.innerHTML = `
  <style>
    ${style}
  </style>

  <header class="country-list__header">
    <input class="header__search" type="search" placeholder="Search Country">
    <button class="header__close-button">X</button>
  </header>

  <ul class="country-list"></ul>
`;

class CountryList extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._shadowRoot.appendChild(template.content.cloneNode(true));

    this.$searchCountry = this._shadowRoot.querySelector(".header__search");
    this.$closeDropdownButton = this._shadowRoot.querySelector(".header__close-button");
    this.$countryList = this._shadowRoot.querySelector(".country-list");

    this.$searchCountry.addEventListener("input", this._filterCountryList.bind(this));
    this.$closeDropdownButton.addEventListener("click", (event) => {
      const onDropdownToggle = new CustomEvent("onDropdownToggle", {
        bubbles: true,
        composed: true,
      });

      this.dispatchEvent(onDropdownToggle);
    });
  }

  connectedCallback() {
    this._renderCountryList();
  }

  _renderCountryList() {
    countryListJson.forEach((countryItemJson) => {
      const countryFlag = countryItemJson.flag;
      const countryName = countryItemJson.name;

      const countryItem = document.createElement("li");
      const countryFlagElement = document.createElement("span");
      const countryNameElement = document.createElement("span");

      countryItem.classList.add("country-list__item");
      countryFlagElement.classList.add("item__flag");
      countryNameElement.classList.add("item__name");

      countryFlagElement.textContent = countryFlag;
      countryNameElement.textContent = countryName;

      countryItem.appendChild(countryFlagElement);
      countryItem.appendChild(countryNameElement);
      this.$countryList.appendChild(countryItem);

      countryItem.addEventListener("click", (event) => {
        const onCountryChanged = new CustomEvent("onCountryChanged", {
          bubbles: true,
          composed: true,
          detail: {
            countryFlag: event.currentTarget.firstChild.textContent,
            selectedCountry: event.currentTarget.lastChild.textContent,
          },
        });

        this.dispatchEvent(onCountryChanged);

        const onDropdownToggle = new CustomEvent("onDropdownToggle", {
          bubbles: true,
          composed: true,
        });

        this.dispatchEvent(onDropdownToggle);
      });
    });
  }

  _filterCountryList(event) {
    const text = event.target.value.toLowerCase();
    const countryItems = [...this._shadowRoot.querySelectorAll(".country-list__item")];

    countryItems.forEach((countryItem) => {
      const countryName = countryItem.lastChild.textContent.toLowerCase();
      const regex = new RegExp(`^${text}`, "gi");

      countryItem.style.display = regex.test(countryName) ? "block" : "none";
    });
  }
}

customElements.define("country-list", CountryList);
