"use strict";
//var config = require("./config");
var frameModule = require("ui/frame");

module.exports = {
  goToSessions: function() {
    frameModule.topmost().navigate("views/sessions/sessions");
  },
  goToDepartmentsForSession: function(session) {
    var navigationEntry = {
      moduleName: "views/departments/departments",
      context: session,
    };
    frameModule.topmost().navigate(navigationEntry);
  },  
  goToCourses: function(obj) {
    var navigationEntry2 = {
      moduleName: "views/courses/courses",
      context: obj,
    };
    frameModule.topmost().navigate(navigationEntry2);
  },
  startingPage: function() {
    console.log("getting starting page");
    return "views/sessions/sessions";
  }
};



