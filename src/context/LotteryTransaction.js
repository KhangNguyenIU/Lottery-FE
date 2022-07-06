import React, { createContext, useEffect, useState } from 'react'

import { ethers } from 'ethers'
import lotteryAbi from '../abi/LotteryAbi.json'
import lotteryNFTAbi from '../abi/LotteryNFTAbi.json'
import cakeAbi from '../abi/CAKEAbi.json'
import { LOTTERYNFT_ADDRESS, LOTTERY_ADDRESS, CAKE_ADDRESS, NOTIFICATION_WARNING, NOTIFICATION_ERROR } from '../constant'
const { ethereum } = window
export const LotteryContext = createContext()

const getEthereumContract = (address, abi) => {
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
    const [test, setTest] = useState("")
    const [notify, setNotify] = useState({
        message: "",
        type: ""
    })


    const changeNotification = (message = "success", type = "success") => {
        setNotify({ message, type })
    }

    const getPrize =async ()=>{
        try {
            checkEthereum()
            const cakeContract = getEthereumContract(CAKE_ADDRESS, cakeAbi)
            cakeContract.on("")
            
        } catch (error) {
            console.log(error)
        }
    }

    
    const batchClaimTickets = async (lotteryId, curAddress) => {
        try {
            if (!curAddress || !lotteryId) {
                return
            }
            checkEthereum()
            const lotteryContract = getEthereumContract(LOTTERY_ADDRESS, lotteryAbi)
            const lotteryNFTContract = getEthereumContract(LOTTERYNFT_ADDRESS, lotteryNFTAbi)
            let ticketIds = await lotteryNFTContract.getUserTickets(lotteryId, curAddress)
            ticketIds = ticketIds.map((ticket, i) => parseInt(ticket._hex))
            console.log({ lotteryId, ticketIds })
            const result = await lotteryContract.batchClaimRewards(lotteryId, ticketIds)
            return parseInt(result.value._hex)
        } catch (error) {
            changeNotification("Fail to claim tickets", NOTIFICATION_ERROR)
            console.log(error)
        }
    }

    const getLotteryInfo = async (id) => {
        try {
            checkEthereum()
            const lotteryAddress = getEthereumContract(LOTTERY_ADDRESS, lotteryAbi)
            const info = await lotteryAddress.getBasicLottoInfo(id)
            return info
        } catch (error) {

        }
    }

    const getCostOfBuyingTicket = async (lotteryId, numberOfTickets) => {
        try {
            checkEthereum()
            const lotteryAddress = getEthereumContract(LOTTERY_ADDRESS, lotteryAbi)
            const cost = await lotteryAddress.costToBuyTickets(lotteryId, numberOfTickets)

            return cost
        } catch (error) {
            // changeNotification("Error", NOTIFICATION_ERROR)
            console.log(error)
        }
    }

    const getCurrentLottery = async () => {
        try {
            checkEthereum()
            const lotteryContract = getEthereumContract(LOTTERY_ADDRESS, lotteryAbi)
            const curId = parseInt(await lotteryContract.lotteryIdCounter_())
            const cur = await lotteryContract.getBasicLottoInfo(curId)
            if (cur) {
                setCurrentLottery(cur)
            }
        } catch (error) {
            changeNotification("No lottery found", NOTIFICATION_ERROR)
            console.log(error)
        }
    }

    const getAllTicketsOfaLottery = async (lotteryId, userAddress) => {
        try {
            checkEthereum()
            const lotteryNFTContract = await getEthereumContract(LOTTERYNFT_ADDRESS, lotteryNFTAbi)
            // console.log({currentAccount})
            if (currentAccount) {
                // console.log("-----", lotteryId, currentAccount)
                const tickets = await lotteryNFTContract.getUserTickets(lotteryId, userAddress)
                return tickets
            }
        } catch (error) {
            changeNotification("No ticket found", NOTIFICATION_ERROR)
            console.log(error)
        }
    }

    const getArrayNumbersOfATicket = async ticketId => {
        try {
            checkEthereum()
            const lotteryNFTContract = await getEthereumContract(LOTTERYNFT_ADDRESS, lotteryNFTAbi)
            const nums = await lotteryNFTContract.getTicketNumbers(ticketId)
            return nums
        } catch (error) {
            // changeNotification("No ethereum object", NOTIFICATION_ERROR)

            console.log(error)
        }
    }

    const checkIfWalletIsConnected = async () => {
        try {
            checkEthereum()
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
            checkEthereum();
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
            checkEthereum()
            const lotteryAddress = getEthereumContract(LOTTERY_ADDRESS, lotteryAbi)
            const cakeContract = getEthereumContract(CAKE_ADDRESS, cakeAbi)
            const cost = await lotteryAddress.costToBuyTickets(lotteryId, numberOfTickets)
            // await cost.wait()
            // console.log("cost ", parseInt(cost._hex), cakeContract)
            const approved = await cakeContract.approve(LOTTERY_ADDRESS, String(parseInt(cost._hex)))
            await approved.wait()
            if (approved) {
            
                const result = await lotteryAddress.batchBuyLottoTicket(lotteryId, numberOfTickets, chosenNumbersForEachTicket)
            }
        } catch (error) {
            // console.log(error)
            changeNotification("Failed to buy ticket", NOTIFICATION_ERROR)
            throw new Error("Error")
        }
    }

    const testApprove = async () => {
        try {
            checkEthereum()
            const cakeContract = getEthereumContract(CAKE_ADDRESS, cakeAbi)
            const approved = await cakeContract.approve("0x2e6059c78Ea7153e93ad3BAFda30B70b7D5dD623", "10000000000000000000")
        } catch (error) {
            console.log(error)
        }
    }
    const getTime = async () => {
        try {
            const lotteryAddress = getEthereumContract(LOTTERY_ADDRESS, lotteryAbi)

        } catch (error) {
            throw new Error("Error")
        }
    }

    const checkEthereum = () => {
        if (!ethereum) {
            alert("Please enable metamask")
            throw new Error("Metamask is not installed")
        }

    }

    useEffect(() => {
        (async () => {
            await checkIfWalletIsConnected()
            const temp = await getLotteryInfo()
        })()
    }, [])

    return (
        <LotteryContext.Provider
            value={{
                checkIfWalletIsConnected, currentAccount, connectWallet, getLotteryInfo, getTime,
                getCurrentLottery, currentLottery, getCostOfBuyingTicket, buyTicket, getAllTicketsOfaLottery, getArrayNumbersOfATicket, batchClaimTickets, testApprove, notify,
                changeNotification
            }}
        >
            {children}
        </LotteryContext.Provider>
    )
}