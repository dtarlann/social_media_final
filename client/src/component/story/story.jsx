import React from 'react'
import '../../App.css'



function story(props) {

    return (
        <div className='shadow-light bg-white p-3 rounded-lg mb-4'>
             
            <div className='scroller'>
                <div className='scroller-item'>
                    {
                        props.value.user.profile &&
                        <img className="h-full w-full object-cover rounded-full" src={`./images/post/${props.value.user.profile}`} alt="" />
                    }
                </div>
                <div className='scroller-item'>
                    <img src="./images/login-page.jpg" alt="" />
                </div>
                <div className='scroller-item'>
                    <img src="./images/login-page.jpg" alt="" />
                </div>
                <div className='scroller-item'>
                    <img src="./images/login-page.jpg" alt="" />
                </div>
                <div className='scroller-item'>
                    <img src="./images/login-page.jpg" alt="" />
                </div>
                <div className='scroller-item'>
                    <img src="./images/login-page.jpg" alt="" />
                </div>
                <div className='scroller-item'>
                    <img src="./images/login-page.jpg" alt="" />
                </div>
                <div className='scroller-item'>
                    <img src="./images/login-page.jpg" alt="" />
                </div>
                <div className='scroller-item'>
                    <img src="./images/login-page.jpg" alt="" />
                </div>
                <div className='scroller-item'>
                    <img src="./images/login-page.jpg" alt="" />
                </div>
                <div className='scroller-item'>
                    <img src="./images/login-page.jpg" alt="" />
                </div>
            </div>
           
        </div>
    )
}

export default story