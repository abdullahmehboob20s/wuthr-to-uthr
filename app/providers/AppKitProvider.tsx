import { createAppKit } from "@reown/appkit/react";
import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";
import { solana, solanaTestnet, solanaDevnet } from "@reown/appkit/networks";
import type { ReactNode } from "react";

const solanaWeb3JsAdapter = new SolanaAdapter();

const projectId = "55b3c63d5fc9a950161da5cde3d89407";

const metadata = {
    name: "AppKit",
    description: "AppKit Solana Example",
    url: "https://example.com",
    icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

createAppKit({
    adapters: [solanaWeb3JsAdapter],
    networks: [solana],
    metadata: metadata,
    projectId,
    allWallets: "HIDE",
    customWallets: [],
    showWallets: false,
    enableWalletGuide: false,
    excludeWalletIds: ["c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96"],
    featuredWalletIds: ["a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393", "1ca0bdd4747578705b1939af023d120677c64fe6ca76add81fda36e350605e79"],
    themeMode: "light",
    features: {
        analytics: false,
        email: false,
        emailShowWallets: false,
        socials: false,
        swaps: false,
        allWallets: false,
    },
});

export function AppKitProvider({ children }: { children: ReactNode }) {
    if (typeof window === "undefined") return;

    return children
}