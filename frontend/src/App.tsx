import "./App.css";
import "./themes/Glass.css";
import "./themes/Light.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { UserProvider } from "./contexts/UserContext";

function App() {
    return (
        <>
            <UserProvider>
                <RouterProvider router={router} />
            </UserProvider>
        </>
    );
}

export default App;
