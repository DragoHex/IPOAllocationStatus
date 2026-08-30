"use strict";

B.on(document, "allGood", function () {
    B.get("/api/ipo-bid-master").then(function (resp) {
        var respJSON = JSON.parse(resp);
        var $select = $("#ipo_bid_symbol");
        $select.empty();
        $select.append('<option value="" disabled selected>Select</option>');
        for (var _iterator = respJSON, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
            var _ref;

            if (_isArray) {
                if (_i >= _iterator.length) break;
                _ref = _iterator[_i++];
            } else {
                _i = _iterator.next();
                if (_i.done) break;
                _ref = _i.value;
            }

            var ele = _ref;

            if (ele) {
                $select.append('<option value="' + ele + '">' + ele + "</option>");
            }
        }
    });
});

function getTable() {
    grecaptcha.execute('6LdqpmYgAAAAAAH0PezfXpa1DdAyuFdK5mgUxB-4', { action: 'submit' }).then(function (token) {

        document.querySelectorAll('.table-container').forEach(function (table) {
            table.style.display = 'none';
        });
        var alertContainer = document.getElementById('alert-container');
        alertContainer.innerHTML = ''; // Clearing alert container
        var body = {};
        try {
            var _spinner = $('#loader');
            var urlType = void 0;
            var ipo_bid_symbol = document.getElementById('ipo_bid_symbol').value;
            var pan_no = document.getElementById('pan_no').value;
            var application_no = document.getElementById('application_no').value;

            if (document.querySelector('input[name="urlType"]:checked')) {
                urlType = document.querySelector('input[name="urlType"]:checked').value;
            };
            if (urlType === 'ipo') {
                if (ipo_bid_symbol === '' || ipo_bid_symbol === null) {
                    showAlert('Please select Symbol', 'danger', 15);
                    return false;
                }
                body.symbol = ipo_bid_symbol;
            }
            if (pan_no) {
                if (!isValidPAN(pan_no)) {
                    showAlert('Invalid Pan Number', 'danger', 15);
                    return false;
                }
            }

            if ((pan_no === '' || pan_no === null) && (application_no === '' || application_no === null)) {
                showAlert('Please enter Pan number Or Application number to view details', 'danger', 15);
                return false;
            }

            if (pan_no && application_no) {
                showAlert('Please enter either Pan number Or Application number to view details', 'danger', 15);
                return false;
            }
            body.pan_no = pan_no;
            body.application_no = btoa(application_no);
            body.urlType = urlType;
            body.recaptcha = token;
            _spinner.show();
            var uri = "/api/ipo-bid-verification-details";
            B.post(uri, body).then(function (resp) {
                var respJSON = resp;
                if (respJSON) {
                    if (respJSON.data.length === 0) {
                        _spinner.hide();
                        showAlert('Record Not Found - This Application is not Bided / Processed from NSE', 'danger', 15);
                    } else if (respJSON.errorCode == '1') {
                        //showAlert('Invalid Pan Number', 'danger', 15)
                        showAlert(respJSON.errorMessage, 'danger', 15);

                        _spinner.hide();
                    } else {
                        var tblData = "";
                        var resData = respJSON.data;
                        if (body.urlType === 'debt') {
                            showTable(body.urlType);

                            for (var i = 0; i < resData.length; i++) {
                                tblData += "<table style='table-layout: fixed;margin-bottom: 20px;'>\n                                <tbody>\n                                    <tr>\n                                        <td class=\"\">Symbol</td>\n                                        <td id=\"debt-symbol\">" + (resData[i].symbol ? resData[i].symbol : '-') + "</td>\n                                    </tr>\n                                    <tr>\n                                        <td class=\"\">Category</td>\n                                        <td id=\"debt-category\">" + (resData[i].category ? resData[i].category : '-') + "</td>\n                                    </tr>\n                                    <tr>\n                                        <td class=\"\">Application Number</td>\n                                        <td id=\"debt-application-number\">" + (resData[i].appNumber ? resData[i].appNumber : '-') + "</td>\n                                    </tr>\n                                    <tr>\n                                        <td class=\"\">Bid Reference Number</td>\n                                        <td id=\"debt-bid-reference\">" + (resData[i].refNumber ? resData[i].refNumber : '-') + "</td>\n                                    </tr>\n                                    <tr>\n                                        <td class=\"\">DP Name and IP</td>\n                                        <td id=\"debt-dp-name-ip\">" + (resData[i].id ? resData[i].id : '-') + "</td>\n                                    </tr>\n                                    <tr>\n                                        <td class=\"\">Qty</td>\n                                        <td id=\"debt-qty\">" + (resData[i].quantity ? resData[i].quantity : '-') + "</td>\n                                    </tr>\n                                    <tr>\n                                        <td class=\"\">Price</td>\n                                        <td id=\"debt-price\">" + (resData[i].price ? resData[i].price : '-') + "</td>\n                                    </tr>\n                                    <tr>\n                                        <td class=\"\">Amount</td>\n                                        <td id=\"debt-amount\">" + (resData[i].amt ? resData[i].amt : '-') + "</td>\n                                    </tr>\n                                    <tr>\n                                        <td class=\"\">Transaction Date</td>\n                                        <td id=\"debt-transaction-date\">" + (resData[i].transDate ? resData[i].transDate : '-') + "</td>\n                                    </tr>\n                                    <tr>\n                                        <td class=\"\">Modification Date</td>\n                                        <td><span id=\"debt-modification-date\">" + (resData[i].modDate ? resData[i].modDate : '-') + "</span></td>\n                                    </tr>\n                                </tbody>\n                            </table>";
                            }
                            $("#debtdata").html(tblData);
                        } else {
                            showTable(body.urlType);
                            var _tblData = "";
                            for (var _i2 = 0; _i2 < resData.length; _i2++) {
                                _tblData += "<table style='margin-bottom: 20px;'>\n                                <tbody>\n                                    <tr>\n                                        <td class=\"label-column\">Order No.</td>\n                                        <td id=\"ipo-order-no\">" + (resData[_i2].orderNo ? resData[_i2].orderNo : '-') + "</td>\n                                    </tr>\n                                    <tr>\n                                        <td class=\"label-column\">Symbol</td>\n                                        <td id=\"ipo-symbol\">" + (resData[_i2].symbol ? resData[_i2].symbol : '-') + "</td>\n                                    </tr>\n                                    <tr>\n                                        <td class=\"label-column\">Quantity</td>\n                                        <td id=\"ipo-quantity\">" + (resData[_i2].quatity ? resData[_i2].quatity : '-') + "</td>\n                                    </tr>\n                                    <tr>\n                                        <td class=\"label-column\">Price</td>\n                                        <td id=\"ipo-price\">" + (resData[_i2].price ? resData[_i2].price : '-') + "</td>\n                                    </tr>\n                                    <tr>\n                                        <td class=\"label-column\">Application No.</td>\n                                        <td id=\"ipo-application-no\">" + (resData[_i2].appNumber ? resData[_i2].appNumber : '-') + "</td>\n                                    </tr>\n                                    <tr>\n                                        <td class=\"label-column\">PAN No.</td>\n                                        <td id=\"ipo-pan-no\">" + (resData[_i2].pan ? resData[_i2].pan : '-') + "</td>\n                                    </tr>\n                                    <tr>\n                                        <td class=\"label-column\">Dep ID.</td>\n                                        <td id=\"ipo-dep-id\">" + (resData[_i2].depId ? resData[_i2].depId : '-') + "</td>\n                                    </tr>\n                                    <tr>\n                                        <td class=\"label-column\">Beneficiary ID</td>\n                                        <td id=\"ipo-beneficiary-id\">" + (resData[_i2].benId ? resData[_i2].benId : '-') + "</td>\n                                    </tr>\n                                    <tr>\n                                        <td class=\"label-column\">Block Amount for UPI Bids\n                                        </td>\n                                        <td id=\"ipo-block-amount\">" + (resData[_i2].UPIAmtBlocked ? resData[_i2].UPIAmtBlocked : '') + "</td>\n                                    </tr>\n                                    <tr>\n                                        <td class=\"label-column\">UPI Status for UPI Bids\n                                        </td>\n                                        <td id=\"ipo-upi-status\">" + (resData[_i2].UPIStatus ? resData[_i2].UPIStatus : '-') + "</td>\n                                    </tr>\n                                    <tr>\n                                        <td class=\"label-column\">Status of Debt / Unblock\n                                        </td>\n                                        <td id=\"ipo-debt-status\">" + (resData[_i2].debitStatus ? resData[_i2].debitStatus : '-') + "</td>\n                                    </tr>\n                                </tbody>\n                            </table>\n                            <div class=\"note_container\">Note : UPI Bid & Blocked amount status is as received from Sponser Bank at EOD</div>\n                            <br>\n                            <div class=\"fw-bold\">Allotment Details :</div>\n                            <table style='margin-bottom: 20px;'>\n                                <tbody>\n                                    <tr>\n                                        <td>Quantity</td>\n                                        <td id=\"allotmentQty\">" + (resData[_i2].allotmentQty ? resData[_i2].allotmentQty : '-') + "</td>\n                                    </tr>\n                                    <tr>\n                                        <td>Price</td>\n                                        <td id=\"allotmentPrice\">" + (resData[_i2].allotmentPrice ? resData[_i2].allotmentPrice : '-') + "</td>\n                                    </tr>\n                                </tbody>\n                            </table>";
                            }
                            $("#ipodata").html(_tblData);
                        }
                    }
                    _spinner.hide();
                } else {
                    showAlert('Record Not Found - This Application is not Bided / Processed from NSE', 'danger', 15);
                    _spinner.hide();
                }
            });
        } catch (f) {
            console.log('catch f:' + f);
            showAlert('Oops! Something went wrong, Please contact administrator', 'danger', 15);
            spinner.hide();
        }
    });
}

