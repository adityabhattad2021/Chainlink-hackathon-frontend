import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import {
	darkTheme,
	getDefaultWallets,
	midnightTheme,
	RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
// import {alchemyProvider} from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import Header from "../components/Header";

const { chains, provider } = configureChains(
	[chain.goerli, chain.hardhat, chain.localhost],
	[publicProvider()]
);

const { connectors } = getDefaultWallets({
	appName: "Decentralized Voting",
	chains,
});

const wagmiClient = createClient({
	autoConnect: true,
	connectors,
	provider,
});

function MyApp({ Component, pageProps }) {
	return (
		<WagmiConfig client={wagmiClient}>
			<RainbowKitProvider chains={chains} theme={midnightTheme()}>
				<Header />
				<Component {...pageProps} />
			</RainbowKitProvider>
		</WagmiConfig>
	);
}

export default MyApp;
