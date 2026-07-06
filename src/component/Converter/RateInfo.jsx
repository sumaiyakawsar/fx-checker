import { ACTIONS } from "@/constants/actions";
import Button from "../UI/Button/Button";
import { FaStar } from "react-icons/fa";



export default function RateInfo({
    rate = "1 USD = 0.8530 EUR",
    onFavorite,
    onLog,
}) {
    return (
        <div className="flex justify-between items-center mt-6 border-t border-neutral-800 pt-4">

            <p className="text-sm text-neutral-400">
                {rate}
            </p>

            <div className="flex gap-3">

                
                <Button
                    variant="primary"
                    icon={<FaStar />} 
                    onClick={onFavorite}
                >
                    {ACTIONS.favorite}
                </Button>
                
                <Button variant="outline" onClick={onLog}>
                    Log Conversion
                </Button>
            </div>

        </div>
    );
}