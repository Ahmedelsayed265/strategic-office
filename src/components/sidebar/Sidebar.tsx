
import Pointers from "./Pointers";
import Sections from "./Sections";

export default function Sidebar() {
  return (
    <aside className="flex gap-4">
      <Sections  />
      <Pointers />
    </aside>
  );
}
