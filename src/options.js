var optionEle = document.getElementById('option');

function saveOptions(){
    var tempList = document.getElementsByClassName("temlate-item");

    var item = {};

    for (let index = 0; index < tempList.length; index++) {
        const element = tempList[index];
        item[ element.getAttribute("key")] = element.value;

    }
    chrome.storage.sync.set({
        'options': optionEle.value,
      }, function() {
        // Update status to let user know options were saved.
    });

    chrome.storage.sync.set({
        'optionList': item,
      }, function() {
        // Update status to let user know options were saved.
    });


}
window.onload = function (){
    chrome.storage.sync.get(['options'], function(result) {
        optionEle.value = result["options"];
        var optionsJson = JSON.parse(result["options"]);
        var data = {
            list:[]
        };

        chrome.storage.sync.get('optionList', function(result) {
            console.warn(result);
            for (let index = 0; index < optionsJson["templatesTypes"].length; index++) {
                const element = optionsJson["templatesTypes"][index];

                data.list.push({
                    key:element,
                    value: result.optionList[element]

                });


                
            }
            console.warn(data);
            var html = template('textarea-tmp', data);
            document.getElementById('template-list').innerHTML = html;
        });
    

       
        
    });


}
document.getElementById('save').addEventListener('click',
saveOptions);