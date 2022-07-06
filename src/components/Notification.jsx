import React, { useContext, useEffect } from 'react'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LotteryContext } from '../context/LotteryTransaction';
/**
* @author
* @function 
**/

export const  Notification = (props) => {
    const { notify} = useContext(LotteryContext)

    useEffect(()=>{
        if(notify.message){
            switch(notify.type){
                case "success":
                    toast.success(notify.message)
                    break
                case "error":
                    toast.error(notify.message)
                    break
                case "warning":
                    toast.warning(notify.message)
                    break
                default:
                    toast(notify.message)
            }
        }
    },[notify])

  return(
    <React.Fragment>
        <ToastContainer
        position="bottom-center"
        autoClose="1000"
        hideProgressBar
        />
    </React.Fragment>
   )
  }
