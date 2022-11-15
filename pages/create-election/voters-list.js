import { useContractRead } from "wagmi";
import { useIsMounted } from "../../hooks/useIsMounted";
import { useIsOrganiser } from "../../hooks/useIsOrganiser";
import { contractAddress } from "../../constants";
import Voting from "../../../smart-contracts/artifacts/contracts/VotingContract.sol/Voting.json";
import Voter from "../../components/Voter";

export default function VotersList() {
	const mounted = useIsMounted();
	const isOrganiser = useIsOrganiser();

	const { data: allVoters, isLoading: isLoadingAllVoters } = useContractRead({
		address: contractAddress,
		abi: Voting.abi,
		functionName: "getAllVoters",
        onSuccess(allVoters){
            console.log(allVoters);
        }
	});

    console.log(isOrganiser);

	return (
		<div>
			{mounted && isOrganiser ? (
				<div>
					<h1
                        className="text-2xl font-bold text-center m-10"
                    >All Voters</h1>
					<div className="">
						{isLoadingAllVoters ? (
							<div>Loading...</div>
						) : (
							<div>
								<ul 
                                
                                className="list-none">
                                    <li>
                                        <div className="flex flex-row justify-around mb-10">
                                            <div className="font-bold">Name</div>
                                            <div className="font-bold"> 
                                                   Wallet Address
                                            </div>
                                            <div className="font-bold">Status</div>
                                        </div>
                                    </li>
									{allVoters?.map((voter, index) => {
										return (
											<li key={index}>
											<Voter address={voter}/>
											</li>
										);
									})}
								</ul>
							</div>
						)}
					</div>
				</div>
			) : (
				<div
					className="grid place-items-center"
					style={{ height: "100vh" }}
				>
					Access Deined
				</div>
			)}
		</div>
	);
}
