import {Store} from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'


let notify=()=>{
    Store.addNotification({
        title: "Wonderful!",
        message: "Account Created successfully",
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

export default notify