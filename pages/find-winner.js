import { useState } from "react";
import { useContractRead } from "wagmi";
import { contractAddress } from "../constants";
import { useIsMounted } from "../hooks/useIsMounted";
import Voting from "../../smart-contracts/artifacts/contracts/VotingContract.sol/Voting.json";
import  Router  from "next/router";

export default function FindWinner() {

    const [roundNumber, setRoundNumber] = useState(0);

    async function handleClick(){
        Router.push({
            pathname: '/winners',
            query: { roundNumber: roundNumber }
        })
    }

	return (
		<div className="flex flex-col items-center">
			<h1
                className="text-3xl font-bold text-center py-5"
            >Enter the round number to find the winner</h1>
            <input value={roundNumber} onChange={(e)=>setRoundNumber(e.target.value)} type="number" className="border-2 border-black rounded-md p-2 mx-5 w-1/3" />
            <button onClick={handleClick} className="px-4 py-3  bg-black text-white rounded-2xl text-2xl font-bold mt-10">Find Winner</button>
		</div>
	);
}
