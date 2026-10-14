import "./mainChat.css"
import { useState,useEffect } from "react";

export default function MainChat({selectedConvo}){
       
         const [messages, setMessages] = useState([]);
       
       useEffect(() => {
         if (!selectedConvo?._id) {
           setMessages([]);
           return;
         }
       
         const FetchMessages = async () => {
           try {
             const res = await fetch(
               `http://localhost:3000/api/messages/${selectedConvo._id}`,
               { credentials: "include" }
             );
       
             if (!res.ok) {
               throw new Error("Failed to fetch messages");
             }
       
             const data = await res.json();
             setMessages(data);
           } catch (err) {
             console.error("Message fetch failed:", err);
           }
         };
       
         FetchMessages();
       }, [selectedConvo?._id]);
       
     
     
     return(<>
        
        <section id="first-screen">


                    <div className="header-top">

                         </div>

                           <div className="main-block">

                   
                                    <div className="decor"></div>

                                   <div className="wellcome-block">

                                      <div className="logo-chat"></div>

                                    <h1>Select a conversation to start chatting</h1>
                                       <p>Choose from your existing conversations on the left or search for a contact to begin a private, distraction-free 1-to-1 conversation.</p>
                          
                                                       <div className="quike-actions">

                                                             <button><span>start new chat</span></button>
                                                                 <button>diractory</button>
                                                        </div>

                                    <div className="navigations">

                                   <div></div>
                                 <div></div>
                                 <div></div>


                                 </div>


                                 <div className="end-to-end">

                                    <span>
End-to-end encrypted</span>
                                    <span>• 
Zero public feeds</span>
                                    <span>
•
Distraction-free</span>
                                 </div>
                          </div>



                    </div>




        </section>
    
    
    </>)
}