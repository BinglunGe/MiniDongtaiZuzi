var basicFunction = new BasicFunctions();
var api = null;
var isLogin = false;
var settingJson = {
	"language": "",
	"user": {
		"loginStatus": ["Login Status", "html", "<div class=\"isLogin\"></div>"],
		"username": ["Username", "text", "guest"],
		"password": ["Password", "text", "guest"],
		"email": ["E-MAIL", "text", "guest@guest.guest"],
		"tel": ["TEL", "text", "48378"],
	},
	"ids": {
		"scanStep": ["Scan Step", "number", 1, "px"],
		"minimumBoldSize": ["Minimum Bold Size", "number", 16, "px"],
		"idsFont": ["IDS Font", "text", "SimSun"],
		"idsFontSize": ["IDS Font Size", "number", 72, "px"]
	}
};
var originalSettingJson=JSON.parse(JSON.stringify(settingJson));
var flashLed = undefined;
var iframeNo = 0;
var mDataType = "text";
var mContentType = "text/plain";

function synchroGetFile(url, isPHP, showUrl) {
	if (showUrl) {
		console.log(url);
	}
	let content=isPHP?
	(
		$.ajax({
			url: url,
			async: false,
			error: function (xhr) {
				alert("ERROR: " + xhr.status + " " + xhr.statusText);
			},
			datatype: mDataType
		}).responseText
	):(
		$.ajax({
			url: "PHP/getFile.php",//url,
			method: "POST",
			data:{
				PATH: url
			},
			async: false,
			error: function (xhr) {
				alert("ERROR: " + xhr.status + " " + xhr.statusText);
			},
			datatype: mDataType
		}).responseText
	);
	//console.log(content, "\n<<<", url);
	return content;
}

var 同步获取文件=synchroGetFile;

function BasicFunctions() {
	this.convertTable = {
		"HESHENGJIANZI": synchroGetFile("DTA/RM-RUL/GHHSJZ.RUL")
	};
	this.applicationList = parseTSVString(synchroGetFile("DTA/APP/APPLST.TSV"));
	this.interfaceDictionary = (
		function (obj) {
			res = {};
			for (var i in obj) {
				res[i] = {};
				for (var j in obj[i]) {
					res[i.toUpperCase()][j.toUpperCase()] = obj[i][j];
				}
			}
			//console.log(res);
			return res;
		}
	)(parseINIString(synchroGetFile("DTA/LANG/LANG.INI")));
	this.nowLanguage = "EN";
	this.nowLanguage = (
		function () {
			if ($.cookie("LANG")) return $.cookie("LANG");
			var systemLanguage = "EN";
			switch ((navigator.browserLanguage || navigator.language)
				.toLowerCase()) {
				case "zh-cn":
					systemLanguage = "CHS";
					break;
				case "zh-tw":
					systemLanguage = "CHT";
					break;
				case "zh-hk":
					systemLanguage = "CHT";
					break;
				case "zh-mo":
					systemLanguage = "CHT";
					break;
				case "ja-jp":
					systemLanguage = "JA";
					break;
				default:
					systemLanguage = "EN";
			}
			return systemLanguage;
		}
	)();
}
BasicFunctions.prototype.addDictionary = function (obj) {
	for (var i in obj) {
		for(var j in obj[i]){
			this.interfaceDictionary[i][j.toUpperCase()]=obj[i][j];
		}
	}
	//console.log(res);
	return;
}
BasicFunctions.prototype.getInterfaceText = function (textInEnglish) {
	var res = this.interfaceDictionary[this.nowLanguage][textInEnglish.toUpperCase()];
	return res ? (this.nowLanguage==="EN"?res.toUpperCase():res) : textInEnglish;
};

