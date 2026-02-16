import { Routes, Route } from "react-router-dom";
import Chat from "./Components/Chat";
import Home from "./Pages/Home";

function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="chat" element={<Chat />} />
    </Routes>
  );
}

export default App;
