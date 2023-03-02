console.log("This is a popup!");


function setInfo(text){
    document.getElementById('info').innerHTML = text;
}

// chrome.storage.local.set({test_var: 0});

document.getElementById('run').onclick = function () {
    t = document.getElementById('time').value;
    t = parseInt(t);
    document.getElementById('info').innerHTML = '开始';
    // chrome.extension.getBackgroundPage().setTime(t, setInfo);
    chrome.runtime.sendMessage({run: 'start', time: t});
}


document.getElementById('stop').onclick=function(){
    // chrome.extension.getBackgroundPage().stop(setInfo);
    document.getElementById('info').innerHTML = '暂停';
    chrome.runtime.sendMessage({run: 'stop'});
}

// chrome.extension.getBackgroundPage().setInfo(setInfo);

chrome.tabs.query({currentWindow: true}).then(tabs=>{
    var window_id = tabs[0].windowId;
    var window_id_string = window_id.toString();
    chrome.storage.local.get([window_id_string]).then(results=>{
        console.log(results, Object.keys(results).length === 0);
        if (Object.keys(results).length === 0){
            document.getElementById('info').innerHTML = '暂停';
        }
        else{
            console.log(results[window_id_string]);
            var info = results[window_id_string];
            document.getElementById('info').innerHTML = '轮播中, 当前/全部:' + info[2] + '/' + info[1] + ', 时间间隔:' + info[0] + '分钟';
        }
    });
});