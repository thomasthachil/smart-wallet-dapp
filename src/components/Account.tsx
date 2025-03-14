import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export function Account() {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! })

  return (
    <div className="flex items-center gap-3">
      {ensAvatar && (
        <div className="relative h-8 w-8 overflow-hidden rounded-full">
          <Image 
            alt="ENS Avatar" 
            src={ensAvatar} 
            fill 
            className="object-cover"
          />
        </div>
      )}
      {address && (
        <div className="font-medium">
          {ensName ? `${ensName} (${address})` : address}
        </div>
      )}
      <Button variant="outline" size="sm" onClick={() => disconnect()}>
        Disconnect
      </Button>
    </div>
  )
}