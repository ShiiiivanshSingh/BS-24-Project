document.addEventListener('DOMContentLoaded', function() {
    const newPostForm = document.getElementById('newPostForm');
    const errorMessage = document.getElementById('errorMessage');

    // Function to create a new post
    function createPost(userName, postContent, timeString) {
        const newPost = document.createElement('div');
        newPost.classList.add('post-card');
        
        newPost.innerHTML = `
            <div class="post-header">
                <h3>${userName || 'Anonymous'}</h3>
                <span>${timeString}</span>
            </div>
            <p>${postContent}</p>
            <button class="reply-btn">Reply</button>
            <div class="replies"></div> <!-- Container for replies -->
            <div class="reply-form" style="display:none;">
                <input type="text" class="reply-input" placeholder="Write a reply..." />
                <button class="submit-reply">Submit Reply</button>
            </div>
        `;
        
        return newPost;
    }

    // Function to create a reply
    function createReply(userName, replyContent, timeString) {
        const reply = document.createElement('div');
        reply.classList.add('reply');
        reply.innerHTML = `
            <div class="post-header">
                <h3>${userName || 'Anonymous'}</h3>
                <span>${timeString}</span>
            </div>
            <p>${replyContent}</p>
        `;
        
        reply.style.backgroundColor = '#f0f0f0'; // Light gray background for replies
        reply.style.padding = '10px';
        reply.style.marginLeft = '20px'; // Indent replies to show nesting
        
        return reply;
    }

    // Handle form submission
    newPostForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form submission and page reload

        const userName = document.getElementById('userName').value;
        const postContent = document.getElementById('postContent').value;

        // Validate post content
        if (postContent.trim() === '') {
            errorMessage.style.display = 'block'; // Show error message
            return;
        }

        errorMessage.style.display = 'none'; // Hide error message

        // Get the current time for the timestamp
        const timestamp = new Date();
        const timeString = `${timestamp.getHours()}:${String(timestamp.getMinutes()).padStart(2, '0')}`;

        // Create new post and append it
        const newPost = createPost(userName, postContent, timeString);
        const forumPosts = document.querySelector('.forum-posts');
        forumPosts.appendChild(newPost);

        // Clear form inputs
        document.getElementById('userName').value = '';
        document.getElementById('postContent').value = '';

        // Handle reply button logic
        const replyButton = newPost.querySelector('.reply-btn');
        const replyForm = newPost.querySelector('.reply-form');
        const replyInput = newPost.querySelector('.reply-input');
        const replyContainer = newPost.querySelector('.replies');

        replyButton.addEventListener('click', function() {
            replyForm.style.display = replyForm.style.display === 'none' ? 'block' : 'none';
        });

        // Handle reply submission
        const submitReplyButton = newPost.querySelector('.submit-reply');
        submitReplyButton.addEventListener('click', function() {
            const replyContent = replyInput.value.trim();

            if (replyContent !== '') {
                const reply = createReply(userName, replyContent, timeString);
                replyContainer.appendChild(reply);

                // Clear reply input and hide form
                replyInput.value = '';
                replyForm.style.display = 'none';
            }
        });
    });
});
