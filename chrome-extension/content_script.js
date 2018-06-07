// store url on load
var currentPage = window.location.href;
var autoScroll;

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
    if (userOnAffectedPage()) {
      location.reload();
    }
    // sendResponse({farewell: "goodbye"});
});

// listen for changes
setInterval(function()
{
    if (currentPage != window.location.href)
    {
        // page has changed, set new page as 'current'
        currentPage = window.location.href;

        // do your thing...
        window.onload();
    }
}, 500);


window.onload = function() {
  if (window.location.host == "www.facebook.com") {
    chrome.storage.local.get(['fb-toggle1-value'], function(result) {
      if (result['fb-toggle1-value']) {
        enableFacebookInterventions1();
      }
    });

    chrome.storage.local.get(['fb-toggle2-value'], function(result) {
      if (result['fb-toggle2-value']) {
        enableFacebookInterventions2();
      }
    });

    // MAIN FUNC
    chrome.storage.local.get(['fb-toggle3-value'], function(result) {
      if (result['fb-toggle3-value']) {
          if (userOnAffectedPage()) {

            $(document).ready(function () {
              enableFacebookInterventions3();
            });


          } else {
            showElems();
            document.body.style.background = "#e9ebee";
            if (document.getElementById("contentCol")) {
              document.getElementById("contentCol").style.background = "#e9ebee";
            }
            if (fb_getTopBanner()) {
              fb_getTopBanner().style.background = "#4267b2";
              fb_getTopBanner().style.border = "none";
            }
            if (fb_getFeedElem()) {
              fb_getFeedElem().style.opacity = 1;
            }
            $(".intervention-ext-scanner").remove();
            clearInterval(autoScroll);
            autoScroll = null;
          }
      }
    });

    chrome.storage.local.get(['fb-toggle4-value'], function(result) {
      if (result['fb-toggle4-value']) {
          enableFacebookInterventions4();
      }
    });

    chrome.storage.local.get(['fb-toggle5-value'], function(result) {
      if (result['fb-toggle5-value']) {
          enableFacebookInterventions5();
      }
    });

  }
}

// SCAN MODE
function enableFacebookInterventions3() {
  // PREPROCESS
  hideElems();
  var black = "#080808";
  document.body.style.background = black;
  if (document.getElementById("contentCol")) {
    document.getElementById("contentCol").style.background = black;
  }
  if (fb_getTopBanner()) {
    fb_getTopBanner().style.background = black;
    fb_getTopBanner().style.border = "none";
  }
  if (fb_getFeedElem()) {
    fb_getFeedElem().style.opacity = 0.5;
  }

  // CREATE SCANNER
  if ($("#globalContainer")) {
    var scannerHTML = `
    <div class="intervention-ext-scanner">
      <div style="width:100px">
        <div class="laser"></div>
      </div>
    </div>`;
    $("#globalContainer").append(scannerHTML);
  }

  // AUTO SCROLL DOWN & DETECT USER CONTENT
  var xhr = new XMLHttpRequest();
  var method = "POST";
  var url = "https://art-io.herokuapp.com/clear"; // Clear user DB
  xhr.open(method, url, true);
  xhr.timeout = 30000;
  xhr.send();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
         console.log('clear successful');
         postUserContentToDB();
         autoScroll = setInterval(() => {
           window.scrollBy(0, 630); // NOTE - keep in sync with styles.css
           postUserContentToDB();
         }, 2000);
      } else {
         console.log('clear failed');
      }
    }
  }
}

function postUserContentToDB() {
  var userContentElems = getFbPostUserContentElements();
  userContentElems.forEach(elem => {
    var content = $(elem);
    // IMPOSE CONTENT FILTERS
    //
    // Facebook Ad filter. ie. "Suggested Post", "sponsored" post
    //
    if (content.prev().find('[id*="feed_subtitle"]').text().indexOf("SpSonSsoSredS") > -1) {
      // how funny this "sponsored" token is
      postToServer(
        content.prev().find('[id*="feed_subtitle"]').prev().text(),
        content.text(),
        "AD"
      );
    } else {
      // Real content
      postToServer(
        content.prev().find('[id*="feed_subtitle"]').prev().text(),
        content.text()
      );
    }
  });
}

