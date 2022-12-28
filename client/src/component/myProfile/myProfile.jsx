import React, { useEffect, useState, useContext } from 'react'
import { Navigate, useNavigate } from "react-router-dom";
import { IoPhonePortraitOutline, IoMailOutline, IoEyeSharp, IoTrashBin } from "react-icons/io5";
// import axios from "axios"
import PostView from '../postView/postView'
import { useQuery, useMutation, useQueryClient, QueryClient } from '@tanstack/react-query'
import { AppContext } from "../../contex/appContext";
import EditProfile from "../editProfile/editProfile";
import { IoPersonCircleOutline, IoCameraOutline } from "react-icons/io5";
import Nitify from '../../modal';
import { ReactNotifications, Store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import { axiosInstance, axios_two } from "../../axiosInstance/axiosInstance";
import FollowList from "../flollowList/followList";
// import { UserContext } from "../../contex/appContext";


function UserProfile(setEditp) {

    const [posts, sestPosts] = useState([])
    const [followData, setFollowData] = useState([])
    const [followingList, setFollowing] = useState(false)
    const [followersList, setFollowers] = useState(false)
    const [postViewId, setpostViewId] = useState("")
    const [postPopup, setpostPopup] = useState(false)
    const [editProfile, sestEditProfile] = useState(false)
    const [render, setrender] = useState(false)
    const [err, setErr] = useState(false)
    const [cover, setCover] = useState({
        userId: "",
        img: ""
    })

    let userId = localStorage.getItem('user')

    let navigate = useNavigate()

    const queryClient = useQueryClient()
    // const queryCache =QueryCache()
    const queryClientw = new QueryClient()


    const { isLoading, error, data, refetch } = useQuery({
        queryKey: ['userinfo'],
        queryFn: () =>
            axiosInstance.get(`user/getuserInfoDetails?user=${userId}`)
    })


    useEffect(() => {
        axios_two.get(`user/getFollowers?users=${userId}`).then((response)=>{
            console.log("followers");
            console.log(response.data);
            setFollowData(response.data)
            }) 
    }, [])
    




    //     const{isLoading:loding,mutate}=useMutation(()=>('http://localhost:8080/api/user/updateCover'),
    //     {onSuccess:()=>{
    //         refetch()
    //         queryClient.invalidateQueries(['userinfo'])
    //     }
    // })



    console.log(data);

    if (isLoading) return (<div className='h-[90vh] flex justify-center items-center'>Loading...</div>)

    if (error) return 'An error has occurred: ' + error.message

    if (data.data.auth == false)
        return <div className='fixed top-0 left-0 bg-gray-100 right-0 bottom-0 text-center '><div className='z-20 absolute left-0 right-0 top-[40%]'>{`An error has occurred: ${data.data.message}`}<br></br><button className='bg-gray-800 mt-3 hover:bg-black text-sm text-white font-bold py-1 px-2 rounded' onClick={() => { navigate('/login') }}>Go to Login</button></div></div>

    const onHandleChange = async (e) => {
        console.log("function call");
        try {
            let userInfo = localStorage.getItem("user")
            console.log("e.target.file");
            console.log(e.target.files[0]);
            let image = e.target.files[0]
            console.log(userInfo);
            console.log("image");
            console.log(image);

            await setCover({ img: image, userId: userInfo })

            console.log("cover");
            console.log(cover);
            console.log("daata");

            onsubmit()
        } catch (error) {
            console.log(error);
        }

    }

    function blockPost(userId) {
        console.log(userId);
        axios_two.get(`post/BlockAndUnblockPost?user=${userId}`)
        // setrender(!render)
        refetch()
    }

    onsubmit = () => {
        console.log("on submit");
        console.log("cover");
        console.log(cover);
        console.log("daata");
        // console.log(Data);

        const Data = new FormData();
        for (let key in cover) {
            Data.append(key, cover[key])
        }

        console.log("daata");
        console.log(Data);
        // mutate(Data)
        refetch()
        axiosInstance.post('user/updateCover', Data).then((response) => {
            console.log(response);
            refetch()
            queryClient.invalidateQueries(['userinfo'])
            setrender(!render)
        })
    }

    function PostDetails(postId) {
        // e.priventDefault()
        console.log("postId");
        console.log(postId);
        setpostViewId(postId)
        setpostPopup(true)
    }

    let postcount = data.data.userData?.length ? data.data.userData.length : 0
    let followers = data.data.user?.followers ? data.data.user.followers.length : 0
    let following = data.data.user?.following ? data.data.user.following.length : 0

    return (
        <div className='container mx-auto'>
            <ReactNotifications />
            <div>

                <div className='rounded-t-lg shadow-light flex flex-col items-end bg-gray-200 w-full h-[40vh] bg-cover' style={{ backgroundImage: `url(./images/post/${data.data.user.cover})` }}>
                    <div className='p-2 flex justify-center items-center bg-[#ffffffb5] rounded-lg'>
                        <label htmlFor="cover">
                            <IoCameraOutline className='text-[20px] sm:text-[50px]'></IoCameraOutline>
                        </label>
                    </div>
                    <input className='hidden' type="file" id='cover'
                        onChange={onHandleChange} />
                </div>
                <div className='rounded-b-lg p-3 bg-white'>
                    <div className='flex md:w-[70%] ml-auto justify-around'>
                        <div className='text-center'>
                            <p className='text-gray-500 font-medium'>{postcount}</p>
                            <p className='font-semibold text-md' >Post</p>
                        </div>
                        <div className='text-center cursor-pointer'onClick={()=>{setFollowers(true); }}>
                            <p className='text-gray-500 font-medium'>{followers}</p>
                            <p className='font-semibold text-md' >Followers</p>
                        </div>
                        <div className='text-center cursor-pointer'  onClick={()=>{ setFollowing(true)}}>
                            <p className='text-gray-500 font-medium'>{following}</p>
                            <p className='font-semibold text-md'>Following</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className='sm:flex mt-5 justify-between'>
                <div className='  sm:w-[25%]'>
                    <div className='bg-white md:mt-[-130px] mb-5 md:ml-3 p-5 shadow-light rounded-lg'>
                        <div className='flex justify-center'>
                            <div className='h-[80px] w-[80px] rounded-full'>
                                {

                                    data.data.user.profile === "null" ?
                                        <IoPersonCircleOutline className='w-full  text-gray-500 text-[80px]'></IoPersonCircleOutline>
                                        : data.data.user.profile != null ?

                                            <img className='w-full h-full object-cover rounded-full' src={`./images/post/${data.data.user.profile}`} alt="User Profile " />

                                            : <IoPersonCircleOutline className='w-full text-gray-500 text-[80px]'></IoPersonCircleOutline>
                                }
                            </div>
                        </div>
                        <p className='text-center mt-3 text-lg font-semibold'>{data.data.user.username}</p>
                        <p className='flex items-center mt-4'><span className='text-lg mr-3'><IoPhonePortraitOutline /></span><span>{data.data.user.phone}</span></p>
                        <p className='flex items-center mt-3'><span className='text-lg mr-3'><IoMailOutline /></span><span>{data.data.user.email}</span></p>
                        <div className='mt-5 text-center'>
                            <button className='bg-gray-800 hover:bg-black text-sm text-white font-bold py-1 px-2 rounded'
                                onClick={() => { sestEditProfile(true) }}>Edit Profile</button>
                        </div>
                    </div>

                </div>
                <div className='sm:w-[73.5%] bg-white shadow-light p-5 rounded-lg '>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5'>

                        {data.data.userData &&
                            data.data.userData.map((post, index) => {
                                return (
                                    <div className='h-[250px] relative posts'>
                                        <img src={`./images/post/${post.image}`} key={posts.index} className="object-cover rounded-lg h-full w-full" alt="" />
                                        <div className=' w-full eachPost flex rounded-lg justify-center bg-[#00000087] items-center h-full left-0 right-0 bottom-0 top-0 m-auto absolute'>
                                            <IoEyeSharp onClick={() => { PostDetails(post._id) }} className="text-white text-[40px] mr-7 cursor-pointer" />
                                            <IoTrashBin onClick={() => { blockPost(post._id) }} className="text-white text-[40px] cursor-pointer" />
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>

            {editProfile &&
                <EditProfile value={sestEditProfile} render={() => { setrender(!render); sestEditProfile(false) }} />
            }

            {
                followingList && <FollowList props={"following"} value={followData[0]?.following}  onclose={()=>{setFollowing(false)}}></FollowList>
            }

            {
                followersList && <FollowList props={"followers"} value={followData[0]?.followers}  onclose={()=>{setFollowers(false)}}></FollowList>
            }

            {
                postPopup &&
                <PostView postId={postViewId && postViewId} popup={() => { setpostPopup(!postPopup) }} />
            }

        </div>
    )
}

export default UserProfile