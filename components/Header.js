
import { ConnectButton } from "web3uikit";


export default function Header() {
    return (
        //ConnectButton does everything we did in manual header
        <div className="border-b-2 center flex flex-flexWrap: wrap">
            <h1 className="py-4 px-4 font-blog text-3xl">Decentralized Lottery</h1>
            <div className="ml-auto py-2 px-4"><ConnectButton moralisAuth={false} />
            </div>

        </div>
    )
}