
import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/authpage";
import NotFound from "./pages/notFound";
import ProtectedRoute from "./protectedRoute";
import MainMe from "./pages/mainMe";



export default function App(){
return(<>
<Routes>

        <Route path='/' element = {<AuthPage />}/>

        <Route element = {<ProtectedRoute/>}>

         <Route path='/chat' element = {<MainMe />}/>
        
        
        
        </Route>
       
        <Route path='*' element = {<NotFound/>}/>

</Routes>




</>)

}