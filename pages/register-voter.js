import { useState } from "react";
import {ethers} from "ethers"
import { useRouter } from "next/router";
import {Web3Storage} from "web3.storage"
import {contractAddress,organiserAddress} from "../constants"
import {useIsMounted} from "../hooks/useIsMounted"
import Voting from "../../smart-contracts/artifacts/contracts/VotingContract.sol/Voting.json"


const token = process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN


const initialState = {
    name:"",
    walletAddress:"",
}


const ipfsURI = "https://w3s.link/ipfs/"
const ipfsEnd = "/post.json"



export default function AddVoter(){
    const [voter,setVoter] = useState(initialState)

    const storage = new Web3Storage({token})
    const {name,walletAddress} = voter
    const router = useRouter()

    function onChange(e){
        setVoter({...voter,[e.target.name]:e.target.value})
    }

    

    async function saveVoterToIPFS(){
        try{
            console.log(voter);
            const blob = new Blob([JSON.stringify(voter)],{type:"application/json"})
            const fileToUpload = new File([blob],
                'voter.json');
            const cid = await storage.put([fileToUpload]);
            console.log(cid);
            return cid;
        }catch(error){
            console.log(error);
        }
    }

    async function saveVoterOnChain(hash){
        if(typeof window.ethereum !== "undefined"){
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                contractAddress,
                Voting.abi,
                signer
            )

            try{
                const voterIPFS = `${ipfsURI}${hash}${ipfsEnd}`
                const name = voter.name;
                const walletAddress = voter.walletAddress;
                const tx = await contract.addVoter(
                    walletAddress,
                    name,
                    voterIPFS
                );
                await provider.waitForTransaction(tx.hash);
                console.log("Voter added to chain",tx);
            } catch(error){
                console.log(error);
            }
        }
    }

    async function addNewVoter(){
        if(!name || !walletAddress) return;
        const hash = await saveVoterToIPFS();
        await saveVoterOnChain(hash);
        router.push('/candidates');
    }

    return(
        <div 
            className="flex flex-col items-center justify-center min-h-screen py-2 -mt-56 px-14 text-center md:px-24 lg:px-96"
        >
            <div>
                <h1 className="text-4xl font-bold">Add Voter</h1>
            </div>
            <div className="flex flex-col w-full mt-8 space-y-4">
                <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Name"
                    name="name"
                    value={name}
                    onChange={onChange}
                />
                <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Wallet Address"
                    name="walletAddress"
                    value={walletAddress}
                    onChange={onChange}
                />
                <button
                    className="w-full px-4 py-2 text-white bg-black rounded-md focus:outline-none focus:bg-gray-200
					hover:bg-gray-700"
                    onClick={addNewVoter}
                >
					Add
				</button>
                </div>




        </div>
    )
}