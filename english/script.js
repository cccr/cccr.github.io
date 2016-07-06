var random = false;

function createCookie(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}

var data = {};
var blocks = [];
var currentBlock = readCookie("block");
var fullData = "";

function getRandomElement(arr) {
    var index = Math.floor(Math.random() * arr.length);
    return arr[index];
}

function alertContents() {

    if (!fullData) throw new Error("fullData is null");

    blocks = Object.keys(fullData);

    if (!currentBlock) {
        currentBlock = getRandomElement(blocks);
        createCookie("block", currentBlock);
    }

    var arrayOfQuotes = fullData[currentBlock];

    var arrayOfQuotesIndexes = [];
    var i = 0;
    while (i < arrayOfQuotes.length) {
        arrayOfQuotesIndexes.push(i++)
    }

    var shown = [];
    var x = readCookie("shown");
    if (x) {
        shown = JSON.parse(atob(x));
        arrayOfQuotesIndexes = arrayOfQuotesIndexes.filter(function (i) {
            return shown.indexOf(i) == -1;
        });
    }

    var index;

    if (random) {
        var randomIndex = getRandomElement(arrayOfQuotesIndexes);
        shown.push(randomIndex);
        data = arrayOfQuotes[randomIndex];
    } else {
        index = shown.length;
        shown.push(index);
        data = arrayOfQuotes[index];
    }


    if (shown.length == arrayOfQuotes.length) {
        eraseCookie("shown");
    } else {
        createCookie("shown", btoa(JSON.stringify(shown)), 1 / 144);
    }

    fillText();
}

function fetchData() {

    typedAnswer.innerHTML = "";
    typedAnswer.dataset.content = "";

    if (fullData) {
        alertContents(fullData);
        return;
    }

    var getResponse = function () {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                fullData = JSON.parse(httpRequest.responseText);
                alertContents();
            } else {
                alert("There was a problem with the request to data.json.");
            }
        }
    };

    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = getResponse;
    httpRequest.open("GET", "data.json");
    httpRequest.send();
}

function chooseBlock() {
    var createLiElement = function(text) {
        var liEl = document.createElement("li");
        liEl.appendChild(document.createTextNode(text));
        liEl.addEventListener("click", changeBlock, false);
        availableBlocks.appendChild(liEl);
    };

    if (!availableBlocks.firstChild) {
        blocks.forEach(createLiElement);
    }

    toggle(availableBlocks);
    window.scrollTo(0, document.body.scrollHeight);
}

function changeBlock() {
    createCookie("block", this.innerHTML);
    currentBlock = this.innerHTML;
    eraseCookie("shown");
    fetchData();
    toggle(availableBlocks);
}

var answerButton;
var answer;
var typedAnswer;
var originalText;
var thumbsUp;
var availableBlocks;

function ready(fn) {
    if (document.readyState != "loading") {
        fn();
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

var init = function () {
    answerButton = document.getElementById("answerButton");
    answer = document.getElementById("answer");
    typedAnswer = document.getElementById("typedAnswer");
    originalText = document.getElementById("originalText");
    thumbsUp = document.getElementById("thumbsUp");
    availableBlocks = document.getElementById("availableBlocks");
};

var fillText = function () {
    originalText.innerHTML = data.russian;
    answer.innerHTML = data.english;
};

var fn = function () {
    init();
    fetchData();

    var hideFunction = function () {
        toggle(answer);
    };
    answerButton.addEventListener("click", hideFunction, false);
};

var className = "hide";

var toggle = function (el) {
    if (el.classList) {
        el.classList.toggle(className);
    } else {
        var classes = el.className.split(" ");
        var existingIndex = classes.indexOf(className);
        if (existingIndex >= 0) {
            classes.splice(existingIndex, 1);
        } else {
            classes.push(className);
        }
        el.className = classes.join(" ");
    }
};

var hint = function () {
    if (typedAnswer.dataset.content !== answer.innerHTML) {
        typedAnswer.innerHTML = diffString(typedAnswer.dataset.content, answer.innerHTML);
    } else {
        toggle(thumbsUp);
        setTimeout(function(){ toggle(thumbsUp) }, 1000);
    }
};

ready(fn);