/*
,--------------.
| 超级界面软件 |
| 作者：葛炳仑 |
|QQ: 2041461362|
|     T E L    |
|+8613154293565|
|+8618104290640|
`--------------'
*/
console.clear();
var xyGap = [0, 0];
var isMoving = "False";
var isZooming = "False";
var windowsNumber = 0;
var currentMovingWindowId = -1;
var windowIndexZMax = 0;
var windowFinalPozisation = [0, 0];
var changePosition = "False";
var windowNow = null;
var topWindowId = 0;
var onCloseFunction = {};
var onStartFunction = {};
var queryWindowBuffer = [];
var isMobileDevice = !(
	function () {
		var userAgentInfo = navigator.userAgent;
		var Agents = ["Android", "iPhone",
			"SymbianOS", "Windows Phone",
			"iPad", "iPod"
		];
		var flag = true;
		for (var v = 0; v < Agents.length; v++) {
			if (userAgentInfo.indexOf(Agents[v]) > 0) {
				flag = false;
				break;
			}
		}
		return flag;
	}
)();
var onclickList = [];
var onclickId = 0;
var globalFunctions = {};
var SJSUserDefinedSignConvertTable = {
	"leftBracket": "(",
	"rightBracket": ")",
	"leftSquareBracket": "[",
	"rightSquareBracket": "]",
	"htmlQuote": "&quot;",
	"quote": "\"",
	"singleQuote": "'",
}
var globalSJSFunctions = {};
var globalLsThis = null;
var globalUiFunction = {};
if (!String.prototype.includes) {
	String.prototype.includes = function (search, start) {
		'use strict';
		if (typeof start !== 'number') {
			start = 0;
		}

		if (start + search.length > this.length) {
			return false;
		} else {
			return this.indexOf(search, start) !== -1;
		}
	};
}
String.prototype.parse = function (func) {
	return func(this);
}
String.prototype.pythonLikeIn = function (keywordsArray) {
	var res = -1;
	for (var i = 0; i < keywordsArray.length; i++) {
		if (this.includes(keywordsArray[i])) {
			res = i;
			break;
		}
	}
	return res;
}


function getMousePosization(event) {
	var e = event || window.event ||
		arguments.callee.caller.arguments[0];
	var scrollX = document.documentElement.scrollLeft ||
		document.body.scrollLeft;
	var scrollY = document.documentElement.scrollTop ||
		document.body.scrollTop;
	var x = e.pageX || e.clientX + scrollX;
	var y = e.pageY || e.clientY + scrollY;
	return [x, y];
}

function clickMoveButton(window) {
	var mButton = $(window)
	var mWindow = mButton.parent().parent();
	isZooming = mButton.attr("isZooming");
	if (isZooming === "True") {
		var xyBefore = [parseInt(mWindow.css("left")), parseInt(mWindow.css("top"))];
		var xyAfter = getMousePosization();
		xyGap = [xyAfter[0] - xyBefore[0], xyAfter[1] - xyBefore[1]];
		//var xyNow=[xyAfter[0]-xyGap[0],xyAfter[1]-xyGap[1]];
		mButton.css("cursor", "default");
		currentMovingWindowId = -1;
		isZooming = "False";
		isMoving = "False";
		mButton.attr("isZooming", isZooming);
	} else {
		isZooming = "True";
		isMoving = "False";
		mButton.attr("isZooming", isZooming);
		var xyBefore = [parseInt(mWindow.css("left")),
			parseInt(mWindow.css("top"))
		];
		var xyAfter = getMousePosization();
		xyGap = [xyBefore[0] - 8, xyBefore[1] - 8];
		mButton.css("cursor", "move");
		currentMovingWindowId = mWindow.attr("id");
		windowNow = window;
	}
}

function clickTitleBar(window) {
	var mTitleBar = $(window);
	var mWindow = mTitleBar.parent().parent();
	isMoving = mTitleBar.attr("isMoving");
	if (isMoving === "True") {
		/*结束移动*/
		var xyBefore = [parseInt(mWindow.css("left")),
			parseInt(mWindow.css("top"))
		];
		var xyAfter = getMousePosization();
		xyGap = [xyAfter[0] - xyBefore[0], xyAfter[1] - xyBefore[1]];
		var xyNow = [xyAfter[0] - xyGap[0], xyAfter[1] - xyGap[1]];
		if (changePosition === "False") {
			mWindow.css("left", xyNow[0])
				.css("top", xyNow[1]);
			changePosition = "True";
		}
		mTitleBar.css("cursor", "default")
			.attr("isMoving", "False");
		isMoving = "False";
		currentMovingWindowId = -1;
		windowFinalPozisation = xyNow;
	} else {
		/*开始移动*/
		var xyBefore = [parseInt(mWindow.css("left")),
			parseInt(mWindow.css("top"))
		];
		var xyAfter = getMousePosization();
		xyGap = [xyAfter[0] - xyBefore[0], xyAfter[1] - xyBefore[1]];
		mTitleBar.attr("isMoving", "True");
		isMoving = "True";
		mTitleBar.css("cursor", "move");
		currentMovingWindowId = mWindow.attr("id");
		if (!(mWindow.attr("z-indexUnchangeable") === "True")) {
			mWindow.css("z-index", ++windowIndexZMax);
			topWindowId = windowIndexZMax;
		}
		windowNow = window;
	}

}

