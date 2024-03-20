<script setup>
import { ref } from 'vue'

defineProps({
  msg: String
})

const count = ref(0)
</script>

<template>
  <div v-if="onYoutube">
    <button @click="injectSignLanguage">Inject/Start Sign Language</button>
  </div>
  <div v-else>

    <h1>{{ msg }}</h1>
    <!--
      <p>
        Recommended IDE setup:
        <a href="https://code.visualstudio.com/" target="_blank">VS Code</a>
        +
        <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
      </p>
      
      <p>
        <a href="https://vitejs.dev/guide/features.html" target="_blank">
          Vite Documentation
        </a>
        |
        <a href="https://v3.vuejs.org/" target="_blank">Vue 3 Documentation</a>
      </p>
      
      <button type="button" @click="count++">count is: {{ count }}</button>
      <p>
        Edit
        <code>components/HelloWorld.vue</code> to test hot module replacement.
      </p>
      <div>
        <button @click="injectSignLanguage">Inject/Start Sign Language</button>
      </div>
    -->
  </div>
  
</template>

<script>
import { ref, onMounted } from 'vue'
export default {
  data() {
    return {
      currentTabUrl: ''
    }
  },
  methods: {
    
    injectSignLanguage() {
      // This method is called when the user clicks the "Inject/Start Sign Language" button
      // It creates a video player and injects it into the current tab as the first child of the div id "secondary-inner"
      
      // Check if the user is on a Youtube video page
      if (! this.onYoutube) {
        alert("You are not on a Youtube video page!");
        return;
      }

      // Send a message to your background script
      chrome.runtime.sendMessage({action: "injectSignLanguage"});

      /*
      // Send a message to your background script to initiate sign language injection
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        
        // Send a message to your background script with the correct video URL
        chrome.runtime.sendMessage({ action: "injectSignLanguage", videoUrl: tabs[0].url });
      });
      */
    }
  },
  computed: {
    onYoutube: function() {
      if (! this.currentTabUrl) {
        return false;
      }
      if (this.currentTabUrl.includes("youtube.com/watch?v")) {
        return true;
      }
      //return "You are not on Youtube!: "+this.currentTabUrl;
      return false;
    }
  },
  mounted() {
    // Fetch the current tab's URL when the component is mounted
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // Set the currentTabUrl data property
      if (tabs.length > 0 && tabs[0].url) {
        this.currentTabUrl = tabs[0].url;
      }
    });
  }
}
</script>

<style scoped>
a {
  color: #42b983;
}
</style>
