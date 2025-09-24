import { useState } from "react";
import splitName from "../split/SplitName";
import { deleteUser } from "../api/api";
import EditUserModal from "../pages/EditUser";
import "../css/UserTable.css";

function UserTable({ users = [], setUsers }) {
  const [editUserId, setEditUserId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Sort state
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      alert("User deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  // Update user in table after edit
  const handleUserUpdated = (updatedUser) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
  };

  // Sorting logic
  const sortedUsers = [...users].sort((a, b) => {
    if (!sortConfig.key) return 0;

    let aValue, bValue;

    switch (sortConfig.key) {
      case "id":
        aValue = a.id;
        bValue = b.id;
        break;
      case "first":
        aValue = splitName(a.name).firstName.toLowerCase();
        bValue = splitName(b.name).firstName.toLowerCase();
        break;
      case "last":
        aValue = splitName(a.name).lastName.toLowerCase();
        bValue = splitName(b.name).lastName.toLowerCase();
        break;
      case "email":
        aValue = a.email.toLowerCase();
        bValue = b.email.toLowerCase();
        break;
      case "company":
        aValue = (a.company?.name || "").toLowerCase();
        bValue = (b.company?.name || "").toLowerCase();
        break;
      default:
        aValue = "";
        bValue = "";
    }

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Handle header click to sort
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortArrow = (key) => {
    if (sortConfig.key !== key) return "";
    return sortConfig.direction === "asc" ? " ▲" : " ▼";
  };

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover align-middle text-nowrap w-100">
        <thead className="table-info">
          <tr>
            <th style={{ cursor: "pointer" }} onClick={() => handleSort("id")}>
              ID{getSortArrow("id")}
            </th>
            <th style={{ cursor: "pointer" }} onClick={() => handleSort("first")}>
              First{getSortArrow("first")}
            </th>
            <th style={{ cursor: "pointer" }} onClick={() => handleSort("last")}>
              Last{getSortArrow("last")}
            </th>
            <th style={{ cursor: "pointer" }} onClick={() => handleSort("email")}>
              Email{getSortArrow("email")}
            </th>
            <th style={{ cursor: "pointer" }} onClick={() => handleSort("company")}>
              Company{getSortArrow("company")}
            </th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.length > 0 ? (
            sortedUsers.map((data) => {
              const { firstName, lastName } = splitName(data.name);
              return (
                <tr key={data.id}>
                  <td>{data.id}</td>
                  <td>{firstName}</td>
                  <td>{lastName}</td>
                  <td className="text-break">{data.email}</td>
                  <td>{data.company?.name || ""}</td>
                  <td>
                    <div className="d-flex flex-wrap gap-2 justify-content-center">
                      <button
                        className="btn btn-sm btn-info"
                        onClick={() => alert(JSON.stringify(data, null, 2))}
                      >
                        View
                      </button>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => {
                          setEditUserId(data.id);
                          setShowEditModal(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(data.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Edit Modal */}
      
       {showEditModal && (
  <EditUserModal
    user={users.find((u) => u.id === editUserId)} 
    show={showEditModal}
    onClose={() => setShowEditModal(false)}
    onUserUpdated={handleUserUpdated} 
  />
)}
    </div>
  );
}

export default UserTable;
