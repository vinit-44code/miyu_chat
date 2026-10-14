import { useEffect, useState ,useRef} from "react"
import MainChat from "../components/chat/mainChat"
import Sidebar from "../components/chat/sidebar"
import ChatScreen from "../components/chat/chatScreen"
import { io } from "socket.io-client";
import "./appLayout.css"

export default function MainMe(){


  
      const [Me,SetMe] = useState(null);
      const [convo,SetConvo] =useState([]);
       


            const [selectedConvo, setSelectedConvo] = useState(null);

            const socketRef = useRef(null);
            const selectedConvoRef = useRef(null);
 

                      useEffect(() => {
                           const socket = io("http://localhost:3000", {
                          withCredentials: true
                            });

                              
let lastActivitySent = 0;

const sendActivity = () => {
  const now = Date.now();

  // Send activity at most once every 15 seconds
  if (now - lastActivitySent < 15000) return;

  lastActivitySent = now;
  if (socket.connected) {
    socket.emit("activity");
  }
};

document.addEventListener("pointerdown", sendActivity);
document.addEventListener("keydown", sendActivity);
document.addEventListener("touchstart", sendActivity);




                          socketRef.current = socket;

                         socket.on("connect", () => {
                                      console.log("Connected:", socket.id);
                                  });

                             socket.on("connect_error", (err) => {
                                   console.log("Connection error:", err.message);
                                       });

                            socket.on("newMessage", handleNewMessage);

                                    const convoId = selectedConvoRef.current;

                                               if (convoId) {
                                                              socket.emit("joinConversation", convoId);
                                                            }

                                   return () => {
                                          document.removeEventListener("pointerdown", sendActivity);
                                          document.removeEventListener("keydown", sendActivity);
                                         document.removeEventListener("touchstart", sendActivity);

                                                   socket.disconnect();
                                                 socketRef.current = null;

                                                };

                           }, []);


                 useEffect(() => {
                         const socket = socketRef.current;

                                   if (!socket || !selectedConvo?._id) return;

                                         socket.emit("joinConversation", selectedConvo._id);

                 }, [selectedConvo?._id]);

  
                    const Userinfo  = async()=>{

              try{ const res = await fetch("http://localhost:3000/api/auth/me",{

                    method :"GET",
                    credentials :"include"
                  })

                  if (!res.ok) {
               throw new Error("Failed to fetch user information");
                               }

                  const data = await res.json() ;

            SetMe(data)
                
                }catch(err){
                    console.log(err);
                  }
                          }

              const GetAllConvo = async()=>{

                try{

                  const res = await fetch("http://localhost:3000/api/conversation/convo/all",{
                    method:"GET",
                    credentials:"include"
                  })

                    if(!res.ok){
                   throw new Error("Failed to fetch user information");
                    }


                    const  data = await  res.json();
                    console.log(data);
                    SetConvo(data);

                }catch(err){

                }

                      }


        
               useEffect(()=>{Userinfo()} ,[])
               useEffect(()=>{GetAllConvo()} ,[])

               const handleNewMessage = (message) => {
    
                        console.log("Real-time message received:", message);
                                          };

          useEffect(() => {
             selectedConvoRef.current = selectedConvo?._id ?? null;
             }, [selectedConvo?._id]);



    return(<>
    
    <div className="app-layout">
  <Sidebar setSelectedConvo={setSelectedConvo}   me={Me}
  convo={convo}/>



         {selectedConvo ? (
           <ChatScreen
              selectedConvo={selectedConvo}
                Me={Me}
           onBack={() => setSelectedConvo(null)}
                  socket={socketRef.current}
                        />
              ) : ( <MainChat
                   selectedConvo={selectedConvo}
                        Me={Me}
                   onBack={() => setSelectedConvo(null)}
                             />
  
                         )}
</div>
    
    </>)
}