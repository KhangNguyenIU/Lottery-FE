
import { useContext, useEffect, useState } from 'react';
import './App.css';
import { Claim } from './components/Claim';
import { History } from './components/History';
import { Main } from './components/Main';
import { BuyTicket } from './components/BuyTicket'
import Modal from './components/Modal'
import { LotteryContext } from './context/LotteryTransaction';
import { Notification } from './components/Notification';

function App() {
    const { checkIfWalletIsConnected, connectWallet, getLotteryInfo, currentLottery,testApprove,changeNotification, getCurrentLottery } = useContext(LotteryContext)
    const [open, setOpen] = useState(false)
    const handleClose = () => setOpen(false)
    const handleOpen = () => setOpen(true)

    useEffect(()=>{
        getCurrentLottery()
    },[])
    return (
        <div className="App">
            <Main handleOpen={handleOpen} />
            <Claim />
            <History />
            <Modal open={Boolean(open && currentLottery?.lotteryID)} handleClose={handleClose}>
                <BuyTicket handleClose={handleClose}/>
            </Modal>
            <Notification/>
        </div>
    );
}

export default App;
