"use strict";

var applicationModule = require("application");
var navigation = require("./shared/navigation");


var classSearch = require("./models/class-search");
applicationModule.classSearch = classSearch;
applicationModule.getSettings = function() {
	// probably should return a promise
	if(!applicationModule.hasOwnProperty("_settings")) {
		applicationModule._settings = new Settings();
	}
	return applicationModule._settings;
};
function Settings() {
	this.test = true;
}
Settings.prototype.save = function() {
	// todo: save settings to sqlite
	// probably going to return a promise
};
Settings.prototype.load = function() {
};


applicationModule.mainModule = navigation.startingPage();
// if(applicationModule.ios)
	applicationModule.start();
// else
 	console.log("application should start by itself.")