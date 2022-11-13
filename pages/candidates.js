import { useState, useEffect } from "react";
import { useContractRead } from "wagmi";
import { contractAddress } from "../constants";
import { useIsMounted } from "../hooks/useIsMounted";
import Voting from "../../smart-contracts/artifacts/contracts/VotingContract.sol/Voting.json";
import Candidate from "../components/Candidate";

export default function Candidates() {
    const [candidates, setCandidates] = useState(null);
    const mounted = useIsMounted();
    const [numberOfCandidates, setNumberOfCandidates] = useState(0);

    const { data: numberOfCandidatesData, isLoading: isLoadingNumberOfCandidates } = useContractRead({
        address: contractAddress,
        abi: Voting.abi,
        functionName: "getCandidateLength",
        onSuccess(numberOfCandidatesData) {
            setNumberOfCandidates(parseInt(numberOfCandidatesData));
        }
    })

    const { data: allCandidate,isLoading:isLoadingCandidateData} = useContractRead({
        address: contractAddress,
        abi: Voting.abi,
        functionName: "getAllCandidates",
        onSuccess(allCandidate) {
            setCandidates(allCandidate);
        }
    })

    

    if(mounted && !isLoadingNumberOfCandidates) {

        return (
            <div>
                <div>
                    <h1
                        className="text-3xl font-bold text-center py-5"
                    >
                        Number of Candidates: {numberOfCandidates}
                    </h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {
                    candidates && candidates.map((candidate,index) => {
                        return (
                            <div key={index}>
                                <Candidate address={candidate} />
                            </div>
                        )
                    })
                }
                </div>
            </div>
        );
    }

    return (
        <div
            className="grid place-items-center"
        >
            <h1
                className="text-3xl font-bold text-center py-5"
            >
                Loading...
            </h1>
        </div>
    );
}
