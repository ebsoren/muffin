import { JoinUs } from "./JoinUs"

export const BottomJoin = () => {
    return (
        <div className="flex flex-col items-center justify-center my-10 gap-10">
            <div className="text-6xl font-bold text-flat-gold">
                Interested?
            </div>
            <JoinUs opt="VSBC" />
        </div>
    )
}