function setInfo(text){
    document.getElementById('info').innerHTML = text;
}

document.getElementById('run').onclick = function () {
    t = document.getElementById('time').value;
    t = parseInt(t);
    document.getElementById('info').innerHTML = 'Starting.';
    chrome.extension.getBackgroundPage().setTime(t, setInfo);
}


document.getElementById('stop').onclick=function(){
    chrome.extension.getBackgroundPage().stop(setInfo);
}

chrome.extension.getBackgroundPage().setInfo(setInfo);