function moveing(window, xyIn) {
	/*
	var mWindow=$(window);
	var mTitleBar=mWindow.children("._titleBar");
	*/
	if (!window) {
		return;
	} else if (isMoving === "True" || isZooming === "True") {
		if (isMoving === "True") {
			var mTitleBar = $(window);
			var mWindow = mTitleBar.parent().parent();
			if (mWindow.attr("unmoveable")) {
				return;
			}
			if (mWindow.attr("unmoveable")) {
				return;
			}
			if (mWindow.attr("id") == currentMovingWindowId) {
				/*var xyBefore=[mWindow.css("left"),mWindow.css("top")];*/
				/*var xyAfter = getMousePosization();*/
				var xyAfter = xyIn;
				mWindow.css("left", xyAfter[0] - xyGap[0]);
				mWindow.css("top", xyAfter[1] - xyGap[1]);
			}
		} else {
			var mButton = $(window)
			var mWindow = mButton.parent().parent();
			var xyAfter = xyIn;
			mWindow.css("width", xyAfter[0] - xyGap[0]);
			mWindow.css("height", xyAfter[1] - xyGap[1]);
		}
	}
}

function pushElementToNewWindow(title, pushedWindow, sizeXY, parameters) {
	var _window = $(pushedWindow);
	newWindow(title, _window.html(), sizeXY, parameters);
	_window.remove();
}

function stopBubble(event) {
	if (event && event.stopPropagation) {
		event.stopPropagation();
	} else
		window.event.cancelBubble = true;
}

function newWindow(title, text, sizeXY, parameters) {
	var windowHtml = (
		new createHtml()
		.setTagName("div")
		.setAttribute(
			"class",
			(
				new createClassName()
				.addClass("_window")
			)
		)
		.setAttribute(
			"id",
			"_window" + windowsNumber
		)
		.addText(
			new createHtml()
			.setTagName("div")
			.setAttribute(
				"class",
				(
					new createClassName()
					.addClass("__shadow")
					.addClass("_windowShadow")
				)
			)
		)
		.addText(
			new createHtml()
			.setTagName("div")
			.setAttribute(
				"class",
				(
					new createClassName()
					.addClass("__window")
				)
			)
			.addText(
				new createHtml()
				.setTagName("div")
				.setAttribute(
					"class",
					(
						new createClassName()
						.addClass("_titleBar")
					)
				)
				.setAttribute("isMoving", "False")
				.setAttribute("onclick", "clickTitleBar(this)")
				.addText(
					new createHtml()
					.setTagName("div")
					.setAttribute(
						"class",
						new createClassName()
						.addClass("noneSelect")
						.addClass("__left")
						.addClass("_title")
					)
					.setAttribute("unselectable", "on")
					.addText(title)
				)
				.addText(
					new createHtml()
					.setTagName("div")
					.setAttribute(
						"class",
						new createClassName()
						.addClass("__right")
					)
					.addText(
						function (m) {
							var result = new stringBuffer();
							for (var i = 0; i < m.length; i++) {
								result.add(
									new createHtml()
									.setTagName("div")
									.setAttribute(
										"class",
										new createClassName()
										.addClass("noneSelect")
										.addClass("__left")
										.addClass("_window_button")
										.addClass("_window_button_" +
											"threeButtonsOnTitleBar")
										.addClass(m[i][0])
									)
									.setAttribute(
										"onclick",
										m[i][2]
									)
									.setAttribute("unselectable", "on")
									.addText(m[i][1])
								)
							}
							return result.toString();
						}
						(
							[
								[
									"_close",
									"-",
									"_minimize(this);" +
									"stopBubble(event);"
								],
								[
									"_maximize",
									"8",
									"_maximize(this);" +
									"stopBubble(event);"
								],
								[
									"_minimize",
									"x",
									"_close(this);" +
									"stopBubble(event);"
								]
							]
						)
					)
				)
			)
			.addText(
				new createHtml()
				.setTagName("div")
				.setAttribute(
					"class",
					new createClassName()
					.addClass("_contents")
				)
				.addText(text)
			)
			.addText(
				new createHtml()
				.setTagName("div")
				.setAttribute(
					"class",
					new createClassName()
					.addClass("noneSelect")
					.addClass("_window_button")
					.addClass("_zoom")
				)
				.setAttribute("onclick", "clickMoveButton(this)")
				.setAttribute("isZooming", "False")
			)
		)
		.toString()
	)
	//console.log(windowHtml)
	$("#_join").append(windowHtml);
	var thisWindow = $("#_window" + windowsNumber++);
	if (sizeXY[0] > 0 && sizeXY[1] > 1) {
		thisWindow
			.css("width", sizeXY[0])
			.css("height", sizeXY[1]);
	}
	windowFinalPozisation[0] += 24;
	windowFinalPozisation[1] += 24;
	thisWindow
		.css("left", windowFinalPozisation[0])
		.css("top", windowFinalPozisation[1]);
	if (!(thisWindow.attr("z-indexUnchangeable") === "True")) {
		thisWindow
			.css("z-index", ++windowIndexZMax);
		topWindowId = windowIndexZMax;
	}
	try {
		for (var i = 0; i < parameters.length; ++i) {
			switch (parameters[i][0]) {
				case "uncloseable":
					thisWindow
						.children(".__window")
						.children("._titleBar")
						.children(".__right")
						.children("._minimize")
						.css("color", "red")
						.removeAttr("onclick");
					console.log(">>#_menubar" + (windowsNumber - 1));
					$(("#_menubar" + (windowsNumber - 1)))
						.css("color", "blue")
						.removeAttr("onclick");
					break;
				case "unzoomable":
					thisWindow
						.children(".__window")
						.children("._zoom")
						.remove();
					break;
				case "unmaximumable":
					thisWindow
						.children(".__window")
						.children("._titleBar")
						.children(".__right")
						.children("._maximize")
						.css("color", "red")
						.removeAttr("onclick");
					break;
				case "unminimizeable":
					thisWindow
						.children(".__window")
						.children("._titleBar")
						.children(".__right")
						.children("._close")
						.css("color", "red")
						.removeAttr("onclick");

					$(("#_menubar" + (windowsNumber - 1)))
						.children("._window_button_threeButtonsOnTitleBar")
						.css("color", "red")
						.removeAttr("onclick");
					break;
				case "unmoveable":
					thisWindow.attr("unmoveable", "True");
					break;
				case "alwaysOnTheBottom":
					thisWindow
						.css("z-index", 0)
						.attr("z-indexUnchangeable", "True");
					break;
				case "alwaysOnTheTop":
					thisWindow
						.css("z-index", 65535)
						.attr("z-indexUnchangeable", "True");
					break;
				case "position":
					thisWindow
						.css("left", parameters[i][1][0][0] +
							parameters[i][1][0][1])
						.css("top", parameters[i][1][1][0] +
							parameters[i][1][1][1]);
					break;
				case "size":
					thisWindow
						.css("width", parameters[i][1][0][0] +
							parameters[i][1][0][1])
						.css("height", parameters[i][1][1][0] +
							parameters[i][1][1][1]);
					break;
				case "noShadow":
					thisWindow.children("._windowShadow").remove();
					//thisWindow.height(thisWindow.height()-2);
					thisWindow
						.css("border-top", "none")
						.css("border-bottom", "none");
					break;
				case "onStart":
					onStartFunction[windowsNumber] = parameters[i][1];
					break;
				case "onClose":
					onCloseFunction[windowsNumber] = parameters[i][1];
					break;
				case "notitle":
					thisWindow
						.children(".__window")
						.css("background-color", "transparent")
						.css("border", "none")
						.children("._titleBar")
						.css("display", "none");
				default:
					console.log(parameters[i][0]);
					break;
			}
		}
	} catch (e) {
		/*console.log(e);*/
	}
	if (windowsNumber > 1) addWindowToWindowsManager(windowsNumber - 1, title);
}

