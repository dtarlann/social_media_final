import { useState ,useEffect} from 'react'
import { useForm } from 'react-hook-form'
// import axios from 'axios'
import {axiosInstance,axios_two} from "../../axiosInstance/axiosInstance";
import { IoPersonCircleOutline } from "react-icons/io5";
// import { setDriver } from 'mongoose';




function EditProfile({props,render}) {

    const [invalidImage, setinvalidImage] = useState(null);
    const [img, setImg] = useState({})
    const [err, setErr] = useState("")
    

    let userinfo = localStorage.getItem("userDetails")
    const userDetails = JSON.parse(userinfo);

    console.log(userinfo);
    

    useEffect(()=>{
        let userInfo = localStorage.getItem("user")
        axiosInstance.get(`user/getuserDetails?user=${userInfo}`).then((response)=>{
            console.log("User info response");
            console.log(response);
            localStorage.setItem("userDetails",JSON.stringify(response.data))
        })
    },[])

    
    useEffect(() => {
     console.log("chnge happen");
    }, [img])
    

    const preloaddata = {
        fullname: userDetails.first_name,
        username: userDetails.username,
        email: userDetails.email,
        phone: userDetails.phone,
    }


    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: preloaddata
    });

    // function fileSelectedHandler(e) {
    //     e.preventDefault()
    //     console.log("image change");
    //     console.log(e.target.files);
    //     setImg({...img,img:e.target.files[0]})
    // }


    let reader = new FileReader(); 
    const fileSelectedHandler = (event) => {
        console.log("jgsdfjhwbcbcknuidwn");
        const imageFile = event.target.files[0];
              const imageFilname = event.target.files[0].name;
 
              if (!imageFile) {
               setinvalidImage('Please select image.');
                return false;
              }
          
              if (!imageFile.name.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG|gif)$/)) {
               setinvalidImage('Please select valid image JPG,JPEG,PNG');
                return false;
              }
              reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
 
 //------------- Resize img code ----------------------------------
                 var canvas = document.createElement('canvas');
                 var ctx = canvas.getContext("2d");
                 ctx.drawImage(img, 0, 0);
 
                 var MAX_WIDTH = 437;
                 var MAX_HEIGHT = 437;
                 var width = img.width;
                 var height = img.height;
 
                 if (width > height) {
                   if (width > MAX_WIDTH) {
                     height *= MAX_WIDTH / width;
                     width = MAX_WIDTH;
                   }
                 } else {
                   if (height > MAX_HEIGHT) {
                     width *= MAX_HEIGHT / height;
                     height = MAX_HEIGHT;
                   }
                 }
                 canvas.width = width;
                 canvas.height = height;
                 var ctx = canvas.getContext("2d");
                 ctx.drawImage(img, 0, 0, width, height);
                 ctx.canvas.toBlob((blob) => {
                   const file = new File([blob], imageFilname, {
                       type: 'image/jpeg',
                       lastModified: Date.now()
                   });
                   setImg({
                      ...img,
                      img:file,
                 })
                 }, 'image/jpeg', 1);
               setinvalidImage(null)
               };
                img.onerror = () => {
                      setinvalidImage('Invalid image content.');
                  return false;
                };
                //debugger
                img.src = e.target.result;
              };
              reader.readAsDataURL(imageFile);
 
      }; 

    const onSubmit = (file) => {
        file.userId = userDetails._id
        file.img =img.img
        console.log("fofdghjklrm");
        console.log(file);
        console.log("form");

         const Data = new FormData();
        for (let key in file) {
            Data.append(key,file[key]) 
        }
        // console.log(details);

        axiosInstance.post('user/editprofile',Data).then((response)=>{
        console.log("response forgot");
        console.log(response);
        if(response.data.status){
            render()
        }else{
            setErr(response.data.message)
        }
        })
    }

    return (
        <div className='relative'>
            <div className='fixed  left-0 right-0 top-0 bottom-0 z-20'></div>
            <div className='  sm:w-[30%] fixed left-[10%] top-[35%] w-[80%] z-30 sm:left-[35%] sm:top-[40%]'>

                <div className='bg-white mt-[-130px] ml-3 p-5 shadow-light rounded-lg'>
                    <div className='text-right cursor-pointer' onClick={render}>
                        <p className='text-lg text-gray-400'>X</p>
                    </div>
                    <div className='flex justify-center'>
                        <div className='h-[80px] w-[80px] rounded-full bg-gray-600'>
                        {
                            img.img ?
                            <img className='w-full h-full object-cover rounded-full' alt='file' src={URL.createObjectURL(img.img)} />
                            :
                                    userDetails.profile === "null"?
                                    <IoPersonCircleOutline className='w-full  text-gray-500 text-[80px]'></IoPersonCircleOutline> 
                                    :userDetails.profile !=  null  ?
                                    
                                        <img className='w-full h-full object-cover rounded-full' src={`./images/post/${userDetails.profile}`} alt="User Profile "/>
                                  
                                    : <IoPersonCircleOutline className='w-full text-gray-500 text-[80px]'></IoPersonCircleOutline> 
                                }
                        </div>
                    </div>
                    <input type="file" single id='img' className='hidden' onChange={(e) => { fileSelectedHandler(e) }} />
                    <div className='text-center mb-3'>
                        <label htmlFor="img" className=' w-full font-light text-sm mt-2 text-blue-500  cursor-pointer'>Edit profile photo</label >
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>

                        <div className="mb-3 text-left">

                            <div>
                                <input className="appearance-none border-2 text-sm border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                    id="inline-full-name"
                                    placeholder='Full Name'
                                    {...register("fullname", {
                                        required: "required",
                                        pattern: {
                                            value: /^[A-Z]\w\D*$/i,
                                            message: "Enter proper name"
                                        }
                                    })} />
                                <p className='text-red-500 font-[8px]'>{errors.first_name?.message}</p>
                            </div>
                        </div>



                        <div className="mb-3 text-left">

                            <div>
                                <input className="appearance-none border-2 text-sm border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                    id="inline-full-name"
                                    placeholder='username'
                                    {...register("username", { required: "required" })} />
                                <p className='text-red-500 font-[8px]'>{errors.last_name?.message}</p>
                            </div>
                        </div>

                        <div className="mb-3 text-left">
                            <div>
                                <input type="email" className="appearance-none border-2 text-sm border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                    id="inline-full-name"
                                    placeholder='Email'
                                    {...register("email", {
                                        required: "required",
                                        pattern: {
                                            value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                                            message: "Enter proper email address"
                                        }
                                    })} />
                                <p className='text-red-500 font-[8px]'>{errors.email?.message}</p>
                            </div>
                        </div>

                        <div className="mb-3 text-left">

                            <div>
                                <input className="appearance-none border-2 text-sm border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                    id="inline-full-name"
                                    placeholder='Phone Number'
                                    type='tel'
                                    {...register("phone", {
                                        required: "required",
                                        pattern: {
                                            value: /^[789]\d{9}$/i,
                                            message: "Enter proper phone number"
                                        }
                                    })} />
                                <p className='text-red-500 font-[8px]'>{errors.phone?.message}</p>
                            </div>
                        </div>

                        <p className='text-red-500 font-[8px]'>{errors.first_name?.message}</p>
                        {/* <p className='text-red-500 font-[8px]'>{passwordErr}</p> */}
                        <p className='text-red-500'>{err}</p>
                        <div className='mt-5 text-center'>
                            <button className='bg-gray-800 hover:bg-black text-sm text-white font-bold py-1 px-2 rounded'
                                type='submit'>Save Changes</button>
                        </div>

                    </form>



                </div>

            </div>
        </div>
    )
}

export default EditProfile