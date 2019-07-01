'use strict';
(function () {
    const inputs = document.querySelector('.container'),
        radios = document.querySelector('#radios'),
        nipInput = document.querySelector('input[name=NIP]'),
        waitForUserAndStore = debounce(populateStorage, 100);

    inputs.addEventListener('input', waitForUserAndStore, false);
    radios.addEventListener('change', waitForUserAndStore, false);
    nipInput.addEventListener('blur', nipTestDisplay, false);
    window.addEventListener('load', setForm, false);

    function populateStorage() {
        let key = document.activeElement.name,
            value = document.activeElement.value,
            newTime = new Date();
        localStorage.setItem(key, value);
        localStorage.setItem('date', newTime.toLocaleString());

        displayTime();
    }

    function setForm() {
        if (localStorage.length > 0) {
            setInputs();
            setRadios();
            displayTime();
        }
        nipTestDisplay();
    }

    function setInputs() {
        const inputArray = document.querySelectorAll('input[type=text]');
        inputArray.forEach(fillFromStorage);

        function fillFromStorage(element) {
            for (var prop in localStorage) {
                if (prop === element.name) {
                    element.value = localStorage.getItem(prop);
                }
            }
        }
    }

    function setRadios() {
        const radioArray = document.querySelectorAll('input[type=radio]');

        for (var prop in radioArray) {
            if (radioArray[prop].value === localStorage.getItem("status")) {
                radioArray[prop].checked = true;
            }
        }
    }

    function displayTime() {
        let timer = document.getElementById('lastUpdate');
        timer.textContent = localStorage.getItem('date');
    }

    function nipTestDisplay() {
        let currentNIP = localStorage.getItem('NIP');

        if (!currentNIP) return;

        if (isValidNIP(currentNIP) || !currentNIP) {
            nipInput.removeAttribute('class', 'invalidNIP');
        } else {
            nipInput.setAttribute('class', 'invalidNIP');
        }
    }

    function isValidNIP(nip) {
        let nipNum = nip.replace(/-/g, ''),
            regCheck = new RegExp(/^[0-9]{10}$/);

        if (regCheck.test(nipNum)) {
            let nipArr = nipNum.split(''),
                scales = [6, 5, 7, 2, 3, 4, 5, 6, 7],
                controlSum = 0;
            for (var i = 0; i < (nipArr.length - 1); i++) {
                controlSum += nipArr[i] * scales[i];
            }
            return controlSum % 11 === Number(nipArr[nipArr.length - 1]) ? true : false;
        } else {
            return false;
        }
    }

    //debounce function from https://davidwalsh.name/javascript-debounce-function
    function debounce(func, wait, immediate) {
        var timeout;
        return function () {
            var context = this,
                args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) {
                    func.apply(context, args);
                }
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) {
                func.apply(context, args);
            }
        };
    };

})();