import BaseControl from './base_control.js';

export default class TextControlCard extends BaseControl {
    constructor() {
      super();
      this.setupTemplate('text-control-template');
      TextControlCard.observedAttributes.forEach(attr => {
        this[attr] = this.shadowRoot.querySelector(`.${attr}`);
      });
      this.onInputChange = this.onInputChange.bind(this);
    }
  
    static get observedAttributes() {
      return ['legend', 'content', 'color_picker', 'size', 'alpha', 'suggested_size', 'margin_color_picker', 'margin_alpha', 'margin', 'left', 'top', 'left_range', 'top_range', 'left_max', 'top_max',];
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      switch (name) {
        case 'legend':
          this.legend.textContent = newValue;
          break
        case 'content':
          this.content.value = newValue;
          break;
        case 'size':
          this.size.value = newValue;
          break;
        case 'margin':
          this.margin.value = newValue;
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
        case 'color_picker':
          this.color_picker.value = newValue;
          break;
        case 'margin_color_picker':
          this.margin_color_picker.value = newValue;
          break;
        case 'margin_alpha':
          this.margin_alpha.value = newValue;
          break;
        case 'alpha':
          this.alpha.value = newValue;
          break;
        case 'suggested_size':
          this.suggested_size.textContent = newValue;
          this.suggested_size.setAttribute('title',
            BaseControl.fillTemplate(
              this.suggested_size.getAttribute('data-title'),
              { suggested_size: `${newValue}` }
            )
          );
          break
        default:
      }
    }
  }

customElements.define('text-control-card', TextControlCard);