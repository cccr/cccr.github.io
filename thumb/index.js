var imageLoader = document.getElementById("imageLoader");
imageLoader.addEventListener("change", handleImage, false);

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var background = new Image();
var canvasScale = 1;


class ControlCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const template = document.getElementById('control-template');
    const templateContent = template.content.cloneNode(true);

    this.shadowRoot.appendChild(templateContent);

    ControlCard.observedAttributes.forEach((e) => this[e] = this.shadowRoot.querySelector("." + e));
    this.onInputChange = this.onInputChange.bind(this);
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
    this.setAttribute(inputId, value);
    doRender();
  }

  static fillTemplate(template, values) {
    return new Function(...Object.keys(values), `return \`${template}\`;`)(...Object.values(values));
  }

  static get observedAttributes() {
    return ['id_preffix', 'legend', 'content', 'color_picker', 'size', 'suggested_size', 'margin_color_picker', 'margin', 'left', 'top', 'left_range', 'top_range', 'left_max', 'top_max',];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'id_preffix':
        this.content.id = `${newValue}${this.content.id}`;
        this.color_picker.id = `${newValue}${this.color_picker.id}`;
        this.size.id = `${newValue}${this.size.id}`;
        this.suggested_size.id = `${newValue}${this.suggested_size.id}`;
        break;
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
        this.left.max = newValue;
        this.left_range.max = newValue;
        break;
      case 'top_max':
        this.top.max = newValue;
        this.top_range.max = newValue;
        break;
      case 'left':
      case 'left_range':
        this.left.value = `${newValue}`;
        this.left_range.value = `${newValue}`;
        if (!(this.getAttribute("left") === this.getAttribute("left_range"))) {
          this.setAttribute(["left", "left_range"].filter(e => e !== name), `${newValue}`);
        }
        break;
      case 'top':
      case 'top_range':
        this.top.value = `${newValue}`;
        this.top_range.value = `${newValue}`;
        if (!(this.getAttribute("top") === this.getAttribute("top_range"))) {
          this.setAttribute(["top", "top_range"].filter(e => e !== name), `${newValue}`);
        }
        break;
      case 'color_picker':
        this.color_picker.value = `${newValue}`;
        break;
      case 'margin_color_picker':
        this.margin_color_picker.value = `${newValue}`;
        break;
      case 'suggested_size':
        this.suggested_size.textContent = `${newValue}`;
        this.suggested_size.setAttribute('title',
          ControlCard.fillTemplate(
            this.suggested_size.getAttribute('data-title'),
            { suggested_size: `${newValue}` }
          )
        );
        break
      default:
    }
  }

  set elements(data) {
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        this.setAttribute(key, data[key]);
      }
    }
  }

  get elements() {
    let obj = {};
    ControlCard.observedAttributes.forEach((e) => obj[e] = this.getAttribute(e));
    return obj;
  }
}

customElements.define('control-card', ControlCard);

const app = document.getElementById('control_app');

const h1 = document.createElement('control-card');
h1.setAttribute('id', 'h1');
h1.elements = {
  id_preffix: 'h1',
  legend: 'H1',
  content: 'Lora IoTipsum',
  color_picker: '#ffffff',
  size: 48,
  suggested_size: '8.5%',
  margin: 20,
  margin_color_picker: "#00003F",
  left: 0,
  top: 0,
  left_range: 0,
  top_range: 0,
};
app.appendChild(h1);

const h2 = document.createElement('control-card');
h2.setAttribute('id', 'h2');
h2.elements = {
  id_preffix: 'h2',
  legend: 'H2',
  content: 'IoTuesday',
  color_picker: '#ffffff',
  size: 48,
  suggested_size: '6%',
  margin: 15,
  margin_color_picker: "#00003F",
  left: 0,
  top: 0,
  left_range: 0,
  top_range: 0,
};
app.appendChild(h2);


class CanvasText {
  static fontface = 'Teko';

  constructor(ctx, left, top, text, fontsize, color, margin, margin_color, margin_alpha) {
    this.ctx = ctx;
    this.left = parseInt(left);
    this.top = parseInt(top);
    this.text = text;
    this.fontsize = parseInt(fontsize);
    this.color = color;
    this.margin = parseInt(margin);
    this.margin_color = margin_color;
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

    this.ctx.fillStyle = this.color;
    this.ctx.fillText(this.text, this.left, this.top);
  }
}

