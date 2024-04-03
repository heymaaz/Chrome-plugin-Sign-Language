console.log("Content script for YouTube BSL Interpreter extension is running.");


// Synchronize play/pause with YouTube player function
function continuousSynchronization(bslVideo) {
    let lastState = null; // Store the last known state

    const checkState = () => {
        // Find the YouTube video player
        const ytPlayer = document.querySelector('.html5-main-video');

        if (ytPlayer) {
            const isPlaying = !ytPlayer.paused;// Check if the video is playing

            // Check if the state has changed since last check
            if (isPlaying !== lastState) {
                if (isPlaying) {
                    bslVideo.play();
                } else {
                    bslVideo.pause();
                }
                lastState = isPlaying; // Update last known state
            }
        }
    };

    // Check every 500 milliseconds. if the state has changed
    setInterval(checkState, 500);
}


// New function to inject the video player with multiple video sources
function injectMultipleSignLanguageVideos() {
    // Array of video sources
    const videoSources = [
        "https://media.signbsl.com/videos/bsl/signstation/ME.mp4",
        "https://media.signbsl.com/videos/bsl/gpnhs/mp4/professor.mp4",
        "https://media.signbsl.com/videos/bsl/signstation/your.mp4",
        "https://media.signbsl.com/videos/bsl/signstation/computer.mp4",
        "https://media.signbsl.com/videos/bsl/signstation/science.mp4"
        // Add more video URLs here
    ];
    let currentVideoIndex = 0; // Index to track the current video

    // Create video element
    const videoElement = document.createElement('video');
    videoElement.id = 'bslVideo';
    videoElement.muted = true; // Mute the video
    videoElement.controls = true; // Hide browser controls
    videoElement.autoplay = true;
    videoElement.width = 640;
    videoElement.height = 360;

    // Function to play the next video
    function playNextVideo() {
        if (currentVideoIndex < videoSources.length) {
            videoElement.src = videoSources[currentVideoIndex];
            videoElement.play().catch(e => console.error(e));
            currentVideoIndex++;
        } else {
            console.log('All videos played.');
        }
    }

    videoElement.addEventListener('ended', playNextVideo); // Add event listener for when each video ends

    // Find the insertion point for the video player in the DOM
    const secondaryInner = document.getElementById('secondary-inner');
    if (secondaryInner) {
        secondaryInner.insertBefore(videoElement, secondaryInner.firstChild);
        playNextVideo(); // Start playing the first video immediately after insertion
        
        let bslVideo = document.getElementById('bslVideo'); 
        continuousSynchronization(bslVideo);
    } else {
        console.error('Could not find the insertion point for the video.');
    }
}


// Listen for the message from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "injectSignLanguage") {
        injectMultipleSignLanguageVideos(); // Call the new function to inject the video player
        console.log("Injected sign language player for video with ID: " + request.videoID);
    }
});