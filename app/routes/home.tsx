import { Home } from '~/components/ui/Home'
import type { Route } from './+types/home';
import { supabase } from '~/utils/supabase.server';
import { z } from "zod"

const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

const payloadValidator = z.object({
  address: z
    .string()
    .regex(solanaAddressRegex, "Invalid Solana wallet address"),
});

export async function loader() {
  const { data } = await supabase.from("requests").select("*").eq("id", 1).single()

  if (!data) {
    return { request: null }
  }

  return { request: data };
}

export async function action({ request }: Route.ActionArgs) {
  try {
    const payload = await request.json()

    const validation = payloadValidator.safeParse(payload)

    if (!validation.success) {
      return { error: "Address is invalid" }
    }

    const { address } = validation.data

    const { error } = await supabase.from("requests").insert({
      id: 1,
      address,
      wuthr_amount: 2
    })

    if (error) { return { error } }

    return { success: true };
  } catch (error: any) {
    return { error: error?.message || "error occured" }
  }
}

export default Home