// App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import UsersPage from "./pages/UserPage";
import AddUserPage from "./pages/AddUser";
import EditUserPage from "./pages/EditUser";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/users" />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/users/add" element={<AddUserPage />} />
        <Route path="/users/edit/:id" element={<EditUserPage />} />
      </Routes>
    </Router>
  );
}

export default App;
