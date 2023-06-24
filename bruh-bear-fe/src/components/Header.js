import React from "react";
import { Button } from "antd";
import { LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import { useConnect, useAccount, useDisconnect } from "wagmi";

import logoHeader from "../assets/image/logo-header.svg";

const Header = () => {
	const { isConnected } = useAccount();

	const { connect, connectors } = useConnect();
	const connectorType = connectors[0];
	const { disconnect } = useDisconnect();

	const handleConnectMetamask = () => {
		return isConnected ? disconnect() : connect({ connector: connectorType });
	};

	return (
		<div
			id="header"
			className="fixed top-0 left-0 right-0 z-50 h-[120px] flex justify-between items-center bg-primary-color px-[198px] py-5"
		>
			<img src={logoHeader} alt="logo" className="w-[88px] h-20" />
			<h1 className="mb-0 font-extrabold text-white">NFT by Huy</h1>
			<Button
				ghost
				type="primary"
				icon={isConnected ? <LogoutOutlined /> : <LoginOutlined />}
				size="large"
				onClick={handleConnectMetamask}
			>
				{isConnected ? "Disconnect" : "Connect to wallet"}
			</Button>
		</div>
	);
};

export default Header;
