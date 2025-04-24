import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { AddressList } from "@/components/address-list"

export default async function AddressesPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const addresses = await prisma.address.findMany({
    where: { userId: session.id as string },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">My Addresses</h1>
      <AddressList addresses={addresses} />
    </div>
  )
}

