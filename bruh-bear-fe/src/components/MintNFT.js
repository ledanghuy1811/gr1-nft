import { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import {
	DownloadOutlined,
	LoadingOutlined,
	CheckCircleOutlined,
	ArrowRightOutlined,
} from "@ant-design/icons";
import Moralis from "moralis";
import {
	useContractWrite,
	useAccount,
	useWaitForTransaction,
} from "wagmi";

import BruhBear from "../abis/BruhBear.json";

const MintNFT = ({ imgUrl }) => {
	const [openModal, setOpenModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [uriPath, setUriPath] = useState("");

	const { address } = useAccount();
	const { data, write } = useContractWrite({
		address: process.env.REACT_APP_CONTRACT_ADDRESS,
		abi: BruhBear.abi,
		functionName: "safeMint",
		args: [address, uriPath],
		from: address,
	});
	const { isLoading, isSuccess } = useWaitForTransaction({
		hash: data?.hash,
	});

	const handleProcessNft = async (imgUrl) => {
		setOpenModal(true);
		setLoading(true);

		const abiImage = [
			{
				path: "nft_01.png",
				content: imgUrl,
			},
		];
		const imgResponse = await Moralis.EvmApi.ipfs.uploadFolder({
			abi: abiImage,
		});

		const metadataContent = {
			name: "Huy-NFT",
			description: "Huy test NFT",
			image: imgResponse.toJSON()[0].path,
		};
		const encoder = new TextEncoder();
		const utf8Bytes = encoder.encode(JSON.stringify(metadataContent));
		const base64Metadata = btoa(String.fromCharCode.apply(null, utf8Bytes));
		const abiMetadata = [
			{
				path: "nft_01.json",
				content: base64Metadata,
			},
		];

		const metadataResponse = await Moralis.EvmApi.ipfs.uploadFolder({
			abi: abiMetadata,
		});

		setLoading(false);
		console.log(metadataResponse.toJSON());
		setUriPath(metadataResponse.toJSON()[0].path);
	};

	const handleMint = () => {
		write();
	};

	useEffect(() => {
		console.log(data)
		isSuccess && setOpenModal(false);
	}, [isSuccess])

	return (
		<div className="w-full">
			<Button
				ghost
				type="primary"
				icon={<DownloadOutlined />}
				size="large"
				onClick={() => handleProcessNft(imgUrl)}
			>
				Mint
			</Button>
			<Modal
				title="Upload metadata to IPFS and Mint NFT"
				centered
				confirmLoading={isLoading}
				open={openModal}
				onCancel={() => setOpenModal(false)}
				onOk={handleMint}
				cancelButtonProps={{ hidden: true }}
				okButtonProps={{ children: "mint", disabled: loading ? true : false }}
			>
				<div className="mt-4 flex flex-col gap-4">
					<div className="flex gap-4 items-center">
						{loading ? (
							<LoadingOutlined />
						) : (
							<CheckCircleOutlined
								style={{ fontSize: "18px" }}
								className="transition-all duration-300 ease-linear"
							/>
						)}
						<h1 className="mb-0 text-base font-normal">
							Upload metadata to IPFS
						</h1>
					</div>
					{!loading && (
						<div className="flex gap-4 items-center transition-all duration-300 ease-linear">
							<ArrowRightOutlined />
							<h1 className="mb-0 text-base font-normal">
								Press Ok to Mint NFT
							</h1>
						</div>
					)}
				</div>
			</Modal>
		</div>
	);
};

export default MintNFT;