function addWindowToWindowsManager(id, title) {
	var windowInfomationHTML = "\n" +
		"<div class=\"noneSelect buttonLike _infomationOfWindow\" id=\"_menuba" +
		"r" + id + "\" onclick=\"_minimize(this,'byWindowsManager')\"" +
		"unselectable=\\\"on\">" +
		"<div class=\"windowsManagerId\">" + id + "</div>" +
		title +
		"<div class=\"noneSelect __right _window_button _window_button_threeBut" +
		"tonsOnTitleBar _minimize\" onclick=\"_close(this,'byWindowsManager')" +
		"\" unselectable=\"on\">x</div>\n" +
		/*
		"<div class=\"noneSelect __right _window_button _window_button_threeButt
		onsOnTitleBar _minimize\" onclick=\"_minimize(this,'byWindowsManager')\"
		 unselectable=\"on\">-</div>\n" +
		*/
		"</div>";
	var windowsManagerWindow = $("#windowsManager");
	windowsManagerWindow.append(windowInfomationHTML);
	console.log(title, id);
}

function _minimize(window, comeFrom) {
	changePosition = "True";
	/*window.stopPropagation();*/
	if (!comeFrom) {
		/*FROM WINMGR*/
		/*$(window).parent().parent().parent().parent().hide();*/
		var mWindow = $(window).parent().parent().parent().parent();
		var mBar = $("#_menubar" + mWindow.attr("id").substring(7));
	} else {
		/*FROM WINDOW*/
		var mBar = $(window);
		var mWindow = $("#_window" + mBar.attr("id").substring(8));
	}

	if (mWindow.is(":hidden")) {
		mWindow.show();
		mBar.css("color", "black");
		/*隐藏时*/
	} else {
		mWindow.hide();
		mBar.css("color", "red");
		/*显示时*/
	}
}

function _close(window, comeFrom) {
	if (!comeFrom) {
		var mWindow = $(window).parent().parent().parent().parent();
		var mId = mWindow.attr("id").substring(7);
		var mBar = $("#_menubar" + mId);
	} else {
		var mBar = $(window).parent();
		var mId = mBar.attr("id").substring(8);
		var mWindow = $("#_window" + mId);
	}
	if ((~~mId + 1) in onCloseFunction) onCloseFunction[mId - 0 + 1]();
	mWindow.remove();
	mBar.remove();
}

function _maximize(window, comeFrom) {
	var mWindow = $(window).parent().parent().parent().parent();
	var mId = mWindow.attr("id").substring(7);
	var mBar = $("#_menubar" + mId);
	if (mWindow.attr("maximized") !== "True") {
		mWindow
			.attr("styleBefore", mWindow.attr("style"))
			.attr("maximized", "True")
			.css("height", "100%")
			.css("width", "calc(100% - 240px)")
			.css("left", "240px")
			.css("top", "0px");
	} else {
		mWindow
			.attr("style", mWindow.attr("styleBefore"))
			.attr("maximized", "False");
	}

}

