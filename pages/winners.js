import { useState } from "react";
import { useContractRead } from "wagmi";
import { contractAddress } from "../constants";
import { useIsMounted } from "../hooks/useIsMounted";
import Voting from "../../smart-contracts/artifacts/contracts/VotingContract.sol/Voting.json";
import { useRouter } from "next/router";

export default function Winners() {

	const router = useRouter();
	const requestedRoundNumber = parseInt(router.query.roundNumber);
	const [winnerId, setWinnerId] = useState(null);
	
	const mounted = useIsMounted();


	const { data: winnerid, isLoading: isLoadingWinnerId } = useContractRead({
		address: contractAddress,
		abi: Voting.abi,
		functionName: "getRoundWinnerById",
		args: [requestedRoundNumber],
		onSuccess(winner) {
			console.log(parseInt(winner));
			setWinnerId(winner);
		},
	});

	const { data: wDetails, isLoading: isLoadingWinnerDetails } =
		useContractRead({
			address: contractAddress,
			abi: Voting.abi,
			functionName: "getCandidateById",
			args: [requestedRoundNumber, winnerId],
		});

	const { data: totalVoters, isLoading: isVoterLengthLoading } =
		useContractRead({
			address: contractAddress,
			abi: Voting.abi,
			functionName: "getVoterLength",
		});

	console.log(parseInt(wDetails?.voteCount));

	if (!mounted) {
		return (
			<div>
				<h1
					style={{
						fontSize: "2rem",
						fontWeight: "bold",
						textAlign: "center",
						marginTop: "2rem",
					}}
				>
					Loading...
				</h1>
			</div>
		);
	}

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
			}}
		>
			<h1 className="text-3xl font-bold text-center py-5">
				Winner of Voting Round {requestedRoundNumber} is :
			</h1>
			{!isLoadingWinnerDetails && !isVoterLengthLoading && (
				<>
					<div className="bg-white shadow-md rounded-lg overflow-hidden">
						<div className="bg-cover bg-center h-56 p-4">
							<div className=" h-56 p-4">
								{wDetails?.image && (
									<img
										className="object-cover rounded-xl lg:object-cover h-56 w-full"
										src={wDetails.image}
									/>
								)}
							</div>
						</div>
					</div>
					<div className="flex flex-col justify-center">
						<div className="p-4 text-center">
							<h1 className="text-gray-900 font-bold text-2xl">
								{wDetails?.name}
							</h1>
						</div>
						<div className="p-4 text-center font-bold text-xl">
							{parseInt(wDetails?.voteCount)} out of {parseInt(totalVoters)} people voted for this candidate.
						</div>
					</div>
				</>
			)}
		</div>
	);
}
