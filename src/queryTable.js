var viewModel = "<div> </div>";
var isAdd = 0;
var _tdNonClass = "_chlejrjfdasjerjlksjflk322349ngasdf";
var _selectDic = [
    { "name": "none", "value": "" },
    { "name": "note", "value": "note" },
    { "name": "length", "value": "length" },
    { "name": "field", "value": "field" },
    { "name": "type", "value": "type" },
];

function buildFile(fieldValue) {
    var fileHead = "public Class1 \n { \n";
    var fileFieldTemlete = "public [type] [fieldName] {get;set;}  \n \n ";
    var fileNoteTemlete = "///[note]  \n";
    for (var i = 0; i < fieldValue.length; i++) {
        if(fieldValue[i].field==""){
            continue;
        }
        fileHead += "    "+fileNoteTemlete.replace("[note]", fieldValue[i].note);
        fileHead += "    "+(fileNoteTemlete.replace("[note]", "原字段:" + fieldValue[i].field));
        fileHead += "    "+fileFieldTemlete.replace("[type]", transformStrFieldType(fieldValue[i].type)).replace("[fieldName]",tranformStr2(fieldValue[i].field));
    }
    var fileFoot = "\n}";
    fileHead += fileFoot;
    var blob = new Blob([fileHead], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "Class1.cs");//saveAs(blob,filename)

}
function go() {
    var attrbuteClass = $('.' + _tdNonClass);
    var queryList = $(attrbuteClass).find('select option:selected');
    var myArray = new Array()

    for (var i = 0; i < queryList.length; i++) {
        myArray[i] = $(queryList[i]).val();
    }
    if (!myArray.includes('field')) {
        alert("field can not empty");
        return;
    }
    if (!myArray.includes('type')) {
        alert("type can not empty");
        return;
    }
    var trList = attrbuteClass.siblings();
    var fieldValue = new Array()

    for (var i = 0; i < $(trList).length; i++) {
        var tdList = $((trList)[i]).children("td");
        var tdCount = $(tdList).length;

        var type = $((tdList)[myArray.indexOf('type')]).text();
        var length = $((tdList)[myArray.indexOf('length')]).text();
        var field = $((tdList)[myArray.indexOf('field')]).text();
        var note = $((tdList)[myArray.indexOf('note')]).text();

        fieldValue[i] = {
            "type": type.replace("br/", "").replace("\n","").trim(),
            "note": note.replace("br/", "").replace(/[\r\n]/g,"").trim(),
            "field": field.replace("br/", "").replace("\n","").trim(),
            "length": length.replace("br/", "").replace("\n","").trim()
        };
    }
    buildFile(fieldValue);

}

var _typeDic ={
    "number":"int",
    "num":"int",
    "string":"string",
};
function transformStrFieldType(str){
        var temp = str.toLowerCase();
        var isArr = 0;
        if(temp.indexOf('[]') != -1){
            isArr=1;
        }
       if(temp.indexOf('string')!=-1){
           return "string";
       }
       if(temp.indexOf('number')!=-1){
        return "int";
       }
       if(temp.indexOf('long')!=-1){
         return "long";
       }
       if(temp.indexOf('bool')!=-1){
        return "bool";
      }
       return str;
}
function tranformStr2(str){
    var strArr=str.split('');
    strArr[0] = strArr[0].toUpperCase();
    for(var i=1;i<strArr.length;i++){
        if(strArr[i]=='_' || strArr[i]=='-'){
            //删除'-'
            strArr.splice(i,1);
            //转大写
            if(i<strArr.length){
                strArr[i]=strArr[i].toUpperCase();
            }
        }
    }
    var str = strArr.join('');
    return  str;
}
function searchTable() {
    var tables = $("table");
    tables.on('mouseover', function () {
        $(this).css("background-color", "rgba(0,0,0,0.2)");
    });
    tables.on('mouseout', function () {
        $(this).css("background-color", "");
    });

    tables.on('click', function () {
        if (isAdd == 0) {
            var tbody = $(this).children("tbody");
            var firstTr = tbody.children("tr:first-child");
            var childLength = tbody.children("tr:first-child").children("td").length;
            if (childLength == 0) {
                childLength = tbody.children("tr:first-child").children("th").length;
            }
            var _tr = $("<tr class='" + _tdNonClass + "'></tr>");
            for (var i = 0; i < childLength; i++) {
                var buildTd = $("<td></td>");
                var _selectH = $("<select></select>");
                _selectDic.forEach(item => {
                    var _op = $("<option value=" + item.value + ">" + item.name + "</option>");
                    _selectH.append(_op);
                });
                buildTd.append(_selectH);
                if (i == childLength - 1) {
                    var _innerButton = $("<button>确定</button>");
                    buildTd.append(_innerButton);
                    _innerButton.on('click', function () {
                        go();
                    });
                }
                _tr.append(buildTd);
            }
            _tr.insertBefore(firstTr);
            isAdd++;
        }
    });
    //tables.css("background-color","red");
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.action == "send") {
            searchTable();
        }
        if (request.action == "submit") {
            sendResponse({ state: '提交成功！' });
        }
    }
);