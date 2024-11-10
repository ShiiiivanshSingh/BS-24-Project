document.addEventListener("DOMContentLoaded", () => {
    const newsContainer = document.getElementById("news-container");
    const apiKey = "7901f47c1f83448d8f811e685e09e074"; // Replace with your News API key
    const url = `https://newsapi.org/v2/everything?q=natural+disaster+OR+earthquake+OR+flood+OR+hurricane+OR+tsunami+OR+wildfire+OR+volcano&language=en&sortBy=popularity&apiKey=${apiKey}`;
    let page = 1; // Page counter for pagination
    let totalResults = 0; // Total number of results available in API response

    // List of keywords related to disasters to filter articles
    const disasterKeywords = [
        "disaster", "earthquake", "flood", "hurricane", "tsunami", 
        "wildfire", "volcano", "natural disaster", "storm", "catastrophe",
        "drought", "famine", "avalanche", "extreme weather", "emergency"
    ];

    // Fetch news from the API
    function fetchNews(page = 1) {
        const paginatedUrl = `${url}&page=${page}`;

        console.log(`Fetching page ${page}...`);

        fetch(paginatedUrl, {
            cache: 'no-cache'  // Ensure we get fresh data by disabling caching
        })
        .then(response => {
            if (response.status === 426) {
                throw new Error('Rate limit exceeded. Please try again later.');
            }
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            return response.json();
        })
        .then(data => {
            console.log("Data received:", data);

            const articles = data.articles;
            if (!articles || articles.length === 0) {
                console.log("No articles found.");
                newsContainer.innerHTML = "<p>No relevant news found.</p>";
                return;
            }

            totalResults = data.totalResults; // Update the total results
            const filteredArticles = filterDisasterArticles(articles); // Filter articles based on disaster keywords
            const uniqueArticles = getUniqueArticles(filteredArticles); // Get unique articles
            displayNews(uniqueArticles);
        })
        .catch(error => {
            console.error("Error fetching news:", error);
            newsContainer.innerHTML = `<p>${error.message}</p>`;
        });
    }

    // Filter articles based on disaster-related keywords in title or description
    function filterDisasterArticles(articles) {
        return articles.filter(article => {
            const title = article.title.toLowerCase();
            const description = (article.description || "").toLowerCase();

            // Check if any of the disaster-related keywords exist in title or description
            return disasterKeywords.some(keyword => title.includes(keyword) || description.includes(keyword));
        });
    }

    // Filter out repeated articles based on title and ensure only a limited number are shown
    function getUniqueArticles(articles) {
        const seenTitles = new Set();
        const uniqueArticles = [];
        
        // Shuffle the articles to ensure randomness
        const shuffledArticles = shuffleArray(articles);

        // Filter unique articles (no duplicates by title)
        for (const article of shuffledArticles) {
            if (!seenTitles.has(article.title)) {
                seenTitles.add(article.title);
                uniqueArticles.push(article);
            }

            // Stop once we have 9 unique articles
            if (uniqueArticles.length === 9) {
                break;
            }
        }

        return uniqueArticles;
    }

    // Shuffle the articles randomly
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Display news articles dynamically
    function displayNews(articles) {
        if (articles.length === 0) {
            newsContainer.innerHTML = "<p>No articles to display.</p>";
        } else {
            articles.forEach(article => {
                const newsItem = document.createElement("div");
                newsItem.classList.add("news-item");

                // Only display the article if it has a valid image
                if (article.urlToImage) {
                    newsItem.innerHTML = `
                        <img src="${article.urlToImage}" alt="news image" class="news-image">
                        <h3>${article.title}</h3>
                        <p>${article.description || "No description available"}</p>
                        <a href="${article.url}" target="_blank">Read more</a>
                    `;
                    newsContainer.appendChild(newsItem);
                }
            });
        }
    }

    // Detect when user scrolls to the bottom of the page to load more articles
    function onScroll() {
        // If user is near the bottom of the page
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
            // Make sure there are still more articles to load
            if (page * 9 < totalResults) {
                page++; // Increment the page number
                console.log(`Fetching page ${page}...`);
                fetchNews(page); // Fetch the next page of news
            }
        }
    }

    // Attach scroll event listener to trigger loading more articles
    window.addEventListener("scroll", onScroll);

    // Initial load of news
    fetchNews(page);
});
