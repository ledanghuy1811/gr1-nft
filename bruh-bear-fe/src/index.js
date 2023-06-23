import React from "react";
import ReactDOM from "react-dom/client";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { goerli } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

const { chains, publicClient, webSocketPublicClient } = configureChains(
	[goerli],
	[
		alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_API_KEY }),
		publicProvider(),
	]
);
const config = createConfig({
	autoConnect: true,
	connectors: [
		new MetaMaskConnector({
			chains,
			options: {
        UNSTABLE_shimOnConnectSelectAccount: true,
			},
		}),
	],
	publicClient,
	webSocketPublicClient,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<WagmiConfig config={config}>
			<App />
		</WagmiConfig>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
