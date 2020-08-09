const viewEditButtonElement = "SPAN";


function createButton(input) {
    var button = document.createElement(viewEditButtonElement);
    button.className = "flex-noshrink fabric-icon ms-Icon--View";
    button.style = "margin-right: 8px; cursor: pointer";
    button.title = "View / edit path filters";
    var isOpened = false;
    button.onclick = function() {
        if (isOpened) {
            return;
        }
        isOpened = true;
        var container = document.createElement("div");
        container.style = "background: white; position: absolute; border: solid 2px black; height: 600px; width: 800px; padding: 10px; z-index:1000000; margin-top: 10px"
        container.className = "bolt-panel-callout-content scroll-auto in relative bolt-callout-content bolt-callout-shadow flex-grow flex-column bolt-callout-medium";
        var close = function() {
            document.getElementsByTagName("body")[0].removeChild(container);
            isOpened = false;
        }
        var title = document.createElement("div");
        title.innerText = "Edit path filters";
        title.className = "bolt-header-title title-m l";
        var textList = document.createElement("textarea");
        var inputText = input.value;
        var listText = inputText.split(";").join("\n");
        textList.value = listText;
        textList.style = "height: 560px; resize: none; overflow: scroll; overflow-wrap: normal; white-space: nowrap; margin-top: 10px";
        var update = document.createElement("button");
        update.innerText = "Update";
        update.onclick = function() {
            var updatedValue = textList.value;
            setNativeValue(input, updatedValue.split("\n").join(";"));
            close();
        }
        var cancel = document.createElement("button");
        cancel.innerText = "Cancel";
        cancel.style = "float: right; margin-left: 10px"
        cancel.onclick = close;
        var buttonContainer = document.createElement("div");
        buttonContainer.style = "display: flex; flex-direction: row-reverse; margin-top: 10px"
        buttonContainer.appendChild(cancel);
        buttonContainer.appendChild(update);
        container.appendChild(title);
        container.appendChild(textList);
        container.appendChild(buttonContainer);
        document.getElementsByTagName("body")[0].appendChild(container);
        // container.style.display = "float";
    }
    return button;
}

function setNativeValue(element, value) {
    let lastValue = element.value;
    element.value = value;
    let event = new Event("input", { target: element, bubbles: true });
    // React 15
    event.simulated = true;
    // React 16
    let tracker = element._valueTracker;
    if (tracker) {
        tracker.setValue(lastValue);
    }
    element.dispatchEvent(event);
}

//on init perform based on chrome stroage value
window.onload=function(){  
    console.log("starting AzureDevOps path filter editor")
    var observer = new MutationObserver(function(mutations) {
        mutations.filter(function(mutation) { return mutation.type === "childList"; })
                 .forEach(function(mutation) {                    
                    mutation.addedNodes.forEach(function(node) {                  
                        if (node.nodeName === viewEditButtonElement || node.nodeType !== 1) {
                            return;
                        }
                        var labels = node.querySelectorAll("label");
                        var label;
                        labels.forEach(function(l) {
                            if(l.innerText === "Path filter (optional)" ||
                               l.innerText === "For pull request affecting these folders") {
                                label = l;
                            }
                        });
                        if(label === undefined) {
                            return;
                        }
                        var inputs = label.parentNode.querySelectorAll("input");
                        if(inputs.length !== 1) {
                            return;
                        }
                        var input = inputs[0];
                        var button = createButton(input);
                        var next = input.nextSibling;
                        if(next !== null &&
                           next.nodeName === viewEditButtonElement) {
                            return;
                        }
                        if(next !== null) {
                            next.insertBefore(button);
                        }
                        else {
                            input.parentNode.appendChild(button);
                        }
                    });
                 });
    });
    observer.observe(document, {
        childList: true,
        subtree: true
    });
}

