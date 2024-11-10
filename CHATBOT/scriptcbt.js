function sendMessage() {
    const userInput = document.getElementById("user-input").value.trim();

    if (userInput) {
        addMessage(userInput, "user-message");
        generateBotResponse(userInput);
        document.getElementById("user-input").value = "";  // Clear input
    }
}

function addMessage(message, className) {
    const chatBox = document.getElementById("chat-box");
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", className);
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;  // Scroll to bottom
}

function generateBotResponse(userInput) {
    let botMessage = "I'm still learning. Could you ask something else?";
    
    // Simple keyword matching for responses
    if (userInput.toLowerCase().includes("hello")) {
        botMessage = "Hi there! How can I help you today?";
    } else if (userInput.toLowerCase().includes("bye")) {
        botMessage = "Goodbye! Have a great day!";
    } else if (userInput.toLowerCase().includes("how are you")) {
        botMessage = "I'm just a bot, but I'm here to help!";
    }

    // Bot responds after a short delay
    setTimeout(() => {
        addMessage(botMessage, "bot-message");
    }, 500);
}
