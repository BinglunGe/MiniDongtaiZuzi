/*
IDC	FIN	ASC	PAR
⿰	O	||	2
⿱	O	==	2
⿲	O	|||	3
⿳	O	===	3
⿴	O	o	2
⿵	O	n	2
⿶	O	u	2
⿷	O	c	2
⿸	O	P	2
⿹	O	7	2
⿺	O	L	2
⿻	O	8	2
⿼	O	>	2
⿽	O	d	2
⿾	O	<->	1
⿿	O	->v	1
*/
/*
    好了。还有什么是需要做的呢？姑且先写在这里吧。
    想来，动态组字是今年四月初开始写的，五月初就写完了，之后就没怎么动。
    现在，关于计算文字包围盒部分的地方应该是不会出问题了吧，但是不保证真的一定不
会出问题。还得测试更多的字符啊，希望大家能发现了提醒我。
    但是，效率方面明显还是不太够啊。毕竟，现在的加粗问题太多了。可是，要更改加粗
部分代码，想来要花很长时间吧……大概。而且加粗之后形成的“长方形”看来也是不处理
不行的了。
    还有，现在对于参数的支持还是不太好。主要是，只对“⿻”起作用，别的还在拖。

    不过，二一年一月份一看，发现基本看不懂了……而且效果还是不行啊，以后干脆推倒
重来算了。
*/
console.time("timer");
var DEBUG=0;
var canvasNo = 0;
var thumbdivNo=0;
var mfont = '"Batang", "New Batang", "SimSun" ,"HYQiHei 25S", "楷体"';
var scanStep = 1; //px
var glyphWidth = 1;
var minimumBoldSize = 50;
var preHandle = true;
var atrKeyValueTable = {
    "W": "width",
    "H": "height",
    "PL": "left",
    "PT": "top",
    "C": "color",
    "F": "font-family"
}
var hengshu = [5, 10];
var hengshus = {};
var hanziMeasureCache = {};
var hanziGlyphCache={};
var thbDiv=null;
var handleNesting=true;
var changeBaoweiGlyph=!false;
var h2cFin=[0, 0];
var maxBushouWidth=80;
function doOnLoad(){
    $("body").append('<div class="add"><div class="hanziViewBox"><div class="hanziIds"></div><div class="hanziView"></div></div><div id="ThumbDiv"></div><canvas id="Thumb" width="255px" height="255px"></canvas>');
}
function idsInit() {
    thbDiv=$("#ThumbDiv");
    hengshu = [
        new glyphMeasure("一").getU2DL2R()[0],
        new glyphMeasure("丨").getU2DL2R()[1],
    ];
    if (preHandle) {
        handleWebPage();
    }
    handleIds();
    console.timeEnd("timer");
}

function handleWebPage(ls) {
    var idses = [];
    var idsTemp = [];
    var j, isIdc;
    var finishAIds = false;
    var beforeCharsNumber = 0;
    var inPara = false;
    var text = "";
    var tt = "";
    var mtext = "";
    var afterPara = [];
    if(!ls)var ls = ["h1", "p"];
    for (var x in ls) {
        text = $(ls[x]);
        for (var si = 0; si < text.length; si++) {
            mtext = $(text[si]);
            mtext.html(mtext.html().replace(/<ids>|<ids\/>/, ""));
            tt = mtext.html();
            for (var i = 0; i <= fixedArrayForm(tt).length; i++) {
                //⿰⿱⿲⿳⿴⿵⿶⿷⿸⿹⿺⿻
                j = fixedCharAt(tt, i);
                if (!beforeCharsNumber && finishAIds) {
                    afterPara.push(j);
                    if (j === "`") {
                        idses[idses.length - 1] += afterPara.join("").substr(1) + "</ids>";
                        finishAIds = false;
                    }
                    continue;
                }
                if (beforeCharsNumber && j === "`") {
                    if (inPara) {
                        inPara = false;
                        idsTemp.push(j);
                        continue;
                    }
                    inPara = true;
                }
                if (inPara) {
                    idsTemp.push(j);
                    //console.log(j);
                    continue;
                }
                isIdc = RegExp(/[⿰⿱⿲⿳⿴⿵⿶⿷⿸⿹⿺⿻⿼⿽⿾⿿!]/).test(j);
                if (beforeCharsNumber) {
                    beforeCharsNumber--;
                    if (!isIdc) {
                        idsTemp.push(j);
                    }
                } else {
                    if (idsTemp.length >= 2) {
                        if (j === "`") {
                            finishAIds = true;
                            afterPara = ["`"];
                            idses.push("<ids>" + idsTemp.join(""));
                        } else {
                            finishAIds = false;
                            idses.push("<ids>" + idsTemp.join("") + "</ids>");
                        }
                        if (!isIdc) {
                            idses.push(j);
                        }
                    } else {
                        if (!isIdc) {
                            idses.push(j);
                        }
                    }
                    idsTemp = [];

                }
                if (isIdc) {
                    if (RegExp(/[⿲⿳]/).test(j)) {
                        beforeCharsNumber += 3;
                        idsTemp.push(j);
                    } else if (RegExp(/[⿰⿱⿲⿳⿴⿵⿶⿷⿸⿹⿺⿻⿼⿽]/).test(j)) {
                        beforeCharsNumber += 2;
                        idsTemp.push(j);
                    } else if (RegExp(/[⿾⿿!]/).test(j)) {
                        beforeCharsNumber++;
                        idsTemp.push(j);
                    }
                }
            }
            mtext.html(idses.join(""));
            idses = [];
        }
    }
}

