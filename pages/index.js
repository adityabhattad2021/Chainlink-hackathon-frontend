import Head from "next/head";
import { useAccount} from "wagmi";
import { useIsMounted } from "../hooks/useIsMounted";
import {useIsOrganiser} from "../hooks/useIsOrganiser"; 
import {useRouter} from "next/router";

export default function Home() {
	const router = useRouter()
	const  mounted  = useIsMounted();
	const { address, isConnected } = useAccount();
	const isOrganiser = useIsOrganiser();

	console.log(isOrganiser);


	function handleClick(e){
		e.preventDefault()
		router.push('/create-election/voting-entry')
	}

	return (
		<div className="flex  flex-col items-center justify-center py-2 ">
			<Head>
				<title>Voting Dapp</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div>
        {mounted && isConnected  && (
			<div>
				{isOrganiser && (
					<button className="px-4 py-3  bg-black text-white rounded-2xl text-4xl font-bold mt-60 " onClick={handleClick}>Start Election</button>
				)}
				
				
			</div>
		)}
      </div>
		</div>
	);
  
};


