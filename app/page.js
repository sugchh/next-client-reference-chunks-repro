import { Heavy } from "./heavy"
import { Own } from "./own"

// Renders <Heavy /> and <Own />, and not <Shared />: the only <Shared /> on
// this page is the layout's.
export default function Page() {
  return (
    <>
      <h1>Home</h1>
      <Heavy />
      <Own />
    </>
  )
}
