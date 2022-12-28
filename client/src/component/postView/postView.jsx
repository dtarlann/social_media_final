import React, { useState } from 'react'
// import axios from "axios"
import {axiosInstance,axios_two} from "../../axiosInstance/axiosInstance";
import { format, render, cancel, register } from 'timeago.js';
import { useQuery, useMutation, useQueryClient, QueryClient } from '@tanstack/react-query'
import { IoPersonCircleOutline, IoHeartSharp, IoHeartOutline, IoChatbubbleOutline, IoShareOutline } from "react-icons/io5";
import { useEffect } from 'react';
function PostView({ postId, popup }) {

    const [comment, setComment] = useState("")
    const [postComment, setPostComment] = useState("")
    const [liked, setLiked] = useState(false)
    const [likedPeoples, setLikedPeoples] = useState(false)
    const [render, setRender] = useState(false)

    let userId = localStorage.getItem('user')


    useEffect(() => {
        getComment()
        refetch()
        getLikedPeople()
    }, [render])


    console.log(postId);
    const { isLoading, error, data, refetch } = useQuery({
        queryKey: ['postIfo'],
        queryFn: () =>
            postId && axiosInstance.get(`post/getPostInfoDetails?user=${postId}`)
    })

    console.log("data picture");
    console.log(data);


    async function getLikedPeople() {
        await axiosInstance.get(`post/getLikedPeople?postId=${postId}`).then((response) => {
            console.log("liked persons");
            console.log(response);
            setLikedPeoples(response.data)
        })
    }


    async function getComment() {
        console.log(postId);
        await axiosInstance.get(`http://localhost:8080/api/post/getComment?postId=${postId}`).then((response) => {
            if (response.data.status) {
                console.log("postcomment");
                console.log(response.data.comment);
                setPostComment(response.data.comment)
                // console.log();
                // setcommentOpen(!commentOpen)
            }
        })
    }

    function doLike(data, postUserId) {
        console.log("Like");
        console.log(postUserId);
        console.log("Like");
        console.log(data);
        console.log(userId);
        let info = {
            userId: userId,
            postId: data,
            receiverId: postUserId,
            type:"like"
        }
        axiosInstance.post('post/doLike', info).then(async(response) => {
            console.log("did");
            if (response?.status === true) {
                await axios_two.post('http://localhost:8080/api/post/notification', info)
                setRender(!render)
                // refetch()
            }
        })
    }

    function doDislike(data) {
        console.log("Like");
        console.log(data);
        console.log(userId);
        let info = {
            userId: userId,
            postId: data
        }
        axiosInstance.post('post/doDislike', info).then(() => {
            console.log("did");
            setRender(!render)
            // refetch()

        })
    }


    let addComment = (postId, postUserId) => {
        console.log(postId);
        console.log("postId");
        console.log(userId);
        console.log("comment");
        let info = {
            comment,
            postId,
            userId,
            receiverId: postUserId,
            type:"comment"
        }
        setComment("")
        console.log("comment ");
        console.log(info);
        console.log("comment cvbnm");
        axiosInstance.post('post/doComment', info).then((response) => {
            if (response.data.status === true ) {
                // notify(response.data.message)
                // socket.emit("sendNotification",{
                //     senderId:userId,
                //     receiverId:postUserId,
                //     type:"Comment"
                // })
                axios_two.post('post/notification', info)
                getComment(postId)
                setRender(!render)

            }
        })

    }



    if (isLoading) return (<div className='h-[90vh] flex justify-center items-center'>Loading...</div>)

    if (error) return 'An error has occurred: ' + error.message

    return (
        <div>
            <div className='relative'>
                <div className='fixed  bg-[#1818188c]  left-0 right-0 top-0 bottom-0 z-50'>
                    <div className='text-right cursor-pointer w-full fixed  text-black z-[99]' onClick={popup} >
                        <p className='text-lg text-right mr-5 text-white'>X</p>
                    </div>
                </div>

                <div className=' sm:w-[60%]  fixed left-[3%] top-[30vh] w-[90%] z-[99] sm:left-[20%] sm:top-[40%]'>

                    <div className='bg-white mt-[-130px]  overflow-hidden h-[70vh] ml-3   shadow-light rounded-lg'>

                        <div className='flex h-full '>
                            <div className='hidden sm:block  w-[35%] sm:w-[65%] h-full'>
                                <div className='w-full h-full relative'>
                                    <img className='w-full h-full object-cover ' src={`./images/post/${data?.data?.response[0]?.image}`} alt="" />
                                    <div className='bg-[#00000075] text-white text-center text-sm p-4  absolute bottom-0 w-full'>{data?.data?.response[0]?.discription}</div>
                                </div>
                            </div>
                            {!liked && <div className='w-[65%] sm:w-[35%] p-4 pl-2 flex flex-col justify-between'>

                                <div className='flex '>
                                    <div className='w-[32px] h-[32px] rounded-full '>
                                        {data?.data?.response[0]?.Userprofile != 'null' ?
                                            <img src={`./images/post/${data?.data?.response[0]?.Userprofile}`} className='object-cover w-full h-full rounded-full' alt="" />
                                            : <IoPersonCircleOutline className='w-full  text-gray-500 text-[60px]'></IoPersonCircleOutline>
                                        }
                                    </div>
                                    <p className='pl-3 font-semibold'>{data?.data?.response[0]?.name}</p>
                                </div>
                                <div className='h-[42vh]'>
                                    <div className='overflow-y-scroll h-full'>
                                        {

                                            // postcomment[0] ? commentOpen && post._id == postcomment[0].postId &&
                                            <>
                                                {
                                                    postComment && postComment.map((comment, index) => {
                                                        return (

                                                            <div key={index} className='px-7 py-2 flex'>
                                                                <div className='w-[25px] h-[25px] z-20 rounded-full bg-gray-400'>

                                                                    {comment.profile !== "null" ?
                                                                        <img src={`./images/post/${comment.profile}`} className='object-cover rounded-full w-full h-full ' alt="" />
                                                                        : <IoPersonCircleOutline className='w-full  text-gray-500 text-[60px]'></IoPersonCircleOutline>
                                                                    }
                                                                </div>
                                                                <div className='ml-3'>
                                                                    <p className='font-semibold text-gray-600'>{comment.username}</p>
                                                                    <p className='text-sm text-gray-600'>{comment.comment}</p>
                                                                    <p className="text-[12px] text-gray-400">{format(comment.date)}</p>
                                                                </div>
                                                            </div>

                                                        )
                                                    })
                                                }
                                            </>
                                            // : commentOpen &&
                                            // <div className='px-7 py-2 flex'>
                                            //     <div className=''>
                                            //         <p className='text-sm text-gray-600'>No comments</p>
                                            //     </div>
                                            // </div>

                                        }
                                    </div>
                                </div>
                                <div className='flex justify-center mt-3 '>
                                    {
                                        data.data.response[0].like.length > 0 ? data.data.response[0].like.includes(userId) ?
                                            <div className='px-4  text-center flex items-baseline'
                                                onClick={() => { doDislike(data.data.response[0]._id) }}><span className='text-[22px] '><IoHeartSharp className='text-red-600 fill-red-600' /></span> <span className='text-[10px]'></span></div>
                                            :
                                            <div className='px-4  text-center flex items-baseline'
                                                onClick={() => { doLike(data.data.response[0]._id,data.data.UserId) }}><span className='text-[22px]   text-black '><IoHeartOutline /></span> <span className='text-[10px]'></span></div>
                                            : <div className='px-4  text-center flex items-baseline'
                                                onClick={() => { doLike(data.data.response[0]._id,data.data.UserId) }}><span className='text-[22px]   text-black '><IoHeartOutline /></span> <span className='text-[10px]'>0</span></div>
                                    }
                                    <div onClick={() => getComment(data.data.response[0]._id)}
                                        className='px-4 text-center'><span className='text-[20px]'><IoChatbubbleOutline /></span> <span className='text-[10px]'></span></div>
                                    <div className='px-4 text-center'><span className='text-[20px]'><IoShareOutline /></span> <span className='text-[10px]'></span></div>

                                </div>
                                <p className='text-sm mt-1 cursor-pointer' onClick={() => { setLiked(true) }}
                                ><span className='font-semibold'>{data.data.response[0].like.length}Likes </span>in your post</p>
                                <div>

                                </div>

                                <div className=''>
                                    <div className='flex items-center mt-4 mb-4'>
                                        <div className='w-[40px] h-[40px] flex justify-center items-center z-20 rounded-full bg-gray-300'>


                                            <IoPersonCircleOutline className='w-full  text-gray-500 text-[60px]'></IoPersonCircleOutline>

                                        </div>
                                        <div className='w-full flex'>
                                            <input value={comment} onChange={(e) => { setComment(e.target.value,data.data.UserId) }}
                                                class=" ml-[-10px] w-full appearance-none border-r-0 border py-2 px-3 text-gray-700 leading-tight focus:outline-none " type="text" placeholder="Your comments" />
                                            <button onClick={() => { addComment(data?.data?.response[0]?._id) }} className='border py-2 px-3 border-l-0 rounded-r-full text-gray-600 font-semibold text-sm'>Submit</button>
                                        </div>

                                    </div>
                                </div>
                            </div>}
                            {liked && <div className='w-full sm:w-[35%]'>
                                <div className='w-full'>
                                    <div className=' w-full'>
                                        <p className='text-lg text-right mr-5 text-black cursor-pointer' onClick={() => { setLiked(false) }}>X</p>

                                        {
                                            likedPeoples.map((item, index) => {
                                                return (
                                                    <div key={index} className='flex hover:bg-gray-200 p-2 rounded-lg items-center'>
                                                        <div className='w-[35px]  h-[35px] z-20 rounded-full bg-gray-400'>

                                                            {item.profile !== "null" ?
                                                                <img src={`./images/post/${item.profile}`} className='object-cover rounded-full w-full h-full ' alt="" />
                                                                : <IoPersonCircleOutline className='w-full  text-gray-500 text-[60px]'></IoPersonCircleOutline>
                                                            }
                                                        </div>
                                                        <p className='ml-3 font-semibold'>{item.name}</p>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                            }
                        </div>

                    </div>

                </div>
            </div>
        </div>


    )
}

export default PostView