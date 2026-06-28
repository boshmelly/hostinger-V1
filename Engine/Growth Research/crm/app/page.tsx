import { getIntel } from "../lib/data";
import Dashboard from "../components/Dashboard";

export default function Page() {
  const intel = getIntel();
  return <Dashboard intel={intel} />;
}
