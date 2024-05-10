var data = "";

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.local.set({
        "isActive": true
    }, function() {
        if (chrome.runtime.lastError) {
            console.error(
                "Error setting " + key + " to " + JSON.stringify(data) +
                ": " + chrome.runtime.lastError.message
            );
        }
    });
});

var filename;
var date;

chrome.runtime.onStartup.addListener(function() {


    chrome.storage.local.get("isActive", function(data) {

        if (data.isActive) {
            chrome.browserAction.setIcon({ path: "images/on.png" });
        } else {
            chrome.browserAction.setIcon({ path: "images/off.png" });
        }

    });



    data = "";
})

chrome.runtime.onMessage.addListener(function(request, sender) {

    if (request.task)

    {
        date = new Date();
        myfilename = "notes_" + date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear() + "_" + date.getHours() + "-" + date.getMinutes() + ".txt";

        var url;
        var datatoadd = "";
        for (var i = 80; i < request.selected.length; i += 80) {
            if (i == 80) {
                datatoadd = (request.selected).substring(0, 80);
            } else {
                datatoadd = datatoadd + "\r\n" + "  " + (request.selected).substring(i - 80, i);
            }


        }

        if (datatoadd == "") {
            datatoadd = request.selected;
        } else if ((i - 1) != request.selected.length) {
            datatoadd = datatoadd + "\r\n" + "  " + (request.selected).substring(i - 80, request.selected.length);
        }

        if (request.task == "addToFile") {
            if (data != "") {
                data = data + "\r\n" + "\u2022" + " " + datatoadd;
            } else {
                data = data + "\u2022" + " " + datatoadd;
            }

        } else if (request.task == "saveFile") {
            if (data != "") {
                data = data + "\r\n" + "\u2022" + " " + datatoadd;
            } else {
                data = data + "\u2022" + " " + datatoadd;
            }
            var blob = new Blob([data], {
                type: '"text/plain;charset=UTF-8"'
            });

            myurl = window.URL.createObjectURL(blob);


            chrome.downloads.download({
                url: myurl,
                filename: myfilename
            }, function(downloadId) {

            });
            data = "";

        }

    }
});
chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.task) {
        var date = new Date();
        var myfilename = "notes_" + date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + "_" + date.getHours() + "-" + date.getMinutes() + ".txt";

        if (request.task == "addToFile") {
            var pageInfo = request.pageInfo;
            var data = "\u2022 " + pageInfo.selectionText + "\n   - Title: " + pageInfo.title + "\n   - URL: " + pageInfo.url + "\n   - Date: " + date.toLocaleString();

            chrome.storage.local.get("data", function(result) {
                var newData = result.data ? result.data + "\n\n" + data : data;
                chrome.storage.local.set({ "data": newData });
            });
        } else if (request.task == "saveFile") {
            chrome.storage.local.get("data", function(result) {
                var blob = new Blob([result.data], { type: "text/plain;charset=utf-8" });
                var url = URL.createObjectURL(blob);
                chrome.downloads.download({ url: url, filename: myfilename });
                chrome.storage.local.remove("data");
            });
        }
    }
});