function showTable(tableName) {
    // Hide all tables
    document.querySelectorAll('.table-container').forEach(function (table) {
        table.style.display = 'none';
    });

    // Show the selected table
    var table = document.getElementById(tableName + "-table");
    if (table) {
        table.style.display = 'block';
    }
}

function radioChanges(type) {
    showTable();
    var div = document.getElementById('symbol-container');
    if (type === 'debt') {
        div.style.display = 'none';
    } else {
        div.style.display = 'block';
    }
    document.getElementById('pan_no').value = "";
    document.getElementById('application_no').value = "";
    document.getElementById('ipo_bid_symbol').selectedIndex = 0;
}

function isValidPAN(panVal) {
    var regpan = /^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/;
    return regpan.test(panVal);
}

function clearData() {
    console.log('inside clear');
    document.getElementById('pan_no').value = "";
    document.getElementById('application_no').value = "";

    var urlType = document.querySelector('input[name="urlType"]:checked').value;
    console.log('urlType ::::', urlType);
    document.getElementById('ipo_bid_symbol').selectedIndex = 0;
    var div = document.getElementById('symbol-container');
    if (urlType === 'debt') {
        div.style.display = 'none';
    } else {
        div.style.display = 'block';
    }

    document.querySelectorAll('.table-container').forEach(function (table) {
        table.style.display = 'none';
    });
}