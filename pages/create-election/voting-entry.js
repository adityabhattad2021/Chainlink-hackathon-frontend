import { useState } from "react";

import {
	useContractRead,
} from "wagmi";
import { contractAddress } from "../../constants";
import { useIsMounted } from "../../hooks/useIsMounted";
import Voting from "../../../smart-contracts/artifacts/contracts/VotingContract.sol/Voting.json";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { useIsOrganiser } from "../../hooks/useIsOrganiser";

export default function VotingEntry() {
	const router = useRouter();
	const isOrganiser = useIsOrganiser();
	const [currentRoundNumber, setCurrentRoundNumber] = useState(0);
	const [votingDuration, setVotingDuration] = useState(0);
	const [isCreating, setIsCreating] = useState(false);
	const mounted = useIsMounted();
	const { data: roundData, isLoading: isLoadingVotingRound } =
		useContractRead({
			address: contractAddress,
			abi: Voting.abi,
			functionName: "getCurrentVotingRoundNumber",
			onSuccess(roundData) {
				setCurrentRoundNumber(parseInt(roundData));
			},
		});

	async function createNewRound() {
		setIsCreating(true);
		if (typeof window.ethereum !== "undefined") {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(
				contractAddress,
				Voting.abi,
				signer
			);

			try {
				const duration = votingDuration;
				const tx =await contract.startNewVoting(duration);
	
				console.log("tx: ", tx);
				setIsCreating(false);
				router.push("/create-election/add-candidate");
			} catch (error) {
				console.log(error);
			}
		}
	}

	if(!isOrganiser){
		return (
			<div
				className="flex flex-col items-center justify-center w-full h-screen"
			>
					<h1 className="text-2xl font-bold text-center">
						You are not the organiser of this election
					</h1>
			</div>
		)
	}

	return (
		<div>
			{mounted && !isLoadingVotingRound ? (
				<div className="grid place-items-center">
					<div className=" text-4xl font-bold m-5">
						Current Voting Round: {currentRoundNumber}
					</div>
					<div className="flex flex-col">
						<label className="text-2xl font-bold m-5">
							Enter Voting Duration (in seconds)
						</label>
						<input
							className="border-2 border-black rounded-md p-2 m-5"
							type="number"
							value={votingDuration}
							onChange={(e) => setVotingDuration(e.target.value)}
						/>
						<button className="bg-black text-white p-2 rounded-md m-5"
						onClick={createNewRound}>
							{isCreating ? "Creating new Round...":"Create New Round"}
						</button>
					</div>
				</div>
			) : (
				<div
					className="grid place-items-center"
					style={{ height: "100vh" }}
				>
					Loading
				</div>
			)}
		</div>
	);
}
