import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

export default function Header() {
	return (
		<nav className="p-5 border-b-2 flex flex-row justify-between items-center">
			<div className="flex flex-row items-center">
				<Link href="/">
					<h1 className="py-4 px-4 font-bold text-3xl">
						Decentralized Voting
					</h1>
				</Link>
				<Link href="/find-winner">
					<button className="px-3 py-2  bg-black text-white rounded-xl text-md font-bold ">
						Find Winner
					</button>
				</Link>
			</div>
			<ConnectButton
				showBalance={true}
				accountStatus={"full"}
				chainStatus={"full"}
			/>
		</nav>
	);
}
