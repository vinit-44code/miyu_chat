import { Outlet, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";


export default function ProtectedRoute() {

    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);


    useEffect(()=>{

            const checkAuth = async()=>{

                    try{

                        const res = await fetch("http://localhost:3000/api/auth/me",{

                            credentials : "include"
                        });
                        if(res.ok){
                            setAuthenticated(true);
                        }else{
                            setAuthenticated(false);
                        }

                    }catch(err){
                        console.log(err);
                        setAuthenticated(false);




                    }finally{

                setLoading(false)

                    }

                               

            }
                checkAuth();
    },[]);

    if(loading){
        return  <p>....loding</p>
    }


if (!authenticated) {
    return <Navigate to="/" replace />;
}


return <Outlet />;
}