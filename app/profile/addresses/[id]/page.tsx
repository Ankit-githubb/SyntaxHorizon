import { redirect, notFound } from "next/navigation"
import { getSession } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { AddressForm } from "@/components/address-form"

interface EditAddressPageProps {
  params: {
    id: string
  }
}

export default async function EditAddressPage({ params }: EditAddressPageProps) {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const address = await prisma.address.findUnique({
    where: { id: params.id },
  })

  if (!address || address.userId !== session.id) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Address</h1>
      <AddressForm address={address} isEditing />
    </div>
  )
}