class CanvasImage {
  image = new Image();

  constructor(ctx, imageLoaded, left, top, scale) {
    this.ctx = ctx;
    this.image.src = imageLoaded;
    this.left = parseInt(left);
    this.top = parseInt(top);
    this.scale = scale;

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

var captions = [];

function doRender() {
  canvas.width = background.width;
  canvas.height = background.height;

  ctx.drawImage(background, 0, 0);

  captions = [];
  captions.push({
    name: "topic",
    drawable: new CanvasText(ctx, h1.elements.left, h1.elements.top, h1.elements.content, h1.elements.size, h1.elements.color_picker, h1.elements.margin, h1.elements.margin_color_picker, 0.9)
  });
  captions.push({
    name: "subject",
    drawable: new CanvasText(ctx, h2.elements.left, h2.elements.top, h2.elements.content, h2.elements.size, h2.elements.color_picker, h2.elements.margin, h2.elements.margin_color_picker, 0.9)
  });
  captions.push({
    name: "logo",
    drawable: new CanvasImage(ctx, "./logo.png", logo_left.value, logo_top.value, Math.pow(Math.exp(1), logo_scale.value))
  });

  captions.forEach((element) => element.drawable.draw());
}

function initialLoad(e) {
  captions = [];
  {
    logo_left.value = Math.round(background.height * 0.05);
    logo_top.value = Math.round(background.height * 0.078);

    h1_temp = {};
    h2_temp = {};

    h1_temp.top_max = background.height;
    h1_temp.left_max = background.width;
    h2_temp.top_max = background.height;
    h2_temp.left_max = background.width;

    h1_temp.suggested_size = Math.round(background.height * 0.196);
    h2_temp.suggested_size = Math.round(h1_temp.suggested_size * 0.625);

    h1_temp.size = h1_temp.suggested_size;
    h2_temp.size = h2_temp.suggested_size;

    h1_temp.top = Math.round(background.height * 0.5465);
    h2_temp.top = Math.round(h1_temp.top * 1.36);

    h1_temp.top_range = h1_temp.top;
    h2_temp.top_range = h2_temp.top;

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
  var fileName = h2.value.concat("_", h1.value).toLowerCase().replace(/[\W_]+/g, "_");
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

let isActive = false;  // Track if mouse is held down
let center = { x: 100, y: 100 };  // Assuming a fixed-size 200x200 area for simplicity
let lastPosition = { x: 100, y: 100 };  // Cache the last mouse position

document.getElementById('trackpointArea').addEventListener('mousedown', function (e) {
  isActive = true;  // Enable movement tracking
  updateLastPosition(e);  // Update position initially on mouse down
});

document.getElementById('trackpointArea').addEventListener('mouseup', function () {
  isActive = false;  // Disable movement tracking
});

document.getElementById('trackpointArea').addEventListener('mouseleave', function () {
  isActive = false;  // Disable movement if leaves the area
});

document.getElementById('trackpointArea').addEventListener('mousemove', function (e) {
  if (isActive) {
    updateLastPosition(e);
    updateCoordinates();
  }
});

function updateLastPosition(e) {
  var rect = e.target.getBoundingClientRect();
  lastPosition.x = e.clientX - rect.left;
  lastPosition.y = e.clientY - rect.top;
}

function updateCoordinates() {
  const sensitivity = 0.1;  // Control how sensitive the movement is
  let dx = Math.round((lastPosition.x - center.x) * sensitivity);
  let dy = Math.round((lastPosition.y - center.y) * sensitivity);

  let currentX = parseInt(document.getElementById('logo_left').value || center.x);
  let currentY = parseInt(document.getElementById('logo_top').value || center.y);

  document.getElementById('logo_left').value = currentX + dx;
  document.getElementById('logo_top').value = currentY + dy;
}

// Continually update the position if the mouse is down
setInterval(function () {
  if (isActive) {
    updateCoordinates();
    doRender();
  }
}, 50);  // Update frequency in milliseconds
