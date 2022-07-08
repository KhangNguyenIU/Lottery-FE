import React, { useContext, useState } from 'react';
import { LotteryContext } from '../context/LotteryTransaction';
import { generateNrandomArray } from '../utils';
import { QueryClient } from 'react-query';
/**
 * @author
 * @function BuyTicket
 **/

export const BuyTicket = ({ handleClose }) => {
  const {
    getCostOfBuyingTicket,
    currentLottery,
    buyTicket,
    changeNotification,
  } = useContext(LotteryContext);

  const queryClient = QueryClient();

  const [cost, setCost] = useState(0);
  const [input, setInput] = useState(0);
  const [loading, setLoading] = useState(false);
  const [chosenNumbersOfTickets, setChosenNumbersOfTickets] = useState([]);
  const [randomList, setRandomList] = useState([]);

  const handleChange = async (e) => {
    if (!loading && currentLottery) {
      setInput(parseInt(e.target.value));
      setLoading(true);
      const estimate = await getCostOfBuyingTicket(
        parseInt(currentLottery.lotteryID?._hex),
        parseInt(e.target.value)
      );
      if (estimate) {
        setCost(parseInt(estimate?._hex) / 10 ** 18);
      }
      let randList = generateNrandomArray(
        parseInt(e.target.value),
        currentLottery?.prizeDistribution?.length
      );
      setRandomList(randList);
      setChosenNumbersOfTickets(randList.flat());
      setLoading(false);
    }
  };

  const onSubmit = async () => {
    try {
      if (currentLottery) {
        setLoading(true);
        const response = await buyTicket(
          parseInt(currentLottery?.lotteryID?._hex),
          input,
          chosenNumbersOfTickets
        );
        changeNotification(`Buy ${input} tickets success`, 'success');
        queryClient.invalidateQueries(["history",currentLottery?.lotteryID ]);
        handleClose();
      }
    } catch (error) {
      // console.log(error)
      setLoading(false);
      changeNotification(`Buy  tickets failed`, 'error');
      handleClose();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-[480px] h-[600px] bg-slate-50">
      <div className="flex flex-col w-2/3 h-1/2 ">
        <label>Tickets: </label>
        <input
          type="number"
          placeholder="Amount"
          className="p-3 outline-0"
          value={input}
          min="0"
          max="50"
          onChange={handleChange}
        />
        <div className="flex justify-between">
          <span>Cost: </span>
          <span>$ {cost}</span>
        </div>
        <button
          className="text-center px-4 py-3 bg-purple-400 mt-5 text-2xl font-bold rounded-md cursor-pointer"
          disabled={loading || input === 0}
          onClick={onSubmit}
        >
          Buy
        </button>
        {loading && <span>Loading...</span>}
        {input > 0 && currentLottery && (
          <div className="m-h-48 overflow-scroll mt-5">
            {randomList.map((height, i) => (
              <div className="" key={i}>
                {height.map((num, index) => (
                  <span key={index}>{num}</span>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
