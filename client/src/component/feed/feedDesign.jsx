import React from 'react'
import { IoPersonCircleOutline, IoCameraOutline, IoHeartOutline, IoChatbubbleOutline, IoShareOutline, IoHeartSharp, IoEllipsisVerticalSharp } from "react-icons/io5";
import {useNavigate,Link}from "react-router-dom";
import { format, render, cancel, register } from 'timeago.js';

function feedDesign({data,reportpop,setreportpop,blockpost,doDislike,doLike,getComment,props,comment,setComment,addComment,postcomment,commentOpen}) {
console.log('props feed');
console.log(reportpop);
    
let userId = localStorage.getItem('user')

  return (
    <div>
    {/* <p>{props.post[0].username}</p> */}
    
   
    {data.post && data.post.map((post, index) => {

        return (
            <div className='bg-white relative p-5 mb-4 rounded-lg shadow-light ' key={index}>
                <div className='flex  justify-between mb-3'>
                    <div className='flex items-center '>
                        <div>
                            <div className='rounded-full flex justify-center items-center h-[50px] w-[50px] overflow-hidden'>
                                {post.profile != 'null' ?
                                    <img src={`./images/post/${post.profile}`} className='object-cover w-full h-full ' alt="" />
                                    : <IoPersonCircleOutline className='w-full  text-gray-500 text-[60px]'></IoPersonCircleOutline>
                                }

                            </div>
                        </div>
                        <div className='ml-2 '>
                        <Link  className='flex p-0 font-semibold items-center cursor-pointer rounded-lg p-3' key={index}
                          to={"/userProfile"} state={{ user: post.postUserId }}>{post.username}</Link>
                            <h2 className='text-[16px] font-bold cursor-pointer'></h2>
                            <p className='text-[12px] text-gray-500'>{format(post.date)}</p>
                        </div>

                    </div>

                    <div className='cursor-pointer' onClick={() => setreportpop({ ...reportpop, id: post.feedId, status: !reportpop.status })}>
                        <IoEllipsisVerticalSharp />
                    </div>

                    {
                         reportpop.status && reportpop.id == post.feedId &&
                        <div onClick={() => { blockpost(post.feedId) }}
                            className='bg-white p-4 shadow absolute rounded-lg right-6 mt-[30px]'>
                            <p className='cursor-pointer text-sm'>Report Post</p>
                        </div>
                    }
                </div>
                <p className='text-gray-600 text-sm'>{post.discription}</p>

                <div className=' mt-4 '>
                    <img src={`./images/post/${post.image}`} className='object-cover w-full h-[370px] md:h-[500px] rounded-lg' alt="" />
                </div>

                <div className='flex justify-center mt-3 '>
                    {
                        post.like.length > 0 ? post.like.includes(userId) ?
                            <div className='px-4  text-center flex items-center'
                                onClick={() => { doDislike(post.feedId) }}><span className='text-[22px] '><IoHeartSharp className='text-red-600 fill-red-600' /></span> <span className='text-[12px]'>{post.like.length}</span></div>
                            :
                            <div className='px-4  text-center flex items-center'
                                onClick={() => { doLike(post.feedId, post.postUserId[0]) }}><span className='text-[22px]   text-black '><IoHeartOutline /></span> <span className='text-[12px]'>{post.like.length}</span></div>
                            : <div className='px-4  text-center flex items-center'
                                onClick={() => { doLike(post.feedId, post.postUserId[0]) }}><span className='text-[22px]   text-black '><IoHeartOutline /></span> <span className='text-[12px]'>0</span></div>
                    }
                    <div onClick={() => getComment(post.feedId)}
                        className='px-4 text-center'><span className='text-[20px]'><IoChatbubbleOutline /></span> <span className='text-[10px]'></span></div>
                    <div className='px-4 text-center'><span className='text-[20px]'><IoShareOutline /></span> <span className='text-[10px]'></span></div>

                </div>

                <div className='flex items-center mt-4 mb-4'>
                    <div className='w-[45px] h-[45px] flex justify-center items-center z-20 rounded-full bg-gray-300'>

                        {props.value.user.profile !== "null" ?
                            <img src={`./images/post/${props.value.user.profile}`} className='object-cover rounded-full w-full h-full ' alt="" />
                            : <IoPersonCircleOutline className='w-full  text-gray-500 text-[60px]'></IoPersonCircleOutline>
                        }
                    </div>
                    <div className='w-full flex'>
                        <input value={comment} onChange={(e) => { setComment(e.target.value) }}
                            class=" ml-[-10px] w-full appearance-none border-r-0 border py-2 px-3 text-gray-700 leading-tight focus:outline-none " type="text" placeholder="Your comments" />
                        <button onClick={() => { addComment(post.feedId, post.postUserId[0]) }} className='border py-2 px-3 border-l-0 rounded-r-full text-gray-600 font-semibold text-sm'>Submit</button>
                    </div>

                </div>



                {

                    postcomment[0] ? commentOpen && post.feedId == postcomment[0].postId &&
                        <>
                            {
                                postcomment && postcomment.map((comment, index) => {
                                    return (

                                        <div key={index} className='px-7 py-2 flex'>
                                            <div className='w-[40px] h-[40px] z-20 rounded-full bg-gray-400'>

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
                        : commentOpen &&
                        <div className='px-7 py-2 flex'>
                            <div className=''>
                                <p className='text-sm text-gray-600'>No comments</p>
                            </div>
                        </div>

                }
            </div>
        )
    })}
</div>
  )
}

export default feedDesign