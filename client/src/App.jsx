import React, { useState, useEffect } from "react";
import UserSignup from "./pages/userSignup";
import UserLogin from "./pages/userLogin";
import AdminLogin from "./pages/adminLogin";
import HomePage from "./pages/homePage";
import AdminHome from "./adminPages/admintemplate";
import AdminSignup from "./component/admin/adminSignup";
import Forgotpassword from "./component/forgotPassword/forgotPassword";
import Profile from "./pages/myProfile";
import UserProfile from "./component/userProfile/userProfile";
import Homemain from "./component/HomeMain/homeMain";
import Search from "./pages/search";
import Addpost from "./pages/addpost";
import UserBlock from "./component/adminHome/userBlock";
import PostBlock from "./component/adminHome/postBlock";
import Post from "./component/post/postpop";
import Chat from "./pages/chat";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { AppContext ,NotificationCountContext} from "./contex/appContext";
import { QueryClient, QueryClientProvider} from '@tanstack/react-query'
// import { UserContext } from "./contex/appContext";
import axios from "axios";



//import './App.css'; 

function App() { 

   const [isNotification, setIsNotification] = useState(false)
   const [isPost, setIsPost] = useState(false)
   const [notificationCount, setNotificationCount] = useState(0)
   const queryClient = new QueryClient()
//    useEffect(()=>{
//     let userInfo = localStorage.getItem("user")
//     axios.get(`http://localhost:8080/api/user/getuserDetails?user=${userInfo}`).then((response)=>{
//         console.log("User info response");
//         console.log(response);
//         localStorage.setItem("userDetails",JSON.stringify(response.data))
//     })
// },[])

//    useEffect(()=>{
//     let userInfo = localStorage.getItem("user")
//     let userDtls =localStorage.getItem("userDetails")
//     const userDetails = JSON.parse(userDtls);
//     setUserDetails(userDetails)
// },[])

  return (
    <BrowserRouter>
    {/* <UserContext.Provider value={{userDt:userinfo}}> */}
    <QueryClientProvider client={queryClient}>
      <NotificationCountContext.Provider value={[notificationCount,setNotificationCount]}>
      <AppContext.Provider value={[isPost, setIsPost,isNotification, setIsNotification]}> 
        <Post/>
        <Routes>
          <Route path="/signup" element={<UserSignup />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/forgotPassword" element={<Forgotpassword />} />
          <Route path="/" element={<Homemain />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/userProfile" element={<UserProfile />} />
          <Route path="/Addpost" element={<Addpost />} />
          <Route path="/search" element={<Search />} />
          <Route path="/chat" element={<Chat />} />
          </Route>
          {/* <Route path="/post" element={<Post/>}/> */}
        </Routes>
      </AppContext.Provider>
      </NotificationCountContext.Provider>
      </QueryClientProvider>
      {/* </UserContext.Provider> */}
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminSignup />} />
        <Route path="/admin" element={<AdminHome />}>
           <Route path='/admin/user' element={<UserBlock />}></Route>
            <Route path='/admin/post' element={<PostBlock />}></Route>
         </Route>
      </Routes>
    </BrowserRouter>

  );
}

export default App;