function postToServer(nameText, contentText, tag = "content") {
  var xhr = new XMLHttpRequest();
  var method = "POST";
  var url = "https://art-io.herokuapp.com/post";
  xhr.open(method, url, true);
  xhr.timeout = 30000;
  xhr.send(JSON.stringify({
    "name" : nameText,
    "content" : contentText,
    "tag" : tag
  }));
}

// READER MODE
function enableFacebookInterventions4() {
  // PREPROCESS
  hideElems();
  var black = "#080808";
  document.body.style.background = black;
  if (document.getElementById("contentCol")) {
    document.getElementById("contentCol").style.background = black;
  }
  if (fb_getTopBanner()) {
    fb_getTopBanner().style.background = black;
    fb_getTopBanner().style.border = "none";
  }

  // DETECT USER CONTENT
  detectAndDimNonUserContent();
  $(document).scroll( function(){
    detectAndDimNonUserContent();
  });
}

function detectAndDimNonUserContent(dimVal = 0, black = "#080808") {
  $(".userContentWrapper").css("background", black);
  var userContentElems = getFbPostUserContentElements();
  userContentElems.forEach(elem => {
    // transform styles to augment attention focus
    var content = $(elem);
    content.addClass("ext-highlight-marker");
    content.css("color", "white");
    content.css("font-size", "150%");
    content.prev().find('[id*="feed_subtitle"]').css("display", "none");
    content.prev().find('[id*="feed_subtitle"]').prev().css("font-size", "150%");
    content.next().css("opacity", dimVal);
    content.parent().siblings().css("opacity", dimVal);
    content.parent().parent().siblings().css("opacity", dimVal);
    content.parent().parent().addClass("ext-highlight-marker-parent");
  });
}

function getFbPostUserContentElements() {
  var posts = Array.from(document.querySelectorAll(".userContentWrapper"));
  var userContents = posts.map(post => {
    var userContentArr = post.getElementsByClassName("userContent");
    var userContent = userContentArr[userContentArr.length - 1];
    return userContent;
  })
  return userContents;
}

// FADE and FLIP
function enableFacebookInterventions1() {
  fb_hidePostComposor();
  fb_flipFeed();
  fadeElems();
}

// FADE - NO FLIP
function enableFacebookInterventions2() {
  fb_hidePostComposor();
  fadeElems();
}

function enableFacebookInterventions5() {
  fb_hidePostComposor();
  fadeElems2();
}

function fadeElems2() {
  var elementsToFade = [
    document.getElementById("pagelet_navigation"), // left side bar
    document.getElementById("rightCol"), // right side bar
    document.getElementById("pagelet_sidebar"), // chat bar
    document.getElementsByClassName("fbChatSidebar"),
    fb_getFeedElem() // feed
  ];
  fadeOutEffect2(elementsToFade[0]);
  fadeOutEffect2(elementsToFade[1]);
  fadeOutEffect2(elementsToFade[2]);
  fadeOutEffect2(elementsToFade[3]);
  //fadeOutEffect2(elementsToFade[elementsToFade.length-1], 0.02, 0.04);
}

function fb_hidePostComposor() {
  var fb_postComposor = document.getElementById("pagelet_composer");
  if (fb_postComposor) {
    fb_postComposor.style.display = 'none';
  }
}

function fb_flipFeed() {
  var fb_feed = fb_getFeedElem();
  // Flip news feed upside down.
  // This demonstrates an intrusive "forever loading" effect.
  if (fb_feed) {
    fb_feed.style.transform = 'rotate(180deg)';
  }
}

function fb_getFeedElem() {
  var fb_feed = document.querySelectorAll('[role="feed"]');
  if (fb_feed && fb_feed[0]) {
    return fb_feed[0];
  }
  return null;
}

