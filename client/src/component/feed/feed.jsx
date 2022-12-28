import useAxios from "axios-hooks";
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {axiosInstance,axios_two} from "../../axiosInstance/axiosInstance";
import { format, render, cancel, register } from 'timeago.js';
import { ReactNotifications, Store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
// import { IoPersonCircleOutline, IoCameraOutline, IoHeartOutline, IoChatbubbleOutline, IoShareOutline, IoHeartSharp, IoEllipsisVerticalSharp } from "react-icons/io5";
import { useQuery } from '@tanstack/react-query'
import {useNavigate,Link}from "react-router-dom";
import { io } from 'socket.io-client'
import FeedDesign from "./feedDesign";

function Feed(props) {

    const [reportpop, setreportpop] = useState({ status: false, id: "" })
    const [comment, setComment] = useState("")
    const [commentOpen, setcommentOpen] = useState(false)
    const [postcomment, setpostcomment] = useState({})
    const [data, setData] = useState({})
    const [render, setRender] = useState(false)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [socket, setSocket] = useState(null)
    const [notification, setNotification] = useState([])
    // const [userId, setUser] = useState()

    console.log("props");
    console.log(props);
    let token = localStorage.getItem('token')
    console.log("token on feed");
    console.log(token);
    let userId = localStorage.getItem('user')

    useEffect(() => {
        setSocket(io("http://vibing.cf",{path:"/socket/socket.io"}));
    }, [])


    useEffect(() => {
        socket?.on('getNotification', data => {
            console.log("socket data");
            console.log(data);
            setNotification(prev => [...prev, data])
        })
    }, [])



    useEffect(() => {
        const fetchdata = async () => {
            setLoading(true)
            setError(false) 
            try {
                axiosInstance.get(`post/getfeeds?user=${userId}`).then((response) => {
                    console.log("response.data on feed page");
                    console.log(response.data);
                    setData(response.data)
                })
            } catch (error) {
                setError(true)
            }
            setLoading(false)
        }
        fetchdata()
    }, [render])



    // const [{ data, loading, error }, refetch] = useAxios(`http://localhost:8080/api/post/getfeeds?user=${userId}`);
    // console.log("data");
    // console.log(data);

    // const { isLoading, error, data ,isFetching} = useQuery({
    //     queryKey: ['repoData'],
    //     queryFn: () =>
    //         axios.get(`http://localhost:8080/api/post/getfeeds?user=${userId}`)
    // })


    // console.log(isLoading);
    // console.log("dtata");
    // console.log(isFetching);
    if (loading) return (<div className='h-[90vh] flex justify-center items-center'>Loading...</div>)

    if (error) return 'An error has occurred: ' + error.message


    let notify = (message) => {
        Store.addNotification({
            title: "Success!",
            message: message,
            type: "success",
            insert: "",
            container: "center",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
                duration: 3000,
                onScreen: true
            }
        });
    }

    function blockpost(postId) {
        let user = localStorage.getItem("user")
        console.log(user);
        console.log(postId);
        let info = {
            user,
            postId
        }
        axiosInstance.post(`post/blockpost`, info).then((response) => {
            if (response) {
                setreportpop({ ...reportpop, status: !reportpop.status })
                notify(response.data.message)
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

    async function getComment(postId) {
        console.log(postId);
        await axiosInstance.get(`post/getComment?postId=${postId}`).then((response) => {
            if (response.data.status) {
                console.log("postcomment");
                console.log(response.data.comment);
                setpostcomment(response.data.comment)
                console.log();
                setcommentOpen(!commentOpen)
            }
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
            console.log("response comment");
            console.log(response);
            if (response.data.status) {
                notify(response.data.message)
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
        axiosInstance.post('post/doLike', info).then((response) => {
            console.log("did");
            if (response) {
                axios_two.post('post/notification', info)
                setRender(!render)
                // refetch()
            }
        })
    }



    return (
       <div>
        <ReactNotifications />
        <FeedDesign data={data} reportpop={reportpop} setreportpop={setreportpop} blockpost={blockpost} doDislike={doDislike} 
        doLike={doLike} getComment={getComment} props={props} comment={comment} setComment={setComment} addComment={addComment}
        postcomment={postcomment} commentOpen={commentOpen}/>
       </div>


    )
}

export default Feed