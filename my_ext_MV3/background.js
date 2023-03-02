
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if(message.run == 'start'){
        chrome.tabs.query({currentWindow: true}, function(tabs){
            console.log(tabs);
            var window_id = tabs[0].windowId;
            console.log(window_id);
            var window_id_string = window_id.toString();
            var time = message.time;
            chrome.storage.local.get([window_id_string]).then(results=>{
                console.log(results, Object.keys(results).length === 0);
                if (Object.keys(results).length === 0){
                    chrome.storage.local.set({[window_id_string]: [time, 0, 0]});
                    // [time, length, index]
                    chrome.alarms.create(window_id_string, {delayInMinutes: time, periodInMinutes: time});
                    console.log('create an alarm.')
                }
                else{
                    console.log(results[window_id_string]);
                }
            });
        });
    }
    else if(message.run == 'stop'){
        // chrome.alarms.clearAll();
        // chrome.storage.local.clear();
        chrome.tabs.query({currentWindow: true}, function(tabs){
            var window_id = tabs[0].windowId;
            var window_id_string = window_id.toString();
            chrome.storage.local.remove(window_id_string);
            chrome.alarms.clear(window_id_string);
            chrome.storage.local.get(window_id_string).then(results=>{
                console.log(results);
            });
            chrome.alarms.getAll().then(alarms=>{
                console.log(alarms);
            });
        });        
        
    }
});

chrome.alarms.onAlarm.addListener(function(alarm) {
    console.log('alarm', alarm);
    var window_id_string = alarm.name;
    var window_id = parseInt(window_id_string);
    chrome.storage.local.get([window_id_string]).then(results=>{
        console.log(results);
        if (!(Object.keys(results).length === 0)){
            console.log(results[window_id_string]);
            var info = results[window_id_string];
            chrome.tabs.query({ windowId: window_id}).then(tabs=>{
                info[1] = tabs.length;
                console.log(tabs.length, info[1]);
                console.log(info, info[0], info[1], info[2]);
                if (info[2] >= info[1]) info[2] = 0;
                chrome.tabs.highlight({ windowId: window_id, tabs: info[2] },function(){});
                console.log('Running, index:' + info[2] + '/' + info[1] + ', time:' + info[0] + 'min.')
                info[2]++;
                chrome.storage.local.set({[window_id_string]: info});
            });
        }
    });
});
