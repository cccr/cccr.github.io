//import logoImageLoaded from "./logo.png";

var imageLoader = document.getElementById("imageLoader");
imageLoader.addEventListener("change", handleImage, false);

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var background = new Image();
var canvasScale = 1;

var captions = [];

class BaseControl extends HTMLElement {
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
    doRender();
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

class TextControlCard extends BaseControl {
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

class ImageControlCard extends BaseControl {
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

customElements.define('text-control-card', TextControlCard);
customElements.define('image-control-card', ImageControlCard);

const app = document.getElementById('control_app');

const logo = document.createElement('image-control-card');
logo.setAttribute('id', 'logo');
logo.elements = {
  legend: 'Logo',
  scale: 0,
  left: 0,
  top: 0,
  left_range: 0,
  top_range: 0,
  left_max: Number.MAX_SAFE_INTEGER,
  top_max: Number.MAX_SAFE_INTEGER,
};
app.appendChild(logo);

const h1 = document.createElement('text-control-card');
h1.setAttribute('id', 'h1');
h1.elements = {
  legend: 'H1',
  content: 'Lora IoTipsum',
  color_picker: '#ffffff',
  alpha: 1,
  size: 48,
  suggested_size: '8.5%',
  margin: 20,
  margin_alpha: 0.9,
  margin_color_picker: "#00003F",
  left: 0,
  top: 0,
  left_range: 0,
  top_range: 0,
  left_max: Number.MAX_SAFE_INTEGER,
  top_max: Number.MAX_SAFE_INTEGER,
};
app.appendChild(h1);

const h2 = document.createElement('text-control-card');
h2.setAttribute('id', 'h2');
h2.elements = {
  legend: 'H2',
  content: 'IoTuesday',
  color_picker: '#ffffff',
  alpha: 1,
  size: 48,
  suggested_size: '6%',
  margin: 15,
  margin_alpha: 0.9,
  margin_color_picker: "#00003F",
  left: 0,
  top: 0,
  left_range: 0,
  top_range: 0,
  left_max: Number.MAX_SAFE_INTEGER,
  top_max: Number.MAX_SAFE_INTEGER,
};
app.appendChild(h2);

class CanvasText {
  static fontface = 'Teko';

  constructor(ctx, textControlCard) {
    this.ctx = ctx;

    const { left, top, content, size, color_picker, alpha, margin, margin_color_picker, margin_alpha } = textControlCard.elements;

    this.left = parseInt(left);
    this.top = parseInt(top);
    this.text = content;
    this.fontsize = parseInt(size);
    this.color = color_picker;
    this.alpha = alpha;
    this.margin = parseInt(margin);
    this.margin_color = margin_color_picker;
    this.margin_alpha = margin_alpha;
  }

  draw() {
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'top';

    this.ctx.font = '600 ' + this.fontsize + 'px ' + CanvasText.fontface;

    if (this.margin >= 0) {
      var lineHeight = this.fontsize * 0.8;// * 1.286;
      var textWidth = ctx.measureText(this.text).width;

      this.ctx.globalAlpha = this.margin_alpha;
      this.ctx.fillStyle = this.margin_color;
      this.ctx.fillRect(this.left - this.margin, this.top - this.margin, textWidth + this.margin * 2, lineHeight + this.margin * 2);
      this.ctx.globalAlpha = 1;
    }

    this.ctx.globalAlpha = this.alpha;
    this.ctx.fillStyle = this.color;
    this.ctx.fillText(this.text, this.left, this.top);
    this.ctx.globalAlpha = 1;
  }
}

class CanvasImage {
  image = new Image();

  constructor(ctx, imageLoaded, imageControlCard) {

    this.image.onload = function () {
      console.log("image loaded");
    }

    const { left, top, scale } = imageControlCard.elements;

    this.ctx = ctx;
    this.image.src = imageLoaded;
    this.left = parseInt(left);
    this.top = parseInt(top);
    this.scale = Math.pow(Math.exp(1), scale);

    this.width = this.image.width;
    this.height = this.image.height;
  }

