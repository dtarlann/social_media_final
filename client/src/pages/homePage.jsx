import React,{useContext, useState,useRef} from 'react'
import Nav from "../component/nav/nav";
import LeftPanel from "../component/leftPanel/leftPanel";
import RightPanel from "../component/rightPanel/rightPanel";
import Feed from "../component/feed/feed";
import Story from "../component/story/story";
// import Pop from "../component/post/postpop";
import { useEffect } from 'react';
// import Axios from "axios";
import {axiosInstance,axios_two} from "../axiosInstance/axiosInstance";
import {useNavigate} from "react-router-dom";
import { io } from 'socket.io-client'
import { NotificationCountContext } from "../contex/appContext";
// import { AppContext } from '../contex/appContext';

function HomePage() {
    
    const socket = useRef()

    const [notificationCount, setNotificationCount] =useContext(NotificationCountContext)
    const [userDetails,setUserDetails] =useState({})
    const [liveUser,setLiveUser] =useState({})
    // const {data}=useContext(AppContext)
    // const [userDetail,setUserDetails] =useState(false)
    const [render,setRender] =useState(false)
    console.log("home page");
   
    let userId = localStorage.getItem('user')
    let navigate =useNavigate()

    useEffect(() => {
        axiosInstance.get(`user/getNotification?user=${userId}`).then((response)=>{
            console.log(" of resinfkdkjsk" );
            console.log(response.data);
           let count = response.data.filter((item)=>{
            return item.status === true
           }).length
           console.log(" count of status true");
            console.log(count);
            setNotificationCount(count)
        })
    }, []);


    useEffect(() => {
        let userInfo = localStorage.getItem("user")
        // socket.current = io("ws://localhost:8900");
        socket.current = io("http://vibing.cf",{path:"/socket/socket.io"});
        socket.current.emit("AddLiveUser",userInfo)
        
    }, [])  

    useEffect(() => {
        socket.current.on("getLiveUser", data => {
            let userInfo = localStorage.getItem("user")
            let Userdata = JSON.stringify(data)
            console.log("userInfo");
            console.log(data);
            axiosInstance.get(`user/getLiveUsers?user=${userInfo}&liveusers[]=`+Userdata).then((response)=>{
            console.log("response user live");
            console.log(response);
            setLiveUser(response.data)
            // setRender(!render)
            })
        })
    }, [])
    
    
   useEffect(()=>{
    let userInfo = localStorage.getItem("user")
    axiosInstance.get(`user/getuserDetails?user=${userInfo}`).then((response)=>{
        console.log("User info response");
        console.log(response);
        localStorage.setItem("userDetails",JSON.stringify(response.data))
        let userDtls =localStorage.getItem("userDetails")
        const userDetails = JSON.parse(userDtls);
       setUserDetails(userDetails)
    })
},[])


    useEffect(()=>{
        axiosInstance.get('user').then((response)=>{
            if(!response.data.auth){
                navigate('/login')
            }
        })
    },[])

    return(
        <div className=''>
            {/* <Nav/> */}
            <div className='bg-slate-100'>
            <div className='sm:grid grid-cols-5 grid-flow-col gap-4 py-8  md:container mx-auto'>
                <div className='hidden sm:block'><LeftPanel liveUsers={liveUser}/></div>
                <div className='col-span-3'>
                    {/* <Story  value={{user:userDetails}}></Story> */}
                    <Feed value={{user:userDetails}}/>
                    </div>
                <div className='hidden sm:block'><RightPanel value={{user:userDetails}}></RightPanel></div>
            </div> 
            </div>
        </div>
       )
}

export default HomePage