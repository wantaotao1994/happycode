var viewModel = "<div> </div>";
var isAdd = 0;
var _tdNonClass = "_chlejrjfdasjerjlksjflk322349ngasdf";
var _typeId = "IAMWINTER_de203482jjfed_dgna";

var  tempConfigList = {};
var  _lastTable = {};
var _selectDic = [
    { "name": "none", "value": "" },
    { "name": "note", "value": "note" },
    { "name": "length", "value": "length" },
    { "name": "field", "value": "field" },
    { "name": "type", "value": "type" },
];

var _fileTypeDic = [];


function buildFileV2(tempFile,data) {
    var html =   template.render(tempFile, data)
    var blob = new Blob([html], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "result.txt");//saveAs(blob,filename)
}


function goV2(){
    chrome.storage.sync.get('optionList', function(result) {
        var attrbuteClass = $('#' + _typeId +' option:selected');
        var type = $(attrbuteClass).val();
        var  temp =  result["optionList"][type];
        var temData = {
            list:[]

        };

        if(temp != undefined){
            var dataList = $('.' + _tdNonClass);
            var queryList = $(dataList).find('select option:selected');
            var myArray = new Array()
            for (var i = 0; i < queryList.length; i++) {
                myArray[i] = $(queryList[i]).val();
            }
            var trList = dataList.siblings();
            for (var i = 0; i < $(trList).length; i++) {
                var tdList = $((trList)[i]).children("td");
                var dataItem ={};
                for (let index = 0; index < _selectDic.length; index++) {
                    const element = _selectDic[index].value;
                    if(element){
                        dataItem[element] = $((tdList)[myArray.indexOf(element)]).text();
                    }
                }
                temData.list.push(dataItem);
            }
            buildFileV2(temp,temData);

        }
    });


}

function tranformStr2(str) {
    var strArr = str.split('');
    strArr[0] = strArr[0].toUpperCase();
    for (var i = 1; i < strArr.length; i++) {
        if (strArr[i] == '_' || strArr[i] == '-') {
            //删除'-'
            strArr.splice(i, 1);
            //转大写
            if (i < strArr.length) {
                strArr[i] = strArr[i].toUpperCase();
            }
        }
    }
    var str = strArr.join('');
    return str;
}
function initSelectDic(result) {
    _selectDic = [];
    _fileTypeDic= [];
    result = JSON.parse(result);
    _selectDic.push({ "name": "none", "value": "" });

    _fileTypeDic.push({ "name": "choose your type", "value": "" });
    result.columnType.forEach(element => {
        _selectDic.push({ "name": element, "value": element });

    });

    result.templatesTypes.forEach(element => {
        _fileTypeDic.push({ "name": element, "value": element });
    });

    tempConfigList= result.fieldMap;

    initTemplateConfig(tempConfigList);

}

function initTemplateConfig(data){
        template.defaults.escape = false;
        template.defaults.imports.swiftDefaultValue = function(value){
            if(value =="String")
            {
                return     "\"\"";
            }
            if(value=="Int"){
                return 0;
            }

            return value;

        };
        template.defaults.imports.jsDefaultValue = function(value){
            if(value =="string")
            {
                return     "\"\"";
            }
            if(value=="number" || value == "integer"){
                return 0;
            }

            return     "\"\"";

        };

        template.defaults.imports.javaDefaultValue = function(value){
            

            return value;
        };

        template.defaults.imports.csharpDefaultValue = function(value){
            

            return value;
        };


        template.defaults.imports.fistCharToUpper = function(value){
            if(value.length==0)
               return "";
            return  value.substring(0, 1).toUpperCase() + value.substring(1);
        };


        template.defaults.imports.mapFieldType = function(value,type){
            console.warn(data);
            if(data[type]!= undefined){
                if(data[type][value]!=undefined){
                    return data[type][value];
                }
        
            }
            return value;
        };

}
function searchTable() {
    chrome.storage.sync.get(['options'], function (result) {
        initSelectDic(result["options"]);
        var tables = $("table");
        tables.on('mouseover', function () {
            $(this).css("background-color", "rgba(0,0,0,0.2)");
        });
        tables.on('mouseout', function () {
            $(this).css("background-color", "");
        });

        tables.on('click',tableInit);
    });

    //tables.css("background-color","red");
}
function  tableInit(){
    console.warn(_lastTable == $(this));

    if(_lastTable == $(this)){

        return;
    }


    if(isAdd > 0 ){
        var node =  $("." + _tdNonClass);
        node.remove();
        isAdd = 0;
    }
    var tbody = $(this).children("tbody");
    var firstTr = tbody.children("tr:first-child");
    var childLength = tbody.children("tr:first-child").children("td").length;
    if (childLength == 0) {
        childLength = tbody.children("tr:first-child").children("th").length;
    }
    var _tr = $("<tr class='" + _tdNonClass + "'></tr>");
    for (var i = 0; i < childLength; i++) {
        var buildTd = $("<td></td>");
    
        var selectH = $("<select></select>");
        _selectDic.forEach(item => {
            var _op = $("<option value=" + item.value + ">" + item.name + "</option>");
            selectH.append(_op);
        });
        selectH.on('click',function(e){
            e.stopPropagation(); // 只执行button的click，如果注释掉该行，将执行button、p和div的click   

        })
        buildTd.append(selectH);


        if (i == childLength - 1) {

            var _selectH = $(`<select id='${_typeId}'></select>`);
            _fileTypeDic.forEach(item => {
                var _op = $("<option value=" + item.value + ">" + item.name + "</option>");
                _selectH.append(_op);
            });

            _selectH.on('click',function(e){
                e.stopPropagation(); // 只执行button的click，如果注释掉该行，将执行button、p和div的click   

            })
            buildTd.append(_selectH);
            var _innerButton = $("<button>确定</button>");
            buildTd.append(_innerButton);
            _innerButton.on('click', function (e) {
                e.stopPropagation(); // 只执行button的click，如果注释掉该行，将执行button、p和div的click   

                goV2();
            });
        }
    
        _tr.append(buildTd);
    }


    
    _tr.insertBefore(firstTr);
    isAdd++;


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