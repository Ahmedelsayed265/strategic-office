import { RouterProvider } from "react-router";
import { Toaster } from "sonner";
import { router } from "./providers/router";

function App() {
  return (
    <>
      <Toaster expand={false} richColors position="bottom-right" />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
