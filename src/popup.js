$(function () {
  $('#go').click(function () {//给对象绑定事件
    chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {//获取当前tab
      chrome.tabs.sendMessage(tab[0].id, {
        action: "send"
      }, function (response) {
        console.log(response);
       // state.html(response.state)
      });
    });
    $('#submit').click(function () {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
        chrome.tabs.sendMessage(tab[0].id, {
          action: "submit"
        }, function (response) {
          state.html(response.state)
        });
      });
    })
  })
})