function fb_hasSignupElem() {
  var elements = document.querySelectorAll('[name="websubmit"]');
  return elements.length > 0;
}

function fb_getTopBanner() {
  var banner = document.querySelectorAll('[role="banner"]');
  if (banner && banner[0]) {
    return banner[0];
  }
  return null;
}

function fb_getSearchBar() {
  return document.getElementById("pagelet_bluebar");
  /*
  var searchbar = document.querySelectorAll('[role="search"]');
  if (searchbar && searchbar[0]) {
    return searchbar[0];
  }
  return null;
  */
}

function fadeElems() {
  var elementsToFade = [
    document.getElementById("pagelet_navigation"), // left side bar
    document.getElementById("rightCol"), // right side bar
    document.getElementById("pagelet_sidebar"), // chat bar
    document.getElementsByClassName("fbChatSidebar"),
    fb_getFeedElem(), // feed,
    fb_getSearchBar() // search bar in top nav
  ];
  setInterval(function() {
    fadeOutEffect(elementsToFade[0]);
  }, 2000);
  setInterval(function() {
    fadeOutEffect(elementsToFade[1]);
  }, 4500);
  setInterval(function() {
    fadeOutEffect(elementsToFade[2]);
    fadeOutEffect(elementsToFade[3]);
  }, 7000);
  setInterval(function() {
    fadeOutEffect(elementsToFade[elementsToFade.length-1], 0.02, 0.04);
  }, 10000);
}

function hideElems() {
  fb_hidePostComposor();
  var elementsToHide = [
    document.getElementById("pagelet_navigation"), // left side bar
    document.getElementById("rightCol"), // right side bar
    document.getElementById("pagelet_sidebar"), // chat bar
    document.getElementById("pagelet_dock"), // dock chat bar,
    fb_getSearchBar() // search bar in top nav
  ];
  for (var i = 0; i < elementsToHide.length; i++) {
    if (elementsToHide[i]) {
      elementsToHide[i].style.opacity = 0;
    }
  }
}

function showElems() {
  var fb_postComposor = document.getElementById("pagelet_composer");
  if (fb_postComposor) {
    fb_postComposor.style.display = 'block';
  }
  var elementsToHide = [
    document.getElementById("pagelet_navigation"), // left side bar
    document.getElementById("rightCol"), // right side bar
    document.getElementById("pagelet_sidebar"), // chat bar
    document.getElementById("pagelet_dock"), // dock chat bar
  fb_getSearchBar() // search bar in top nav
  ];
  for (var i = 0; i < elementsToHide.length; i++) {
    if (elementsToHide[i]) {
      elementsToHide[i].style.opacity = 1;
    }
  }
}

function fadeOutEffect(fadeTarget, step = 0.02, endValue = 0.02) {
    if (!fadeTarget) return;
    var fadeEffect = setInterval(function () {
        if (!fadeTarget.style.opacity) {
            fadeTarget.style.opacity = 1;
        }
        if (fadeTarget.style.opacity < endValue) {
            clearInterval(fadeEffect);
        } else {
            fadeTarget.style.opacity -= step;
        }
    }, 1000);
}

function fadeOutEffect2(fadeTarget, step = 0.02, endValue = 0.02) {
    if (!fadeTarget) return;
    var fadeEffect = setInterval(function () {
        if (!fadeTarget.style.opacity) {
            fadeTarget.style.opacity = 1;
        }
        if (fadeTarget.style.opacity < endValue) {
            clearInterval(fadeEffect);
            if (fb_getFeedElem()) {
              fb_getFeedElem().style.opacity = 0.5;
            }
            enableFacebookInterventions3();
        } else {
            fadeTarget.style.opacity -= step;
        }
    }, 200);
}

function userOnAffectedPage() {
  return !fb_hasSignupElem() && (fb_getFeedElem() || window.location.href === "https://www.facebook.com/");
}
