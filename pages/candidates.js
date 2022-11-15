import { useState, useEffect } from "react";
import { useContractRead, useAccount } from "wagmi";
import { contractAddress } from "../constants";
import { useIsMounted } from "../hooks/useIsMounted";
import Voting from "../../smart-contracts/artifacts/contracts/VotingContract.sol/Voting.json";
import Candidate from "../components/Candidate";
import Link from "next/link";
import Router,{ useRouter } from "next/router";

export default function Candidates() {

	const [candidates, setCandidates] = useState(null);
	const mounted = useIsMounted();
	const [isWinnerAnnouncedStatus, setIsWinnerAnnouncedStatus] =
		useState(false);
	const { address: currentVoter } = useAccount();
	const [currentRoundNumber, setCurrentRoundNumber] = useState(null);
	const [isCurrentVoterRegister, setIsCurrentVoterRegistered] =
		useState(null);

	const {
		data: numberOfCandidatesData,
		isLoading: isLoadingNumberOfCandidates,
	} = useContractRead({
		address: contractAddress,
		abi: Voting.abi,
		functionName: "getCandidateLength",
		
	});

	const { data: roundData, isLoading: isLoadingVotingRound } =
		useContractRead({
			address: contractAddress,
			abi: Voting.abi,
			functionName: "getCurrentVotingRoundNumber",
			onSuccess(roundData) {
				setCurrentRoundNumber(parseInt(roundData));
			},
		});

	const { data: allCandidate, isLoading: isLoadingCandidateData } =
		useContractRead({
			address: contractAddress,
			abi: Voting.abi,
			functionName: "getAllCandidates",
			onSuccess(allCandidate) {
				setCandidates(allCandidate);
			},
		});

	const { data: isVoterRegister, isLoadingIsRegsitered } = useContractRead({
		address: contractAddress,
		abi: Voting.abi,
		functionName: "isVoterRegistered",
		args: [currentRoundNumber, currentVoter],
		onSuccess(isVoterRegister) {
			setIsCurrentVoterRegistered(isVoterRegister);
		},
	});

	const { data: isWinnerPicked, isLoading: isWinnerPickedLoading } =
		useContractRead({
			address: contractAddress,
			abi: Voting.abi,
			functionName: "getIsWinnerPickedStatus",
			onSuccess(isWinnerPicked) {
				setIsWinnerAnnouncedStatus(isWinnerPicked);
			},
		});

	console.log(currentRoundNumber);

	if (mounted && !isLoadingNumberOfCandidates) {
        if(isWinnerAnnouncedStatus){
            Router.push({
				pathname: "/winners",
				query: { roundNumber: currentRoundNumber-1 },
			})
        }
		if (isCurrentVoterRegister) {
			return (
				<div>
	

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						{candidates &&
							candidates.map((candidate, index) => {
								return (
									<div key={index}>
										<Candidate address={candidate} />
									</div>
								);
							})}
					</div>
				</div>
			);
		} else {
			return (
				<div>
					<h1 className="text-3xl font-bold text-center py-5">
						You are not registered to vote in this round
					</h1>
				</div>
			);
		}
	}
	return (
		<div className="grid place-items-center">
			<h1 className="text-3xl font-bold text-center py-5">Loading...</h1>
		</div>
	);
}
