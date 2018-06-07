var useFakeData = true; // turn this off when in production
var activePage = 0; // 0 = left page; 1 = right page

$( document ).ready(function() {
  $(".title").text("News Feed (" + getCurrentDate() + ")");

  if (useFakeData) {
    $.getJSON('static/data/fakedata.json', function(data) {
      posts = data.posts;
      var userPosts = posts.filter(post => {
        return post.tag == "content";
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
        return post.tag == "content";
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
  elem.textillate({
    // the default selector to use when detecting multiple texts to animate
    selector: '.texts',

    // enable looping
    loop: false,

    // sets the minimum display time for each text before it is replaced
    minDisplayTime: 2000,

    // sets the initial delay before starting the animation
    // (note that depending on the in effect you may need to manually apply
    // visibility: hidden to the element before running this plugin)
    initialDelay: 0,

    // set whether or not to automatically start animating
    autoStart: true,

    // custom set of 'in' effects. This effects whether or not the
    // character is shown/hidden before or after an animation
    inEffects: [],

    // custom set of 'out' effects
    outEffects: [ 'hinge' ],

    // in animation settings
    in: {
      // set the effect name
      effect: 'fadeIn',

      // set the delay factor applied to each consecutive character
      delayScale: 1.5,

      // set the delay between each character
      delay: 300,

      // set to true to animate all the characters at the same time
      sync: false,

      // randomize the character sequence
      // (note that shuffle doesn't make sense with sync = true)
      shuffle: false,

      // reverse the character sequence
      // (note that reverse doesn't make sense with sync = true)
      reverse: false,

      // callback that executes once the animation has finished
      callback: function () {}
    },

    // callback that executes once textillate has finished
    callback: function () {
      if (!content) {
        if (curIdx < userPostsArray.length - 1) {
          animateTextIn(userPostsArray, curIdx+1);
        } else {
          endOfBook();
        }
        return;
      }
      var div = document.createElement("div");
      div.className = "post";
      var elem = $(div);
      appendElem(elem);
      elem.text(content);
      elem.textillate({
        selector: '.texts',
        loop: false,
        minDisplayTime: 2000,
        initialDelay: 0,
        autoStart: true,
        inEffects: [],
        outEffects: [ 'hinge' ],
        in: {
          effect: 'fadeIn',
          delayScale: 1.5,
          delay: 400,
          sync: false,
          shuffle: false,
          reverse: false,
          callback: function () {}
        },
        callback: function () {
          if (curIdx < userPostsArray.length - 1) {
            animateTextIn(userPostsArray, curIdx+1);
          } else {
            endOfBook();
          }
        },
        type: 'word'
      })
    },
    // set the type of token to animate (available types: 'char' and 'word')
    type: 'word'
  });
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
