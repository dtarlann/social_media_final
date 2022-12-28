import React, { useState, useEffect, useRef } from 'react'
import '../../App.css'
import { IoPersonCircleOutline } from "react-icons/io5";
// import axios from 'axios'
import {axiosInstance,axios_two} from "../../axiosInstance/axiosInstance";
import { format, render, cancel, register } from 'timeago.js';
import { io } from 'socket.io-client'


function Message({ currentUser, currentChat }) {
  
    const [user, setUser] = useState([])
    const [chatUser, setChatUser] = useState([])
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [arrivelMessage, setArrivelMessage] = useState(null)
    //  const [socket, setSocket] = useState(null)
    const socket = useRef()
    const scrollRef = useRef()


    useEffect(() => {
        try {
            console.log('currentUser && currentUser');
            console.log(currentChat && currentChat);
            axiosInstance.get('user/getuserDetails?user=' + currentUser).then((res) => {
                setUser(res.data)
            })

            let getChatUser = async () => {

                var friendId = await currentChat?.members?.find((item) => item !== currentUser)

                axiosInstance.get('user/getuserDetails?user=' + friendId).then((res) => {

                    setChatUser(res.data)
                })
            }
            getChatUser()

        } catch (error) {
            console.log(error);
        }
    }, [currentUser,currentChat])

    


    useEffect(() => {
        const getmessages = async () => {
            console.log("currentChat?._id");
            console.log(currentChat?._id);
            try {
                axiosInstance.get('message/' + currentChat?._id).then((res) => {
                    console.log("message");
                    console.log(res);
                    setMessages(res.data)
                })
            } catch (error) {
                console.log(error);
            }
        }
        getmessages()
    }, [currentChat])

    // useEffect(() => {

    // }, [])


    const handleSubmit = async (e) => {
        e.preventDefault()
        const message = {
            sender: user._id,
            text: newMessage,
            conversationId: currentChat._id
        }

        const receiverId = currentChat.members.find(member => member !== user._id)
        console.log("receiverId");
        console.log(receiverId);

        socket.current.emit("sendMessage", {
            senderId: user._id,
            receiverId,
            text: newMessage
        })

        try {
            const response = await axiosInstance.post('message', message)
            setNewMessage("")
            setMessages([...messages, response.data])

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        console.log("arrival message");
        arrivelMessage && currentChat?.members.includes(arrivelMessage.sender) &&
            setMessages((prev)=>[...prev, arrivelMessage])
            // setNewMessage(arrivelMessage)
            console.log(arrivelMessage);
            console.log(messages);
    }, [arrivelMessage, currentChat])


    useEffect(() => {
        socket.current = io("http://vibing.cf",{path:"/socket/socket.io"});
        socket.current.on("getMessage", data => {
            setArrivelMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now()
            })
        })
    }, [])


    useEffect(() => {
        scrollRef?.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    // useEffect(() => {
    //    setSocket(io('ws://localhost:8900'))
    //    io.emit("welcome this is socket server")
    //    }, [])


    useEffect(() => {
        console.log("userrrrrrr");
        console.log(user);
        socket.current.emit("Adduser", user._id)
        socket.current.on("getUsers", users => {
            console.log("users");
            console.log(users);
        })
    }, [user])


    return (
        <div className={currentChat ? 'null' : 'h-[90%]'}>
            <div className={currentChat ? 'null p-4  flex flex-col justify-between shadow-light w-full bg-white rounded-lg' : 'h-[100%] p-4 justify-center flex flex-col shadow-light w-full bg-white rounded-lg'}>
                {currentChat? <><div>
                    <div className='flex items-center my-3 border-b-2 pb-3'>
                        <div>
                            <div className='rounded-full  bg-gray-200 flex justify-center items-center h-[45px] w-[45px] overflow-hidden'>
                                {chatUser?.profile ?
                                    <img src={`./images/post/${chatUser?.profile}`} className='object-cover w-full h-full ' alt="" />
                                    : <IoPersonCircleOutline className='w-full  text-gray-500 text-[60px]'></IoPersonCircleOutline>
                                }
                            </div>
                        </div>
                        <div className='ml-2 '>
                            <h2 className='text-[16px] font-semibold'>{chatUser?.username}</h2>
                        </div>

                    </div>
                    <div className='h-[52vh] overflow-auto'>
                        {currentChat &&
                            <>
                                {messages.map(m => (
                                    <div ref={scrollRef}>
                                        {m.sender != user._id ?
                                            <div className='mb-3 ml-3' key={m._id}>
                                                <div className='p-3 left talkbubble text-sm bg-slate-300 rounded-lg table'>{m.text}</div>
                                                <p className='text-xs mt-1 text-gray-500'>{format(m.createdAt)}</p>
                                            </div>


                                            : <div className='mb-3  mr-3 text-end'>
                                                <div className='p-3 right talkbubble ml-auto text-white text-sm bg-blue-500 rounded-lg  table'>{m.text}</div>
                                                <p className='text-xs mt-1 text-gray-500'>{format(m.createdAt)}</p>
                                            </div>
                                        }
                                    </div>

                                ))}
                            </>
                        }

                    </div>
                </div>



                    <div className='flex items-center mt-4 mb-4'>
                        <div className='w-[40px] items-center flex h-[40px] z-20 rounded-full bg-gray-400'>
                            {user?.profile ?
                                <img src={`./images/post/${user?.profile}`} className='object-cover rounded-full w-full h-full ' alt="" />
                                : <IoPersonCircleOutline className='w-full  text-gray-500 text-[60px]'></IoPersonCircleOutline>
                            }
                        </div>
                        <div className='w-full flex'>
                            <input onChange={(e) => setNewMessage(e.target.value)}
                                value={newMessage}
                                class=" ml-[-10px] w-full appearance-none border-r-0 border py-1 px-3 text-gray-700 leading-tight focus:outline-none " type="text" placeholder="Your comments" />
                            <button onClick={handleSubmit}
                                className='border py-2 px-3 border-l-0 rounded-r-full text-gray-600 font-semibold text-sm'>Submit</button>
                        </div>

                    </div></> : <>
                    <div className='text-center'>

                        <p className='text-gray-500 text-lg font-semibold'>Your Messages</p>
                        <p className='text-gray-500'>Open a conversation to start a chat</p>
                    </div>
                </>}
            </div>
        </div>
    )
}

export default Message