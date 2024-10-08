const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatWindow = document.querySelector(".chat-window");
const chatBotOpener = document.querySelector(".chatbot-opener");
const chatBotCloseBtn = document.querySelector(".close-btn");

let userMessage;
//Please utilize your own Gemeni
const API_KEY = "";
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    // Creating a chat line element with the passed message and class name.
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing-chat" ? `<p></p>` : `<span class="material-symbols-outlined">support_agent</span><p></p>`
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

const generateResponse = (incomingChatLi) => {
    const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`
    const messageElement = incomingChatLi.querySelector("p");

    //Building the API call through a POST method
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contents: [{role: "user", parts: [{text: userMessage}]}]
        }),
    }

    //Response from POST request
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.candidates[0].content.parts[0].text; // Update message text with API response
    }).catch((error) => {
        messageElement.classList.add("error");
        messageElement.textContent = "Something went wrong.";
    }).finally(() => chatWindow.scrollTo(0, chatbox.scrollHeight));
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    //Appending the user's message to the chat window
    chatWindow.appendChild(createChatLi(userMessage, "outgoing-chat"));
    chatWindow.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        //Showing a default message while waiting for a response
        const incomingChatLi = createChatLi("Thinking...", "incoming-chat");
        chatWindow.appendChild(incomingChatLi);
        chatWindow.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);   
    }, 600);

};

chatInput.addEventListener("input", () => {
    //Auto adujusting height based on input
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
})

chatInput.addEventListener("keydown", (e) => {
    //Allowing the use of the enter key to send messages
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
})

chatBotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatBotOpener.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
sendChatBtn.addEventListener("click", handleChat);