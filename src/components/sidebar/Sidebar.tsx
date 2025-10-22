import Pointers from "./Pointers";
import Sections from "./Sections";

export default function Sidebar() {
  return (
    <aside className="flex">
      <Sections />
      <Pointers />
    </aside>
  );
}
