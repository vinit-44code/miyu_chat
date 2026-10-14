import { useState } from "react"
import TextField from '@mui/material/TextField';

import { useNavigate } from "react-router-dom";
import "./auth.css"

export default function Authentication(){
    

const nevigate = useNavigate();



     const [UserInfo,SetUserInfo] = useState({

        Username: "",
        Email:"",
        Password:""
     })

     const [ToggleLogin , SetToggleLogin ] = useState(false);



   const HandleAuth = async(e)=>{

    e.preventDefault();

    try{
            let res = await fetch(ToggleLogin?"http://localhost:3000/api/auth/regi":"http://localhost:3000/api/auth/login",{

                method: "POST",

                    headers: {
                        "content-type": "application/json"
                    },
                    body : JSON.stringify(  ToggleLogin?{
                                             Email : UserInfo.Email,
                                             Password:UserInfo.Password

                                }:UserInfo),

                                credentials : "include"


                                                 });

                     let data = await res.json();

                     if(res.ok){
                        console.log("login succes",data);
                        nevigate("/chat")
                     }else{
                        console.log("login failed",data);
                     }




    }catch(err){

       console.log("internal server err");
                    console.log(e);



    }





   }


    return(<>

   <section  className="Landing-page">

    <div className="deco"></div>
    <div className="deco-right"></div>



        <div className="Form-Block">

            <div className="form-header">

                    <span>Y&M</span>
                    <h3>YOU & ME</h3>
                 <p>Personal, distraction-free messaging for</p>
                 <p>web</p>

            </div>

            <form onSubmit={HandleAuth} className="Auth-card">
                                
            { ToggleLogin?   <TextField id="outlined-basic" label="UserName" variant="outlined"  value={UserInfo.Username
                } onChange={(e)=>{

                    SetUserInfo({

                        ...UserInfo,
                        Username : e.target.value
                    })

                }
                }/>:""}
                   <TextField id="outlined-basic" label="Email" variant="outlined" type="email" placeholder="email" value={UserInfo.Email}  onChange={(e)=>{

                    SetUserInfo({

                        ...UserInfo,
                        Email : e.target.value
                    })

                }
                } />
                <TextField id="outlined-basic" label="PassWord" variant="outlined" type="password" placeholder="password" value={UserInfo.Password} onChange={(e)=>{

                    SetUserInfo({

                        ...UserInfo,
                        Password : e.target.value
                    })

                }
                }/>
                    

                <button type="submit">submit</button>




            </form>

<div id="toggle-change">
         
          <button style={{
                        background : "none",
                        appearance : "none",
                        border: "none",
                        color : "blue"
                        
                }
                }
                
                onClick={ ()=>{ToggleLogin?SetToggleLogin(false):SetToggleLogin(true)}
                }
                
                >{
                        ToggleLogin?"have account/login":"new user / register "


                } </button>


                        <div id="end-to-end">
                            <span>☑️</span>
                            <span>End-to-end encrypted 1-to-1 conversations • WebAuthn protected</span>
                        </div>


</div>


        </div>


   </section>
    
    
    
    </>)
}