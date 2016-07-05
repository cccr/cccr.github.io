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
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}

var data = {};

function fetchData() {
    var alertContents = function () {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                var arrayOfQuotes = JSON.parse(httpRequest.responseText);

                var arrayOfQuotesIndexes = [];
                var i = 0;
                while (i < arrayOfQuotes.length) {
                    arrayOfQuotesIndexes.push(i++)
                }

                var shown = [];
                var x = readCookie('shown');
                if (x) {
                    shown = JSON.parse(atob(x));
                    arrayOfQuotesIndexes = arrayOfQuotesIndexes.filter(function (i) {
                        return shown.indexOf(i) == -1;
                    });
                }

                var index;

                if (random) {
                    index = Math.floor(Math.random() * arrayOfQuotesIndexes.length);
                    shown.push(arrayOfQuotesIndexes[index]);
                    data = arrayOfQuotes[arrayOfQuotesIndexes[index]];
                } else {
                    index = shown.length;
                    shown.push(index);
                    data = arrayOfQuotes[index];
                }


                if (shown.length == arrayOfQuotes.length) {
                    eraseCookie('shown');
                } else {
                    createCookie('shown', btoa(JSON.stringify(shown)), 1 / 144);
                }

                fillText();
            } else {
                alert('There was a problem with the request to data.json.');
            }
        }
    };

    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = alertContents;
    httpRequest.open('GET', 'self.json');
    httpRequest.send();
}

var answerButton;
var answer;
var typedAnswer;
var originalText;
var thumbsUp;

function ready(fn) {
    if (document.readyState != 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

var init = function () {
    answerButton = document.getElementById("answerButton");
    answer = document.getElementById("answer");
    typedAnswer = document.getElementById("typedAnswer");
    originalText = document.getElementById("originalText");
    thumbsUp = document.getElementById("thumbsUp");
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
    answerButton.addEventListener('click', hideFunction, false);
};

var className = 'hide';

var toggle = function (el) {
    if (el.classList) {
        el.classList.toggle(className);
    } else {
        var classes = el.className.split(' ');
        var existingIndex = classes.indexOf(className);
        if (existingIndex >= 0) {
            classes.splice(existingIndex, 1);
        } else {
            classes.push(className);
        }
        el.className = classes.join(' ');
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