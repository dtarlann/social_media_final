import React, { useContext, useState } from 'react'
import { AppContext } from '../../contex/appContext'
import { IoCloudUploadOutline } from "react-icons/io5";
// import Axios from "axios";
import { ReactNotifications, Store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import {axiosInstance,axios_two} from "../../axiosInstance/axiosInstance";
function Postpop() {


    const [form, setForm] = useState({discription:"" ,img:"", userId:""})
    const [file, setFile] = useState({})
    const [userId, setuserId] = useState({})
    const [invalidImage, setinvalidImage] = useState(null);
    const [isPost, setIsPost] = useContext(AppContext)
    const [error, setError] = useState("")

    let notify = () => {
      Store.addNotification({
          title: "Success!",
          message: "Post added successfully",
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
    
    let reader = new FileReader(); 
    const fileSelectedHandler = async(event) => {
        console.log("jgsdfjhwbcbcknuidwn");
        setForm({...form,userId:"jasim"}) 
        setFile(event.target.files)
        const imageFile = event.target.files[0];
              const imageFilname = event.target.files[0].name;
 
              if (!imageFile) {
                setError('Please select image.');
                return false;
              }
          
              if (!imageFile.name.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG|gif)$/)) {
                setError('Please select valid image JPG,JPEG,PNG');
                return false;
              }
              reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
 
 //------------- Resize img code ----------------------------------
                 var canvas = document.createElement('canvas');
                 var ctx = canvas.getContext("2d");
                 ctx.drawImage(img, 0, 0);
 
                 var MAX_WIDTH = 700;
                 var MAX_HEIGHT = 700;
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
                   setForm({...form,img:file})   
                 }, 'image/jpeg', 1);
               setinvalidImage(null)
               };
                img.onerror = () => {
                  setError('Invalid image content.');
                  return false;
                };
                //debugger
                img.src = e.target.result;
              };
              reader.readAsDataURL(imageFile);
 
      }; 
    const onsubmit = async(e) => {
        e.preventDefault()
        console.log('asddsa');
        console.log(form);
        const Data = new FormData();
        for (let key in form) {
            Data.append(key,form[key]) 
        }
        


        if(!form.img ||!form.discription){
          setError('Please select proper image and Discription');
        }else{
       
          axiosInstance.post('post/addpost', Data).then((response)=>{
            if(response.data.post){
                notify()

                setTimeout(()=>{
                  setIsPost(false)
                  setFile("")
                  setForm("")
                },2000)
               
            }else{
                console.log(response.data.message);
            }
        })
       
      }    
    }
    
    return (
        isPost && <div>
          <ReactNotifications className='fixed top-0 right-0'/>
            <div className='fixed bg-[#00000085] left-0 right-0 top-0 bottom-0 z-20'></div>
            <div className='fixed left-[30%] right-[30%] top-[20%] z-40 bg-white px-8 pt-4 pb-8 rounded-lg'>
                <div className='text-right cursor-pointer' onClick={() => { setIsPost(false) }}>
                    <p className='text-lg text-gray-400'>X</p>
                </div>
                <p className='text-center font-semibold mb-5'>Create New Post</p>
                <div className='flex border-b-[1px] pb-3 border-gray-200'>
                     <div className='h-[40px] w-[40px] mr-5 bg-black rounded-full'></div>

                    <input type="text" className=' w-[80%] '
                        name='aa'
                        value={form.name}
                        placeholder='Write Somthing'
                        onChange={(e) => setForm({...form,discription: e.target.value,userId:localStorage.getItem('user') })}
                    />
                </div>
                <div>

                    {form.img && <img className='w-[100px]' alt='file' src={URL.createObjectURL(form.img)} />}
                </div>
                <label className='text-[70px] text-center flex justify-center mt-5' htmlFor="attach" >
                <IoCloudUploadOutline/>
                </label>
                <p className='text-center text-gray-400'>Attach your Post her</p>
                <input type="file" accept='image/png,image/jpg,image/jpeg'  className='mt-7 hidden'id='attach' 
                    single
                    filename='post'
                    //value={file.image[0]}
                    placeholder="qwertyuio"
                    onChange={(e)=>{fileSelectedHandler(e)}}
                />
                <div className='text-center'>
                   <p className='text-red-600'>{error}</p>
                </div>
                <div className='text-center'>
                    <button className='mt-7 w-[80%] bg-[#af6480] hover:bg-[#4b5a7b] focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded' onClick={(e) => { onsubmit(e) }}>Upload</button>
                </div>
            </div>
        </div>

    )
}

export default Postpop