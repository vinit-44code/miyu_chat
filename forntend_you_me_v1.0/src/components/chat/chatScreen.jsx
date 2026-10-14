
import { useEffect, useRef, useState } from "react";
import "./chatScreen.css";

export default function ChatScreen({ selectedConvo, Me, onBack ,  socket }) {

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const otherUser = selectedConvo?.participents?.find(
    (u) => String(u._id) !== String(Me?._id)
  );

                          useEffect(() => {
    if (!selectedConvo?._id) {
      setMessages([]);
      return;
    }

    let cancelled = false;

    async function loadMessages() {
      try {
        const res = await fetch(
          `http://localhost:3000/api/messages/${selectedConvo._id}`,
          { credentials: "include" }
        );

        if (!res.ok) throw new Error("Could not load messages");

        const data = await res.json();
        if (!cancelled) setMessages(data);
      } catch (err) {
        console.error(err);
      }
    }

    loadMessages();

    return () => { cancelled = true; };
                             }, [selectedConvo?._id]);



                                useEffect(() => {
                  if (!socket || !selectedConvo?._id) return;

                          const handleNewMessage = (message) => {

                               if (
                                       String(message.converasation_id) !==
                                        String(selectedConvo._id)
                                               ) {
                                         return;
                                                   }
                                         socket.on("newMessage", handleNewMessage);

                                    setMessages((prev) => {
                                        const exists = prev.some(
                                                (msg) => String(msg._id) === String(newMessage._id)
                                                              );

                                                      if (exists) return prev;
 
                                               return [...prev, newMessage];
                                            });
                                            };

   

                                             return () => {
        socket.off("newMessage", handleNewMessage);
    };
                            }, [socket, selectedConvo?._id]);



                            useEffect(() => {
                       bottomRef.current?.scrollIntoView({ behavior: "smooth" });
                                 }, [messages]);





                 const handleSend = async (e) => {
                            e.preventDefault();
                             const content = messageText.trim();

                            if (!content || sending || !selectedConvo?._id) return;

                                      setSending(true);

                                  try {
                           const res = await fetch("http://localhost:3000/api/message", {

                                                  method: "POST",
                                                  headers: { "Content-Type": "application/json" },
                                                  credentials: "include",
                                                  body: JSON.stringify({
                                                   content,
                                                    converasation_id: selectedConvo._id,
                                                    }),
                                             });

                                                  if (!res.ok) throw new Error("Could not send message");

                                       const saved = await res.json();
                                  setMessages((prev) => [...prev, saved]);
                                                setMessageText("");

                                    } 
                                    
                                    catch (err) {
                                   console.error(err);
                                        } finally {
                                    setSending(false);
                                                  }
                           };




                           if (!selectedConvo) return null;

                   const username = otherUser?.Username ?? "Unknown user";
                        const initials = username.slice(0, 2).toUpperCase();

  return (
    <section className="chat-screen">
      {/* Top application navigation */}
      <nav className="cs-topnav">
        <div className="cs-tabs">
          <span className="cs-tab active">Chat</span>
          <span className="cs-tab">Account Switch</span>
        </div>

        <div className="cs-top-actions">
          <button aria-label="Search">⌕</button>
          <button aria-label="Call">♧</button>
          <button className="cs-account" aria-label="Account">♙</button>
        </div>
      </nav>

      {/* Conversation header */}
      <header className="cs-conversation-header">
        <button className="cs-back" onClick={onBack} aria-label="Back">
          ←
        </button>

        <div className="cs-avatar">
          {initials}
          <span className="cs-online-dot" />
        </div>

        <div className="cs-contact">
          <div className="cs-name-row">
            <h2>{username}</h2>
            <span className="cs-status">Conversation</span>
          </div>
          <p>Personal one-to-one space</p>
        </div>

        <div className="cs-header-actions">
          <button title="Call">♧</button>
          <button title="Video call">▣</button>
          <button title="Information">ⓘ</button>
          <button title="More options">⋮</button>
        </div>
      </header>

      {/* Main conversation and contact information */}
      <div className="cs-workspace">
        <main className="cs-chat-column">
          <div className="cs-encryption-notice">
            <span>♙</span>
            Personal conversation
          </div>

          <div className="cs-messages">
            {messages.length === 0 ? (
              <div className="cs-empty">
                <div className="cs-empty-icon">✉</div>
                <h3>Start the conversation</h3>
                <p>Send your first message to {username}.</p>
              </div>
            ) : (
              messages.map((msg) => {
                const senderId =
                  typeof msg.sender_id === "object"
                    ? msg.sender_id?._id
                    : msg.sender_id;

                const mine = String(senderId) === String(Me?._id);

                const ids = messages.map((msg) => msg._id);



                return (
                  <div
                    key={msg._id}
                    className={`cs-message-row ${mine ? "mine" : "theirs"}`}
                  >
                    {!mine && (
                      <div className="cs-small-avatar">{initials}</div>
                    )}

                    <div className="cs-message-content">
                      <div className="cs-message-meta">
                        <span>{mine ? "You" : username}</span>
                        <time>
                          {msg.createdAt &&
                            new Date(msg.createdAt).toLocaleTimeString(
                              "en-IN",
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                        </time>
                      </div>

                      <div className="cs-bubble">{msg.content}</div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>

          <form className="cs-composer" onSubmit={handleSend}>
            <button type="button" className="cs-attach" title="Attachment">
              ♧
            </button>

            <input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder={`Type a message to ${username}... (Press Enter to send)`}
              aria-label="Message"
            />

            <button
              type="submit"
              className="cs-send"
              disabled={!messageText.trim() || sending}
              aria-label="Send message"
            >
              ➤
            </button>
          </form>
        </main>

        {/* Right-side contact panel */}
        <aside className="cs-profile">
          <div className="cs-profile-avatar">{initials}</div>
          <h2>{username}</h2>
          <p className="cs-profile-subtitle">MiYu Chat contact</p>

          <div className="cs-availability">
            <span /> Conversation participant
          </div>

          <div className="cs-profile-actions">
            <button><span>♧</span>Call</button>
            <button><span>♩</span>Mute</button>
            <button><span>☆</span>Starred</button>
          </div>

          <div className="cs-shared-heading">
            <h3>Conversation details</h3>
          </div>

          <div className="cs-detail-card">
            <div className="cs-detail-icon">▤</div>
            <div>
              <strong>One-to-one chat</strong>
              <p>{messages.length} messages</p>
            </div>
          </div>

          <div className="cs-detail-card">
            <div className="cs-detail-icon teal">↔</div>
            <div>
              <strong>Participants</strong>
              <p>You and {username}</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
