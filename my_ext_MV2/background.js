var run_dict = new Array();

function setInfo(text_callback) {
    chrome.tabs.query({ windowId: chrome.windows.WINDOW_ID_CURRENT}, function (tabs) {
        var window_id = tabs[0].windowId;
        if (window_id in run_dict){
            text_callback('Running, index:' + run_dict[window_id].index + '/' + run_dict[window_id].length);
        }else{
            text_callback('Stopping.');
        }
    });
}

function setTime(t, text_callback) {
    var time = t * 1000;
    chrome.tabs.query({ windowId: chrome.windows.WINDOW_ID_CURRENT}, function (tabs) {
        var window_id = tabs[0].windowId;
        if (!(window_id in run_dict)){
            run_dict[window_id] = {time: time, length: 0, timer: null, index: 0};
            run_dict[window_id].timer = setInterval(function(){
                chrome.tabs.query({ windowId: window_id}, function (tabs) { run_dict[window_id].length = tabs.length;});
                if (run_dict[window_id].index >= run_dict[window_id].length) run_dict[window_id].index = 0;
                chrome.tabs.highlight({ windowId: window_id, tabs: run_dict[window_id].index },function(){});
                text_callback('Running, index:' + run_dict[window_id].index + '/' + run_dict[window_id].length);
                run_dict[window_id].index++;
            }, run_dict[window_id].time);
        }
    });
}

function stop(text_callback) {
    chrome.tabs.query({ windowId: chrome.windows.WINDOW_ID_CURRENT}, function (tabs) {
        var window_id = tabs[0].windowId;
        if (window_id in run_dict){
            timer = run_dict[window_id].timer;
            clearInterval(timer);
            delete run_dict[window_id];
            text_callback('Stopping.');
        }
    });
}