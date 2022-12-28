import React, { useState, useEffect } from 'react'
// import axios from "axios";
import {axiosInstance,axios_two} from "../axiosInstance/axiosInstance";
import Message from "../component/message/message";
import Conversation from "../component/conversatoin/conversation";


function Chat() {

    const [conversation, setConversation] = useState([])
    const [currentChat, setCurrentChat] = useState(false)

    let user = localStorage.getItem('user')
    useEffect(() => {
        let fetchConversation = () => {
            
            axiosInstance.get(`conversation/${user}`).then((response) => {
                console.log('get conversation');
                console.log(response);
                setConversation(response.data)
            })
        }
        fetchConversation()
    }, [user])


    return (

        <div className='sm:flex container py-5'>
            <div className='sm:w-[40%] p-4'>
            <div className='sm:h-[80vh]'>
            <div className='px-4 py-2 shadow-light  bg-white rounded-full'>
                <input type="text" className='w-full border-0 appearance-none focus:outline-none' placeholder='Search' />
            </div>

            <div className=' bg-white p-4 mt-4  shadow-light rounded-lg'>
                <p className='font-semibold '>Recent</p>
            <div className=' flex sm:block sm:overflow-x-auto overflow-x-scroll  w-full '>
                {
                    conversation.map((conver,index) => {
                        return(
                            <div onClick={()=>{setCurrentChat(conver)}} >
                                <Conversation key={index}  conversation={conver} currentUser={user} />
                            </div>
                    )})
                }
            </div> 
            </div>

            
            </div>
        </div>
            <div className='p-4 sm:w-[60%]'>
                <Message currentUser={user} currentChat={currentChat}/>
            </div>
        </div>
    )
}

export default Chat