import React, { useContext, useEffect, useState } from 'react';
import { LotteryContext } from '../context/LotteryTransaction';
import { isObjectEmpty } from '../utils';

/**
 * @author
 * @function Main
 **/

export const History = ({ lotteryId }) => {
  const { getAllTicketsOfaLottery, getArrayNumbersOfATicket, currentAccount, currentLottery } =
    useContext(LotteryContext);
  const [history, setHistory] = useState([]);

 
  useEffect(() => {
    (async () => {
      if (currentAccount && currentLottery?.lotteryID) {
        let ticketIds = await getAllTicketsOfaLottery(parseInt(currentLottery?.lotteryID?._hex), currentAccount);
        if (ticketIds?.length > 0) {
          const numsArray = await fecthAllTicketsOfAUser(ticketIds);
          setHistory([...numsArray]);
        }
      }
    })();
  }, [currentAccount,currentLottery]);

  const fecthAllTicketsOfAUser = async (ids) => {
    const fetchPromise = ids.map(async (nums, i) => {
      const numbers = await getArrayNumbersOfATicket(parseInt(nums._hex));
      return numbers;
    });

    const result = Promise.all(fetchPromise);
    return result;
  };

  return (
    <div className="h-screen flex justify-center items-center text-white w-full">
      <div className="flex flex-col justify-center items-center w-full">
        <h3 className="text-4xl text-gray-200">TIcket history</h3>
        <div className="flex flex-col w-1/3 h-28 mt-5">
          <div className="flex">
            <div className="basis-1/2">Numbers</div>
            <div className="basis-1/2 flex justify-end">Lottery Id</div>
          </div>

          <div className="flex mt-5">
            <div className="basis-1/2 flex flex-col">
              {!!history.length &&
                history.map((nums, index) => (
                  <div key={index} className="flex">
                    {nums.map((num, index) => (
                      <div
                        key={index}
                        className="text-2xl text-purple-900 mr-4"
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                ))}
            </div>
            <div className="basis-1/2 flex justify-end">
              <p className="text-2xl text-purple-900 mr-4"> {!isObjectEmpty(currentLottery) && parseInt(currentLottery?.lotteryID?._hex) }</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
