"use strict";
console.log("session required");
var application = require("application");
var observableArray = require("data/observable-array");
var navigation = require("../../shared/navigation");
var classSearch = application.classSearch;//require("../../models/class-search.js");//application.classSearch
var allSessions;


function onPageLoaded(args) {
  var page = args.object;
  console.log("on page loaded ran");

  classSearch.getSessions().then(function(sessions) {
    var array = new observableArray.ObservableArray();
    sessions.forEach(function(session) {
      array.push(session);
    });
    page.bindingContext = {myItems: array};
    allSessions = array;
  });


}
 exports.onPageLoaded = onPageLoaded;
exports.onTap = function(args) {
  console.log(args.index);
  navigation.goToDepartmentsForSession(allSessions.getItem(args.index));
};

