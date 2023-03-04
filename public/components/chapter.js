const template = document.createElement('template');
template.innerHTML = `
  <style>
  .chapter-card {
		font-family: 'Arial', sans-serif;
		background: #f4f4f4;
		width: 500px;
		display: grid;
		grid-template-columns: 1fr 2fr;
		grid-gap: 10px;
		margin-bottom: 15px;
		border-bottom: darkorchid 5px solid;
    border-radius: 30px;
	}

  .chapter-card img {
    border-top-left-radius: 30px;
    border-bottom-left-radius: 30px;
    width: 10em;
    height: 10em;
  }

	.chapter-card button {
		cursor: pointer;
		background: darkorchid;
		color: #fff;
		border: 0;
		border-radius: 5px;
		padding: 5px 10px;
	}
  </style>
  <form method="POST" action="/quiz">
    <div class="chapter-card">
      <img />
      <div>
        <h3></h3>
        <div class="info">
          <p><slot name="description" /></p>
          <p><slot name="phone" /></p>
          <div> <slot name="meter" />
            <span></span>
          </div>
        </div>
      </div>
    </div>
  </form>
`;

class ChapterCard extends HTMLElement {
  constructor() {
    super();

    this.showInfo = true;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.shadowRoot.querySelector('h3').innerText = this.getAttribute('name');
    this.shadowRoot.querySelector('img').src = this.getAttribute('avatar');
  }

}

window.customElements.define('chapter-card', ChapterCard);