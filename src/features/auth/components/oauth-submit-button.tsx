'use client'

import Image from 'next/image'
import { useFormStatus } from 'react-dom'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

type OAuthSubmitButtonProps = {
  label: string
}

export function OAuthSubmitButton({ label }: OAuthSubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      variant="outline"
      className="h-10 w-full"
      disabled={pending}
    >
      {pending ? (
        <Spinner />
      ) : (
        <Image
          src="/icons/google.svg"
          alt=""
          width={16}
          height={16}
          aria-hidden="true"
        />
      )}
      {pending ? "Redirigiendo" : label}
    </Button>
  )
}
