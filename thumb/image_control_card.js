import BaseControl from './base_control.js';

export default class ImageControlCard extends BaseControl {
    constructor() {
      super();
      this.setupTemplate('image-control-template');
      ImageControlCard.observedAttributes.forEach(attr => {
        this[attr] = this.shadowRoot.querySelector(`.${attr}`);
      });
      this.onInputChange = this.onInputChange.bind(this);
    }
  
    static fillTemplate(template, values) {
      return new Function(...Object.keys(values), `return \`${template}\`;`)(...Object.values(values));
    }
  
    static get observedAttributes() {
      return ['legend', 'scale', 'left', 'top', 'left_range', 'top_range', 'left_max', 'top_max',];
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      switch (name) {
        case 'legend':
          this.legend.textContent = newValue;
          break
        case 'scale':
          this.scale.value = newValue;
          break;
        case 'left_max':
          this.left.setAttribute("max", newValue);
          this.left_range.setAttribute("max", newValue);
          break;
        case 'top_max':
          this.top.max = newValue;
          this.top_range.max = newValue;
          break;
        case 'left':
        case 'left_range':
          this.left.setAttribute("value", newValue);
          this.left_range.setAttribute("value", newValue);
  
          this.left.value = newValue;
          this.left_range.value = newValue;
  
          if (!(this.getAttribute("left") === this.getAttribute("left_range"))) {
            this.setAttribute(["left", "left_range"].filter(e => e !== name), newValue);
          }
          break;
        case 'top':
        case 'top_range':
          this.top.setAttribute("value", newValue);
          this.top_range.setAttribute("value", newValue);
  
          this.top.value = newValue;
          this.top_range.value = newValue;
  
          if (!(this.getAttribute("top") === this.getAttribute("top_range"))) {
            this.setAttribute(["top", "top_range"].filter(e => e !== name), newValue);
          }
          break;
        default:
      }
    }
  }

customElements.define('image-control-card', ImageControlCard);