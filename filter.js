// ==UserScript==
// @name         Hide Tweets by Filter List (Usernames and Keywords)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Hide tweet containers containing specific keywords or from specific usernames on Twitter/X
// @author       Your Name
// @match        https://twitter.com/*
// @match        https://*.x.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const externalFileURL = "https://cdn.jsdelivr.net/gh/Eonarchy/p2025/filter.json"; // Replace with the URL to your JSON file
    let keywords = [];
    let usernames = [];

    // Function to fetch external data
    const fetchFilters = async () => {
        try {
            const response = await fetch(externalFileURL);
            if (!response.ok) {
                console.error(`Failed to fetch filter data: ${response.statusText}`);
                return;
            }
            const data = await response.json();
            keywords = data.keywords || [];
            usernames = data.usernames || [];
        } catch (error) {
            console.error("Error fetching filter data:", error);
        }
    };

    // Function to hide containers with tweets containing specific keywords or from specific usernames
    const hideTweetContainers = () => {
        const containers = document.querySelectorAll('div.css-175oi2r[style*="transform"]');

        containers.forEach(container => {
            const tweetText = container.innerText.toLowerCase();
            const usernameElement = container.querySelector('span.css-1jxf684.r-bcqeeo.r-1ttztb7.r-qvutc0.r-poiln3');
            const username = usernameElement ? usernameElement.innerText.toLowerCase() : '';

            const containsKeyword = keywords.some(keyword => tweetText.includes(keyword.toLowerCase()));
            const isBlockedUsername = usernames.some(blockedUser => username.includes(blockedUser.toLowerCase()));

            if (containsKeyword || isBlockedUsername) {
                container.style.display = 'none';
            }
        });
    };

    // Initialize the script
    const initialize = async () => {
        await fetchFilters(); // Load the external data
        hideTweetContainers(); // Initial run

        // Observe DOM changes for dynamically loaded tweets
        const observer = new MutationObserver(hideTweetContainers);
        const targetNode = document.body;
        const config = { childList: true, subtree: true };
        observer.observe(targetNode, config);
    };

    initialize();
})();
