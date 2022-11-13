import { useState } from "react";
import { ethers } from "ethers";
import { Web3Storage } from "web3.storage";
import { contractAddress, organiserAddress } from "../../constants";
import { useIsMounted } from "../../hooks/useIsMounted";
import Voting from "../../../smart-contracts/artifacts/contracts/VotingContract.sol/Voting.json";

const token = process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN;

const initialState = {
	name: "",
	walletAddress: "",
};

const ipfsURI = "https://w3s.link/ipfs/";
const ipfsEnd = "/post.json";

const ipfsImgEnd = "/candidate.png";


export default function AddCandidate() {
	const [candidate, setCandidate] = useState(initialState);

	const storage = new Web3Storage({ token });
	const { name, walletAddress } = candidate;

	function onChange(e) {
		setCandidate({ ...candidate, [e.target.name]: e.target.value });
	}

	async function handleFileChange(e) {
		const uploadedFile = e.target.files[0];
		const blob = uploadedFile.slice(0, uploadedFile.size, "image/png");
		const forIPFS = new File([blob], "candidate.png", {
			type: "image/png",
		});
		console.log(forIPFS);
		if (!forIPFS) {
			console.log("No file selected");
			return;
		}
		const cid = await storage.put([forIPFS]);
		console.log(cid);
		setCandidate((prevState) => ({
			...prevState,
			candidateImage: `${ipfsURI}${cid}${ipfsImgEnd}`,
		}));
	}

	async function addNewCandidate() {
		if (!name || !walletAddress) return;

		const hash = await saveCandidateToIPFS();
		await saveCandidate(hash);

	}

	async function saveCandidateToIPFS() {
		try {
			console.log(candidate);
			const blob = new Blob([JSON.stringify(candidate)], {
				type: "application/json",
			});
			const fileToUpload = new File([blob], "candidate.json");
			const cid = await storage.put([fileToUpload]);
			console.log(cid);
			return cid;
		} catch (error) {
			console.log(error);
		}
	}

	async function saveCandidate(hash) {
		if(typeof window.ethereum !== "undefined"){
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                contractAddress,
                Voting.abi,
                signer
            )

            try{
                const candidateIPFS = `${ipfsURI}${hash}${ipfsEnd}`;
                const candidateImg = candidate.candidateImage;
                const val = await contract.addCandidate(candidate.walletAddress,candidate.name,candidateImg,candidateIPFS);
                await provider.waitForTransection(val.hash);
                console.log("Val ",val);
            }catch(err){
                console.log(err);
            }
        }
	}

	return (
		<div>
			<div className="grid place-items-center">
				<div className=" text-4xl font-bold m-5">Add Candidate</div>
				<div className="flex flex-col">
					<label className="text-2xl font-bold">Candidate Name</label>
					<input
						className="border-2 border-black rounded-md p-2 m-2"
						type="text"
                        name="name"
						value={candidate.name}
						onChange={onChange}
					/>
				</div>
				<div className="flex flex-col">
					<label className="text-2xl font-bold">
						Candidate Address
					</label>
					<input
						className="border-2 border-black rounded-md p-2 m-2"
						type="text"
                        name="walletAddress"
						value={candidate.walletAddress}
						onChange={onChange}
					/>
				</div>
				<div className="flex flex-col">
					<label className="text-2xl font-bold">
						Candidate Image
					</label>
					<input
						className="border-2 border-black rounded-md p-2 m-2"
						type="file"
						onChange={handleFileChange}
					/>
				</div>
				<button
					className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-xl m-2"
					type="submit"
                    onClick={addNewCandidate}
				>
					Add Candidate
				</button>
			</div>
		</div>
	);
}
