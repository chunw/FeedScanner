var useFakeData = true; // turn this off when in production
var activePage = 0; // 0 = left page; 1 = right page

$( document ).ready(function() {
  $(".title").text("Ads Feed (" + getCurrentDate() + ")");

  if (useFakeData) {
    $.getJSON('static/data/fakedata.json', function(data) {
        posts = data.posts;
        var userPosts = posts.filter(post => {
          return post.tag == "AD";
        });
        animateTextIn(userPosts, 0);
    });
  ]};

  } else {
    $.ajax({
      type : 'GET',
      url : '/get'
    }).done(function(posts) {
      var userPosts = Array.from(posts).filter(post => {
        return post.tag == "AD";
      });
      animateTextIn(userPosts, 0);
    });
  }
});

function animateTextIn(userPostsArray, curIdx) {
  var post = userPostsArray[curIdx];
  var content = post.content;
  var poster = post.name;
  if (!poster) {
    if (curIdx < userPostsArray.length - 1) {
      animateTextIn(userPostsArray, curIdx+1);
    } else {
      endOfBook();
    }
    return;
  }
  var div = document.createElement("div");
  div.className = "poster";
  var elem = $(div);
  appendElem(elem);
  elem.text(poster);
  if (!content) {
    if (curIdx < userPostsArray.length - 1) {
      animateTextIn(userPostsArray, curIdx+1);
    } else {
      endOfBook();
    }
    return;
  } else {
    var div = document.createElement("div");
    div.className = "post";
    var elem = $(div);
    appendElem(elem);
    elem.text(content);
    if (curIdx < userPostsArray.length - 1) {
      animateTextIn(userPostsArray, curIdx+1);
    } else {
      endOfBook();
    }
  }
}

function endOfBook() {
  var div = document.createElement("div");
  div.className = "bookend";
  var elem = $(div);
  elem.text("************* The End *************");
  appendElem(elem);
}

/*
* Make new content appear on one of the book pages.
*/
function appendElem(elem) {
  var height1 = $("#tlt").height();
  var height2 = $("#tlt2").height();

  if (height1 >= 600 && height2 < 600) {
    activePage = 1;
    $("#tlt2").append(elem);
  } else if (height1 >= 600 && height2 >= 600) {
    if (activePage == 1) {
      activePage = 0;
      $("#tlt").empty();
      $("#tlt").append(elem);
    } else if (activePage == 0) {
      activePage = 1;
      $("#tlt2").empty();
      $("#tlt2").append(elem);
    }
  } else {
    activePage = 0;
    $("#tlt").append(elem);
  }
}

function getCurrentDate() {
  return moment().format('MMMM Do YYYY');
}
