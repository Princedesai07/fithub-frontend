import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

import "./Assistant.css";

const STORAGE_MESSAGES = "fithub_ai_messages";
const STORAGE_CONVERSATION = "fithub_ai_conversation_id";

const initialMessage = {
  role: "assistant",
  content:
    "Hey! 👋 I'm FitHub AI. How can I help you with fitness products today?",
  products: [],
};

function Assistant() {
  const { isLoggedIn, loading: authLoading } = useAuth();

  const [messages, setMessages] = useState(() => {
    try {
      const savedMessages = sessionStorage.getItem(STORAGE_MESSAGES);

      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);

        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (error) {
      console.error("Unable to restore FitHub AI messages:", error);
    }

    return [initialMessage];
  });

  const [input, setInput] = useState("");

  const [conversationId, setConversationId] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_CONVERSATION) || null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  /*
    Save chat history.

    IMPORTANT:
    Do not save while AuthContext is still restoring
    the user's login state.

    Also do not save when logged out because logout
    should completely remove the previous user's chat.
  */
  useEffect(() => {
    if (authLoading || !isLoggedIn) {
      return;
    }

    try {
      sessionStorage.setItem(STORAGE_MESSAGES, JSON.stringify(messages));
    } catch (error) {
      console.error("Unable to save FitHub AI messages:", error);
    }
  }, [messages, isLoggedIn, authLoading]);

  /*
    Save conversation ID.

    Wait until authentication has finished restoring.
  */
  useEffect(() => {
    if (authLoading || !isLoggedIn) {
      return;
    }

    try {
      if (conversationId) {
        sessionStorage.setItem(STORAGE_CONVERSATION, conversationId);
      } else {
        sessionStorage.removeItem(STORAGE_CONVERSATION);
      }
    } catch (error) {
      console.error("Unable to save FitHub AI conversation:", error);
    }
  }, [conversationId, isLoggedIn, authLoading]);

  /*
    Clear the visible chat immediately after logout.

    IMPORTANT:
    authLoading prevents this from running during the
    temporary logged-out state while AuthContext is
    restoring the user after a page refresh.
  */
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      setMessages([initialMessage]);
      setConversationId(null);
      setInput("");
      setLoading(false);

      try {
        sessionStorage.removeItem(STORAGE_MESSAGES);
        sessionStorage.removeItem(STORAGE_CONVERSATION);
      } catch (error) {
        console.error("Unable to clear FitHub AI session:", error);
      }
    }
  }, [isLoggedIn, authLoading]);

  /*
    Automatically scroll to the latest message.
  */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  /*
    Simple greetings should NOT go to the product-search
    backend.

    Otherwise "hi" can accidentally become a product
    recommendation request.
  */
  function isSimpleGreeting(text) {
    const value = text.trim().toLowerCase();

    const greetings = [
      "hi",
      "hii",
      "hiii",
      "hiiii",
      "hello",
      "helo",
      "hey",
      "heyy",
      "heyyy",
      "yo",
      "namaste",
      "good morning",
      "good afternoon",
      "good evening",

      // Gujarati
      "kem cho",
      "kem chho",
      "majama",

      // Hindi
      "नमस्ते",
      "नमस्कार",
      "हाय",
      "हेलो",
    ];

    return greetings.includes(value);
  }

  /*
    Simple thanks should also receive a natural local reply.
  */
  function isSimpleThanks(text) {
    const value = text.trim().toLowerCase();

    const thanks = [
      "thanks",
      "thank you",
      "thank u",
      "thx",
      "thanks bro",
      "thank you bro",
      "ty",
      "ધન્યવાદ",
      "धन्यवाद",
    ];

    return thanks.includes(value);
  }

  /*
    Add a message to the chat.
  */
  function addMessage(role, content, products = []) {
    setMessages((previous) => [
      ...previous,
      {
        role,
        content,
        products,
      },
    ]);
  }

  /*
    Send message.
  */
  async function sendMessage() {
    const message = input.trim();

    if (!message || loading) {
      return;
    }

    setInput("");

    /*
      Reset textarea height.
    */
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    /*
      Show user's message immediately.
    */
    addMessage("user", message);

    /*
      Handle greetings locally.

      IMPORTANT:
      We return here, so "hi" never reaches /chat.
    */
    if (isSimpleGreeting(message)) {
      setTimeout(() => {
        addMessage(
          "assistant",
          "Hey! 👋 How can I help you with fitness products today?",
        );
      }, 250);

      return;
    }

    /*
      Handle thanks locally.
    */
    if (isSimpleThanks(message)) {
      setTimeout(() => {
        addMessage(
          "assistant",
          "You're welcome! 💪 Let me know whenever you need help finding or comparing fitness products.",
        );
      }, 250);

      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/chat", {
        message,
        conversationId,
      });

      const data = response.data;

      /*
        Save conversation ID.
      */
      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

      /*
        Convert backend product objects into
        normal product objects.
      */
      let products = Array.isArray(data.products)
        ? data.products.map((item) => item.product || item)
        : [];

      /*
        Fetch complete product information.

        This gives us image, brand, category,
        specifications, quality evidence, etc.
      */
      if (products.length > 0) {
        const detailedProducts = await Promise.all(
          products.map(async (product) => {
            if (!product?._id) {
              return product;
            }

            try {
              const productResponse = await api.get(`/products/${product._id}`);

              return {
                ...product,
                ...productResponse.data,
              };
            } catch (error) {
              console.error(`Unable to load product ${product._id}:`, error);

              return product;
            }
          }),
        );

        products = detailedProducts;
      }

      /*
        Add AI response.
      */
      addMessage(
        "assistant",
        data.message || "I couldn't generate a response.",
        products,
      );
    } catch (error) {
      console.error("FitHub AI error:", error);

      addMessage(
        "assistant",
        error.response?.data?.message ||
          "Sorry, I couldn't connect to FitHub AI right now. Please make sure the FitHub backend and Ollama are running.",
      );
    } finally {
      setLoading(false);
    }
  }

  /*
    Enter = send
    Shift + Enter = new line
  */
  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  /*
    Auto-expand textarea.
  */
  function handleInput(event) {
    setInput(event.target.value);

    const textarea = textareaRef.current;

    if (textarea) {
      textarea.style.height = "auto";

      textarea.style.height = Math.min(textarea.scrollHeight, 150) + "px";
    }
  }

  /*
    Restore complete product details for
    products already present in saved chat history.
  */
  useEffect(() => {
    if (authLoading || !isLoggedIn) {
      return;
    }

    let cancelled = false;

    async function loadMissingProductDetails() {
      const allProducts = [];

      messages.forEach((message) => {
        if (!Array.isArray(message.products)) {
          return;
        }

        message.products.forEach((product) => {
          if (product?._id) {
            allProducts.push(product);
          }
        });
      });

      const uniqueProducts = Array.from(
        new Map(allProducts.map((product) => [product._id, product])).values(),
      );

      const productsMissingDetails = uniqueProducts.filter(
        (product) => !product.image || !product.brandId,
      );

      if (productsMissingDetails.length === 0) {
        return;
      }

      try {
        const detailedProducts = await Promise.all(
          productsMissingDetails.map(async (product) => {
            try {
              const response = await api.get(`/products/${product._id}`);

              return {
                id: product._id,
                product: {
                  ...product,
                  ...response.data,
                },
              };
            } catch (error) {
              console.error(`Unable to load product ${product._id}:`, error);

              return null;
            }
          }),
        );

        if (cancelled) {
          return;
        }

        const productMap = new Map(
          detailedProducts
            .filter(Boolean)
            .map((item) => [item.id, item.product]),
        );

        if (productMap.size === 0) {
          return;
        }

        setMessages((previousMessages) =>
          previousMessages.map((message) => {
            if (!Array.isArray(message.products)) {
              return message;
            }

            return {
              ...message,
              products: message.products.map((product) => {
                const updatedProduct = productMap.get(product._id);

                return updatedProduct || product;
              }),
            };
          }),
        );
      } catch (error) {
        console.error("Unable to restore FitHub product details:", error);
      }
    }

    loadMissingProductDetails();

    return () => {
      cancelled = true;
    };
  }, [authLoading, isLoggedIn, messages]);

  /*
    Render normal text + **bold text**.
  */
  function renderFormattedText(text) {
    if (!text) {
      return null;
    }

    const lines = String(text).split("\n");

    return lines.map((line, index) => {
      const trimmedLine = line.trim();

      if (!trimmedLine) {
        return <div key={index} className="ai-message-space" />;
      }

      const isBullet =
        trimmedLine.startsWith("- ") || trimmedLine.startsWith("* ");

      const cleanLine = isBullet ? trimmedLine.substring(2) : trimmedLine;

      /*
        Split **bold** text.
      */
      const parts = cleanLine.split("**");

      const content = parts.map((part, partIndex) => {
        if (partIndex % 2 === 1) {
          return <strong key={partIndex}>{part}</strong>;
        }

        return <span key={partIndex}>{part}</span>;
      });

      if (isBullet) {
        return (
          <div key={index} className="ai-message-bullet">
            <span className="ai-bullet-dot">•</span>

            <span>{content}</span>
          </div>
        );
      }

      return (
        <p key={index} className="ai-message-paragraph">
          {content}
        </p>
      );
    });
  }

  return (
    <main className="assistant-page">
      <div className="assistant-container">
        {/* HEADER */}

        <div className="assistant-header">
          <div className="assistant-header-left">
            <div className="assistant-logo">AI</div>

            <div>
              <h1>FitHub AI</h1>

              <p>Your fitness product assistant</p>
            </div>
          </div>

          <Link to="/products" className="assistant-browse-btn">
            Browse Products
          </Link>
        </div>

        {/* CHAT */}

        <section className="assistant-chat">
          <div className="assistant-messages">
            {messages.map((message, index) => (
              <div
                key={`${index}-${message.role}`}
                className={`chat-message ${
                  message.role === "user" ? "user-message" : "assistant-message"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="message-avatar">AI</div>
                )}

                <div className="message-content">
                  <div className="message-name">
                    {message.role === "assistant" ? "FitHub AI" : "You"}
                  </div>

                  <div
                    className={
                      message.role === "user"
                        ? "user-bubble"
                        : "assistant-bubble"
                    }
                  >
                    {renderFormattedText(message.content)}
                  </div>

                  {/* PRODUCT CARDS */}

                  {message.products && message.products.length > 0 && (
                    <div className="assistant-products">
                      {message.products.map((product) => (
                        <div
                          className="assistant-product-card"
                          key={product._id}
                        >
                          {/* IMAGE */}

                          <div className="assistant-product-image">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                onError={(event) => {
                                  event.currentTarget.style.display = "none";

                                  const placeholder =
                                    event.currentTarget.parentElement?.querySelector(
                                      ".assistant-product-placeholder",
                                    );

                                  if (placeholder) {
                                    placeholder.style.display = "flex";
                                  }
                                }}
                              />
                            ) : null}

                            <div
                              className="assistant-product-placeholder"
                              style={{
                                display: product.image ? "none" : "flex",
                              }}
                            >
                              FitHub
                            </div>
                          </div>

                          {/* PRODUCT INFORMATION */}

                          <div className="assistant-product-info">
                            <h3>{product.name}</h3>

                            <p className="assistant-product-brand">
                              {product.brand ||
                                product.brandId?.name ||
                                "FitHub"}
                            </p>

                            <div className="assistant-product-meta">
                              <strong className="assistant-product-price">
                                ₹{Number(product.price).toLocaleString("en-IN")}
                              </strong>

                              <span className="assistant-product-rating">
                                ⭐ {product.rating}
                              </span>
                            </div>

                            <Link
                              to={`/products/${product._id}`}
                              className="assistant-view-product"
                            >
                              View Product
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* TYPING INDICATOR */}

            {loading && (
              <div className="chat-message assistant-message">
                <div className="message-avatar">AI</div>

                <div className="message-content">
                  <div className="message-name">FitHub AI</div>

                  <div className="assistant-bubble typing-bubble">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}

          <div className="assistant-input-area">
            <div className="assistant-input-wrapper">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Message FitHub AI..."
                rows={1}
                disabled={loading}
              />

              <button
                type="button"
                className="assistant-send-btn"
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                aria-label="Send message"
              >
                ↑
              </button>
            </div>

            <p className="assistant-input-hint">
              Enter to send · Shift + Enter for a new line
            </p>

            <p className="assistant-disclaimer">
              FitHub AI uses information from the FitHub catalogue to help with
              product discovery.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Assistant;