function mConfirm(buttonList, title, text, sizeXY, parameters) {
	/*
	buttonList={
		"yes": function(){}
		"no": function(){}
	}
	*/
	this.title = title || basicFunction.getInterfaceText("confirm?");
	this.text = text || basicFunction.getInterfaceText("question?");
	this.sizeXY = sizeXY || [320, 240];
	this.parameters = (
		parameters || [
			["size", [
				[17, "em"],
				[6, "em"]
			]],
		]
	);
	this.mWindow = null;
	this.buttonList = buttonList || [buttonList];
}
mConfirm.prototype.close = function () {
	this.mWindow.close();
	return this;
}
mConfirm.prototype.createWindow = function () {
	this.mWindow = new mWindow(
		this.title,
		(
			new createHtml()
			.setTagName("div")
			.addText(
				new createHtml()
				.setTagName("p")
				.addText(
					new createHtml()
					.setTagName("div")
					.addText(this.text)
					.setAttribute(
						"style",
						new createCss()
						.add(
							new createCssCommand()
							.setAttribute("text-align")
							.addKey("center")
						)
					)
				)
			)
			.addText(
				(
					(
						function (buttonList) {
							var res = [];
							for (
								var i = 0; i < (keys = Object.keys(buttonList)).length; i++
							) {
								res.push(
									new createButton()
									.setText(keys[i])
									.setFunction(
										(
											function (i, j) {
												return (
													function () {
														buttonList[keys[i]](j)
													}
												)
											}
										)
										(
											i,
											(
												function () {
													return (
														queryWindowBuffer.pop()
													)
												}
											)
										)
									)
									.toString()
								);
							}
							return res.join();
						}
					)
					(this.buttonList)
				)
			)
			.toString()
		),
		this.sizeXY,
		this.parameters
	)
	this.mWindow.createWindow();
	queryWindowBuffer.push(this.mWindow);
	return this;
}

function mWindow(title, text, sizeXY, parameters) {
	this.title = title;
	this.text = text;
	this.sizeXY = sizeXY;
	this.parameters = parameters;
	this.windows = null;
	this.id = 0;
}
mWindow.prototype.createWindow = function () {
	newWindow(this.title, this.text, this.sizeXY, this.parameters);
	this.id = windowsNumber - 1;
	if ((~~this.id + 1) in onStartFunction) onStartFunction[this.id - 0 + 1]();
	this.windows = $("#_window" + this.id);
};
mWindow.prototype.pushElement = function () {
	pushElementToNewWindow(this.title, this.text, this.sizeXY,
		this.parameters);
};
mWindow.prototype.close = function () {
	this.windows.remove();
};
mWindow.prototype.changeTitle = function (title) {
	this.title = title;
	this.windows.children(".__window").children("._titleBar")
		.children("._title").
	html(this.title);
};
mWindow.prototype.changeText = function (text) {
	this.text = text;
	this.windows.children(".__window").children("._contents").html(this.text);
};
mWindow.prototype.changeSize = function (size) {
	this.sizeXY = size;
	/**/
};
mWindow.prototype.getTitle = function () {
	return this.title;
};
mWindow.prototype.getText = function () {
	return this.text;
};
mWindow.prototype.getSize = function () {
	return this.sizeXY;
};
mWindow.prototype.getId = function () {
	return this.id;
};
mWindow.prototype.getWindow = function () {
	return this.windows;
}

function stringize(object) {
	if (typeof object !== "string") {
		try {
			return object.toString();
		} catch (error) {
			console.log("ERROR:", object, error);
		}
	} else {
		return object;
	}
}

function parseINIString(d) {
	var res = {}
	d = d.split("\r\n");
	var group = "";
	var t = [];
	for (var i = 0; i < d.length; i++) {
		if (d[i].charAt(0) === "[") {
			group = d[i].substring(1, d[i].length - 1);
			res[group] = {};
		} else if (d[i].charAt(0) !== ";") {
			t = d[i].split("=");
			res[group][t[0]] = t[1];
		} else {}
	}
	return res;
}

function parseTSVString(d) {
	var res = [];
	var singleRow;
	d = d.split("\r\n");
	var commit = false;
	for (var i = 0; i < d.length; i++) {
		commit = d[i].charAt(0) === "-";
		if (typeof singleRow !== "undefined" && !commit) {
			singleRow = d[i].split("\t");
			res.push(singleRow);
		} else {
			if (commit) {
				singleRow = null;
			}
		}
	}
	return res;
}

function uitextHandle(uitext) {
	uitext = 处理界面脚本(uitext);
	//var res="<pre style='height:561px;overflow-y:scroll'>"+JSON.stringify(JSON.parse(JSON.stringify(uitext)), null, 2)+"</pre>";
	//res = uitext;
	//res.add(uitext);
	var res = uitext;
	
	return res;
}

