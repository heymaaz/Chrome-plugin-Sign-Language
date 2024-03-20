console.log("Background service worker for YouTube BSL Interpreter extension is running.");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "injectSignLanguage") {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (tabs.length > 0) {
                // Send a message to the content script in the active tab
                chrome.tabs.sendMessage(tabs[0].id, {action: "injectSignLanguage"});
            }
        });
        console.log("Attempted to inject sign language player for video.");
    }
});

  