function handleIds(idsNo) {
    if (idsNo) {
        ids = $("#ids" + idsNo);
    } else {
        ids = $("ids");
    }
    var i, ip, msize, mtext;
    var before = canvasNo + 1;
    for (var j = 0; j < ids.length; j++) {
        i = $(ids[j]);
        if (!i.attr("handled")) {
            ip = i.parent();
            //msize = 255;
            msize=parseInt(ip.css("font-size"));
            mtext = i.text();
            mfont = ip.css("font-family");
            i.html(hanzi(mtext));
            i.children(".glyph")
                .css("width", msize)
                .css("height", msize)
                .attr("font", mfont)
                .attr("ids", mtext);
            i.attr("handled", "true");
            if (idsNo !== "View") {
                i.mouseleave(function () {
                    //debugger;
                    var mThis = $(".hanziViewBox");
                    mThis.css("display", "none");
                    //handleNesting=false;
                });
                i.mouseover(function () {
                    if(1||!handleNesting){
                        handleNesting=true;
                        //console.log(this);
                        var mThis = $(this);
                        var mGlyph = mThis.children(".glyph");
                        var hanziViewBox = $(".hanziViewBox");
                        var hanziView = $(".hanziView");
                        var hanziIds = $(".hanziIds");
                        hanziViewBox
                            .css(
                                "top",
                                mThis.offset().top + mThis.height()
                            )
                            .css(
                                "left",
                                (mThis.offset().left +
                                    255 <= $("body").width()
                                ) ?
                                mThis.offset().left +
                                mThis.width() :
                                $("body").width() - 255
                            )
                            .css("display", "block");
                        hanziView.html(
                            "<ids id='idsView'>" +
                            mGlyph.attr("ids") +
                            "</ids>"
                        )
                        hanziIds.html(mGlyph.attr("ids"));
                        hanziViewBox.css(
                            "font-family",
                            mGlyph.attr("font")
                        );
                        handleIds("View");
                    }
                });
            }
        }
    }
    var after = canvasNo;
    reFontSize([before, after]);
}

