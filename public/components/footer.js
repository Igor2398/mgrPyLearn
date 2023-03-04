class Footer extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
      this.innerHTML = `
          <style>

          </style>
          <footer>

          </footer>
        `;
    }
  }
  
  customElements.define("footer-component", Footer);