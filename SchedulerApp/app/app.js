"use strict";
var applicationModule = require("application");

var classSearch = require("../../models/class-search");
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

var navigation = require("./shared/navigation");

applicationModule.mainModule = navigation.startingPage();
applicationModule.start();