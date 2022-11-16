import Head from "next/head";
import { useAccount, useContractRead } from "wagmi";
import { useIsMounted } from "../hooks/useIsMounted";
import { useIsOrganiser } from "../hooks/useIsOrganiser";
import { useRouter } from "next/router";
import Link from "next/link";
import { contractAddress } from "../constants";
import Voting from "../../smart-contracts/artifacts/contracts/VotingContract.sol/Voting.json";
import { useState } from "react";

export default function Home() {
	const router = useRouter();
	const mounted = useIsMounted();
	const { address, isConnected } = useAccount();
	const isOrganiser = useIsOrganiser();
	const [currentRoundNumber, setCurrentRoundNumber] = useState(null);

	const { data: roundData, isLoading: isLoadingVotingRound } =
		useContractRead({
			address: contractAddress,
			abi: Voting.abi,
			functionName: "getCurrentVotingRoundNumber",
			onSuccess(roundData) {
				setCurrentRoundNumber(parseInt(roundData));
			},
		});

	const { data: isVoterRegister, isLoadingIsRegsitered } = useContractRead({
		address: contractAddress,
		abi: Voting.abi,
		functionName: "isVoterRegistered",
		args: [currentRoundNumber, address],
	});

	const {
		data: hasVoterAlreadyVoted,
		isLoading: isLoadingHasVoterAlreadyVotes,
	} = useContractRead({
		address: contractAddress,
		abi: Voting.abi,
		functionName: "hasVoterAlreadyVoted",
		args: [address],
	});

	return (
		<div className="flex  flex-col items-center justify-center py-2 ">
			<Head>
				<title>Voting Dapp</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div>
				{mounted && isConnected && (
					<div>
						{isOrganiser ? (
							<Link href="/create-election/voting-entry">
								<button className="px-4 py-3  bg-black text-white rounded-2xl text-4xl font-bold mt-60 ">
									Start Election
								</button>
							</Link>
						) : (
							<div>
								{!isLoadingIsRegsitered ? (
									<div>
										{isVoterRegister ? (
											<div>
												{!isLoadingHasVoterAlreadyVotes ? (
													<Link href="/candidates">
													<button className="px-4 py-3  bg-black text-white rounded-2xl text-4xl font-bold mt-60 ">
														{hasVoterAlreadyVoted ? "View Results" : "Vote"}
													</button>
												</Link>
												) : (
													<div>
														<h1 className="px-4 py-3  font-bold mt-60 ">
															Loading...
														</h1>
													</div>
												)}
											</div>
										) : (
											<Link href="/register-voter">
												<button className="px-4 py-3  bg-black text-white rounded-2xl text-4xl font-bold mt-60 ">
													Register as a Voter
												</button>
											</Link>
										)}
									</div>
								) : (
									<div>
										<h1 className="px-4 py-3  font-bold mt-60 ">
											Loading...
										</h1>
									</div>
								)}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
