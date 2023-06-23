import { useState, useEffect, useRef } from "react";
import { Select, Button, Modal } from "antd";
import {
	DownloadOutlined,
	LoadingOutlined,
	CheckCircleOutlined,
} from "@ant-design/icons";
import Moralis from "moralis";
import { useAccount } from "wagmi";

import { selectList } from "../utils";

await Moralis.start({
  apiKey: process.env.REACT_APP_MORALIS_API_KEY,
});

const Container = () => {
	const { isConnected } = useAccount();
	const canvasRef = useRef();
	const [openModal, setOpenModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [bruhDetail, setBruhDetail] = useState({
		background: "bg-white",
		bears: "fur-cream",
	});
	const [image, setImage] = useState({
		background: null,
		bears: null,
		clothes: null,
		eyes: null,
		head: null,
		mouth: null,
	});

	const selectBruhDetail = (type, value) => {
		bruhDetail[type] = value;
		setBruhDetail((prev) => {
			prev[type] = value;
			return { ...prev };
		});
	};

	const handleImage = (type) => {
		if (bruhDetail[type] !== "none") {
			const image = new Image();
			image.src = `/characters/bear/${type}/${bruhDetail[type]}.png`;
			// console.log(image);
			image.onload = () => {
				setImage((prev) => {
					prev[type] = image;
					return { ...prev };
				});
			};
		} else {
			setImage((prev) => {
				delete prev[type];
				return { ...prev };
			});
		}
	};

	function handleCanvas() {
		const ctx = canvasRef.current.getContext("2d");

		if (image.background && image.bears && canvasRef) {
			Object.values(image).forEach((item) => {
				if (item) {
					ctx.drawImage(item, 0, 0, 450, 450);
				}
			});
		}
	}

	const handleUploadToIpfs = async (imgUrl) => {
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
	};

	const handleProcessNft = async () => {
		if (canvasRef) {
			var anchor = document.createElement("a");
			anchor.href = canvasRef.current.toDataURL("image/png");
			anchor.download = "bluh.png";
			// console.log(anchor.href);
			// anchor.click();

			// open Modal
			setOpenModal(true);

			// upload to ipfs
			await handleUploadToIpfs(anchor.href);

			// mint nft
		}
	};

	useEffect(() => {
		handleImage("background");
		handleImage("bears");
		handleImage("clothes");
		handleImage("head");
		handleImage("eyes");
		handleImage("mouth");
	}, [bruhDetail]);

	useEffect(() => {
		handleCanvas();
	}, [image]);

	return (
		<div
			id="container"
			className="bg-primary-color mt-[120px] py-20 px-40 flex flex-col justify-center items-center"
		>
			<h1 className="text-[60px] font-black text-white mb-20">BUILD-A-BRUH</h1>
			<div className="flex gap-28">
				<canvas
					id="canvas"
					ref={canvasRef}
					width={450}
					height={450}
					className="bg-white"
				></canvas>
				<div className="flex flex-col justify-between">
					<div className="flex flex-col gap-5">
						{selectList.map((selectItem) => (
							<Select
								key={selectItem.title}
								className="w-[220px]"
								placeholder={"Select " + selectItem.title}
								onChange={(val) => {
									selectBruhDetail(selectItem.type, val);
								}}
								options={selectItem.items}
							/>
						))}
					</div>
					{isConnected && (
						<>
							<Button
								ghost
								type="primary"
								icon={<DownloadOutlined />}
								size="large"
								onClick={handleProcessNft}
							>
								Mint
							</Button>
							<Modal
								title="Upload metadata to IPFS and Mint NFT"
								centered
								open={openModal}
								onCancel={() => setOpenModal(false)}
							>
								<div className="mt-4">
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
								</div>
							</Modal>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default Container;
