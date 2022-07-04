
import { useContext, useState } from 'react';
import './App.css';
import { Claim } from './components/Claim';
import { History } from './components/History';
import { Main } from './components/Main';
import { BuyTicket} from './components/BuyTicket'
import Modal from './components/Modal'
import { LotteryContext } from './context/LotteryTransaction';

function App() {
    const { checkIfWalletIsConnected, currentAccount,connectWallet, getLotteryInfo} = useContext(LotteryContext)
    const [open, setOpen] = useState(false)
    const handleClose =()=>setOpen(false)
    const handleOpen=()=>setOpen(true)
    return (
        <div className="App">
            <Main handleOpen={handleOpen}/>
            <Claim/>
            <History/>
            <Modal open={open} handleClose={handleClose}>
                <BuyTicket/>
            </Modal>
            <button onClick={handleOpen} className='text-white'> CLick</button>
        </div>
    );
}

export default App;
