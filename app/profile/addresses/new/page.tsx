import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { AddressForm } from "@/components/address-form"

export default async function NewAddressPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Add New Address</h1>
      <AddressForm />
    </div>
  )
}

