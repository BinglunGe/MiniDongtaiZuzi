function getChromeVersion() {
    var arr = navigator.userAgent.split(' '); 
    var chromeVersion = '';
    for(var i=0;i < arr.length;i++){
        if(/chrome/i.test(arr[i]))
        chromeVersion = arr[i]
    }
    if(chromeVersion){
        return Number(chromeVersion.split('/')[1].split('.')[0]);
    } else {
        return 65535;
    }
}
function fixedArrayForm(arr){
    try{
        return Array.from(arr);
    }catch(e){
        res=[];
        for(var i=0;i<arr.length;i++){
            res.push(arr[i]);
        }
        return res;
    }
}
function fixedCharAt(str, idx) {
    var ret = '';
    str += '';
    var end = str.length;

    var surrogatePairs = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
    while ((surrogatePairs.exec(str)) != null) {
        var li = surrogatePairs.lastIndex;
        if (li - 2 < idx) {
            idx++;
        } else {
            break;
        }
    }

    if (idx >= end || idx < 0) {
        return '';
    }

    ret += str.charAt(idx);

    if (/[\uD800-\uDBFF]/.test(ret) && /[\uDC00-\uDFFF]/.test(str.charAt(idx + 1))) {
        // Go one further, since one of the "characters" is part of a surrogate pair
        ret += str.charAt(idx + 1);
    }
    return ret;
}
if (!String.prototype.codePointAt) {
    (function () {
        'use strict'; // 严格模式，needed to support `apply`/`call` with `undefined`/`null`
        var codePointAt = function (position) {
            if (this == null) {
                throw TypeError();
            }
            var string = String(this);
            var size = string.length;
            // 变成整数
            var index = position ? Number(position) : 0;
            if (index != index) { // better `isNaN`
                index = 0;
            }
            // 边界
            if (index < 0 || index >= size) {
                return undefined;
            }
            // 第一个编码单元
            var first = string.charCodeAt(index);
            var second;
            if ( // 检查是否开始 surrogate pair
                first >= 0xD800 && first <= 0xDBFF && // high surrogate
                size > index + 1 // 下一个编码单元
            ) {
                second = string.charCodeAt(index + 1);
                if (second >= 0xDC00 && second <= 0xDFFF) { // low surrogate
                    // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
                    return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
                }
            }
            return first;
        };
        if (Object.defineProperty) {
            
                Object.defineProperty(String.prototype, 'codePointAt', {
                    'value': codePointAt,
                    'configurable': true,
                    'writable': true
                });
        } else {
            String.prototype.codePointAt = codePointAt;
        }
    }());
}

        /* 先假设显示出来的字形应该是横高为HS1、竖宽为HS2的。
         * 设HS1=5, HS2=10。
         * 字形显示出来时是经缩放的，字形“宽高”为HW0、HW1。
         * 设HW0=50, HW1=200。
         * 可这时候的、经缩放了的字形，它的横高、竖宽为多少呢？
         * 设未经缩放的字形宽高均为100的话（设为FS），
         *  这个字形的横高、竖宽就分别是：
         *      (字形高/字形尺寸)*字形横高、
         *          (字形宽/字形尺寸)*字形竖宽。
         *      [(200/100)*5, (50/100)*10] = [10, 5]
         * 而为了让缩放后的字形的横高、竖宽与原字形一致，
         * 所以呢，就得让缩放后字形横竖分别增加：
         *      (字形高/字形尺寸)*字形横高-字形横高、
         *          (字形宽/字形尺寸)*字形竖宽-字形竖宽
         * 个像素。
         */