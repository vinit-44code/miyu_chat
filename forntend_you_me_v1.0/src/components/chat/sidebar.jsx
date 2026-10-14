

import { useState,useEffect,useRef } from "react";

import"./sidebar.css"

export default function Sidebar({convo,SetConvo,me,setSelectedConvo}){


    const [searchText, setSearchText] = useState("");
    const [searchResults, setSearchResults] = useState([]);
   const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

       useEffect(() => {
         const handleOutsideClick = (event) => {
           if (menuRef.current && !menuRef.current.contains(event.target)) {
               setMenuOpen(false);
        }
                     };

               document.addEventListener("pointerdown", handleOutsideClick);

                     return () => {
                    document.removeEventListener("pointerdown", handleOutsideClick);
                                       };
                                          }, []);

    const OpenConversation = async (reciverId) => {
  try {
    const res = await fetch(
      "http://localhost:3000/api/conversation/convo",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ reciverId }),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to open conversation");
    }

    const data = await res.json();

    setSelectedConvo(data);
    setSearchText("");
    setSearchResults([]);
  } catch (err) {
    console.error("Could not open conversation:", err);
  }
};

            useEffect(() => {
              const query = searchText.trim();
 
              if (!query) {
             setSearchResults([]);
            return;
         }

              const timer = setTimeout(() => {
                        SearchUsers(query);
                           }, 300);

                 return () => clearTimeout(timer);
                        }, [searchText]);


                        

              const SearchUsers=async(query)=>{

                          if (!searchText.trim()) {
                       setSearchResults([]);
                                 return;
                                       }


                        try{

                            let res = await fetch(`http://localhost:3000/api/users/search?q=${encodeURIComponent(query)}`,{
                                method:"GET",

                                 credentials: "include",  
                                
                            });

                            const data = await res.json();
                            console.log(data)

                         if (!res.ok) {
                   throw new Error(data.message || "Search failed");
                              }

                      setSearchResults(data);


                        }catch(err){

                        }

              }

  

    return(<>

    <section className="Sidebar">

  <div className="main-sidebar"> 

                     
                     <div className="logo-block">
                        <span className="app-name">M&Y</span>
                      <span>MiYu</span>

                    <div className="mobile-menu-container" ref={menuRef}>
                            <button
                    type="button"
                 className="mobile-menu-trigger"
                 aria-label="Open account menu"
              aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
                              >
                             ⋮
                               </button>

                     {menuOpen && (
                           <div className="profile-menu">
                        <div className="profile-menu-user">
                           <div className="pfp">
                            {me?.Username?.slice(0, 2).toUpperCase()}
                                 </div>
                                        <div>
                          <strong>{me?.Username || "My Account"}</strong>
                         <small>My account</small>
                        </div>
                                 </div>

                        <div className="profile-menu-divider" />
       
                           <button
                            type="button"
                       className="profile-menu-item"
                             onClick={() => setMenuOpen(false)}
                                     >
                              <span>♙</span> Profile
                                             </button>

                                <button
                                         type="button"
                              className="profile-menu-item"
                              onClick={() => setMenuOpen(false)}
                                           >
                                       <span>⚙</span> Settings
                                                 </button>

                                        <button
                                      type="button"
                             className="profile-menu-item"
                         onClick={() => setMenuOpen(false)}
                                     >
                                  <span>◐</span> Theme
                                      </button>

                          <div className="profile-menu-divider" />

                                  <button
                                   type="button"
                                className="profile-menu-item logout-item"
                               onClick={() => setMenuOpen(false)}
        >
                                  <span>↪</span> Log out
                                              </button>
                                              </div>
                                          )}
                                           </div>
                        </div>


                    <div id="search-bar">
                        <input type="text" placeholder="Search conversations..." className="search-input"  value={searchText}
                                           onChange={(e) => setSearchText(e.target.value)}/>
                                           
                  
{searchText.trim() && (
  <div className="search-results" >
    {searchResults.length > 0 ? (
      searchResults.map((user) => (
        
        <div className="search-result" key={user._id}    onClick={() => OpenConversation(user._id)}>
          <div className="search-avatar">
            {user.Username?.slice(0, 2).toUpperCase()}
          </div>

          <span>{user.Username}</span>
        </div>
   
      ))
    ) : (
      <p>No users found</p>
    )}
  </div>

  
)}

                    </div>


                    <div id="filtre-box"> 
                            <button>All</button>
                            <button>Unread</button>
                            <button>Favorites</button>
                    </div>

                    <div className="conversation-block">


                                    {
                                        
                                        convo.map((converList)=>{

                                            const otherUser = converList.participents.find(
                                                  (participant) => participant._id !== me._id
                                                        );
                                      return(  <div className="Convo" key={converList._id}   onClick={() =>setSelectedConvo(converList)}>

                                            <span className="pfp">{<span>{otherUser?.Username.slice(0, 2).toUpperCase()}</span>}</span>
                                       <div className="sender-info">
                                            <div className="sender-name-time">
                                                <span>{otherUser?.Username}</span>
                                                <span><span>
    {converList.lastMessage?.createdAt
        ? new Date(converList.lastMessage.createdAt).toLocaleTimeString(
              "en-IN",
              { hour: "2-digit", minute: "2-digit" }
          )
        : ""}
</span></span>
                                            </div>
                                            <div className="last-message">
                                                <span>{converList.lastMessage?.content}</span>

                                                </div>
                                         </div>
                                      </div>)})

                                              }

                    </div>

          </div>

                    
                    <div className="UserInfo-setting">

                        <div className="Username-block">
                            <div className="pfp"></div>
                            <span id="Username">{me?.Username}</span>
                            <span id="UserStatus">active</span>

                        </div>

                        <div id="setting-block">
                            <button id="setting">  ⚙</button>
                        </div> 

                    </div>

              


    </section>
    
        
    
    </>)
}