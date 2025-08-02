import { useAppKitAccount } from "@reown/appkit/react";
import { useNavigation, useSubmit } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import type { Route } from "../../routes/+types/home";
import { Alert, AlertDescription, AlertTitle } from "./alert";

export function Home({ loaderData, actionData }: Route.ComponentProps) {
    const { address } = useAppKitAccount()
    const submit = useSubmit()
    const { state } = useNavigation()
    const isLoading = state === "submitting" || state === "loading"

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="container px-4">
                <Card className="max-w-md mx-auto shadow-lg border-0">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold text-slate-800">Token Exchange Request</CardTitle>
                        <CardDescription className="text-slate-600">
                            Convert your wrapped UTHR tokens to native UTHR. All requests are reviewed and processed within 2-3
                            business days.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {loaderData.request ? (
                            <div className="text-center space-y-4">
                                <div>
                                    <h3 className="font-semibold text-slate-800 mb-2">Request Submitted Successfully</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        Your exchange request is now under review. You'll receive your UTHR tokens directly in your
                                        connected wallet once approved by our team.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-600 font-medium">Exchange Rate:</span>
                                        <span className="font-bold text-slate-800">1 wUTHR = 0.1 UTHR</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-600 font-medium">Your Balance:</span>
                                        <span className="font-bold text-green-600">2.0 wUTHR</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                                        <span className="text-slate-600 font-medium">You'll Receive:</span>
                                        <span className="font-bold text-blue-600">0.2 UTHR</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Connect Your Wallet</label>
                                        <appkit-button balance="hide" />
                                    </div>

                                    {address && (
                                        <Button
                                            disabled={isLoading}
                                            onClick={async () => {
                                                await submit({ address }, { encType: "application/json", method: "post" })
                                            }}
                                            className="w-full h-12 font-semibold text-base cursor-pointer"
                                            size="lg"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <svg
                                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        ></circle>
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        ></path>
                                                    </svg>
                                                    Processing Request...
                                                </>
                                            ) : (
                                                "Submit Exchange Request"
                                            )}
                                        </Button>
                                    )}

                                    {!address && (
                                        <p className="text-center text-sm text-slate-500">
                                            Please connect your wallet to proceed with the exchange
                                        </p>
                                    )}
                                </div>

                                {actionData?.error && (
                                    <Alert variant="destructive">
                                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="15" y1="9" x2="9" y2="15" />
                                            <line x1="9" y1="9" x2="15" y2="15" />
                                        </svg>
                                        <AlertTitle>Request Failed</AlertTitle>
                                        <AlertDescription className="mt-2">
                                            {String(actionData?.error)}. Please try again or contact support if the issue persists.
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}