function GraphicInterface() {
	this.basicFunctions = basicFunction;
	var startWindowHtml = [];
	for (var i = 0; i < this.basicFunctions.applicationList.length; i++) {
		startWindowHtml.push(
			"<div class='iconOfApplication' onclick='new AddWindow(\"" + this.basicFunctions.applicationList[i][1] + "\")'><div class='iconOfApplicationUpIcon'><img src='DTA/APP/" + this.basicFunctions.applicationList[i][2] + "/" + this.basicFunctions.applicationList[i][2] + ".PNG'></div><div class='iconOfApplicationDownText'>" + this.basicFunctions.getInterfaceText(this.basicFunctions.applicationList[i][0]) + "</div></div>"
		);
	}
	var StartWindow = new mWindow(this.basicFunctions.getInterfaceText("Start"),
		startWindowHtml.join(""), [320, 240], [
			["uncloseable"],
			["unminimizeable"],
			["unmaximumable"]
		]);
	StartWindow.createWindow();
}

function AddWindow(windowName) {
	this.basicFunctions = basicFunction;
	this.newApplicationWindow(windowName);
	/*switch (windowName) {
		case "Setting":
			this.openSettingWindow();
			break;
		case "Convert":
			this.openConvertWindow();
			break;
		case "Clock":
			this.openClockWindow();
			break;
		case "IDS":
			this.openIDSWindow();
			break;
		case "Hanzi":
			this.openHanziWindow();
			break;
	}*/
	return;
}
AddWindow.prototype.newApplicationWindow = function (windowName) {
	var applicationInfomation = (
		function (windowName) {
			for (var i = 0; i < this.basicFunctions.applicationList.length; i++) {
				if (this.basicFunctions.applicationList[i][0] === windowName) {
					return this.basicFunctions.applicationList[i];
				}
			}
		}
	)(windowName);
	console.log(windowName);
	/*console.log(applicationInfomation, this.basicFunctions.applicationList,
	windowName)*/
	$.ajax({
		url: "PHP/getFile.php",//url,
		method: "POST",
		data:{
				PATH: "DTA/APP/" + applicationInfomation[2] + "/" +
				applicationInfomation[2] + ".SJS"
		},
		success: function (result) {
			var sjs = sjsHandle(
				result, {
					"WINDOWS-NUMBER": windowsNumber,
					"BASIC-FUNCTION": basicFunction,
					"APPLICATION-PATH": (
						"DTA/APP/" + applicationInfomation[2] + "/"
					)
				}
			);
			console.log(sjs[1]);
			//console.log(sjs[2][0]);
			/*console.log(sjs[2][1]);*/
			try {
				eval(sjs[1]);
			} catch (e) {
				console.log(e);
			}
			//console.log(sjsHandle(result, {"WINDOWS-NUMBER":windowsNumber,
			//"BASIC-FUNCTION":basicFunction}));
		},
		error: function (xhr) {
			alert("ERROR: " + xhr.status + " " + xhr.statusText);
		},
		dataType: mDataType
	})
}
AddWindow.prototype.openSettingWindow = function () {
	var languagesList = Object.keys(this.basicFunctions.interfaceDictionary);
	var languagesListHtml = "";
	for (var language in languagesList) {
		console.log(languagesList);
		languagesListHtml += "<div class='_window_button' style='padding: 4px;' onclick='changeLanguageTo(\"" + languagesList[language] + "\")'>" +
			this.basicFunctions.getInterfaceText(languagesList[language]) + "</div><br/>";
	}
	var settingWindow = new mWindow(
		this.basicFunctions.getInterfaceText("Setting"),
		languagesListHtml,
		[240, 320]
	);
	settingWindow.createWindow();
};

function changeLanguageTo(language) {
	$.cookie('LANG', language, {
		expires: 7,
		path: '/'
	});
	location.reload();
}

function webSiteApi() {
	this.username = $.cookie("USERNAME") || settingJson.user.username[2];
	this.password = $.cookie("PASSWORD") || settingJson.user.password[2];
	this.user = null;
	this.setting = null;
	this.loadSubfunction = function () {
		this.user = new webUser(this.username, this.password);
		this.setting = new webSetting(this.username, this.password);
	}
	this.loadSubfunction();
}
webSiteApi.prototype.changeUsername = function (username) {
	this.username = username;
	$.cookie("USERNAME", username);
	this.loadSubfunction();
}
webSiteApi.prototype.changePassword = function (password) {
	this.password = password;
	$.cookie("PASSWORD", password);
	this.loadSubfunction();
}