function sjsHandle(s, userVariable, debuging) {
	var metaINIHandle = function (ini) {
		var applicationPath = userVariable["APPLICATION-PATH"];
		ini = synchroGetFile(applicationPath + ini.toUpperCase());
		ini = parseINIString(ini);
		var languageFileList = ini.LANG;
		var javascriptFileList = ini.JS;
		var languageFileListKeys = Object.keys(languageFileList);
		var javascriptFileListKeys = Object.keys(javascriptFileList);
		var singleLanguageFile;
		var res = new stringBuffer();
		//console.log(languageFileList, ini)
		for (var i = 0; i < languageFileListKeys.length; i++) {
			singleLanguageFile = parseINIString(synchroGetFile(applicationPath +
				languageFileList[languageFileListKeys[i]]));
			basicFunction.addDictionary(singleLanguageFile);
		}
		if (javascriptFileList) {
			for (var i = 0; i < javascriptFileListKeys.length; i++) {
				res.add("/*BEGIN->" +
					javascriptFileList[javascriptFileListKeys[i]] + "*/\n\r");
				res.add(synchroGetFile(applicationPath +
					javascriptFileList[javascriptFileListKeys[i]]));
				res.add("/*<-END*/");
			}
		}
		res.add("\n");
		return res.toString();
	}
	var htmlHandle = function (html) {
		return html
			.replace(
				/~>(.*)<~/g,
				function (match, pos, originalText) {
					return (userVariable[match.substring(2, match.length - 2)]);
				}
			)
			.replace(
				/~\[!([\w\W]*?)~\]/g,
				function (match, pos, originalText) {
					console.log(match);
					return "\"" + match.replace(/\\/g, "\\\\")
						.replace(/"/g, "\\\"")
						.replace(/[\n\r\t]/g, "")
						.replace(/~\[/g, "")
						.replace(/~\]/g, "") +
						"\"";
				}
			)
			.replace(
				/~\[([\w\W]*?)~\]/g,
				function (match, pos, originalText) {
					return "\"" + match.replace(/\\/g, "\\\\")
						.replace(/"/g, "\\\"")
						.replace(/[\n\r\t]/g, "")
						.replace(/~\[/g, "")
						.replace(/~\]/g, "") +
						"\"";
				}
			)
	}
	var jsHandle = function (js) {
		js = htmlHandle(js);
		js = js
			/*.replace(/\r\n/g, ";\r\n")
			.replace(/(;){2,}/g, ";\r\n")
			.replace(/([\{\}\[\]\(\),]);/g,"$1")*/
			.replace(
				/@WITH>(.*?)</g,
				function (match, pos, originalText) {
					match = match.substring(6, match.length - 1);
					return metaINIHandle(match);
				}
			)
			.replace(
				/@GET>(.*?)</g,
				"SYNCHRO-GET-FILE[@<APPLICATION-PATH>+UPPER-CASE[\"$1\"]]"
			)
			.replace(
				/@<(.*?)>/g,
				function (match, pos, originalText) {
					match = match.substring(2, match.length - 1);
					//console.log(match,userVariable[match]);
					globalFunctions[match] = userVariable[match];
					return "GLOBAL-FUNCTIONS|[UPPER-CASE[\"" + match +
						"\", 1]]|";
				}
			)
			.replace(
				/\^<(.*?)>/g,
				"GLOBAL-S-J-S-FUNCTIONS|[\"$1\"]| "
			)
			.replace(
				/<JS\?!(.*?)\?JS>/g,
				"RUN-SELFDEFINED-FUNCTION[\"$1\", THIS]"
			)
			.replace(
				/<JS\?(.*?)\?JS>/g,
				"RUN-SELFDEFINED-FUNCTION[@HTML-QUOTE@$1@HTML-QUOTE@, THIS]"
			)
			.replace(
				/<TEXT\?(.*?)\?TEXT>/g,
				"\" + $1 + \""
			)
			.replace(
				/<CSS\?(.*?)\?CSS>/g,
				function (match, pos, originalText) {
					return match.replace(/-/g, "--");
				}
			)
			.replace(
				/<LANG\?!(.*?)\?LANG>/g,
				"\" +GLOBAL-FUNCTIONS|[UPPER-CASE[\"BASIC-FUNCTION\", 1]]|.GET-INTERFACE-TEXT[$1]+ \""
			)
			.replace(
				/<LANG\?(.*?)\?LANG>/g,
				function (match, pos, originalText) {
					match = match.substring(6, match.length - 6);
					return userVariable["BASIC-FUNCTION"]
						.getInterfaceText(match);
				}
			)
			.replace(/REM/g, "//")
			.replace(/ OR /g, " || ")
			.replace(/ NOT /g, " !")
			.replace(/ AND /g, " && ")
			.replace(/ NOT EQUALS /g, " != ")
			.replace(/ EQUALS /g, " === ")
			.replace(/ IS /g, " = ")
			.replace(/\[/g, "(")
			.replace(/\]/g, ")")
			.replace(/\|\(/g, "[")
			.replace(/\)\|/g, "]")
			.replace(/BEGIN/g, "{")
			.replace(
				/SET ANONYMOUS-FUNCTION WITH NONE IN/g,
				"function (){"
			)
			.replace(
				/SET ANONYMOUS-FUNCTION WITH (.*?) IN/g,
				"function ($1){"
			)
			.replace(
				/SET (.*?) AS FUNCTION WITH NONE IN/g,
				"SET $1 AS function (){"
			)
			.replace(
				/SET (.*?) AS FUNCTION WITH (.*?) IN/g,
				"SET $1 AS function ($2){"
			)
			.replace(
				/FOR (?:SET )*(.*?) (?:IS|AS) (.*?) TO (.*?) STEP(.*?)\r/g,
				/*"$1/$2/$3/$4/$5"//*/
				"for(var $1=$2;$1<$3;$1+=$4){"
			)
			.replace(
				/FOR (?:SET )*(.*?) (?:IS|AS) (.*?) TO (.*?)\r/g,
				/*"$1/$2/$3/$4/$5"//*/
				"for(var $1=$2;$1<$3;$1++){"
			)
			.replace(
				/IF (.*?) THEN/g,
				"if($1){"
			)
			.replace(
				/ELSE /g,
				"}else{"
			)
			.replace(
				/END ANONYMOUS-FUNCTION WITH (.*?) IN\r/g,
				"}($1)"
			)
			.replace(
				/END (.*?)\r/g,
				"}"
			)
			.replace(
				/NEXT\r/g,
				"}"
			)
			.replace(
				/ELSE\r/g,
				"}else{"
			)
			.replace(
				/SET (.*?) AS/g,
				"var $1 = "
			)
			.toLowerCase()
			.replace(
				/-[a-z|-]/g,
				function (match, pos, originalText) {
					return match.toUpperCase().charAt(1);
				}
			)
			.replace(
				/<css\?(.*?)\?css>/g,
				function (match, pos, originalText) {
					match = match.substring(5, match.length - 5)
					return match.replace(/-/g, "-");
				}
			)
			.parse(
				function (str) {
					for (var i in SJSUserDefinedSignConvertTable) {
						str = str.replace(
							new RegExp(
								("@" + i + "@"),
								"g"
							),
							SJSUserDefinedSignConvertTable[i]
						);
					}
					return str;
				}
			);
		//console.log(js);
		return js;
	}
	var ss = s;
	s = [s.match(/\[([\w\W]*?)\]/)[0]];
	s.push(ss.substring(s[0].length).split("->")[0]);
	s.push(ss.substring(s[1].length + s[0].length).match(/->([\w\W]*?)<-/g));
	s[1] = jsHandle(s[1]);
	if (s[2]) {
		s[2] = s[2].map(jsHandle);
		s[2] = s[2].map(
			function (js) {
				js = js.substring(4, js.length - 2);
				var exportFunctions = js.match(/@export<(.*?)>/)[1];
				js += "\r\n" + exportFunctions.indexOf(",") === -1 ? "[" +
					exportFunctions + "]" : exportFunctions;
				res = js;
				//console.log(js);
				exportFunctions = exportFunctions.split(",");
				try {
					var functionList = eval(js);
				} catch (error) {
					console.log("ERROR:", js);
				}
				for (var i = 0; i < functionList.length; i++) {
					globalSJSFunctions[exportFunctions[i]] = !functionList ?
						functionList[i] : functionList;
				}
				return res;
			}
		)
	}

	if (debuging) {
		res = new stringBuffer();
		res.add(s[0]);
		res.add("\n------------------------------------------------\n");
		res.add(s[1]);
		res.add("\n------------------------------------------------\n");
		res.add(s[2]);
		//console.log(s);
	}
	//console.log(s);
	return s;
}

