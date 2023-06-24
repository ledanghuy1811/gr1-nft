import { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import {
	DownloadOutlined,
	LoadingOutlined,
	CheckCircleOutlined,
	ArrowRightOutlined,
} from "@ant-design/icons";
import {
	useContractWrite,
	useAccount,
	useWaitForTransaction,
	useContractRead,
} from "wagmi";

import {
	uploadMoralisImage,
	uploadMoralisMetadata,
} from "../services/moralis.js";
import BruhBear from "../abis/BruhBear.json";

const MintNFT = ({ imgUrl, imageAttrs }) => {
	const { address } = useAccount();
	const [openModal, setOpenModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [uriPath, setUriPath] = useState("");

	const { data: readData, refetch } = useContractRead({
		address: process.env.REACT_APP_CONTRACT_ADDRESS,
		abi: BruhBear.abi,
		functionName: "getTokenId",
		from: address,
	});

	console.log(Number(readData));

	const { data, write } = useContractWrite({
		address: process.env.REACT_APP_CONTRACT_ADDRESS,
		abi: BruhBear.abi,
		functionName: "safeMint",
		args: [address, uriPath],
		from: address,
	});
	const { isSuccess, isError, error } = useWaitForTransaction({
		hash: data?.hash,
	});

	const handleProcessNft = async (imgUrl) => {
		setOpenModal(true);
		setLoading(true);

		const imgMoralisResponse = await uploadMoralisImage(
			imgUrl,
			Number(readData)
		);

		const metadataMoralisResponse = await uploadMoralisMetadata(
			imgMoralisResponse,
			imageAttrs,
			Number(readData)
		);

		setLoading(false);
		console.log(metadataMoralisResponse.toJSON());
		setUriPath(metadataMoralisResponse.toJSON()[0].path);
	};

	const handleMint = () => {
		setConfirmLoading(true);
		write();
	};

	const openSuccessModal = () => {
		Modal.success({
			title: "You mint an NFT successfully",
			width: "600px",
			content: (
				<div id="popup-modal" className="flex flex-col gap-3 mb-3">
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
			width: "600px",
			content: <div>Error: {error}</div>,
		});
	};

	useEffect(() => {
		let timerId;
		if (isSuccess) {
			setConfirmLoading(false);
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
				confirmLoading={confirmLoading}
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
