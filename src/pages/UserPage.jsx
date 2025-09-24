import React, { useState, useEffect } from "react";
import { getUsers, addUser, updateUser } from "../api/api";
import UserTable from "../components/UserTable";
import SearchBar from "../components/SearchBar";
import AddUserPage from "./AddUser";
import Filter from "../components/Filter";
import Pagination from "../components/Pagination";
import UserForm from "../components/UserForm";
import { Modal } from "react-bootstrap";
import splitName from "../split/SplitName";

function UserData() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Company: "",
  });
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); 
  const [itemsPerPage, setItemsPerPage] = useState(5);
  // Sorting state
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

  // Edit modal state
  const [editUser, setEditUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers();
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);  // Fetch users once

  // Filter + search + sort users
  const getFilteredUsers = () => {
    let filtered = users.filter((u) => {
      const { firstName, lastName } = splitName(u.name);
      const term = search.toLowerCase();

      const matchesSearch =
        firstName.toLowerCase().includes(term) ||
        lastName.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        (u.company?.name || "").toLowerCase().includes(term);

      const matchesFilter =
        (!filter.FirstName ||
          firstName.toLowerCase().includes(filter.FirstName.toLowerCase())) &&
        (!filter.LastName ||
          lastName.toLowerCase().includes(filter.LastName.toLowerCase())) &&
        (!filter.Email ||
          u.email.toLowerCase().includes(filter.Email.toLowerCase())) &&
        (!filter.Company ||
          (u.company?.name || "")
            .toLowerCase()
            .includes(filter.Company.toLowerCase()));

      return matchesSearch && matchesFilter;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue, bValue;
        if (sortConfig.key === "id") {
          aValue = a.id;
          bValue = b.id;
        } else if (sortConfig.key === "name") {
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
        } else if (sortConfig.key === "email") {
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
        } else if (sortConfig.key === "company") {
          aValue = (a.company?.name || "").toLowerCase();
          bValue = (b.company?.name || "").toLowerCase();
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  };

  const filteredUsers = getFilteredUsers();

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  
  // Add user
  const handleAddUser = async (user) => {
    try {
      const res = await addUser(user);
      setUsers((prev) => [res.data, ...prev]);
      alert("User added successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to add user");
    }
  };

  // Edit user
  const handleEditUser = (user) => {
    setEditUser(user);
    setShowEditModal(true);
  };

  // Update user
  const handleUpdateUser = async (updatedUser) => {
    try {
      const res = await updateUser(editUser.id, updatedUser);
      setUsers((prev) =>
        prev.map((u) => (u.id === editUser.id ? res.data : u))
      );
      setShowEditModal(false);
      setEditUser(null);
      alert("User updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update user");
    }
  };

  // Handle sort click
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="p-4">
      <h1 className="text-center mb-4">User Management Dashboard</h1>
      {/* Toolbar */}
      <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center justify-content-md-between gap-3 w-100 mb-3">
        <SearchBar searchTerm={search} setSearchTerm={setSearch} />
        <button
          className="btn btn-outline-primary px-4 py-2"
          onClick={() => setShowFilter(true)}
        >
          Filters
        </button>
        {/* Rows per page */}{" "}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-2 w-100 w-md-auto">
          {" "}
          <label className="mb-0">Rows per page:</label>{" "}
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="form-select w-100 w-auto"
          >
            {" "}
            {[5, 10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>
                {" "}
                {n}{" "}
              </option>
            ))}
          </select>
        </div>
        <AddUserPage onAddUser={handleAddUser} />
      </div>
      {/* Filters */}
      <Filter
        show={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={(appliedFilters) => setFilter(appliedFilters)}
      />
          

      {/* Table */}
      <UserTable
        users={currentUsers}
        setUsers={setUsers}
        onEdit={handleEditUser}
        onSort={handleSort}
        sortConfig={sortConfig}
      />
      {/* Pagination */}{" "}
      <Pagination
        totalItems={filteredUsers.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
      {/* Edit Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UserForm
            user={editUser}
            onSubmit={handleUpdateUser}
            onCancel={() => setShowEditModal(false)}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default UserData;
