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
	useContractRead,
} from "wagmi";

import BruhBear from "../abis/BruhBear.json";

const MintNFT = ({ imgUrl, imageAttrs }) => {
	const { address } = useAccount();
	const { data: readData, isLoading: readDataLoading, refetch } = useContractRead({
		address: process.env.REACT_APP_CONTRACT_ADDRESS,
		abi: BruhBear.abi,
		functionName: "getTokenId",
		from: address,
	});

	console.log(Number(readData), readDataLoading);

	const [openModal, setOpenModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [uriPath, setUriPath] = useState("");

	const { data, write } = useContractWrite({
		address: process.env.REACT_APP_CONTRACT_ADDRESS,
		abi: BruhBear.abi,
		functionName: "safeMint",
		args: [address, uriPath],
		from: address,
	});
	const { isLoading, isSuccess, isError, error } = useWaitForTransaction({
		hash: data?.hash,
	});

	const handleProcessNft = async (imgUrl) => {
		setOpenModal(true);
		setLoading(true);

		const abiImage = [
			{
				path: `hnft_${Number(readData) + 1}.png`,
				content: imgUrl,
			},
		];
		const imgResponse = await Moralis.EvmApi.ipfs.uploadFolder({
			abi: abiImage,
		});

		const metadataContent = {
			name: `Huy-NFT-${Number(readData) + 1}`,
			description: `Huy-NFT collection Number ${Number(readData) + 1}`,
			image: imgResponse.toJSON()[0].path,
			attributes: imageAttrs,
		};
		const encoder = new TextEncoder();
		const utf8Bytes = encoder.encode(JSON.stringify(metadataContent));
		const base64Metadata = btoa(String.fromCharCode.apply(null, utf8Bytes));
		const abiMetadata = [
			{
				path: `hnft_${Number(readData) + 1}.json`,
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

	const openSuccessModal = () => {
		Modal.success({
			title: "You mint an NFT successfully",
			width: "600px",
			content: (
				<div id="popup-modal" className="flex flex-col gap-3 mb-5">
					<h1 className="mb-0 text-base font-normal">
						Your transaction hash: {data?.hash}
					</h1>
					<div className="grid grid-cols-2 gap-10">
						<Button
							href={`https://goerli.etherscan.io/tx/${data?.hash}`}
							target="_blank"
							type="primary"
						>
							View Transaction
						</Button>
						<Button
							href={`https://testnets.opensea.io/assets/goerli/${
								process.env.REACT_APP_CONTRACT_ADDRESS
							}/${Number(readData)}`}
							target="_blank"
							type="primary"
						>
							View NFT
						</Button>
					</div>
				</div>
			),
		});
		setOpenModal(false);
	};

	const openErrorModal = () => {
		Modal.error({
			title: "Mint NFT error",
			content: <div>Error: {error}</div>,
		});
	};

	useEffect(() => {
		let timerId;
		if (isSuccess) {
			setOpenModal(false);
			refetch();
			timerId = setTimeout(() => {
				openSuccessModal();
			}, 500);
		}

		return () => clearTimeout(timerId);
	}, [isSuccess]);

	useEffect(() => {
		let timerId;
		if (isError) {
			setOpenModal(false);
			timerId = setTimeout(() => {
				openErrorModal();
			}, 500);
		}

		return () => clearTimeout(timerId);
	}, [isError]);

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
