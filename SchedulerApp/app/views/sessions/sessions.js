console.log("session required");
var application = require("application");
var observableArray = require("data/observable-array");
var navigation = require("../../shared/navigation");
var view = require("ui/core/view");
view.cssFile = "./sessions.css";
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
 exports.navigatedTo = function() {
  console.log("navigated to...");
 }
exports.onTap = function(args) {
  console.log(args.index);
  navigation.goToDepartmentsForSession(allSessions.getItem(args.index));
};

console.log("made it to the end of sessions.js");