function upperCase(text, mode) {
	if (!mode) {
		return text.toUpperCase();
	} else {
		return text.replace(/([A-Z])/g, "-$1").toUpperCase();
	}
}

function runSelfdefinedFunction(jsfunc, mthis) {
	jsfunc = jsfunc.split("(");
	jsfunc[1] = jsfunc[1].substring(0, jsfunc[1].length - 1);
	if (jsfunc[1] === "this") {
		globalLsThis = mthis;
		jsfunc[1] = "globalLsThis";
	}
	eval(
		"globalSJSFunctions[\"" + jsfunc[0].substring(0, jsfunc[0].length - 1) +
		"\"](" + jsfunc[1] + ")"
	);
}

function htmlEscape(text) {
	return text.replace(/[<>"&]/g, function (match, pos, originalText) {
		switch (match) {
			case "<":
				return "&lt;";
			case ">":
				return "&gt;";
			case "&":
				return "&amp;";
			case "\"":
				return "&quot;";
		}
	});
}

function insertAtCaret(area, text) {
	//console.log(area, "\n", text);
	var txtarea = area;
	if (!txtarea) {
		return;
	}

	var scrollPos = txtarea.scrollTop;
	var strPos = 0;
	var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ?
		"ff" : (document.selection ? "ie" : false));
	if (br == "ie") {
		txtarea.focus();
		var range = document.selection.createRange();
		range.moveStart('character', -txtarea.value.length);
		strPos = range.text.length;
	} else if (br == "ff") {
		strPos = txtarea.selectionStart;
	}

	var front = (txtarea.value).substring(0, strPos);
	var back = (txtarea.value).substring(strPos, txtarea.value.length);
	txtarea.value = front + text + back;
	strPos = strPos + text.length;
	if (br == "ie") {
		txtarea.focus();
		var ieRange = document.selection.createRange();
		ieRange.moveStart('character', -txtarea.value.length);
		ieRange.moveStart('character', strPos);
		ieRange.moveEnd('character', 0);
		ieRange.select();
	} else if (br == "ff") {
		txtarea.selectionStart = strPos;
		txtarea.selectionEnd = strPos;
		txtarea.focus();
	}

	txtarea.scrollTop = scrollPos;
}

