import { HiArrowsRightLeft } from "react-icons/hi2";

export default function SwapButton() {
    return (
        <button
            className="
               p-4
                rounded-xl
                bg-neutral-700
                hover:bg-neutral-600
                transition
                flex
                items-center
                justify-center
            "
        >
            <HiArrowsRightLeft
                className="text-white text-2xl"
            />
        </button>
    );
}