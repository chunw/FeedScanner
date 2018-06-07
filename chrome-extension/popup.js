var fbToggle1Value = false;
var fbToggle2Value = false;
var fbToggle3Value = false; // this is the scanner option
var fbToggle4Value = false;
var fbToggle5Value = false;

function getFbToggle1() {
  chrome.storage.local.get(['fb-toggle1-value'], function(result) {
    fbToggle1Value = result['fb-toggle1-value'];
    document.getElementById("fb-toggle1-value").textContent =
      (fbToggle1Value ? "ON" : "OFF");
  });
}

function getFbToggle2() {
  chrome.storage.local.get(['fb-toggle2-value'], function(result) {
    fbToggle2Value = result['fb-toggle2-value'];
    document.getElementById("fb-toggle2-value").textContent =
      (fbToggle2Value ? "ON" : "OFF");
  });
}

function getFbToggle3() {
  chrome.storage.local.get(['fb-toggle3-value'], function(result) {
    fbToggle3Value = result['fb-toggle3-value'];
    document.getElementById("fb-toggle3-value").textContent =
      (fbToggle3Value ? "ON" : "OFF");
    if (!fbToggle3Value) {
      $("#fb-toggle3-switch").removeAttr("checked");
    } else {
      $("#fb-toggle3-switch").attribute("checked");
    }
  });
}

function getFbToggle4() {
  chrome.storage.local.get(['fb-toggle4-value'], function(result) {
    fbToggle4Value = result['fb-toggle4-value'];
    document.getElementById("fb-toggle4-value").textContent =
      (fbToggle4Value ? "ON" : "OFF");
  });
}

function getFbToggle5() {
  chrome.storage.local.get(['fb-toggle5-value'], function(result) {
    fbToggle5Value = result['fb-toggle5-value'];
    document.getElementById("fb-toggle5-value").textContent =
      (fbToggle5Value ? "ON" : "OFF");
  });
}

function fbToggle1() {
    fbToggle1Value = !fbToggle1Value;
    chrome.storage.local.set({'fb-toggle1-value': fbToggle1Value}, function() {});
    getFbToggle1();
    notify();
}

function fbToggle2() {
    fbToggle2Value = !fbToggle2Value;
    chrome.storage.local.set({'fb-toggle2-value': fbToggle2Value}, function() {});
    getFbToggle2();
    notify();
}

function fbToggle3() {
    fbToggle3Value = !fbToggle3Value;
    chrome.storage.local.set({'fb-toggle3-value': fbToggle3Value}, function() {});
    getFbToggle3();
    notify();
}

function fbToggle4() {
    fbToggle4Value = !fbToggle4Value;
    chrome.storage.local.set({'fb-toggle4-value': fbToggle4Value}, function() {});
    getFbToggle4();
    notify();
}

function fbToggle5() {
    fbToggle5Value = !fbToggle5Value;
    chrome.storage.local.set({'fb-toggle5-value': fbToggle5Value}, function() {});
    getFbToggle5();
    notify();
}

$( document ).ready(function() {
    document.getElementById("fb-toggle1").addEventListener("click", fbToggle1);
    document.getElementById("fb-toggle2").addEventListener("click", fbToggle2);
    document.getElementById("fb-toggle3").addEventListener("click", fbToggle3);
    document.getElementById("fb-toggle4").addEventListener("click", fbToggle4);

    getFbToggle1();
    getFbToggle2();
    getFbToggle3();
    getFbToggle4();

    $("#res-link").click(function (){
      chrome.tabs.create({active: true, url: "http://art-io.herokuapp.com"});
    });
});

function notify() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {}, function(response) {});
  });
}