function stringBuffer() {
	this.text = [];
	this.length = 0;
}
stringBuffer.prototype.add = function (string) {
	if (!string) {
		return this;
	}
	this.text.push(string);
	this.length += string.length;
	return this;
}
stringBuffer.prototype.toString = function () {
	return this.text.join("");
}
stringBuffer.prototype.getLength = function () {
	return this.length;
}
stringBuffer.prototype.clear = function () {
	this.text = [];
	this.length = 0;
	return this;
}
stringBuffer.prototype.添加 =function(字符串){
	this.add(字符串);
	return this;
}
stringBuffer.prototype.转为字符串 =function(){
	return this.toString();
	//return this;
}
stringBuffer.prototype.的长度 =function(){
	return this.getLength();
	//return this;
}
stringBuffer.prototype.清除 =function(){
	this.clear();
	return this;
}

const 字符串缓冲 = stringBuffer;

function createAttribute(attribute, value) {
	this.attribute = stringize(attribute);
	this.value = stringize(value);
}
createAttribute.prototype.toString = function () {
	var result = new stringBuffer();
	result
		.add(this.attribute)
		.add("=\"")
		.add(this.value)
		.add("\"");
	return result.toString();
}

function cssWithFunction() {
	this.functionName = "";
	this.functionParameters = [];
}
cssWithFunction.prototype.setFunctionName = function (functionName) {
	this.functionName = stringize(functionName);
	return this;
}
cssWithFunction.prototype.addFunctionParameters = function (parameter) {
	this.functionParameters.push(stringize(parameter));
	return this;
}
cssWithFunction.prototype.toString = function () {
	var result = new stringBuffer();
	return (
		result
		.add(this.functionName)
		.add("(")
		.add(
			function (functionParameters) {
				var result = new stringBuffer();
				for (var i = 0; i < functionParameters.length; i++) {
					result
						.add(" ")
						.add(functionParameters[i]);
				}
				result.add(" ");
				return result.toString();
			}
			(
				this.functionParameters
			)
		)
		.add(")")
		.toString()
	);
}

function createCss() {
	this.cssList = [];
}
createCss.prototype.add = function (css) {
	this.cssList.push(stringize(css));
	return this;
}
createCss.prototype.toString = function () {
	result = new stringBuffer();
	for (var i = 0; i < this.cssList.length; i++) {
		result
			.add(this.cssList[i])
			.add(";");
	}
	return result;
}

function createCssCommand() {
	this.attribute = "";
	this.keyList = [];
}
createCssCommand.prototype.setAttribute = function (attributeName) {
	this.attribute = stringize(attributeName);
	return this;
}
createCssCommand.prototype.addKey = function (key) {
	this.keyList.push(stringize(key));
	return this;
}
createCssCommand.prototype.toString = function () {
	return new stringBuffer()
		.add(this.attribute)
		.add(":")
		.add(
			function (keyList) {
				var result = new stringBuffer();
				for (var i = 0; i < keyList.length; i++) {
					result
						.add(keyList[i])
						.add(" ")
				}
				return result.toString();
			}
			(
				this.keyList
			)
		)
		.toString();
}

function createButton() {
	this.text = "";
	this.function = null;
}
createButton.prototype.setText = function (text) {
	this.text = text;
	return this;
}
createButton.prototype.setFunction = function (func) {
	this.function = func;
	return this;
}
createButton.prototype.toString = function () {
	return (
		new createHtml()
		.setTagName("div")
		.addText(this.text)
		.setAttribute(
			"class",
			new createClassName()
			.addClass("_window_button")
			.addClass("queryButton")
		)
		.setAttribute(
			new createOnClickFunction()
			.setFunction(this.function)
			.toString()
		)
	)
}

function createOnClickFunction() {

}
createOnClickFunction.prototype.setFunction = function (func) {
	onclickList.push(func);
	return this;
}
createOnClickFunction.prototype.toString = function () {
	return ["onclick", "onclickList[" + (onclickId++) + "]();"];
}

function createClassName() {
	this.classList = [];
}
createClassName.prototype.addClass = function (className) {
	this.classList.push(stringize(className));
	return this;
}
createClassName.prototype.toString = function () {
	result = new stringBuffer();
	for (var i = 0; i < this.classList.length; i++) {
		result.add(this.classList[i]);
		result.add(" ");
	}
	return result.toString();
}

function createHtml() {
	this.html = new stringBuffer();
	this.tagName = "";
	this.attributeList = [];
	this.text = [];
}
createHtml.prototype.setTagName = function (tagName) {
	this.tagName = stringize(tagName);
	return this;
}
createHtml.prototype.setAttribute = function (attribute, value) {
	if (typeof attribute != "string") {
		value = attribute[1];
		attribute = attribute[0];
	}
	this.attributeList.push(new createAttribute(stringize(attribute),
		stringize(value)));
	return this;
}
createHtml.prototype.addText = function (text) {
	this.text.push(stringize(text));
	return this;
}
createHtml.prototype.toString = function () {
	return (
		this.html
		.add("<")
		.add(this.tagName)
		.add(function (attributeList) {
				var result = new stringBuffer();
				for (var i = 0; i < attributeList.length; i++) {
					result
						.add(" ")
						.add(
							attributeList[i].toString()
						)
				}
				return result.toString();
			}
			(
				this.attributeList
			)
		)
		.add(">")
		.add(
			function (textList) {
				//console.log(textList)
				var result = new stringBuffer();
				for (var i = 0; i < textList.length; i++) {
					result
						.add(textList[i])
				}
				return result.toString();
			}
			(this.text)
		)
		.add("</")
		.add(this.tagName)
		.add(">")
		.toString()
	);
}

