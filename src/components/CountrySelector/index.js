import style from "!!raw-loader!./style.css";

const template = document.createElement("template");

template.innerHTML = `
  <style>
    ${style}
  </style>

  <button class="country-selector">
    <span class="country-selector__text">Select Country</span>
    <span class="country-selector__chevron">🔽</span>
  </button>
`;

class CountrySelector extends HTMLElement {
  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._shadowRoot.appendChild(template.content.cloneNode(true));

    this.addEventListener("click", () => {
      const onDropdownToggle = new CustomEvent("onDropdownToggle", {
        bubbles: true,
        composed: true,
      });

      this.dispatchEvent(onDropdownToggle);
    });
  }
}

customElements.define("country-selector", CountrySelector);
