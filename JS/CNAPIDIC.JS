/*             */
/*中文 API 转换*/
/*             */
const 真 = true;
const 假 = false;
const 空 = null;
const 未定义 = undefined;
const 不是数 = NaN;
const 排错中 = 真;
const 打印 = console.log;
const 警告 = console.warn;
const 解释 = eval;
const 无符号八位整型 = Uint8Array;
const 无符号十六位整型 = Uint16Array;
const 无符号三十二位整型 = Uint32Array;
const 类型的中文 = {
	未定义: "undefined",
	布尔: "boolean",
	字符串: "string",
	数字: "number",
	对象: "object",
	函数: "function",
	数组: Array
}
String.prototype.存在 = String.prototype.pythonLikeIn;
String.prototype.含有 = String.prototype.存在;
String.prototype.分割 = String.prototype.split;
String.prototype.替换 = String.prototype.replace;
String.prototype.子字符串 = String.prototype.substring;
String.prototype.字符的索引 = String.prototype.indexOf;

RegExp.prototype.测试 = RegExp.prototype.test;
RegExp.prototype.存在 = RegExp.prototype.测试;
RegExp.prototype.被含有 = RegExp.prototype.测试;

//Object.prototype.含有 = Object.prototype.hasOwnProperty;

Array.prototype.取顶 = Array.prototype.pop;
Array.prototype.取底 = Array.prototype.shift;
Array.prototype.加入 = Array.prototype.join;
Array.prototype.推入 = Array.prototype.push;
Array.prototype.在后推入 = Array.prototype.push;
Array.prototype.在前推入 = Array.prototype.unshift;
Array.prototype.平坦推入 = Array.prototype.concat;
Array.prototype.连接 = Array.prototype.concat;
Array.prototype.切片 = Array.prototype.slice;
Array.prototype.遍历 = Array.prototype.map;
Array.prototype.高级切片 = function (范围) {
	//忽视步长和倒序
	//[开始:结尾][开始:][:结尾]
	let 开始, 结尾, 长度 = this.的长度();
	开始结尾 = 范围.分割(":");
	开始 = 开始结尾[0].转为数();
	结尾 = 开始结尾[1].转为数();
	if (开始 < 0) {
		开始 = 长度 + 开始;
	}
	if (结尾 < 0) {
		结尾 = 长度 + 结尾;
	}
	if (开始结尾[0] === "") {
		开始 = 0;
	}
	if (开始结尾[1] === "") {
		结尾 = 长度;
	}
	//打印(长度, 范围, 开始结尾, 开始, 结尾)
	return this.切片(开始, 结尾);
}
Array.prototype.的长度 = function () {
	return this.length;
}
Array.prototype.的第几个元素 = function (几) {
	return this[几];
}
Array.prototype.筛选 = function (筛选函数) {
	let 结果 = [];
	for (let i = 0; i < this.的长度(); i++) {
		if (筛选函数(this[i])) {
			结果.推入(this[i]);
		}
	}
	return 结果;

}

function 是数组(对象) {
	return Array.isArray(对象);
}
const 字位 = new GraphemeSplitter();
String.prototype.以字位分割 = function () {
	return 字位.splitGraphemes(this);
}
String.prototype.以字位迭代 = function () {
	let 结果 = 字位.iterateGraphemes(this);
	结果.的下一个 = 结果.next;
	return 结果;
}
String.prototype.以字位计数 = function () {
	return 字位.countGraphemes(this);
}
String.prototype.的第几个字 = function (几) {
	//以后添加Unicode优化
	return this.charAt(几);
}
String.prototype.是 = function (字) {
	return (this === 字);
}
String.prototype.的长度 = function () {
	return this.length;
}
String.prototype.转为数 = function (是整型) {
	//以后添加特殊格式优化	O
	if (是整型) {
		return parseInt(this);
	} else {
		return parseFloat(this);
	}

}
String.prototype.是不是数 = function () {
	if (
		/([*-]?\d+)([\./]\d+)?/.被含有(this)
	) {
		return 真;
	}
	return 假;
}
Number.prototype.转为字符串 = Number.prototype.toString;
Number.prototype.不大于 = function (数) {
	return this <= 数;
}
Number.prototype.大于 = function (数) {
	return this < 数;
}
Number.prototype.不小于 = function (数) {
	return this >= 数;
}
Number.prototype.小于 = function (数) {
	return this > 数;
}
Number.prototype.的几次方 = function (幂数) {
	return Math.pow(this, 幂数);
}
Number.prototype.的地板函数 = function (数) {
	return Math.floor(this, 数);
}
Number.prototype.是偶数 = function (数) {
	return this % 2 === 0;
}

function 含有(对象, 值) {
	if (typeof 对象 === 类型的中文.对象) {
		return 对象.hasOwnProperty(值);
	} else {
		//打印(对象, 值);
		return 假;
	}
}

function 如果(真假, 是真的话, 是假的话) {
	if (真假) {
		是真的话();
	} else {
		if (是假的话) {
			是假的话();
		}
	}
}

function 逻辑非(真假) {
	return !真假;
}

function 返回零() {
	return 0;
}
const 不 = 逻辑非;
const 没 = 逻辑非;

function 不但(真假) {
	this.的真假 = 真假;
}
不但.prototype.是真的话 = function () {
	return this.的真假;
}
不但.prototype.是假的话 = function () {
	return 逻辑非(this.的真假);
}
不但.prototype.而且 = function (真假) {
	this.的真假 = this.的真假 && 真假;
	return this;
}

function 深拷贝(输入对象 /*对象*/ ) {
	//return Object.assign({}, 对象);
	//return JSON.parse(JSON.stringify(对象));
	let 输出对象, 值, 键;
	if (typeof 输入对象 !== 类型的中文.对象 || 输入对象 === 空) {
		return 输入对象; //如果输入对象不是一个对象, 就返回其值
	}
	// 创建一个用来包含值的数组或对象
	输出对象 = 是数组(输入对象) ? [] : {};
	for (键 in 输入对象) {
		值 = 输入对象[键];
		// 对于包括数组的嵌套对象进行递归 (深) 拷贝
		输出对象[键] = 深拷贝(值);
	}
	return 输出对象
}

function 对象的键们(对象) {
	return Object.keys(对象);
}

function 对象的长度(对象) {
	return 对象的键们(对象).的长度();
}
/*
const 完成=假;
const 字符串="中文";
function 干活儿(){
	打印("干活儿了");
}
function 不干活儿(){
	打印("没干活儿")
}
如果(new 不但(没(完成)).而且(字符串.的长度().不大于(5)).是真的话(),那就=>
{干活儿();},否则就=>{不干活儿();});*/