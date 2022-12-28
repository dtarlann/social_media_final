import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { IoPersonCircleOutline, IoCameraOutline, IoEllipsisVerticalSharp } from "react-icons/io5";
// import axios from "axios"
import {axiosInstance,axios_two} from "../../axiosInstance/axiosInstance";
import  PostView from '../postView/postView'
import { useQuery, useMutation, useQueryClient, QueryClient } from '@tanstack/react-query'
import { ReactNotifications, Store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'



function UserProfile(props) {

    let navigate = useNavigate()

    const queryClient = useQueryClient()
    // const queryCache =QueryCache()
    const queryClientw = new QueryClient()

    const [render, setrender] = useState(false)
    const [userDetails, setUserDetails] = useState({})
    const [data, setData] = useState({})
    const [reportuser, setreportuser] = useState(false)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [postViewId, setpostViewId] = useState("")
    const [postPopup, setpostPopup] = useState(false)

    // const userId = useLocation().state.user._id;
    const user = useLocation().state.user;
    let userId
    
    user._id ?
      userId =user._id
    :
      userId =user

    let myId = localStorage.getItem('user')
    console.log("userId bbbbbbbbbbb");
    console.log(user);
    console.log(myId);
    console.log(userId);

    useEffect(() => {
        console.log("fetch data from userprofile");
        try {
            setLoading(true)
            setError(false)
            axiosInstance.get(`user/getuserInfoDetails?user=${userId}`).then((response) => {
                console.log(response.data);
                setData(response.data)
            })
        }
        catch (error) {
            setError(true)
        }

        setLoading(false)

    }, [render])


    // const { isLoading, error, data,refetch } = useQuery({
    //     queryKey: ['repoData'],
    //     queryFn: () =>
    //         axios.get(`http://localhost:8080/api/user/getuserInfoDetails?user=${userId}`)
    // })

    // console.log("data ftch");
    // console.log(data);
    // console.log(data.data.length);
    let postCount
    if (data.userData) {
        postCount = data.userData.length
    } else {
        postCount = 0
    }

    function follow(e) {
        e.preventDefault()
        console.log("userId");
        console.log(userId);
        console.log(myId);

        let usersDetails = {
            userId: myId,
            receiverId: userId,
            type:"follow",
            postId:null
        }
        
        console.log(usersDetails);
        console.log("user Profile id change");
        console.log(usersDetails);

        axiosInstance.post('user/follow', usersDetails).then(() => {
            axios_two.post('post/notification', usersDetails)
            queryClient.invalidateQueries(['userinfo'])
            setrender(!render)
        })

    }

    function unfollow(e) {
        e.preventDefault()
        console.log("userId");
        console.log(userId);
        console.log(myId);
        let usersDetails = {
            userId: myId,
            receiverId: userId,
        }
        console.log(usersDetails);
        console.log("user Profile id change");
        console.log(usersDetails);

        axiosInstance.post('user/unfollow', usersDetails).then(() => {
            // axios.post('http://localhost:8080/api/post/notification', usersDetails)
            queryClient.invalidateQueries(['userinfo'])
            setrender(!render)
        })

    }

    function reportUser() {
        let usersDetails = {
            myId: myId,
            userId: userId
        }

        axiosInstance.post('user/reportuser', usersDetails).then((response) => {
            if (response) {
                setreportuser(!reportuser)
                notify(response.data.message)
            }
        })
    }



    if (loading) return (<div className='h-[90vh] flex justify-center items-center'>Loading...</div>)

    if (error) return 'An error has occurred: ' + error.message

    let notify = (message) => {
        Store.addNotification({
            title: "Success!",
            message: message,
            type: "success",
            insert: "",
            container: "top-right",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
                duration: 3000,
                onScreen: true
            }
        });
    }

    const createConversation =(e)=>{
        e.preventDefault()
        let usersDetails = {
            senderId: myId,
            receiverId: userId
        }
        axiosInstance.post('conversation', usersDetails).then((response)=>{
            console.log("message");
            console.log(response);
            navigate('/chat')

        })
    }

    function PostDetails(postId){
        // e.priventDefault()
        console.log("postId");
        console.log(postId);
        setpostViewId(postId)
        setpostPopup(true) 
    }


    return (
        //  data.user &&
        <div className='py-8 md:container mx-auto '>
            <ReactNotifications />
            <div>

                <div className=' shadow-light p-2 rounded-t-lg flex flex-col items-end bg-gray-200 w-full h-[40vh] ' style={{ backgroundImage: `url(./images/post/${data.user?.cover})` }}>
                    <div className='p-2 flex justify-center items-center bg-[#ffffffb5] rounded-lg'
                        onClick={() => setreportuser(!reportuser)}>
                        <label htmlFor="cover">
                            <IoEllipsisVerticalSharp />
                        </label>
                    </div>

                    {
                        reportuser &&
                        <div onClick={reportUser}
                            className='bg-white p-4 shadow absolute rounded-lg right-19rem top-[9rem]'>
                            <p className='cursor-pointer text-sm'>Report user</p>
                        </div>
                    }
                    {/* {


                        data.user?.cover === "null" ?
                            null
                            : data.user?.cover != null ?
                                <img className='w-full h-full object-cover bg-cover ' src={`./images/post/${data.user.cover}`} alt="User Profile " />

                                : null

                    } */}
                </div>
                <div>
                <div className='rounded-b-lg p-3 bg-white sm:flex justify-around items-center'>
                    <div className='flex sm:w-[50%] justify-around items-center'>

                        <div className='text-center'>
                            <div className=' bg-red-400'></div>
                            <div className='rounded-full mt-[-50px] borde w-[100px] h-[100px]'>
                                {

                                    user.profile === "null" ?
                                        <IoPersonCircleOutline className='w-full  text-gray-500 text-[80px]'></IoPersonCircleOutline>
                                        : user.profile != null ?

                                            <img className='w-full h-full object-cover rounded-full' src={`./images/post/${user.profile}`} alt="User Profile " />

                                            : <IoPersonCircleOutline className='w-full text-gray-500 text-[80px]'></IoPersonCircleOutline>
                                }
                            </div>
                            <p className='font-semibold text-md' >{data.user?.username}</p>
                        </div>
                        <div className='flex'>
                        {

                            data.user?.following != undefined &&
                                data.user?.following.includes(myId) && !data.user?.followers?.includes(myId) ?
                                <div className='text-center'>
                                    <button className='bg-[#5347ff] hover:bg-[#153271] focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded-lg'
                                        onClick={follow}>Follow Back</button>
                                </div>
                                : data.user?.followers &&
                                    data.user?.followers?.includes(myId) ?
                                    <div className='text-center'>
                                        <button className='bg-white hover:font-semibold font-normal border hover:bg-white focus:shadow-outline focus:outline-none text-dark hover:shadow font-bold py-2 px-4 rounded-lg'
                                            onClick={unfollow}>following</button>
                                    </div>
                                    : <div className='text-center'>
                                        <button className='bg-[#382dda] hover:bg-[#4b5a7b] focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded-lg'
                                            onClick={follow}>Follow</button>
                                    </div>

                            //    data.data.user.following ?
                            //    data.data.user.following.includes(userId) ?
                            //     <div className='text-center'>
                            //         <button className='bg-[#382dda] hover:bg-[#4b5a7b] focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded-lg'
                            //             onClick={follow}>Unfollow</button>
                            //     </div>
                            //     :data.data.userData.userId.following.includes(myId) ?
                            //     <div className='text-center'>
                            //         <button className='bg-[#382dda] hover:bg-[#4b5a7b] focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded-lg'
                            //             onClick={follow}>Follow Back</button>
                            //     </div>
                            //     : <div className='text-center'>
                            //     <button className='bg-[#382dda] hover:bg-[#4b5a7b] focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded-lg'
                            //         onClick={follow}>Follow Back</button>
                            // </div>
                            // :null
                        }

                        <div className='text-center ml-4'>
                        <button onClick={createConversation}
                        className='bg-white hover:font-semibold font-normal border hover:bg-white focus:shadow-outline focus:outline-none text-dark hover:shadow font-bold py-2 px-4 rounded-lg'
                        >Message</button>
                        </div>
                        </div>
                        </div>
                        <div className='flex sm:w-[50%]  mt-3 sm:mt-0 justify-evenly'>
                        <div className='text-center'>
                            <p className='text-gray-500 font-medium'>{postCount}</p>
                            <p className='font-semibold text-md' >Post</p>
                        </div>
                        <div className='text-center'>
                            <p className='text-gray-500 font-medium'>{data.user?.followers.length}</p>
                            <p className='font-semibold text-md' >Followers</p>
                        </div>
                        <div className='text-center'>
                            <p className='text-gray-500 font-medium'>{data.user?.following.length}</p>
                            <p className='font-semibold text-md' >Following</p>
                        </div>
                    </div>
                </div>
                </div>
            </div>

            <div className='sm:flex mt-5 justify-between'>
                <div className='w-full bg-white shadow-light p-5 rounded-lg '>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5'>

                        {/* <img src={`./images/post/${data.data[0].image}`}  className="object-cover rounded-lg h-full w-full" alt="" /> */}
                        {data &&
                            data?.userData?.map((post, index) => {
                                return (
                                    <div className='h-[250px] cursor-pointer' onClick={()=>{PostDetails(post._id)}}>
                                        <img src={`./images/post/${post.image}`} key={index} className="object-cover rounded-lg h-full w-full" alt="" />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>

            {
                postPopup &&
                <PostView postId={postViewId&&postViewId} popup={()=>{setpostPopup(!postPopup)}}/>
            }
        </div>
    )
}

export default UserProfile