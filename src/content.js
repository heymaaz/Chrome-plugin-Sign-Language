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
// Synchronize play/pause with YouTube player function
function setupPlayPauseSynchronization(bslVideo) {
    document.addEventListener('click', event => {
        let element = event.target;
        while (element && !element.matches('.ytp-play-button')) {
            element = element.parentElement;
        }

        if (element) {
            // Use requestAnimationFrame to delay the synchronization after YouTube updates
            requestAnimationFrame(() => {
                // Re-check the state after the frame refreshes to ensure accuracy
                requestAnimationFrame(() => {
                    const isYouTubePlaying = element.getAttribute('aria-label').includes('Pause');
                    if (isYouTubePlaying) {
                        if (bslVideo.paused) {
                            bslVideo.play();
                        }
                    } else {
                        if (!bslVideo.paused) {
                            bslVideo.pause();
                        }
                    }
                });
            });
        }
    });
}

function continuousSynchronization(bslVideo) {
    let lastState = null; // Store the last known state

    const checkState = () => {
        // Assuming the YouTube player is embedded in an iframe or is otherwise accessible,
        // you might need to find the specific element representing the YouTube player
        // Here we are making a broad assumption on how to find this. You might need to adjust.
        const ytPlayer = document.querySelector('.html5-main-video');

        if (ytPlayer) {
            const isPlaying = !ytPlayer.paused;

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

    // Check every 500 milliseconds. You can adjust the interval as needed.
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
        //setupPlayPauseSynchronization(bslVideo);
        continuousSynchronization(bslVideo);
    } else {
        console.error('Could not find the insertion point for the video.');
    }
}


// Listen for the message from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "injectSignLanguage") {
        //injectSignLanguageVideo();
        injectMultipleSignLanguageVideos(); // Call the new function to inject the video player
    }
});