function reFontSize(cvn) {
    if (!cvn) {
        cvn = [1, canvasNo];
    }
    //调整Canvas大小。
    for (var j = cvn[0]; j <= cvn[1]; j++) {
        var i = $(".hanzi" + j);
        //i.css("font-size", i.width()>i.height()?i.height():i.width());
        //var ip=i.parent().children("img");
        var ip = i.parent();
        var hw = [
            ip.width(),
            ip.height(),
        ];
        i.css("top", "-" + hw[1] + "px");
        i.attr("width", hw[0]);
        i.attr("height", hw[1]);
        //var fontsize = $(".glyph").width();
        var addHengshu=[-1,-1];
        mfont = i.css("font-family");
        if (hengshus[mfont]) {
            hengshu = hengshus[mfont];
        } else {
            hengshu = [
                new glyphMeasure("一").getU2DL2R()[0],
                new glyphMeasure("丨").getU2DL2R()[1],
            ];
            hengshus[mfont] = hengshu;
        }
        //console.log(hengshu);
        //addHengshu=[2,2];
        var attrScale = ip.parent().attr("scale");
        var scale = [1, 1];
        if (attrScale) {
            scale = attrScale.split(",");
        }
        if (ip.css("float") === "left") {
            i.css("top", (parseInt(i.css("top")) / 2 + "px"));
            //i.css("top", i.css("top")-ip.height());
            //console.log(i.css("top"), ip.height());
            //console.log(parseInt(i.css("top")));
        }
        if (0) {
            addHengshu = [-1, -1];
        } else {
            //部件：（所求横高）=原字：横高
            //所求横高=部件*横高/原字
            //console.log(glyphDisplay, scale);
            
            addHengshu = [
                0 - hengshu[1] * (hw[0] / 255 - 1) / glyphWidth,
                0 - hengshu[0] * (hw[1] / 255 - 1) / glyphWidth,
            ];
            
            /*
            var addhengshu = [
                (fontsize / hw[0]) * hengshu[1] / glyphWidth,
                (fontsize / hw[1]) * hengshu[0] / glyphWidth,
            ];*/
        }
        try {
            var c = i[0].getContext("2d");
        } catch (e) {
            continue;
        }
        /*c.ImageSmoothingEnabled = false;*/
        //c.globalAlpha=0.2;
        c.background = ("rgba(255, 255, 255, 0)");
        var px = i.width() > i.height() ? i.height() : i.width();
        c.font = (px) + "px " + mfont + "";
        //c.font = (px) + "px " + i.css("font-family") + "";
        c.fillStyle = ip.css("color");
        c.textBaseline = "top";
        c.textAlign = "left";
        c.scale(i.width() / px * scale[0], i.height() / px * scale[1]);
        //缩放
        //console.log(glyphDisplay, hw, hengshu, addHengshu);
        var glyphDisplay = String.fromCodePoint(parseInt(i.attr("hanziCode"), 16));
        if ((hw[0] <= minimumBoldSize && hw[1] <= minimumBoldSize) || addHengshu[0] < 0) {
            c.fillText(glyphDisplay, 0, 0);
        } else {
            for (var i = 0; i <= addHengshu[0]; i++) {
                c.fillText(glyphDisplay, i / 2, 0);
            }
            for (var i = 0; i <= addHengshu[1]; i++) {
                c.fillText(glyphDisplay, 0, i / 2);
            }
        }
        //c.fillText(glyphDisplay, 0, 0);
        //c.fillText(String.fromCodePoint(parseInt(i.attr("hanziCode"), 16)),i.width()/2,i.height()/2);
        //c.scale(c.width/px, c.height/px);
    }
}
function idsPreHandle(ids){
    if(changeBaoweiGlyph){
        for(var key in bujianwaizi){
           ids=ids.replace(key,bujianwaizi[key]);
        }
    }
    //console.log(ids);
    return ids;
}
function hanzi(ids, outList) {
    ids=idsPreHandle(ids);
    var mids = ids;
    //canvasNo=0;
    var m = [];
    var j = "";
    var jb = false;
    var sj = [];
    var hanziNumber = 0;
    for (var i = fixedArrayForm(ids).length; i >= 0; i--) {
        //$(".add").append(ids[i]);
        //⿰⿱⿲⿳⿴⿵⿶⿷⿸⿹⿺⿻
        j = fixedCharAt(ids, i);
        if (j === "`") {
            if (!jb) {
                jb = true;
            } else {
                m.push(attribute(sj.reverse()));
                sj = [];
                jb = false;
            }
        } else if (jb) {
            sj.push(j);
        } else {
            m.push(j);
        }
    }
    var ids = [];
    var p = [];
    for (var i in m) {
        switch (m[i]) {
            case "⿰":
                //ids.pop();
                p = ["||", ids.pop(), ids.pop()];
                ids.push(p);
                break;
            case "⿱":
                //ids.pop();
                p = ["==", ids.pop(), ids.pop()];
                ids.push(p);
                break;
            case "⿲":
                p = ["|||", ids.pop(), ids.pop(), ids.pop()];
                ids.push(p);
                break;
            case "⿳":
                p = ["===", ids.pop(), ids.pop(), ids.pop()];
                ids.push(p);
                break;
            case "⿴":
                p = ["o", ids.pop(), ids.pop()];
                ids.push(p);
                break;
            case "⿵":
                //ids.pop();
                p = ["n", ids.pop(), ids.pop()];
                ids.push(p);
                break;
            case "⿶":
                //ids.pop();
                p = ["u", ids.pop(), ids.pop()];
                ids.push(p);
                break;
            case "⿷":
                //ids.pop();
                p = ["c", ids.pop(), ids.pop()];
                ids.push(p);
                break;
            case "⿸":
                //ids.pop();
                p = ["P", ids.pop(), ids.pop()];
                ids.push(p);
                break;
            case "⿹":
                //ids.pop();
                p = ["7", ids.pop(), ids.pop()];
                ids.push(p);
                break;
            case "⿺":
                //ids.pop();
                p = ["L", ids.pop(), ids.pop()];
                ids.push(p);
                break;
            case "⿻":
                //ids.pop();
                try{
                    p = ["8", ids.pop(), ids.pop()];
                    if (ids[ids.length - 1].length > 1) {
                        p.push(ids.pop());
                    }
                    ids.push(p);
                    break;
                }catch(e){
                    //console.log(ids);
                    break;
                }
                
            case "⿼":
                //ids.pop();
                p = ["O", ids.pop(), ids.pop()];
                ids.push(p);
                break;
            case "⿽":
                //ids.pop();
                p = ["d", ids.pop(), ids.pop()];
                ids.push(p);
                break;
            case "⿾":
                //ids.pop();
                p = ["<->", ids.pop()];
                ids.push(p);
                break;
            case "⿿":
                //ids.pop();
                p = ["->v", ids.pop()];
                ids.push(p);
                break;
            case "!":
                //ids.pop();
                try{
                    p = ["A", ids.pop()];
                    if (ids[ids.length - 1].length > 1) {
                        p.push(ids.pop());
                    }
                    ids.push(p);
                    break;
                }catch(e){
                    //console.log(ids);
                    break;
                }
            default:
                ids.push(m[i]);
                break;
        }
    }
    //console.log(outHanzi(ids));
    if(outList) return ids[1];
    if (DEBUG == 2) return "<p>" + JSON.stringify(ids, null, 4) + "</p><br/>" + mids + "<br/><div class='glyph'>" + outHanzi(ids) + "</div>";
    else return "<div class='glyph'>" + outHanzi(ids) + "</div>";
    //return "<br/>"+ JSON.stringify(ids, null, 4) + "<br/><div class='glyph'>" + outHanzi(ids) + "</div>";
}

function attribute(atr) {
    //console.log(atr);
    atrs = [];
    atrtmp = [];
    inAtr = false;
    atrss = "";
    for (var i = 0; i < atr.length; i++) {
        if (atr[i] === "/") {
            atrs.push([atrtmp[0], atrtmp.join("").substring(1)]);
            atrtmp = [];
        } else {
            atrtmp.push(atr[i]);
        }
    }
    atrs.push([atrtmp[0], atrtmp.join("").substring(1)]);
    atrs.shift();
    for (var i = 0; i < atrs.length; i++) {
        atrss = atrs[i][1];
        atrs[i][1] = atrss.substring(1, atrss.length - 1).split("][");
    }
    //console.log(atrs);
    return atrs;
}

