<!DOCTYPE html>
<html lang="zh-cn">
<head>
    <script src="../JS/jquery.min.js" type="text/javascript"></script>
    <script src="../JS/UCRANG.JS" type="text/javascript"></script>
    <script type="text/javascript" src="../JS/IDS.JS"></script>
    <script type="text/javascript" src="../JS/UNIH.JS"></script>
    <link rel="stylesheet" href="../CSS/IDS.CSS">
    <meta charset="UTF-8">
    <title>OUT</title>
</head>
<script type="text/javascript">
    $(document).ready(function() {
<?PHP
$JSON=FILE_GET_CONTENTS("http://zi.tools/api/zi/".($_GET["T"]));
ECHO "var ZI=".$JSON;
ECHO ";\n";
?>
            var GLYPHIN=ZI.__zi.codePointAt(0).toString(16);
            $(".searchGlyph").append("&#x" + GLYPHIN + ";");
            $(".searchUnicode").append(GLYPHIN);
			$("#uRange").append(getUnicodeRangeName(GLYPHIN));
            handleZi(ZI);
        }
    );
    function handleZi(zi) {
        var res, ress, resss;
        for (var standard in zi["standards"]){
            $(".standard").append("<span style='border: solid 1px black;margin: 2px;'>"+zi["standards"][standard]+"</span>");
        }
        for (var source in zi["sources"]){
            $(".source").append("<span style='border: solid 1px black;margin: 2px;bottom: 1px;'>"+zi["sources"][source]+"</span>");
        }
        for (var dictName in zi["dict"]){
            res="\n" +
                "        <table border='1'>\n" +
                "            <tr>\n" +
                "                <td>"+dictName+"</td>\n" +
                "            </tr>\n" +
                "            <tr>\n" +
                "                <td>"+zi["dict"][dictName].replace(/\/ /g,"<br/>")+"</td>\n" +
                "            </tr>\n" +
                "        </table>\n" +
                "        <hr>";
            $(".meaning").append(res);
        }
        for (var meaning in zi["meaning"]){
            ress="<table border='1'>";
            for (var means in zi["meaning"][meaning]){
                var devided=zi["meaning"][meaning][means].split("\t");
                resss="";
                for (var i in devided){
                    resss+="<td>"+devided[i].replace(/None/g,"--")+"</td>";
                }
                ress+="<tr>"+resss+"</tr>";
            }
            ress+="</table>";
            res="\n" +
                "        <table border='1'>\n" +
                "            <tr>\n" +
                "                <td>"+meaning+"</td>\n" +
                "            </tr><tr><td>\n"+ress+
                "        </td></tr></table>\n" +
                "        <hr>";
            $(".meaning").append(res);
        }
        $(".ids").append(zi["ids"]);
        $(".paisheng").append(zi["derived"]);
        $(".baohanyu").append(zi["involved"]);
        return;
    }
	function getUnicodeRangeName(codeIn){
		var codeIn=eval("0x"+codeIn);
		var j=0;
		for(var i in rangeOfUnicode){
			if(rangeOfUnicode[i][0]>codeIn){
				j=i;
				break;
			}
		}
		return rangeOfUnicode[j-1][1];
	}
</script>
<style type="text/css">
	body{
		background-color:silver;
	}
    .displayFont{
        font-size: 32px;
    }
    .GBBitmapFont,body{
        font-family: "New Batang", "sim-ch_n5100", "Unifont","巨硬俗白","SimSun", serif;
        font-size: 16px;
    }
    .ZhongHuaSong{
        font-family: "中华书局宋体00平面", "中华书局宋体02平面", "中华书局宋体15平面","Unifont","巨硬俗白",serif;
    }
    .THKaiTp{
        font-family: "楷体", "TH-Khaai-TP0", "TH-Khaai-TP2","Unifont","巨硬俗白", cursive;
    }
    .THMing{
        font-family: "MS Mincho","HanaMinA", "HanaMinB","Unifont","巨硬俗白", serif;
    }
    .THMingH{
        font-family: "Batang", "New Batang", "TH-Ming-H","Unifont","巨硬俗白", serif;
    }
    .NomNaTong{
        font-family: "Nom Na Tong","Unifont","巨硬俗白", serif;
    }
    .MingLiU{
        font-family: "MingLiU", "MingLiU-ExtB", "Unifont","巨硬俗白", serif;
    }
    .THKaiPp{
        font-family: "DFKai-SB", "TH-Khaai-PP0", "TH-Khaai-PP2","Unifont","巨硬俗白", cursive;
    }
    .fontName{
        font-size: 24px;
        font-family: "New Batang","Unifont","巨硬俗白", serif;
    }
	.Kyoukasho{
        font-family: "A-OTF Kyoukasho ICA Pro R","Unifont","巨硬俗白", cursive;
	}
	.Gungsuh{
        font-family: "New Gungsuh","Unifont","巨硬俗白", cursive;
	}
    .Chopom{
        font-family: "KP CheongPong","Unifont","巨硬俗白", serif;
    }
    .GangMing{
        font-family: "DFHKStdSong-B5", "MingLiU_HKSCS", "MingLiU_HKSCS-ExtB","Unifont","巨硬俗白", serif;
    }
	.Code2000{
		font-family: "Code2002", "Code2000","Unifont","巨硬俗白", serif;
	}
</style>
<body>
    <span class="text GBBitmapFont searchGlyph"></span>（U+<span class="searchUnicode"></span>）位于<span id="uRange"></span>区，以下为其各地字形：
    <table border=1>
        <tr class="fontName">
            <td>陆宋</td>
            <td>陆楷</td>
            <td>日明</td>
            <td>日楷</td>
            <td>韩明</td>
            <td>韩楷</td>
            <td>朝明</td>
            <td>越宋</td>
            <td>台宋</td>
            <td>港宋</td>
            <td>台楷</td>
			<!--
				<td>C200</td>
			-->
        </tr>
        <tr class="displayGlyph">
            <td class="searchGlyph displayFont ZhongHuaSong"></td>
            <td class="searchGlyph displayFont THKaiTp"></td>
            <td class="searchGlyph displayFont THMing"></td>
            <td class="searchGlyph displayFont Kyoukasho"></td>
            <td class="searchGlyph displayFont THMingH"></td>
            <td class="searchGlyph displayFont Gungsuh"></td>
            <td class="searchGlyph displayFont Chopom"></td>
            <td class="searchGlyph displayFont NomNaTong"></td>
            <td class="searchGlyph displayFont MingLiU"></td>
            <td class="searchGlyph displayFont GangMing"></td>
            <td class="searchGlyph displayFont THKaiPp"></td>
            <!--
				<td class="searchGlyph displayFont Code2000"></td>
			-->
        </tr>
    </table>
    <div class="ziTool">
        <table>
            <tr>
                <td>标准：</td>
                <td class="standard"></td>
            </tr>
            <tr>
                <td>UNICODE源：</td>
                <td class="source"></td>
            </tr>
            <tr>
                <td>IDS：</td>
                <td class="ids"></td>
            </tr>
            <tr>
                <td>派生字符：</td>
                <td class="paisheng"></td>
            </tr>
            <tr>
                <td>包含于：</td>
                <td class="baohanyu"></td>
            </tr>
        </table>
        含义：
        <div class="meaning"></div>
    </div>
    汉字信息部分来自<A href="http://zi.tools">Zi.Tools</A>
</html>
