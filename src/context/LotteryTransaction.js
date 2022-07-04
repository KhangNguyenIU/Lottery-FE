import React, { createContext, useEffect, useState } from 'react'

import {ethers} from 'ethers'
import lotteryAbi from '../abi/LotteryAbi.json'
import { LOTTERY_ADDRESS } from '../constant'
const { ethereum} = window
export const LotteryContext = createContext()

const getEthereumContract =()=>{
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    const transactionContract = new ethers.Contract(
        LOTTERY_ADDRESS, lotteryAbi,signer
    )

    return transactionContract
}
export const LotteryProvider = ({children})=>{
    const [currentAccount, setCurrentAccount] = useState("")
    const [loading, isLoading] =useState(false)
    const [test, setTest] = useState("")
    
    const getLotteryInfo =async ()=>{
        try{
            checkEthereum()
            const lotteryAddress = getEthereumContract()
            console.log({lotteryAddress})
            const info = await lotteryAddress.bucketTwoMax_()
            console.log({info})
            return info
        }catch(error){
            console.log(error)
        }
    }

    const checkIfWalletIsConnected = async()=>{
        try{
            checkEthereum()
            const accounts = await ethereum.request({ method: "eth_accounts"})
            console.log("adasd",accounts)
            if(accounts.length){
            setCurrentAccount(accounts[0])
            }else{
                console.log("account not found")
            }

        }catch(error){
            console.log(error)
            throw new Error("Error")
        }
    }

    const connectWallet = async () => {
        console.log("connectWallet");
        try {
          checkEthereum();
          const accounts = await ethereum.request({
            method: "eth_requestAccounts",
          });
          setCurrentAccount(accounts[0]);
          console.log(accounts[0]);
        } catch (error) {
          console.log(error);
          throw new Error("No ethereum objecy");
        }
      };

    const checkEthereum = ()=>{
        if(!ethereum){
            alert("Please enable metamask")
            throw new Error("Metamask is not installed")
        }
            
    }

    useEffect(()=>{
        (async()=>{
            await checkIfWalletIsConnected()
            const temp = await getLotteryInfo()
            console.log(temp)
        })()
    },[])
    return (
        <LotteryContext.Provider
        value={{
            checkIfWalletIsConnected, currentAccount, connectWallet, getLotteryInfo
        }}
        >
            {children}
        </LotteryContext.Provider>
    )
}