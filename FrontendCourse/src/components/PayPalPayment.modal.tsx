import React, { useEffect, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { PayPalButton } from "react-paypal-button-v2";




interface IProp{
    totalPrice: number;
    paymentProcess: boolean;
    setPayMentProcess : (v: boolean) => void;
}

const PayPalPayment = (prop : IProp) => {
    const {totalPrice} = prop;
    const {setPayMentProcess} = prop
    const [scriptLoaded, setScriptLoaded] = useState(false)
    

    const addPayPalScript = () => {
        if(window.paypal){
            setScriptLoaded(true)
            return
        }
        const script = document.createElement("script")
        script.src = "https://sandbox.paypal.com/sdk/js?client-id=AaYL7PDE8PfumpijXBgUD_hYuPWbBPtzRoZL0iAYf269Ij2w12Gv6Nq-ABxznomSHveH_OHigBtZ_MqT"

        script.type = "text/javascript"
        script.async = true
        script.onload = () => setScriptLoaded(true)
        document.body.appendChild(script)
    }
    useEffect(() => {
        addPayPalScript()
    },[])
    return (
        <>
            {scriptLoaded ? <PayPalButton
                amount={totalPrice}
                onSuccess={(details : any,data : any) => {
                    
                    console.log("Tai Khoan giao dich bởi" + details.payer.name.given_name)
                    console.log(details)
                    setPayMentProcess(true)
                    
                }}
            
            />  : <span>Loading</span>
            }
        
        </>
    );
};

export default PayPalPayment;