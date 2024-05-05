'use client'
  
export function ServerAction({
  children,
  action
}: Readonly<{
  children: React.ReactNode;
  action: any,
}>) {   
  return (
    <form action={action}>
      {children}      
    </form>
  )
}