function webSetting(username, password) {
	this.username = username;
	this.password = password;
}
webSetting.prototype.addSetting = function (name, json) {
	/*PHP/SETTING/addSetting.php?
		用户名	=葛炳仑&
		密码	=md5(用户名+密码)&
		设置名	=仿宋&
		内容	={json}*/
		
	console.log(settingJson);
	return synchroGetFile(
		"PHP/SETTING/addSetting.php" +
		("?用户名=" + this.username || "") +
		("&密码=" + md5("Hanzi" + md5(this.username) + md5(this.password)) || "") +
		("&设置名=" + name || "") +
		("&内容=" + window.btoa(JSON.stringify(settingJson)) || "")
		, true
	)
}
webSetting.prototype.getSetting = function (name) {
	/*PHP/SETTING/getSetting.php?
			用户名	=葛炳仑&
			设置名	=仿宋*/
	//settingJson = ((mjson=(((lsjson = ((function(un,n){try {return(JSON.parse(window.atob((function (jsons) {console.log(jsons);return jsons;})(jg=(synchroGetFile("PHP/SETTING/getSetting.php" + ("?用户名=" + un || "") + ("&设置名=" + n || ""), 1))))));} catch (e) {console.log(e, jg);return {w:1}}})(this.username, name))).user) ? lsjson : (((function () {console.log("WRONG:\t", window.atob(lsjson));return;})()) || settingJson)))?mjson:settingJson);
	msettingJson=synchroGetFile("PHP/SETTING/getSetting.php" + ("?用户名=" + this.username || "") + ("&设置名=" + name || ""), true);
	if(msettingJson){
		settingJson=window.atob(msettingJson);
		settingJson=JSON.parse(settingJson);
		console.log(settingJson);
	}else{
		console.log("尚无配置文件！");
	}
	if (settingJson.language)basicFunction.nowLanguage=settingJson.language;
	settingJson.user.loginStatus=["Login Status", "html", "<div class=\"isLogin\"></div>"];
	return;
}

function webUser(username, password) {
	this.username = username;
	this.password = password;
}
webUser.prototype.newUser = function (email, phone, change, newPassword) {
	/*PHP/USER/addUser.php?
		用户名	=葛炳仑&
		密码	=md5(用户名+密码)&
		新密码	=md5(用户名+新密码)&
		手机	=008613154293565&
		邮箱	=2041461362@qq.com
		[更改=更改]*/
	if (!change) {
		return synchroGetFile(
			"PHP/USER/addUser.php" +
			("?用户名=" + this.username || "") +
			("&密码=" + md5("Hanzi" + md5(this.username) + md5(this.password)) || "") +
			("&手机=" + phone || "") +
			("&邮箱=" + email || ""), true
		);
	} else {
		return synchroGetFile(
			"PHP/USER/addUser.php" +
			("?用户名=" + this.username || "") +
			("&密码=" + md5("Hanzi" + md5(this.username) + md5(this.password)) || "") +
			("&新密码=" + md5("Hanzi" + md5(this.username) + md5(newPassword)) || "") +
			("&手机=" + phone || "") +
			("&邮箱=" + email || "") +
			("&更改=更改"), true
		);
	}

}

webUser.prototype.login = function () {
	/*/PHP/USER/getUser.php?
		用户名=葛炳仑&
		密码=md5(用户名+密码)*/
	if (
		synchroGetFile(
			"PHP/USER/getUser.php" +
			"?用户名=" + this.username +
			"&密码=" + md5("Hanzi" + md5(this.username) + md5(this.password))
			, true
		) === "有"
	) {
		return true;
	} else {
		return false;
	}
}
function newUserOrLogin(){
	/*var loginWindow=new mWindow(
		"LOGIN",
		"",
		[320, 240],
		[
			["size", [
				[17, "em"],
				[6, "em"]
			]],
		]
	)*/
	return;
}
function uiOnload() {
	api = new webSiteApi();
	isLogin = api.user.login();
	if(isLogin||api.username!=="guest"){
		console.log(api.username, api.password);
	}else{
		newUserOrLogin();
	}
	$("#username").text(api.username);
	api.setting.getSetting("main");
	GraphicInterface();
}