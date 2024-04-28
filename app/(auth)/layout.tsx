

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex items-center justify-center p-2">
      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto w-full sm:max-w-4xl">
        <div className="hidden sm:block sm:w-1/2 bg-cover"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1546514714-df0ccc50d7bf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80')" }}>
        </div>
        <div className="w-full rounded-r-lg p-8 sm:w-1/2 border b-t-1 border-gray">
          {children}
        </div>
      </div>
    </div>
  )
}