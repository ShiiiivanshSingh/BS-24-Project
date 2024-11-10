document.addEventListener("DOMContentLoaded", () => {
    const newsContainer = document.getElementById("news-container");
    const apiKey = "7901f47c1f83448d8f811e685e09e074"; // Replace with your News API key
    const url = `https://newsapi.org/v2/everything?q=natural+disaster+OR+earthquake+OR+flood+OR+hurricane+OR+tsunami+OR+wildfire+OR+volcano&language=en&sortBy=popularity&apiKey=${apiKey}`;
    let page = 1; // Page counter for pagination
    let totalResults = 0; // Total number of results available in API response

    // List of keywords related to disasters to filter articles
    const disasterKeywords = [
        "disaster", "earthquake", "flood", "hurricane", "tsunami", 
        "wildfire", "volcano", "natural disaster", "catastrophe",
        "drought", "famine", "avalanche", "extreme weather", "emergency"
    ];

    // Fetch news from the API
    function fetchNews(page = 1) {
        const paginatedUrl = `${url}&page=${page}`;

        fetch(paginatedUrl, {
            cache: 'no-cache'  // Ensure we get fresh data by disabling caching
        })
        .then(response => response.json())
        .then(data => {
            const articles = data.articles;
            totalResults = data.totalResults; // Update the total results
            const filteredArticles = filterDisasterArticles(articles); // Filter articles based on disaster keywords
            const uniqueArticles = getUniqueArticles(filteredArticles); // Get unique articles
            displayNews(uniqueArticles);
        })
        .catch(error => {
            console.error("Error fetching news:", error);
            newsContainer.innerHTML = "<p>Failed to load news. Please try again later.</p>";
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

    // Filter out repeated articles based on title and ensure only 20 articles are shown
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

            // Stop once we have 20 unique articles
            if (uniqueArticles.length === 20) {
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
        // Clear previous news items
        newsContainer.innerHTML = '';

        // Display each article inside a news item card
        articles.forEach(article => {
            const newsItem = document.createElement("div");
            newsItem.classList.add("news-item");

            // Only display the article if it has a valid image
            if (article.urlToImage) {
                // Add image, title, description, and link to each news item
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

    // Initial load of news
    fetchNews(page);
});
