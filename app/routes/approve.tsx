import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { supabase } from "~/utils/supabase.server";
import type { Route } from "./+types/approve";
import type { RequestEntry } from "~/types";
import { Button } from "~/components/ui/button";
import { Connection, PublicKey, Keypair } from '@solana/web3.js'
import {
    getOrCreateAssociatedTokenAccount,
    transfer,
} from '@solana/spl-token'
import bs58 from 'bs58'
import { useNavigation, useSubmit } from "react-router";
import { useEffect } from "react";
import { toast } from "sonner"

export async function loader() {
    const { data } = await supabase.from("requests").select("*").overrideTypes<RequestEntry[]>()

    return { requests: data };
}

const SOLANA_RPC = "https://api.mainnet-beta.solana.com"
const UTHR_MINT = new PublicKey("8sdE4z8X8DZNjFSXW6fJt66339xLGmBA9Q1h8zxMpXKt")
const DECIMALS = 9
const CONVERSION_RATE = 0.1 // 1 wUTHR = 0.1 $UTHR

export async function action({ request }: Route.ActionArgs) {
    const body = await request.json()

    const connection = new Connection(SOLANA_RPC, 'confirmed')
    const secretKey = bs58.decode(process.env.PRIVATE_KEY!)
    const custodialWallet = Keypair.fromSecretKey(secretKey)

    if (body.intent === "decline") {
        const { error } = await supabase.from("requests").delete().eq("id", 1)

        if (error?.message) {
            return { error: error?.message || "Failed to decline request" }
        }

        return { success: true };
    }


    if (body.intent === "approve") {
        const { data, error } = await supabase.from("requests").select("*").eq("id", 1).single()

        if (error?.message) {
            return { error: error?.message || "No pending requests found" }
        }

        if (!data) {
            return { error: "No pending requests found" };
        }

        const { id, wuthr_amount, address } = data as RequestEntry
        const recipient = new PublicKey(address)
        const uthrAmount = Number(wuthr_amount) * CONVERSION_RATE

        try {
            // Resolve token accounts
            const toTokenAccount = await getOrCreateAssociatedTokenAccount(
                connection,
                custodialWallet,
                UTHR_MINT,
                recipient
            )

            const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
                connection,
                custodialWallet,
                UTHR_MINT,
                custodialWallet.publicKey
            )

            const txHash = await transfer(
                connection,
                custodialWallet,
                fromTokenAccount.address,
                toTokenAccount.address,
                custodialWallet,
                uthrAmount * 10 ** DECIMALS
            )

            console.log("✅ Transfer successful:", txHash)
            await supabase.from("requests").delete().eq("id", id)
            return { success: true }
        } catch (err: any) {
            console.error("❌ Transfer failed:", err)
            return { error: err?.message || "Unexpected Server Error" }
        }
    }

    return { error: "no 'intent' in payload" }
}

function ApprovePage({ loaderData, actionData }: Route.ComponentProps) {
    const submit = useSubmit()
    const navigation = useNavigation()
    const isSubmitting = navigation.state === "submitting" || navigation.state === "loading"

    useEffect(() => {
        if (actionData?.error) {
            toast.error(actionData.error)
        }

        if (actionData?.success) {
            toast.success("Request approved succesfully")
        }
    }, [actionData])


    return (
        <div className="container mx-auto py-20">
            <h1 className="mb-6">User Request</h1>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loaderData.requests?.map((request) => (
                        <TableRow key={request.id}>
                            <TableCell className="font-medium">{request.id}</TableCell>
                            <TableCell>{request.wuthr_amount} wUTHR</TableCell>
                            <TableCell>{request.address}</TableCell>
                            <TableCell>
                                <div className="flex items-center space-x-4">
                                    <Button
                                        variant="destructive"
                                        className="cursor-pointer"
                                        disabled={isSubmitting}
                                        onClick={async () => {
                                            await submit({ intent: "decline" }, { action: ".", method: "POST", encType: "application/json" })
                                            toast("Request declined succesfully")
                                        }}
                                    >
                                        Reject Request
                                    </Button>
                                    <Button
                                        variant="default"
                                        className="cursor-pointer"
                                        disabled={isSubmitting}
                                        onClick={async () => {
                                            await submit({ intent: "approve" }, { action: ".", method: "POST", encType: "application/json" })

                                        }}
                                    >
                                        Approve Request
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default ApprovePage