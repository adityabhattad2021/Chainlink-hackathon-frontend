import {useState} from "react"
import {
    useContractRead,
} from "wagmi"
import {contractAddress} from "../constants"
import { ethers } from "ethers"
import Voting from "../../smart-contracts/artifacts/contracts/VotingContract.sol/Voting.json"


export default function Candidate({address}){
    const [candidate,setCandidate]=useState(null);
    const [votingRoundNumber,setVotingRoundNumber]=useState(0);



    const {data:roundNumber,isLoading:isLoadingRoundNumber}=useContractRead({
        address:contractAddress,
        abi:Voting.abi,
        functionName:"getCurrentVotingRoundNumber",
        onSuccess(roundNumber){
            setVotingRoundNumber(parseInt(roundNumber));
        }
    })

    const {data:candidateDetails,isLoading:detailsLoading}=useContractRead({
        address:contractAddress,
        abi:Voting.abi,
        functionName:"getCandidateByAddress",
        args:[votingRoundNumber,address],
        onSuccess(candidateDetails){
            setCandidate(candidateDetails);
        }           
    })


   async function vote(){
    if(!candidate){
        return;
    }
    if(typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
            contractAddress,
            Voting.abi,
            signer
        );
        try{
            const candidateId = candidate.id;
            const tx = await contract.giveVote(candidateId);
            await provider.waitForTransaction(tx.hash);
            console.log("Voted successfully, ",tx);
        }catch(error){
            console.log(error);
        }
    }
   }

    return (
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div
            className="bg-cover bg-center h-56 p-4"
        >
            <div className=" h-56 p-4">
                <img
                className="w-full h-full object-cover rounded-xl"
                src="https://bafybeia5xwpuxyr6cymm42yd2aghpmi6knvaqx4s3xepax24tblobps44a.ipfs.w3s.link/candidate.png"
                />
            </div>
        </div>
        <div className="flex flex-col justify-center">
            <div className="p-4 text-center">
                <h1 className="text-gray-900 font-bold text-2xl">
                    {candidate?.name}
                </h1>
            </div>
            <div className="w-full flex justify-center pb-5">
                <button className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-xl w-44"
                onClick={vote}
                >
                    Vote
                </button>
            </div>

        </div>
    </div>

    )
}

