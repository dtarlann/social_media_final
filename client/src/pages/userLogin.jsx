
import { useEffect } from 'react';
import UserLogin from "../component/user/userLogin";
import {useNavigate} from "react-router-dom";
// import Axios from "axios";
import {axiosInstance,axios_two} from "../axiosInstance/axiosInstance";


function UserLog() {
    console.log("user login");
     let navigate = useNavigate()

    useEffect(()=>{
        console.log("user login effect");
        let token = localStorage.getItem('token')
        axiosInstance.get('user/verify').then((response)=>{
            console.log(response);
            if(!response.data.auth){
                console.log("log fail");
                navigate('/login')
            }else{
                console.log("log");
                navigate('/home')
            }
        })
        // if(token){
        //   navigate('/home')
        // }else{
        //   navigate('/login')
        // }
    },[])

  return (
    <div>
        <UserLogin/>
    </div>
  )
}

export default UserLog