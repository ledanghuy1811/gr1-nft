import Moralis from "moralis";

export const startMoralisServer = async () => {
	if (!Moralis.Core.isStarted) {
		await Moralis.start({
			apiKey: process.env.REACT_APP_MORALIS_API_KEY,
		});
	}
};

export const uploadMoralisImage = async (imgUrl, tokenId) => {
	const abiImage = [
		{
			path: `hnft_${tokenId + 1}.png`,
			content: imgUrl,
		},
	];
	const imgResponse = await Moralis.EvmApi.ipfs.uploadFolder({
		abi: abiImage,
	});
	return imgResponse;
};

export const uploadMoralisMetadata = async (
	imgMoralisRes,
	imgAttrs,
	tokenId
) => {
	const metadataContent = {
		name: `Huy-NFT-${tokenId + 1}`,
		description: `Huy-NFT collection Number ${tokenId + 1}`,
		image: imgMoralisRes.toJSON()[0].path,
		attributes: imgAttrs,
	};

	const encoder = new TextEncoder();
	const utf8Bytes = encoder.encode(JSON.stringify(metadataContent));
	const base64Metadata = btoa(String.fromCharCode.apply(null, utf8Bytes));
	const abiMetadata = [
		{
			path: `hnft_${tokenId + 1}.json`,
			content: base64Metadata,
		},
	];

	const metadataResponse = await Moralis.EvmApi.ipfs.uploadFolder({
		abi: abiMetadata,
	});
	return metadataResponse;
};
