var flag;
var show;




var bubbleDOM = document.createElement('input');

bubbleDOM.setAttribute('type', 'button');


bubbleDOM.setAttribute('class', 'selection_bubble');
bubbleDOM.setAttribute('id', "btn");
document.body.appendChild(bubbleDOM);

var inputDOM = document.createElement('input');

inputDOM.setAttribute('type', 'button');


inputDOM.setAttribute('class', 'selection_bubble');
inputDOM.setAttribute('id', "btn");
document.body.appendChild(inputDOM);


//Close the bubble when we click on the screen.
document.addEventListener('mousedown', function(e) {
    if (bubbleDOM.id != e.target.id && bubbleDOM.style.visibility == 'visible') {
        bubbleDOM.removeAttribute("value");
        inputDOM.removeAttribute("value");
        bubbleDOM.style.visibility = 'hidden';
        inputDOM.style.visibility = 'hidden';
    }
}, false);

document.addEventListener('mouseup', function(e) {
    var selection = window.getSelection();
    if (selection.toString().length > 0) {
        var pageInfo = {
            title: document.title,
            url: window.location.href,
            selectionText: selection.toString()
        };
        renderBubble(e.pageX, e.pageY, pageInfo);
    }
}, false);

function renderBubble(mouseX, mouseY, pageInfo) {
    chrome.storage.local.get("isActive", function(data) {
        if (data.isActive == true) {
            showit(mouseX, mouseY, pageInfo);
        } else {
            chrome.browserAction.setIcon({ path: "images/off.png" });
        }
    });
}

function showit(mouseX, mouseY, pageInfo) {
    if (bubbleDOM.hasAttribute('value') == false) {
        bubbleDOM.setAttribute('value', "Add to file");
        inputDOM.setAttribute('value', "Save file");

        bubbleDOM.style.top = mouseY + 'px';
        bubbleDOM.style.left = mouseX + 'px';
        bubbleDOM.style.visibility = 'visible';
        inputDOM.style.top = mouseY + 'px';
        inputDOM.style.left = (mouseX + 102) + 'px';
        inputDOM.style.visibility = 'visible';

        bubbleDOM.onclick = function() {
            addToFile(pageInfo);
        };
        inputDOM.onclick = function() {
            saveFile(pageInfo);
        };
    }
}

function saveFile(pageInfo) {
    bubbleDOM.style.visibility = 'hidden';
    inputDOM.style.visibility = 'hidden';

    chrome.runtime.sendMessage({
        task: 'saveFile',
        pageInfo: pageInfo
    }, function() {
        bubbleDOM.removeAttribute("value");
        inputDOM.removeAttribute("value");
    });
}

function addToFile(pageInfo) {
    bubbleDOM.style.visibility = 'hidden';
    inputDOM.style.visibility = 'hidden';

    chrome.runtime.sendMessage({
        task: 'addToFile',
        pageInfo: pageInfo
    }, function() {
        bubbleDOM.removeAttribute("value");
        inputDOM.removeAttribute("value");
    });
}
