import style from "!!raw-loader!./style.css";

const template = document.createElement("template");

template.innerHTML = `
  <style>
    ${style}
  </style>

  <article class="covid19-info__prevention">
    <h2 class="prevention__title">COVID-19 Prevention</h2>

    <ol class="prevention__list">
      <li class="prevention__item"> 😷 Always wear a mask.</li>
      <li class="prevention__item"> 🏠 Stay home.</li>
      <li class="prevention__item"> 🍱 Eat healthy food.</li>
      <li class="prevention__item"> 🚲 Exercise regularly.</li>
      <li class="prevention__item"> 🧼👏 Clean your hands often.</li>
      <li class="prevention__item"> 🧑↔️🧑 Practice social distancing.</li>
      <li class="prevention__item"> 🚫🤦 Don’t touch your eyes, nose or mouth.</li>
    </ol>

    <p class="prevention__extra-info">
      If you feel sick you should rest, drink plenty of fluid, and eat nutritious food. 
      Stay in a separate room from other family members, and use a dedicated bathroom if possible. 
      Clean and disinfect frequently touched surfaces.
    </p>

    <p class="prevention__extra-info">
      Everyone should keep a healthy lifestyle at home. 
      Maintain a healthy diet, sleep, stay active, and make social contact with loved ones through the phone or internet.
      Children need extra love and attention from adults during difficult times. 
      Keep to regular routines and schedules as much as possible.
    </p>

    <p class="source">Info by <a class="source__link" href="https://www.who.int">who.int</a></p>
  </article>

  <article class="covid19-info__symptoms">
    <h2 class="symptoms__title">COVID-19 Symptoms</h2>
    
    <section class="symptoms__common">
      <p class="common__title">Most common symptoms:</p>
      <ul class="common__list">
        <li class="common__item">Fever</li>
        <li class="common__item">Dry Cough</li>
        <li class="common__item">Tiredness</li>
      </ul>
    </section>

    <section class="symptoms__less-common">
      <p class="less-common__title">Lest common symptoms:</p>
      <ul class="less-common__list">
        <li class="less-common__item">Aches and pains</li>
        <li class="less-common__item">Sore throat</li>
        <li class="less-common__item">Tiredness</li>
        <li class="less-common__item">Diarrhoea</li>
        <li class="less-common__item">Conjunctivitis</li>
        <li class="less-common__item">Headache</li>
        <li class="less-common__item">Loss of taste or smell</li>
        <li class="less-common__item">A rash on skin, or discolouration of fingers or toes</li>
      </ul>
    </section>

    <section class="symptoms__serious">
      <p class="serious__title">Serious symptoms:</p>
      <ul class="serious__list">
        <li class="serious__item">Difficulty breathing or shortness of breath</li>
        <li class="serious__item">Chest pain or pressure</li>
        <li class="serious__item">Loss of speech or movement</li>
      </ul>
    </section>

    <p class="source">Info by <a class="source__link" href="https://www.who.int">who.int</a></p>
  </article>
`;

class Covid19Info extends HTMLElement {
  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define("covid19-info", Covid19Info);
