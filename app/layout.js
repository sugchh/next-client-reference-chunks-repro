import { Shared } from "./shared"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Shared />
        {children}
      </body>
    </html>
  )
}
