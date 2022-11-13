import { useState } from "react";

import {
	useContractRead,
	usePrepareContractWrite,
	useContractWrite,
	useWaitForTransaction,
} from "wagmi";
import { contractAddress } from "../../constants";
import { useIsMounted } from "../../hooks/useIsMounted";
import { useDebounce } from "../../hooks/useDebounce";
import Voting from "../../../smart-contracts/artifacts/contracts/VotingContract.sol/Voting.json";

export default function VotingEntry() {
	const [currentRoundNumber, setCurrentRoundNumber] = useState(0);
	const [votingDuration, setVotingDuration] = useState(0);
	const debouncedVotingDuration = useDebounce(votingDuration, 500);
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

	const {
		config,
		error: prepareError,
		isError: isPrepareError,
	} = usePrepareContractWrite({
		address: contractAddress,
		abi: Voting.abi,
		functionName: "startNewVoting",
		args: [parseInt(debouncedVotingDuration)],
		enabled: Boolean(debouncedVotingDuration),
	});

	const { data, error, isError, write } = useContractWrite(config);

	const {
		isLoading: isWaitingForTransaction,
		isSuccess: isCreateVotingRoundSuccess,
	} = useWaitForTransaction({ hash: data?.hash });

	return (
		<div>
			{mounted && !isLoadingVotingRound ? (
				<div className="grid place-items-center">
					<div className=" text-4xl font-bold m-5">
						Current Voting Round: {currentRoundNumber}
					</div>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							write?.();
						}}
					>
						<div className="flex flex-col">
							<label className="text-2xl font-bold m-5">
								Enter Voting Duration (in seconds)
							</label>
							<input
								className="border-2 border-black rounded-md p-2 m-5"
								type="number"
								value={votingDuration}
								onChange={(e) =>
									setVotingDuration(e.target.value)
								}
							/>
							<button
								disabled={!write}
								className="bg-black text-white p-2 rounded-md m-5"
							>
								{isWaitingForTransaction
									? "Creating Voting Round"
									: "Create Voting Round"}
							</button>

							{isCreateVotingRoundSuccess && (
								<div className="text-green-500 font-bold text-2xl text-center">
									Voting Round Created
								</div>
							)}
							{(isPrepareError || isError) && (
								<div className="text-red-500 font-bold text-2xl">
									{prepareError?.message || error?.message}
								</div>
							)}
						</div>
					</form>
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
