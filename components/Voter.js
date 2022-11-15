import { useState } from "react";
import { contractAddress } from "../constants";
import { useIsMounted } from "../hooks/useIsMounted";
import Voting from "../../smart-contracts/artifacts/contracts/VotingContract.sol/Voting.json";
import { useContractRead } from "wagmi";

export default function Voter({ address }) {
	const [votingRoundNumber, setVotingRoundNumber] = useState(0);
	const [voter, setVoter] = useState(null);

	const { data: roundNumber, isLoading: isLoadingRoundNumber } =
		useContractRead({
			address: contractAddress,
			abi: Voting.abi,
			functionName: "getCurrentVotingRoundNumber",
			onSuccess(roundNumber) {
				setVotingRoundNumber(parseInt(roundNumber));
			},
		});

	const { data: voterData, isLoading: isLoadingVoterData } = useContractRead({
		address: contractAddress,
		abi: Voting.abi,
		functionName: "getVoterByAddress",
		args: [votingRoundNumber, address],
		onSuccess(voterData) {
			setVoter(voterData);
		},
	});

	return (
		<div>
			{!isLoadingRoundNumber && !isLoadingVoterData && (
				<div className="flex flex-row justify-around">
					<div className="font-bold">{voter?.name}</div>
                    <div className="font-bold">{voter?.walletAddress}</div>
                    <div className="font-bold">{voter?.alreadyVoted ? 'Voted' : 'Not Voted' }</div>
				</div>
                
			)}
		</div>
	);
}
