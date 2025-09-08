import React, { useContext, useState, useEffect, useRef } from "react";
import "./Main.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";

const Main = () => {
  const {
    onSent,
    recentPrompt,
    showResult,
    loading,
    resultData,
    setInput,
    input,
  } = useContext(Context);

  // Local chat history
  const [chats, setChats] = useState([]);
  const prevRecentPromptRef = useRef();
  const chatEndRef = useRef(null);

  // Add a new chat when a new prompt is sent
  useEffect(() => {
    if (!recentPrompt) return;

    if (prevRecentPromptRef.current === recentPrompt) return;
    prevRecentPromptRef.current = recentPrompt;

    const id = Date.now();
    setChats((prev) => [
      ...prev,
      {
        id,
        prompt: recentPrompt,
        response: null, // initially empty, loader will show
      },
    ]);
  }, [recentPrompt]);

  // Update the last chat with the response when resultData changes
  useEffect(() => {
    if (resultData == null) return;

    setChats((prev) => {
      if (prev.length === 0) return prev;
      const newChats = [...prev];
      newChats[prev.length - 1] = {
        ...newChats[prev.length - 1],
        response: resultData,
      };
      return newChats;
    });
  }, [resultData]);

  // Auto-scroll to bottom when chats update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  return (
    <div className="main">
      <div className="nav">
        <p>Nova</p>
        <img src={assets.user_icon} alt="" />
      </div>

      <div className="main-container">
        {/* If no chats yet, show greeting */}
        {chats.length === 0 ? (
          <div className="greet">
            <p>
              <span>Hello, Tirth.</span>
            </p>
            <p>How can I help you today?</p>
          </div>
        ) : (
          <div className="chat-list">
            {chats.map((chat) => (
              <div className="result" key={chat.id}>
                <div className="result-title">
                  <img src={assets.user_icon} alt="user" />
                  <p>{chat.prompt}</p>
                </div>
                <div className="result-data">
                  <img src={assets.gemini_icon} alt="ai" />
                  {chat.response ? (
                    <p dangerouslySetInnerHTML={{ __html: chat.response }}></p>
                  ) : (
                    <div className="loader">
                      <hr className="animated-bg" />
                      <hr className="animated-bg" />
                      <hr className="animated-bg" />
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <input
              type="text"
              placeholder="Enter a prompt here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && input.trim() !== "") {
                  onSent();
                }
              }}
            />
            <div>
              <img src={assets.gallery_icon} width={30} alt="" />
              <img src={assets.mic_icon} width={30} alt="" />
              {input ? (
                <img
                  onClick={() => onSent()}
                  src={assets.send_icon}
                  width={30}
                  alt=""
                />
              ) : null}
            </div>
          </div>
          <p className="bottom-info">
            This is a clone. No database is used, so your chats will disappear
            if you refresh or open a new session.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