function returns(res) {
	return res;
}

function getRadioChecked(form) {
	inputList = form.children("input");
	for (var i = 0; i < inputList.length; i++) {
		if (inputList[i].checked) {
			return inputList[i];
		}
	}
}

function setRadioChecked(form, checkId) {
	inputList = form.children("input");
	console.log(inputList, checkId);
	for (var i = 0; i < inputList.length; i++) {
		if (inputList[i].id === checkId) {
			$(inputList[i]).attr("checked", "checked");
			return true;
		}
	}
	$(inputList[0]).attr("checked", "checked");
	return false;
}
function getQueryVariable(variable)
{
	   var query = window.location.search.substring(1);
	   var vars = query.split("&");
	   for (var i=0;i<vars.length;i++) {
			   var pair = vars[i].split("=");
			   if(pair[0] == variable){return pair[1];}
	   }
	   return(false);
}
function runRequestApp(){
	appName=getQueryVariable("app");
	if(appName){
		new AddWindow(appName);
	}
}
$(document).ready(function () {
	/*$("body").html("<div style='background-color:white; overflow-y:scroll;over
	flow-x:visible;height:800px;font-family:\"New Batang\"!important;white-space
	: pre-wrap;word-wrap: break-word;'><pre style='font-family:\"New Batang\"!im
	portant'>" +
		htmlEscape(sjsHandle(synchroGetFile("DTA/APP/KEYBOARD/KEYBRD.SJS"), {"WI
		NDOWS-NUMBER":windowsNumber+123,"BASIC-FUNCTION":basicFunction})) +
		"</pre></div>"
	);*/
	//return
	//isMobileDevice = document.body.clientWidth <= (document.body.clientHeight
	//|| document.documentElement.clientHeight);
	/*假设竖屏的都是手机*/
	if (isMobileDevice) {
		$("#mainCss").attr("href", "CSS/Window/Mobile.css")
	}
	$(document).mousemove(function (e) {
		/*$("span").text(e.pageX + ", " + e.pageY);*/
		if (isMoving) moveing(windowNow, [e.pageX, e.pageY]);
		if (isZooming) moveing(windowNow, [e.pageX, e.pageY]);
	});

	var windowsManager =
		new mWindow(
			"<span id=\"username\"></span>",
			"<div id=\"windowsManager\"></div>",
			[240, 640],
			[
				["uncloseable"],
				["unminimizeable"],
				["unmaximumable"],
				["unmoveable"],
				["unzoomable"],
				(
					isMobileDevice ? ["alwaysOnTheTop"] : ["alwaysOnTheBottom"]
				),
				["position", [
					[0, "px"],
					[0, "px"]
				]],
				["size", [
					[240, "px"],
					[97, "%"]
				]],
				["noShadow"],
				["onStart",
					(
						isMobileDevice ?
						function () {
							var newWindowsManagerOpenCloseButton = new mWindow(
								"",
								(
									new createHtml()
									.setTagName("div")
									.setAttribute(
										"class",
										new createClassName()
										.addClass("showManager")
										.addClass("noneSelect")
									)
									.setAttribute(
										new createOnClickFunction()
										.setFunction(
											function () {
												var mWindow = $("#_window0");
												if (mWindow.is(":hidden")) {
													mWindow.show();
												} else {
													mWindow.hide();
												}
											}
										)
										.toString()
									)
									.addText("<")
									.toString()
								),
								[16, 16],
								[
									["uncloseable"],
									["unminimizeable"],
									["unmoveable"],
									["unzoomable"],
									["notitle"],
									["alwaysOnTheTop"],
									["position", [
										[0, "px"],
										[0, "px"]
									]],
									["size", [
										[0, "em"],
										[8, "em"]
									]],
									["noShadow"]
								]
							)
							newWindowsManagerOpenCloseButton.createWindow();
						} :
						function () {}
					)
				]
			]
		);
	windowsManager.createWindow();
	$("#_menubar1").remove();
	windowList = [];
	/*var addWindows=new mWindow("New!!","<button onclick=\"windowList.push(new
		mWindow('Title','Text',[320,240]).createWindow())\">Click me!</button>",
		[320,240]);
	addWindows.createWindow();*/
	//idsInit();
	uiOnload();
	测试代码();
	runRequestApp()

});
/*
console.log(
	new createHtml()
	.setTagName("div")
	.addText(
		new createHtml()
		.setTagName("div")
		.addText("e")
		.setAttribute(
			"style",
			new createCss()
			.add(
				new createCssCommand()
				.setAttribute("border")
				.addKey("1px")
				.addKey("solid")
				.addKey("black")
			)

			.add(
				new createCssCommand()
				.setAttribute("width")
				.addKey(
					new cssWithFunction()
					.setFunctionName("calc")
					.addFunctionParameters("100px")
					.addFunctionParameters("+")
					.addFunctionParameters("15%")
				)
			)
		)
		.setAttribute("class", "test")
	)
	.setAttribute("id", "test")
	.setAttribute("class", "test")
	.toString()
)*/