  draw() {
    this.ctx.drawImage(
      this.image,
      this.left,
      this.top,
      this.width * this.scale,
      this.height * this.scale
    );
  }
}

function doRender() {
  canvas.width = background.width;
  canvas.height = background.height;

  ctx.drawImage(background, 0, 0);

  captions = [];
  captions.push({
    name: "topic",
    drawable: new CanvasText(ctx, h1)
  });
  captions.push({
    name: "subject",
    drawable: new CanvasText(ctx, h2)
  });
  captions.push({
    name: "logo",
    drawable: new CanvasImage(ctx, "./logo.png", logo)
  });

  captions.forEach((element) => element.drawable.draw());
}

function initialLoad(e) {
  captions = [];
  {
    let logo_temp = {
      top_max: background.height,
      left_max: background.width,
      left: Math.round(background.height * 0.05),
      top: Math.round(background.height * 0.078)
    };

    
    let h1_temp = {
      top_max: background.height,
      left_max: background.width,
      suggested_size: Math.round(background.height * 0.196),
      top: Math.round(background.height * 0.5465)
    };

    let h2_temp = {
      top_max: background.height,
      left_max: background.width,
      suggested_size: Math.round(h1_temp.suggested_size * 0.625),
      top: Math.round(h1_temp.top * 1.36)
    };

    h1_temp.size = h1_temp.suggested_size;
    h2_temp.size = h2_temp.suggested_size;

    h1_temp.top_range = h1_temp.top;
    h2_temp.top_range = h2_temp.top;

    logo.elements = Object.assign(logo.elements, logo_temp);
    h1.elements = Object.assign(h1.elements, h1_temp);
    h2.elements = Object.assign(h2.elements, h2_temp);

    doRender(e);
  }
}

function handleImage(e) {
  var reader = new FileReader();
  reader.onload = function (event) {
    background.addEventListener("load", initialLoad, false);
    background.src = event.target.result;
  };
  reader.readAsDataURL(e.target.files[0]);
  doRender();
}

function pickColor(event) {
  console.log(getComputedStyle(event.target).backgroundColor);
  rgb2hex = (rgb) => `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('')}`;
  event.target.parentNode.querySelector("input[type='color']").value = rgb2hex(getComputedStyle(event.target).backgroundColor);
  doRender();
}

function changeFontSize(event) {
  event.target.parentNode.querySelector("input[type='number']").value = parseInt(event.target.innerText);
  doRender();
}

function changeCanvasCtxScale(event) {
  canvasScale = Math.pow(Math.exp(1), event.target.value);
  canvas.style.width = background.width * canvasScale + "px";
}

function downloadCanvas(event) {
  var dataUrl = canvas.toDataURL("image/png");
  var fileName = h2.elements.content.concat("_", h1.elements.content).toLowerCase().replace(/[\W_]+/g, "_");
  event.target.download = fileName.concat(".png");
  this.href = dataUrl.replace(/^data:image\/[^;]/, "data:application/octet-stream");
}

dl.addEventListener("click", downloadCanvas, false);
reload.addEventListener("click", doRender, false);
canvas_scale.addEventListener("input", changeCanvasCtxScale, false);

document.querySelectorAll("input.scale").forEach(function (elem) {
  elem.addEventListener("dblclick", function () { this.value = 0; this.dispatchEvent(new Event("input")); }, false);
});

document.querySelectorAll("div.control input").forEach(function (elem) {
  elem.addEventListener("input", doRender, false);
});

document.querySelectorAll("fieldset.control input").forEach(function (elem) {
  elem.addEventListener("input", doRender, false);
});

document.querySelectorAll("fieldset.control abbr").forEach(function (elem) {
  elem.addEventListener("click", changeFontSize, false);
});

document.querySelectorAll("fieldset.control div.picker").forEach(function (elem) {
  elem.addEventListener("click", pickColor, false);
});


canvas.addEventListener("click", displayColor, false);

function displayColor(mouseEvent) {
  var imgData = ctx.getImageData(mouseEvent.offsetX / canvasScale, mouseEvent.offsetY / canvasScale, 1, 1);
  var rgba = imgData.data;

  alert("rgba(" + rgba[0] + ", " + rgba[1] + ", " + rgba[2] + ", " + rgba[3] + ")");

  canvas.removeEventListener("click", displayColor, false);
}