function outHanzi(ids) {
    //console.log(ids);
    if (!ids[0]) {
        ids = ids[1];
    }
    var res = ""
    var t = function (i) {
        if (Array.isArray(i)) {
            return outHanzi(i);
        } else {
            //console.log(i);
            var point = i.codePointAt(0).toString(16);
            canvasNo++;
            if (getChromeVersion() <= 45) {
                return "<div class='ot'><div class='placeholder'>" + "</div>" + "<canvas class='mCanvas hanzi" + canvasNo + "' hanziCode='" + point + "' width=0 height=0></div>";
            } else {
                return "<div class='ot'><div class='placeholder'>" + i + "</div>" + "<canvas class='mCanvas hanzi" + canvasNo + "' hanziCode='" + point + "' width=0 height=0></div>";
            }

            //return "<img src='ZI.PNG'></img>" + "<canvas class='mCanvas hanzi" + canvasNo + "' hanziCode='" + point + "' width=0 height=0>";
            //return "<img src='Y:\\PY\\IMGS\\IMG\\24PX\\" + point + ".bmp'></img>" + "<canvas class='mCanvas hanzi" + canvasNo + "' hanziCode='" + point + "' width=0 height=0>"
            //加上Canvas输出
        }
    };
    if(ids[0]==="A"){
        res=".";
    }else if (ids[0] === "<->" || ids[0] === "->v") {
        if (ids[0] === "<->") {
            res =
                "<div class='horizon'>" + t(ids[1]) + "</div>";
        } else {
            res =
                "<div class='lt90'>" + t(ids[1]) + "</div>";
        }
    } else if (ids[0] === "|||" || ids[0] === "===") {
        //3
        if (ids[0] === "|||") {
            res =
                "<div class='l3'>" + t(ids[1]) + "</div>" +
                "<div class='lrm3'>" + t(ids[2]) + "</div>" +
                "<div class='r3'>" + t(ids[3]) + "</div>";
        } else {
            res =
                "<div class='u3'>" + t(ids[1]) + "</div>" +
                "<div class='udm3'>" + t(ids[2]) + "</div>" +
                "<div class='d3'>" + t(ids[3]) + "</div>";
        }
    } else {
        switch (ids[0]) {
            case "||":
                //width
                var gl = new glyphMeasure(ids[1]).get("l");
                var mcss1 = "width:" + gl + "%;";
                var mcss2 = "width:" + (100 - gl) + "%;";
                
                //console.log(gl);
                if (gl === 50) {
                    gl = 100;
                }
                
                if(gl===100){
                    res =
                        "<div class='l' style='" + mcss1 + "' scale='" + 1 + "," + 1 + "'>" + t(ids[1]) + "</div>" +
                        "<div class='r' style='" + mcss2 + "'>" + t(ids[2]) + "</div>"
                }else{

                    /* "<div class='ot'><div class='u8'>" + t(ids[1]) + "</div>" +
                    "<div class='d8' style='" + mcss + "'>" + t(ids[2]) + "</div></div>" */
                    res =
                        "<div class='ot'><div class='u8'>"+t(ids[1])+"</div><div class='d8' style='top: 0px'><div class='ot'><div class='l' style='" + mcss1 + "' scale=''>" + t(" ") + "</div>" +
                        "<div class='r' style='" + mcss2 + "'>" + t(ids[2]) + "</div></div></div></div>"
                }
                break;
            case "==":
                //height
                var gu = new glyphMeasure(ids[1]).get("U");
                //console.log(gu)
                var mcss1 = "height:" + gu + "%;";
                var mcss2 = "height:" + (100 - gu) + "%;";
                if (gu === 50) {
                    gu = 100;
                }
                if(gu===100){
                    res =
                        "<div class='u' style='" + mcss1 + "' scale='" + 1 + "," + 1 + "'>" + t(ids[1]) + "</div>" +
                        "<div class='d' style='" + mcss2 + "'>" + t(ids[2]) + "</div>"
                }else{

                    /* "<div class='ot'><div class='u8'>" + t(ids[1]) + "</div>" +
                    "<div class='d8' style='" + mcss + "'>" + t(ids[2]) + "</div></div>" */
                    res =
                        "<div class='ot'><div class='u8'>"+t(ids[1])+"</div><div class='d8' style='top: 0px'><div class='ot'><div class='u' style='" + mcss1 + "' scale=''>" + t(" ") + "</div>" +
                        "<div class='d' style='" + mcss2 + "'>" + t(ids[2]) + "</div></div></div></div>"
                }
                break;
            case "L":
                /*
                .ruL {
                    position: relative;
                    top: -100%;
                    left: 30%;
                    width: 70%;
                    height: 70%;
                }*/
                //改变被包围部分的大小
                var gl = new glyphMeasure(ids[1]).get("L");
                var mcss =
                    "left:" + gl[0] +
                    "%;width:" + (100 - gl[0]) +
                    "%;height:" + gl[1] + "%;";

                //console.log(ids, gl[0], mcss);
                res =
                    "<div class='ot'><div class='ldL'>" + t(ids[1]) + "</div>" +
                    "<div class='ruL' style='" + mcss + "'>" + t(ids[2]) + "</div></div>"
                break;
            case "7":
                /*
                .ruL {
                    position: relative;
                    top: -100%;
                    left: 30%;
                    width: 70%;
                    height: 70%;
                }*/
                //改变被包围部分的大小
                var g7 = new glyphMeasure(ids[1]).get("7");
                var mcss =
                    "top:" + (0 - (100 - g7[1])) +
                    "%;width:" + (g7[0]) +
                    "%;height:" + (100 - g7[1] - (100 - g7[2])) + "%;";

                //console.log(ids, g7, mcss);
                res =
                    "<div class='ot'><div class='ru7'>" + t(ids[1]) + "</div>" +
                    "<div class='ld7' style='" + mcss + "'>" + t(ids[2]) + "</div></div>"
                break;
            case "d":
                /*
                    .lud {
                    position:relative;
                    top: 0%;
                    left: 0%;
                    width: 70%;
                    height: 70%
                }*/
                //改变被包围部分的大小
                var gd = new glyphMeasure(ids[1]).get("d");
                var mcss =
                    "width:" + (gd[0]) +
                    "%;height:" + (gd[1]) + "%;";

                //console.log(ids, gd, mcss);
                res =
                    "<div class='ot'><div class='rdd'>" + t(ids[1]) + "</div>" +
                    "<div class='lud' style='" + mcss + "'>" + t(ids[2]) + "</div></div>"
                break;
            case "P":
                /*
                .rdP {
                    position: relative;
                    top: -45%;
                    left: 30%;
                    width: 70%;
                    height: 45%;
                }*/
                var gp = new glyphMeasure(ids[1]).get("P");
                var mcss =
                    "left:" + gp[0] +
                    "%;top:" + (gp[1] - 100) +
                    "%;width:" + (100 - gp[0]) +
                    "%;height:" + (100 - gp[1]) + "%;";;
                res =
                    "<div class='ot'><div class='luP'>" + t(ids[1]) + "</div>" +
                    "<div class='rdP' style='" + mcss + "'>" + t(ids[2]) + "</div></div>"
                break;
            case "o":
                /*
                .mo{
                    position: relative;
                    top:-90%;
                    left:10%;
                    width:70%;
                    height:70%;
                }*/
                var go = new glyphMeasure(ids[1]).get("o");
                //go:udlr
                //console.log(go);
                var mcss =
                    "left:" + go[2] +
                    "%;top:" + (go[0] - 99) +
                    "%;width:" + (go[3] - go[2]) +
                    "%;height:" + (go[1] - go[0]) + "%;";;
                res =
                    "<div class='ot'><div class='oo'>" + t(ids[1]) + "</div>" +
                    "<div class='mo' style='" + mcss + "'>" + t(ids[2]) + "</div></div>"
                break;
            case "n":
                var go = new glyphMeasure(ids[1]).get("n");
                //go:udlr
                //console.log(go);
                var mcss =
                    "left:" + go[2] +
                    "%;top:" + (go[0] - 99) +
                    "%;width:" + (go[3] - go[2]) +
                    "%;height:" + (go[1] - go[0]) + "%;";;
                res =
                    "<div class='ot'><div class='oo'>" + t(ids[1]) + "</div>" +
                    "<div class='mo' style='" + mcss + "'>" + t(ids[2]) + "</div></div>"
                break;
            case "u":
                var go = new glyphMeasure(ids[1]).get("u");
                //go:udlr
                //console.log(go);
                var mcss =
                    "left:" + go[2] +
                    "%;top:" + (go[0] - 99) +
                    "%;width:" + (go[3] - go[2]) +
                    "%;height:" + (go[1] - go[0]) + "%;";

                res =
                    "<div class='ot'><div class='oo'>" + t(ids[1]) + "</div>" +
                    "<div class='mo' style='" + mcss + "'>" + t(ids[2]) + "</div></div>"
                break;
            case "c":
                var go = new glyphMeasure(ids[1]).get("c");
                //go:udlr
                //console.log(go);
                res =
                    "<div class='ot'><div class='oo'>" + t(ids[1]) + "</div>" +
                    "<div class='mo' style='" + mcss + "'>" + t(ids[2]) + "</div></div>";
                break;

            case "8":
                //console.log(ids);
                if (ids.length === 4) {
                    var mcss = outCustomCssFromAttr(ids[3]);
                } else {
                    var mcss = "";
                }
                res =
                    "<div class='ot'><div class='u8'>" + t(ids[1]) + "</div>" +
                    "<div class='d8' style='" + mcss + "'>" + t(ids[2]) + "</div></div>"
                break;
        }
        //2
    }
    return res;
}

