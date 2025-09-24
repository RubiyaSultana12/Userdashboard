import { useNavigate } from "react-router-dom";
import splitName from "../split/SplitName";
import { deleteUser } from "../api/api";
import "../css/UserTable.css"; 

function UserTable({ users = [], setUsers }) {
  const navigate = useNavigate();

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

  return (
    <div className="table-responsive">
      <table
        className="table table-bordered table-hover align-middle text-nowrap w-100"
        style={{ tableLayout: "auto" }}
      >
        <thead className="table-info">
          <tr>
            <th>ID</th>
            <th>First</th>
            <th>Last</th>
            <th>Email</th>
            <th>Company</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((data) => {
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
                        onClick={() => navigate(`/users/edit/${data.id}`)}
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
    </div>
  );
}

export default UserTable;
