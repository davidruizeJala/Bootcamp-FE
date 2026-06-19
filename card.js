const template = document.createElement('template');
template.innerHTML = `
  <style>
    html {
    font-family: Arial, Helvetica, sans-serif;
}

.card {
    border: 2px solid black;
    display: flex;
    flex-direction: column;
    width: 300px;
    text-align: center;
}

.character {
    display: flex;
    flex-direction: column;
    background-color: black;
    padding: 2rem 2rem 0 2rem;
}

.character img {
    border-radius: 20px;
}

.name {
    color: white;
}

.rol {
    background-color: red;
    color: white;
}
  </style>
    <div class="card">
      <img
        src="https://mma.prnewswire.com/media/2841830/jalasoft_Logo.jpg"
        alt="Jalasoft"
      />
      <div class="character">
        <img
          src="https://static.wikia.nocookie.net/attack-vampire/images/2/2d/Levi_Ackermann.png/revision/latest?cb=20190722002607"
          alt="Levi"
        />
        <h1 class="name"><slot name="character"> Levi Ackerman </slot> </h1>
      </div>
      <div class="rol">
        <h1><slot name="rol">Captain</slot></h1>
      </div>
    </div>
`;

class UserCard extends HTMLElement {
  static observedAttributes = ['color'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const color = this.getAttribute('color') || '#000000';
    const character = this.shadowRoot.querySelector('.character');
    character.style.background = color;
  }
}

customElements.define('character-card', UserCard);
