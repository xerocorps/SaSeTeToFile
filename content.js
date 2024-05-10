var flag;
var show;
var bubbleDOM = document.createElement('input');

bubbleDOM.setAttribute('type', 'button');


bubbleDOM.setAttribute('class', 'selection_bubble');
bubbleDOM.setAttribute('id', "btn");
document.body.appendChild(bubbleDOM);


//Close the bubble when we click on the screen.
document.addEventListener('mousedown', function(e) {
    if (bubbleDOM.id != e.target.id && bubbleDOM.style.visibility == 'visible') {
        bubbleDOM.removeAttribute("value");
        bubbleDOM.style.visibility = 'hidden';
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
        bubbleDOM.setAttribute('value', "📝 Add to file");

        bubbleDOM.style.top = mouseY + 'px';
        bubbleDOM.style.left = mouseX + 'px';
        bubbleDOM.style.visibility = 'visible';

        bubbleDOM.onclick = function() {
            addToFile(pageInfo);
        };
    }
}

function saveFile(pageInfo) {
    bubbleDOM.style.visibility = 'hidden';

    chrome.runtime.sendMessage({
        task: 'saveFile',
        pageInfo: pageInfo
    }, function() {
        bubbleDOM.removeAttribute("value");
    });
}

function addToFile(pageInfo) {
    bubbleDOM.style.visibility = 'hidden';

    chrome.runtime.sendMessage({
        task: 'addToFile',
        pageInfo: pageInfo
    }, function() {
        bubbleDOM.removeAttribute("value");
    });
}
