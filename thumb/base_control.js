export default class BaseControl extends HTMLElement {
    constructor() {
      super();
    }
  
    setupTemplate(templateId) {
      this.attachShadow({ mode: 'open' });
      const template = document.getElementById(templateId);
      const templateContent = template.content.cloneNode(true);
      this.shadowRoot.appendChild(templateContent);
    }
  
    connectedCallback() {
      this.shadowRoot.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', this.onInputChange);
      });
    }
  
    disconnectedCallback() {
      this.shadowRoot.querySelectorAll('input').forEach(input => {
        input.removeEventListener('input', this.onInputChange);
      });
    }
  
    onInputChange(event) {
      const inputId = event.target.className;
      const value = event.target.value;
      event.target.setAttribute("value", value);
      this.setAttribute(inputId, value);
      this.dispatchEvent(new CustomEvent('valueChanged', { bubbles: true, composed: true}));
    }
  
    set elements(data) {
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          this.setAttribute(key, data[key]);
        }
      }
    }
  
    getObservedAttributes() {
      return this.constructor.observedAttributes;
    }
  
    get elements() {
      const attributesData = {};
      const observedAttributes = this.getObservedAttributes();
      observedAttributes.forEach(attr => {
        attributesData[attr] = this.getAttribute(attr);
      });
      return attributesData;
    }
  
    static fillTemplate(template, values) {
      return new Function(...Object.keys(values), `return \`${template}\`;`)(...Object.values(values));
    }
  }