function outCustomCssFromAttr(atr) {
    
    //console.log(atr);
    var patr = {};
    for (var i = 0; i < atr.length; i++) {
        patr[atr[i][0]] = atr[i][1];
    }
    atr = patr;
    //console.log(atr);
    try {
        if (!atr["P"]) {
            atr["P"] = [0, 0];
        }
        var mcss =
            outCss(atrKeyValueTable.W, atr["W"], "%") +
            outCss(atrKeyValueTable.H, atr["H"], "%") +
            outCss(atrKeyValueTable.PL, atr["P"][0], "%") +
            outCss(atrKeyValueTable.PT, atr["P"][1], "%") +
            outCss(atrKeyValueTable.C, atr["C"], "")+
            outCss(atrKeyValueTable.F, atr["F"], "");
    } catch (e) {
        //console.log(e);
    }
    //console.log(mcss);
    return mcss;
}

function outCss(key, value, unit) {
    //console.log(value);
    if (!value) {
        return "";
    } else {
        if (Array.isArray(value)) {
            value = value[0];
        }
        if (value.indexOf("\"") !== -1) {
            value = "\"" + value + "\"";
        }
        return key + ":" + value + unit + ";";
    }
}

function glyphMeasure(str) {
    this.str = str;
    this.c = document.getElementById("Thumb");
    this.cxt = this.c.getContext("2d");
    this.imgData = NaN;
    this.imgWidth = this.c.width;
    this._init_(str);
}
glyphMeasure.prototype._init_ = function (str) {
    //console.log(str);
    this.cxt.fillStyle = "#000000"
    this.cxt.font = "255px " + mfont + "";
    this.cxt.textBaseline = "top";
    this.cxt.textAlign = "left";
    this.cxt.clearRect(0, 0, this.c.width, this.c.height);
    if(fixedArrayForm(str).length==1){
        this.cxt.fillText(str, 0, 0);
    }else{
        if(1||handleNesting){
            var canvasNoBefore=canvasNo;
            var thisHtml="<div class='glyph thumbGlyph'>" + outHanzi(str) + "</div>";
            thbDiv.append("<div id='thb"+thumbdivNo+"'>"+thisHtml+"</div>");
            var thisDiv=$("#thb"+thumbdivNo);
            reFontSize([canvasNoBefore,canvasNo]);
            thbDiv.append("<canvas width='255' height='255' id='cav"+thumbdivNo+"'></canvas>");
            this.copyCanvas(thumbdivNo, thisDiv);
            //debugger
            thisDiv.remove();
            thumbdivNo++;
        }
    }
    this.imgData = this.cxt.getImageData(0, 0, this.imgWidth, this.imgWidth).data;

};
glyphMeasure.prototype.copyCanvas = function (obj,father) {
    try{
        var canvases=$("#thb"+obj+" canvas");
        var _mcav=$("#cav"+obj);
        var mcav=_mcav[0].getContext("2d");
        var c,cxt,h,w,p;
        var posFather=father.offset();
        for(var i=0;i<canvases.length;i++){
            c=canvases[i];
            h=c.height;
            w=c.width;
            p=$(c).offset();
            cxt = c.getContext("2d");
            mcav.drawImage(
                c,
                (p.left-posFather.left)>>0,
                (p.top-posFather.top)>>0,
                w,
                h
            );
            //debugger
        }
        this.cxt.putImageData(mcav.getImageData(0, 0, this.imgWidth, this.imgWidth),0,0);
        //debugger;
        _mcav.remove();
    }catch(e){
        _mcav.remove();
        console.log(this.str,obj,father,e);
    }
    
}
glyphMeasure.prototype.getPix = function (x, y) {
    x = ~~x;
    y = ~~y;
    this.cxt.fillStyle = "#ff0000ee";
    this.cxt.fillRect(x, y, 2, 2);
    //var pix = this.cxt.getImageData(x, y, 1, 1).data[3];
    var pix = this.imgData[4 * (y * this.imgWidth + x) + 3];
    //console.log(4*(y*this.imgWidth+x)+3);
    //debugger;
    //console.log(x,y,pix.data)
    //cxt.fillRect(x, y, 1, 1)
    return pix === 255;
};
glyphMeasure.prototype.get = function (type) {
    var mre = hanziMeasureCache[mfont + type + this.str];
    if (mre) {
        return mre;
    } else {
        mre = eval("this.get" + type + "();");
        hanziMeasureCache[mfont + type + this.str] = mre;
    }
    return mre;
}
glyphMeasure.prototype.getL = function () {
    var mx = 0;
    var my = 0;
    var mFin = false;
    for (var i = scanStep; i <= 255; i += scanStep) {
        //cxt.fillRect(255-i, i, 1, 1);
        for (var yy = i; yy >= 0; yy -= (scanStep * 2)) {
            //点的上方不能有像素，所以得每格都要向上扫。
            //很吃性能呢，可没什么好办法了吧……
            //姑且把扫描间距乘二吧，虽说貌似不是个好主意。
            //扫描(x=mx, y<my)的范围，就是mx, my点上方的全部点。
            if (this.getPix(255 - i, yy)) {
                mFin = true;
                mx = 255 - i;
                my = i;
                break;
            }
        }
        if (mFin) {
            break;
        }
        if (this.getPix(255 - i, i)) {
            mx = 255 - i;
            my = i;
            break;
        }
    }
    //console.log(mx, my);
    //如果是碓到下头，就看上一格的左边有没有。
    if (/*!*/mFin && !this.getPix(mx - scanStep, my -= scanStep * 2)) {
        //console.log(mx, my);
        //如果有就开始向左顶。
        while (1) {
            if (mx < scanStep) {
                break;
                mx = 0;
                //console.log(mx, my);
            } else if (this.getPix(mx -= scanStep, my)) {
                //往左走。
                //顶到了才进来。
                //console.log(mx, my);
                break;
            }
        }
    } else {
        //那就是碰到左边了。
        //console.log(mx, my);
        //要往下探。
        mx += scanStep;
        //先往右挪一格。
        while (1) {
            //console.log(mx, my);
            if (my > 255 - scanStep) {
                break;
                mx = 0;
            } else if (this.getPix(mx, my += scanStep)) {
                //往下走。
                //顶到了才进来。
                //console.log(mx, my);
                break;
            }
        }
    }
    //如果是顶到左边儿，就看右一格的上头有没有。
    this.cxt.fillStyle = "#0000FFFE";
    this.cxt.fillRect(mx, my, 5, 5);
    return [mx / 255 * 100, my / 255 * 100];
};
glyphMeasure.prototype.getP = function () {
    var mx = 0;
    var my = 0;
    for (var i = scanStep; i <= 255; i += scanStep) {
        //cxt.fillStyle="#FF0000";
        //cxt.fillRect(255-i, 255-i, 1, 1);
        if (this.getPix(255 - i, 255 - i)) {
            mx = 255 - i;
            my = 255 - i;
            break;
        }
    }
    //console.log(mx, my);
    //如果是顶到上头，就看下一格的左边有没有。
    if (!this.getPix(mx - scanStep, my += scanStep * 2)) {
        //console.log(mx, my);
        //如果有就开始向左顶。
        while (1) {
            if (mx < scanStep) {
                break;
                mx = 0;
            } else if (this.getPix(mx -= scanStep, my)) {
                //往左走。
                //顶到了才进来。
                //console.log(mx, my);
                break;
            }
        }
    } else {
        //console.log(mx, my);
        //没有就往上顶。
        mx+=scanStep;
        while (1) {
            if (mx < scanStep) {
                break;
                mx = 0;
            } else if (this.getPix(mx, my -= scanStep)) {
                //往上走。
                //顶到了才进来。
                break;
            }
        }
    }
    //如果是顶到左边儿，就看右一格的上头有没有。

    this.cxt.fillStyle = "#ff0000";
    this.cxt.fillRect(mx, my, 5, 5);
    return [mx / 255 * 100, my / 255 * 100];
};
glyphMeasure.prototype.get7 = function () {
    var mx = 0;
    var my = 0;
    var muy = 0;
    for (var i = scanStep; i <= 255; i += scanStep) {
        //cxt.fillStyle="#FF0000";
        //cxt.fillRect(255-i, 255-i, 1, 1);
        if (this.getPix(i, 255 - i)) {
            mx = i;
            my = 255 - i;
            break;
        }
    }
    //console.log(mx, my);
    //如果是顶到右头，就看左一格的上边有没有。
    if (!this.getPix(mx -= scanStep, my -= scanStep * 2)) {
        //console.log(mx, my);
        //如果没有就开始向上顶。
        while (1) {
            if (my < scanStep) {
                my = 0;
                break;
            } else if (this.getPix(mx, my -= scanStep)) {
                //往上走。
                //顶到了才进来。
                //console.log(mx, my);
                break;
            }
        }
    } else {
        //console.log(mx, my);
        //没有就往右顶。
        my += scanStep * 4;
        while (1) {
            if (mx > 255 - scanStep) {
                break;
                mx = 0;
            } else if (this.getPix(mx += scanStep, my)) {
                //往右走。
                //顶到了才进来。
                break;
            }
        }
    }
    //如果是顶到左边儿，就看右一格的上头有没有。
    mx -= scanStep * 8;
    for (var i = 128; i < 255 - scanStep; i += scanStep) {
        //console.log(mx,i);
        if (this.getPix(mx, i)) {
            //alert(mx,i);
            muy = i;
            break;
        }else{
            muy=255;
        }
    }
    this.cxt.fillStyle = "#ff0000fe";
    this.cxt.fillRect(mx, muy, 5, 5);
    this.cxt.fillStyle = "#00ff00fe";
    this.cxt.fillRect(mx, my, 5, 5);
    return [mx / 255 * 100, my / 255 * 100, muy / 255 * 100];
};
glyphMeasure.prototype.getd = function () {
    var mx = 0;
    var my = 0;
    for (var i = scanStep; i <= 255; i += scanStep) {
        //cxt.fillStyle="#FF0000";
        //cxt.fillRect(255-i, 255-i, 1, 1);
        if (this.getPix(i, i)) {
            mx = i;
            my = i;
            break;
        }
    }
    //console.log(mx, my);
    //如果是顶到下头，就看上一格的右边有没有。
    if (!this.getPix(mx += scanStep, my -= scanStep * 2)) {
        //console.log(mx, my);
        //如果没有就开始向右顶。
        while (1) {
            if (mx < 255 - scanStep) {
                break;
                mx = 0;
            } else if (this.getPix(mx += scanStep, my)) {
                //往右走。
                //顶到了才进来。
                //console.log(mx, my);
                break;
            }
        }
    } else {
        //console.log(mx, my);
        //没有就往下顶。
        my += scanStep * 4;
        while (1) {
            if (mx < scanStep) {
                break;
                mx = 0;
            } else if (this.getPix(mx, my += scanStep)) {
                //往下走。
                //顶到了才进来。
                break;
            }
        }
    }
    //如果是顶到左边儿，就看右一格的上头有没有。
    this.cxt.fillStyle = "#00ff00fe";
    this.cxt.fillRect(mx, my, 5, 5);
    return [mx / 255 * 100, my / 255 * 100];
};
glyphMeasure.prototype.geto = function () {
    //要从中点开始，直接分别向上下左右延伸。
    var cWh = [this.c.width, this.c.height];
    var u = cWh[1] / 2;
    var d = cWh[1] / 2;
    var l = cWh[0] / 2;
    var r = cWh[0] / 2;
    //debugger;
    while (1) {
        //上
        if (u <= scanStep) {
            u = 0;
            break;
        } else if (this.getPix(l, u -= scanStep)) {
            break;
        }
    }
    var dd = d;
    while (1) {
        //下
        if (d >= 255 - scanStep) {
            d = 255;
            break;
        } else if (this.getPix(l, d += scanStep)) {
            break;
        }
    }
    while (1) {
        //左
        if (l <= scanStep) {
            l = 0;
            break;
        } else if (this.getPix(l -= scanStep, dd)) {
            break;
        }
    }
    while (1) {
        //右
        if (r >= 255 - scanStep) {
            r = 255;
            break;
        } else if (this.getPix(r += scanStep, dd)) {
            break;
        }
    }
    this.cxt.fillStyle = "#ff0000dd";
    this.cxt.fillRect(l, u, 5, 5);
    this.cxt.fillStyle = "#aa0000dd";
    this.cxt.fillRect(l, d, 5, 5);
    this.cxt.fillStyle = "#00aa00dd";
    this.cxt.fillRect(r, u, 5, 5);
    this.cxt.fillStyle = "#00ff00dd";
    this.cxt.fillRect(r, d, 5, 5);

    return (
        [
            u / 255 * 100,
            d / 255 * 100,
            l / 255 * 100,
            r / 255 * 100
        ]
    );
};
glyphMeasure.prototype.getn = function () {
    //横向从中点开始，分别向左右延伸。
    var cWh = [this.c.width, this.c.height];
    var u = cWh[1] / 2;
    var d = cWh[1] / 2;
    var l = cWh[0] / 2;
    var r = cWh[0] / 2;
    while (1) {
        //左
        if (l <= scanStep) {
            l = 0;
            break;
        } else if (this.getPix(l -= scanStep, d)) {
            break;
        }
    }
    while (1) {
        //右
        if (r >= 255 - scanStep) {
            r = 255;
            break;
        } else if (this.getPix(r += scanStep, d)) {
            break;
        }
    }
    var maxHeight = 0;
    var yTop = 0;
    var yBottom = 0;
    var mScanStep = scanStep * 3;
    //l+=mScanStep;
    r -= mScanStep * 2;
    var dd = d;
    var py = 255;
    //获取画布底部（y=255）到文字最下方的高度
    //cxt.fillStyle="#000000dd";
    for (var iy = 255; iy > mScanStep; iy -= mScanStep) {
        if (py !== 255) {
            break;
        }
        for (var ix = 0; ix < 255 - mScanStep; ix += mScanStep) {
            //console.log(ix, iy);
            if (this.getPix(ix, iy)) {
                py = iy;
                break;
            }
        }
    }
    //console.log(py)
    //在范围（左，右）内、上下扫描。
    //最后返回最小的上下范围。
    for (var x = l + mScanStep; x <= r; x += mScanStep) {
        yTop = dd;
        yBottom = dd;
        while (1) {
            //中线以上部分，用不着操心。
            //cxt.fillStyle="#008800dd";
            if (yTop < mScanStep) {
                break;
            } else if (this.getPix(x, yTop -= mScanStep)) {
                break;
            }
        }
        while (1) {
            //中线以下部分，到就结束了！
            //cxt.fillStyle="#0000ffdd";
            if (yBottom > py - mScanStep) {
                //console.log("-->", yBottom, yTop);
                yBottom = 255;
                break;
            } else if (this.getPix(x, yBottom += mScanStep)) {
                //console.log("<--", yBottom, yTop);
                break;
            }
        }
        //console.log(yBottom,yTop,(yBottom-yTop), "<", d-u);
        if ((d - u) === 0 || (yBottom - yTop) < (d - u)) {
            u = yTop;
            d = yBottom;
        }
    }
    this.cxt.fillStyle = "#ff0000dd";
    this.cxt.fillRect(l, u, 5, 5);
    this.cxt.fillStyle = "#aa0000dd";
    this.cxt.fillRect(l, d, 5, 5);
    this.cxt.fillStyle = "#00aa00dd";
    this.cxt.fillRect(r, u, 5, 5);
    this.cxt.fillStyle = "#00ff00dd";
    this.cxt.fillRect(r, d, 5, 5);
    return (
        [
            u / 255 * 100,
            d / 255 * 100,
            l / 255 * 100,
            r / 255 * 100
        ]
    );
};
glyphMeasure.prototype.getu = function () {
    return this.geto();
};
glyphMeasure.prototype.getc = function () {
    return this.geto();
};
glyphMeasure.prototype.getl = function () {
    //console.log(this.str);
    var mx = 0;
    //从右往左扫，每格都从上往下扫。
    for (var i = 255; i > scanStep; i -= scanStep) {
        if (mx) {
            break;
        }
        //从上往下
        for (var j = 0; j < 255 - scanStep; j += scanStep * 4) {
            if (this.getPix(i, j)) {
                mx = i;
                break;
            }
        }
    }
    this.cxt.fillStyle = "#ff0000";
    this.cxt.fillRect(mx, 0, 5, 255);
    return mx / 255 < maxBushouWidth/100 && !Array.isArray(this.str) ? mx / 255 * 100 : 50;
};
glyphMeasure.prototype.getU = function () {
    var my = 0;
    //从下往上扫，每格都从左往右扫。
    for (var j = 255; j > scanStep; j -= scanStep) {
        if (my) {
            break;
        }
        //从左往右
        for (var i = 0; i < 255 - scanStep; i += scanStep * 8) {
            if (this.getPix(i, j)) {
                my = j;
                break;
            }
        }
    }
    this.cxt.fillStyle = "#ff0000";
    this.cxt.fillRect(0, my, 255, 5);
    return my / 255 < 0.5 && !Array.isArray(this.str) ? my / 255 * 100 : 50;
};
glyphMeasure.prototype.getU2DL2R = function () {
    var h = 0;
    var u = 0;
    var d = 0;
    var w = 0;
    var l = 0;
    var r = 0;
    for (var i = 0; i < 255; i++) {
        if (this.getPix(128, i)) {
            u = i;
            break;
        }
    }
    for (var i = 255; i > 0; i--) {
        if (this.getPix(128, i)) {
            d = i;
            break;
        }
    }
    for (var i = 0; i < 255; i++) {
        if (this.getPix(i, 128)) {
            l = i;
            break;
        }
    }
    for (var i = 255; i > 0; i--) {
        if (this.getPix(i, 128)) {
            r = i;
            break;
        }
    }
    h = d - u;
    w = r - l;
    //console.log("h,w,u,d,l,r");
    //console.log(h, w, u, d, l, r);
    return [h, w];
}

function hanziMeasure(hanzi) {
    this.hanzi = hanzi;
    this.font = mfont;
    this.type = "L";
}
hanziMeasure.prototype.setFont = function (font) {
    this.font = font ? font : mfont;
}
hanziMeasure.prototype.put = function (measure) {
    hanziMeasureCache[this.font][this.type][this.hanzi]=measure;
}
hanziMeasure.prototype.get = function (type) {
    this.type = type;
    if (this.font in hanziMeasureCache) {
        if (this.type in hanziMeasureCache[this.font]) {
            if (this.hanzi in hanziMeasureCache[this.font][this.type]) {
                return hanziMeasureCache[this.font][this.type][this.hanzi];
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}