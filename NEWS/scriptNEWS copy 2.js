document.addEventListener("DOMContentLoaded", () => {
    const newsContainer = document.getElementById("news-container");
    const apiKey = "7901f47c1f83448d8f811e685e09e074";  // Replace with your News API key
    const url = `https://newsapi.org/v2/everything?q=natural+disaster+OR+earthquake+OR+flood+OR+hurricane+OR+tsunami+OR+wildfire+OR+volcano&language=en&sortBy=popularity&apiKey=${apiKey}`;
    let page = 1;
    let totalResults = 0;

    // Disaster-related keywords
    const disasterKeywords = [
        "disaster", "earthquake", "flood", "hurricane", "tsunami", 
        "wildfire", "volcano", "natural disaster", "catastrophe", "drought", 
        "famine", "avalanche", "extreme weather", "emergency"
    ];

    // Fetch and display news articles
    function fetchNews(page = 1) {
        const paginatedUrl = `${url}&page=${page}`;
        console.log(`Fetching page ${page}...`);

        fetch(paginatedUrl, { cache: 'no-cache' })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 426) {
                        throw new Error('Rate limit exceeded. Please try again later.');
                    }
                    throw new Error('Failed to fetch data');
                }
                return response.json();
            })
            .then(data => {
                console.log("Data received:", data);
                const articles = data.articles;
                if (!articles || articles.length === 0) {
                    newsContainer.innerHTML = "<p>No relevant news found.</p>";
                    return;
                }
                totalResults = data.totalResults;
                const filteredArticles = filterArticles(articles);
                const uniqueArticles = getUniqueArticles(filteredArticles);
                displayArticles(uniqueArticles);
            })
            .catch(error => {
                console.error("Error fetching news:", error);
                if (error.message === 'Rate limit exceeded. Please try again later.') {
                    newsContainer.innerHTML = "<p>Rate limit exceeded. Please try again later.</p>";
                } else {
                    newsContainer.innerHTML = "<p>Failed to load news. Please try again later.</p>";
                }
            });
    }

    // Filter articles based on disaster-related keywords
    function filterArticles(articles) {
        return articles.filter(article => {
            const title = article.title.toLowerCase();
            const description = (article.description || "").toLowerCase();
            return disasterKeywords.some(keyword => title.includes(keyword) || description.includes(keyword));
        });
    }

    // Ensure articles are unique by title and shuffle
    function getUniqueArticles(articles) {
        const seenTitles = new Set();
        const uniqueArticles = [];
        const shuffledArticles = shuffleArray(articles);

        for (const article of shuffledArticles) {
            if (!seenTitles.has(article.title)) {
                seenTitles.add(article.title);
                uniqueArticles.push(article);
            }
            if (uniqueArticles.length === 9) break;
        }
        return uniqueArticles;
    }

    // Shuffle articles randomly
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Display news articles in the container
    function displayArticles(articles) {
        newsContainer.innerHTML = "";
        if (articles.length === 0) {
            newsContainer.innerHTML = "<p>No articles to display.</p>";
        } else {
            articles.forEach(article => {
                const newsItem = document.createElement("div");
                newsItem.classList.add("news-item");
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

    // Load more articles when scrolling near the bottom
    function onScroll() {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
            if (page * 9 < totalResults) {
                page++;
                console.log(`Fetching page ${page}...`);
                fetchNews(page);
            }
        }
    }

    // Attach scroll event listener for infinite scrolling
    window.addEventListener("scroll", onScroll);

    // Initial news load
    fetchNews(page);
});
