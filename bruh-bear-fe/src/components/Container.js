import { useState, useEffect, useRef } from "react";
import { Select, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import {default as Moralis} from 'moralis';
import { EvmChain } from "@moralisweb3/common-evm-utils";

import { selectList } from "../utils";

const Container = () => {
	const canvasRef = useRef();
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

	const handleUploadMetadata = async () => {
		// const Moralis = require("moralis").default;
		// const { EvmChain } = require("@moralisweb3/common-evm-utils");

		await Moralis.start({
			apiKey: process.env.REACT_APP_MORALIS_API_KEY,
		});

		const metadataContent = {
			name: "Huy-NFT",
			description: "Huy test NFT",
			image:
				"https://cdn3.dhht.vn/wp-content/uploads/2023/01/30-giong-meo-noi-tieng-dep-nhat-cute-de-nuoi-va-gia-ban-bia.jpg",
		};
		const encoder = new TextEncoder();
		const utf8Bytes = encoder.encode(JSON.stringify(metadataContent));
		const base64Metadata = btoa(String.fromCharCode.apply(null, utf8Bytes));

		const abi = [
			{
				path: "nft_01.json",
				content: base64Metadata,
			},
		];

		const response = await Moralis.EvmApi.ipfs.uploadFolder({ abi });

		console.log(response.toJSON());
	};

	const handleProcessNft = () => {
		if (canvasRef) {
			var anchor = document.createElement("a");
			anchor.href = canvasRef.current.toDataURL("image/png");
			anchor.download = "bluh.png";
			// console.log(anchor.href);
			// anchor.click();

			// upload to ipfs
			handleUploadMetadata();

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
					<Button
						ghost
						type="primary"
						icon={<DownloadOutlined />}
						size="large"
						onClick={handleProcessNft}
					>
						Mint
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Container;
