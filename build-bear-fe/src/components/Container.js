import {useState, useEffect, useRef} from "react";
import { Select, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

const Container = () => {
    const selectList = [
        {
            title: "Background",
            type: "background",
            items: [
                { value: "bg-white", label: "White" },
                { value: "bg-purple", label: "Purple" },
            ],
        },
        {
            title: "Fur",
            type: "bears",
            items: [
                { value: "fur-cream", label: "Cream" },
                { value: "fur-zombie", label: "Zombie" },
            ],
        },
        {
            title: "Clothes",
            type: "clothes",
            items: [
                { value: 'none', label: "None" },
                { value: "suit", label: "Suit" },
                { value: "plaid-shirt", label: "Plaid Shirt" },
            ],
        },
        {
            title: "Mouth",
            type: "mouth",
            items: [
                { value: 'none', label: "None" },
                { value: "beard", label: "Beard" },
                { value: "black-face-mask", label: "Black face mask" },
            ],
        },
        {
            title: "Eyes",
            type: "eyes",
            items: [
                { value: 'none', label: "None" },
                { value: "sun-glasses", label: "Sun Glasses" },
                { value: "diamond-glasses", label: "Diamond Glasses" },
            ],
        },
        {
            title: "Head",
            type: "head",
            items: [
                { value: 'none', label: "None" },
                { value: "halo", label: "Halo" },
                { value: "top-hat", label: "Top Hat" },
            ],
        },
    ];

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
		if (bruhDetail[type] !== 'none') {
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

    const handleDownloadCanvas = () => {
		if (canvasRef) {
			var anchor = document.createElement("a");
			anchor.href = canvasRef.current.toDataURL("image/png");
			anchor.download = "bluh.png";
			anchor.click();
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
            <h1 className="text-[60px] font-black text-white mb-20">
                BUILD-A-BRUH
            </h1>
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
                        onClick={handleDownloadCanvas}
                    >
                        Download
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Container;
