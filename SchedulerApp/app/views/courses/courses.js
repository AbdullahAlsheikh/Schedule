"use strict";
var colorModule = require("color");

var observableArray = require("data/observable-array");
var navigation = require("../../shared/navigation");
var dialogs = require("ui/dialogs");
var Q = require("q");
var courses;
var session;
var thisPage;
var rmp = require("../../models/ratemyprofessor");
var StackLayout = require("ui/layouts/stack-layout").StackLayout;
var observableModule = require("data/observable");

function refreshAll() {
    var courseList = thisPage.getViewById("courseList");
    courseList.refresh();
    updateIDs();
}
function updateIDs() {
  thisPage.getViewById("courseList")._eachChildView(function(stackLayout) {
    // var i = 0;
    // console.log("got stack layout");
    // console.log(stackLayout);
    // console.log(stackLayout.getChildrenCount());
    stackLayout._eachChildView(function (courseView) {
      // console.log(i);
      // console.log(courseView);
      //grid, repeater
      
      var courseHeader = courseView.getChildAt(0);
      // console.log("header: "+courseHeader);
      var sectionRepeater = courseView.getChildAt(1);
      // console.log("repeater: "+sectionRepeater);
      // console.log("get rows:" +courseHeader.getRows());
      var courseInfo;
      courseHeader._eachChildView(function(courseHeaderSubview) {
        if(courseHeaderSubview instanceof StackLayout)
          courseInfo = courseHeaderSubview;
        // console.log("--- type: "+courseHeaderSubview)
      });
      var classCodeView = courseInfo.getChildAt(0);
      // console.log("classCode: "+classCodeView.text)
      // console.log(classCodeView);
      var classCode = classCodeView.text.replace(' ', '_');
      sectionRepeater.id = classCode;
      // console.log(classCode);
      // console.log();

    });
  });
}
function updateSection(section) {
  if(section.rating > 2.5) {
    section.ratingClass = "sectionRatingGood";
  } else if(section.rating <= 2.5) {
    section.ratingClass = "sectionRatingBad";
  }
  if(section.inCart) {
    section.inCartClass = "removeFromCart";
  } else {
    section.inCartClass = "addToCart";
  }
  section.toggleCartText = !section.inCart? "+" : "×";

}
function onPageLoaded(args) {
  var page = args.object;
  thisPage = page;

  var context = args.object.navigationContext;
  var coursesPromise = context.courses;
  console.log(typeof coursePromise);
  if(typeof coursesPromise === "function") {

    coursesPromise = coursesPromise();
  }
  var title = context.title;
  courses = new observableArray.ObservableArray();
  page.bindingContext = {title: "Loading"};
  Q.when(coursesPromise).then(function(coursesArr) {
    console.log("courses promise resolved")
    session = context.session;

    var promises = [];
    var chain = Q.when();
    var couldntFindOne = false;

    coursesArr.forEach(function(course) {
      course.sections.forEach(function(section) {
        updateSection(section);
        var professorName = section.instructor;
        section.rating = "↻";
        var instructorParts = professorName.split(" ");
        section.ratingClass = "sectionRatingDefault";
        var lastName = instructorParts[0];
        var firstNameInitial = instructorParts[1];
        chain = chain.then(rmp.getProfessor(firstNameInitial, lastName), function(e){console.log("err");console.log(e);});
        chain = chain.then(function(professor) {

          // console.log(JSON.stringify(professor));
          if(professor && professor.rating) {
          //dialogs.alert("Rating: "+professor.rating).then(console.log);
          section.rating = professor.rating;
          updateSection(section);

          } else {
            section.rating = "?";
            //console.log("not set "+JSON.stringify(professor))
          }

        }, function(e) {
        }); // end of then


        section.toggleCart = toggleCart(section, course.code.replace(" ","_"));

      }); // end each(section)
      chain = chain.then(function() {
        var parent = thisPage.getViewById(course.code.replace(" ", "_"));
        // console.log("updating "+course.code+" after rmp");
        if(parent && parent.refresh) {
          parent.refresh();
        } else {

           console.log("could not find parent for " + parent)
          couldntFindOne = true;
        }
      });
      courses.push(course);
      // console.log("pushed course: "+course.code);
    }); // end each(course);
    chain = chain.then(function() {
      if(couldntFindOne) {
        refreshAll();
      }
      page.bindingContext.set("isLoading",false);
    });

  page.bindingContext = new observableModule.Observable({title: context.title, myItems: courses, isLoading: true});
updateIDs();
  });
  // var coursesArr = context.courses;
  

}

exports.onPageLoaded = onPageLoaded;
function toggleCart(section, courseID) {

  return function(event) {

    var target = event.object;
    if(!section.hasOwnProperty('inCart')) {
      section.inCart = true;
    } else {
      section.inCart = !section.inCart;
    }
    updateSection(section);
    var parent = thisPage.getViewById(courseID);

    if(parent && parent.refresh) {
      parent.refresh();
    } else {
      console.log("could not find parent: " + courseID);
      console.log(parent);
      refreshAll();
    }


    // section.toggleCartText = section.inCart? "×" : "+";
    // target.text = section.toggleCartText;
  };
}
exports.onTap = function(a) {
  // console.log(a);
  //navigation.goToDepartmentsForSession(allSessions[0]);
};
exports.navigatedTo =  function(eventData) {
     var context = eventData.object.navigationContext;
};
