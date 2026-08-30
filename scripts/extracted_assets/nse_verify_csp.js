'use strict';

B.on(document, 'allGood', function () {

    var ipobidAction1 = document.getElementById('ipobidSubmitBtn');
    if (ipobidAction1) {
        ipobidAction1.addEventListener('click', function (e) {
            e.preventDefault();
            getTable('ipobid-form');
        });
    }

    var ipobidAction2 = document.getElementById('ipobidResetBtn');
    if (ipobidAction2) {
        ipobidAction2.addEventListener('click', function (e) {
            e.preventDefault();
            clearData('ipobid-form');
        });
    }

    var radioButtons = document.querySelectorAll('input[name="urlType"]');
    if (radioButtons) {
        radioButtons.forEach(function (radio) {
            radio.addEventListener('change', function (event) {
                // Check if this specific radio button was the one checked
                if (event.target.checked) {
                    console.log("Selected value:", event.target.value);
                    radioChanges(event.target.value);
                }
            });
        });
    }
});