console.log("Content script for YouTube BSL Interpreter extension is running.");

// Function to inject the video
function injectSignLanguageVideo() {
    const video = document.createElement('video');
    video.src = 'https://www.w3schools.com/html/mov_bbb.mp4';
    video.controls = true;
    video.autoplay = true;
    video.width = 640;
    video.height = 360;

    const secondaryInner = document.getElementById('secondary-inner');
    if (secondaryInner) {
        secondaryInner.insertBefore(video, secondaryInner.firstChild);
    } else {
        console.error('Could not find the insertion point for the video.');
    }
}

// Listen for the message from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "injectSignLanguage") {
        injectSignLanguageVideo();
    }
});
