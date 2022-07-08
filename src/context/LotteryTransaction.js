import React, { createContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'

import lotteryAbi from '../abi/LotteryAbi.json'
import lotteryNFTAbi from '../abi/LotteryNFTAbi.json'
import cakeAbi from '../abi/CakeAbi.json'
import { LOTTERYNFT_ADDRESS, LOTTERY_ADDRESS, CAKE_ADDRESS, NOTIFICATION_WARNING, NOTIFICATION_ERROR } from '../constant'

const { ethereum } = window

export const LotteryContext = createContext()


const getContract = (address, abi) => {
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    const transactionContract = new ethers.Contract(
        address, abi, signer
    )
    return transactionContract
}


export const LotteryProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState("")
    const [currentLottery, setCurrentLottery] = useState({})
    const [loading, isLoading] = useState(false)
    const [notify, setNotify] = useState({
        message: "",
        type: ""
    })


    const changeNotification = (message = "success", type = "success") => {
        setNotify({ message, type })
    }



    const batchClaimTickets = async (lotteryId, curAddress) => {
        try {
            // validate condition
            if (!curAddress || !lotteryId)
                return
            checkMetamask()

            const lotteryContract = getContract(LOTTERY_ADDRESS, lotteryAbi)
            const lotteryNFTContract = getContract(LOTTERYNFT_ADDRESS, lotteryNFTAbi)

            // get all tickets id of a Lottery
            let ticketIds = await lotteryNFTContract.getUserTickets(lotteryId, curAddress)

            // convert hex to int
            ticketIds = ticketIds.map((ticket, i) => parseInt(ticket._hex))

            // claim above tickets
            const result = await lotteryContract.batchClaimRewards(lotteryId, ticketIds)
            await result.wait()
            return parseInt(result.value._hex)
        } catch (error) {
            changeNotification("Fail to claim tickets", NOTIFICATION_ERROR)
        }
    }

    const getLotteryInfo = async (id) => {
        try {
            checkMetamask()
            const lotteryAddress = getContract(LOTTERY_ADDRESS, lotteryAbi)
            const info = await lotteryAddress.getBasicLottoInfo(id)
            return info
        } catch (error) {
            throw new Error("Fail to get Lottery info")
        }
    }

    const getCostOfBuyingTicket = async (lotteryId, numberOfTickets) => {
        try {
            checkMetamask()
            const lotteryAddress = getContract(LOTTERY_ADDRESS, lotteryAbi)
            const cost = await lotteryAddress.costToBuyTickets(lotteryId, numberOfTickets)

            return cost
        } catch (error) {
            throw new Error("Fail to get Cost of a ticket")
        }
    }

    const getCurrentLottery = async () => {
        try {
            checkMetamask()
            const lotteryContract = getContract(LOTTERY_ADDRESS, lotteryAbi)
            const curId = parseInt(await lotteryContract.lotteryIdCounter_())
            const cur = await lotteryContract.getBasicLottoInfo(curId)
            if (cur)
                setCurrentLottery(cur)

        } catch (error) {
            changeNotification("No lottery found", NOTIFICATION_ERROR)
        }
    }

    const getAllTicketsOfaLottery = async (lotteryId, userAddress) => {
        try {
            checkMetamask()
            const lotteryNFTContract = await getContract(LOTTERYNFT_ADDRESS, lotteryNFTAbi)
            if (currentAccount) {
                const tickets = await lotteryNFTContract.getUserTickets(lotteryId, userAddress)
                return tickets
            }
        } catch (error) {
            changeNotification("No ticket found", NOTIFICATION_ERROR)
        }
    }

    const getArrayNumbersOfATicket = async ticketId => {
        try {
            checkMetamask()
            const lotteryNFTContract = await getContract(LOTTERYNFT_ADDRESS, lotteryNFTAbi)
            const nums = await lotteryNFTContract.getTicketNumbers(ticketId)
            return nums
        } catch (error) {
            throw new Error("Fail to get numbers of a ticket")
        }
    }

    const checkIfWalletIsConnected = async () => {
        try {
            checkMetamask()
            const accounts = await ethereum.request({ method: "eth_accounts" })
            if (accounts.length) {
                setCurrentAccount(accounts[0])
                return true
            } else {
                changeNotification("No account found", NOTIFICATION_ERROR)
                return false
            }

        } catch (error) {
            throw new Error("Error")
        }
    }

    const connectWallet = async () => {
        try {
            checkMetamask();
            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });
            setCurrentAccount(accounts[0]);
        } catch (error) {
            changeNotification("No ethereum object", NOTIFICATION_ERROR)
            throw new Error("No ethereum objecy");
        }
    };

    const buyTicket = async (lotteryId, numberOfTickets, chosenNumbersForEachTicket) => {
        if (!lotteryId || !numberOfTickets || chosenNumbersForEachTicket.length == 0) {
            changeNotification("Please fill all the inputs", NOTIFICATION_WARNING)
            return
        }
        try {
            checkMetamask()
            const lotteryAddress = getContract(LOTTERY_ADDRESS, lotteryAbi)
            const cakeContract = getContract(CAKE_ADDRESS, cakeAbi)

            const cost = await lotteryAddress.costToBuyTickets(lotteryId, numberOfTickets)

            const approved = await cakeContract.approve(LOTTERY_ADDRESS, String(parseInt(cost._hex)))
            await approved.wait()
            // wait unitl approved finish
            if (approved) {
                const result = await lotteryAddress.batchBuyLottoTicket(lotteryId, numberOfTickets, chosenNumbersForEachTicket)
            }
        } catch (error) {
            changeNotification("Failed to buy ticket", NOTIFICATION_ERROR)
            throw new Error("Error")
        }
    }

    const testApprove = async () => {
        try {
            checkMetamask()
            const cakeContract = getContract(CAKE_ADDRESS, cakeAbi)
            const approved = await cakeContract.approve("0x2e6059c78Ea7153e93ad3BAFda30B70b7D5dD623", "10000000000000000000")
        } catch (error) {
            // console.log(error)
            throw new Error("Fail")
        }
    }
    const getTime = async () => {
        try {
            const lotteryContact = getContract(LOTTERY_ADDRESS, lotteryAbi)
        } catch (error) {
            throw new Error("Error")
        }
    }

    const checkMetamask = () => {
        if (!ethereum) {
            alert("Please enable metamask")
            throw new Error("Metamask is not installed")
        }

    }

    const setLotteryInfo = async()=>{
        try{
            const lotteryId =  await getCurrentLottery()
            const lotteryInfo = await getLotteryInfo(lotteryId)
            if(lotteryInfo){
                
                setCurrentLottery(lotteryId)
            }
        }catch(error){
            console.log(error)
        }
    }

    useEffect(() => {
        (async () => {
            await checkIfWalletIsConnected()
            await getLotteryInfo()

        })()
    }, [])

    return (
        <LotteryContext.Provider
            value={{
                checkIfWalletIsConnected, currentAccount, connectWallet, getLotteryInfo, getTime,
                getCurrentLottery, currentLottery, getCostOfBuyingTicket, buyTicket, getAllTicketsOfaLottery, getArrayNumbersOfATicket, batchClaimTickets, testApprove, notify,setLotteryInfo,
                changeNotification
            }}
        >
            {children}
        </LotteryContext.Provider>
    )
}