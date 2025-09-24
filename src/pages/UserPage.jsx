import React, { useState, useEffect } from "react";
import { getUsers, addUser, updateUser } from "../api/api";
import UserTable from "../components/UserTable";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import AddUserPage from "./AddUser";
import Filter from "../components/Filter";
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
  const [itemsPerPage, setItemsPerPage] = useState(5); // default 5 rows per page
    const [editUser, setEditUser] = useState(null); // selected user for editing
  const [showEditModal, setShowEditModal] = useState(false);
  // Fetch users once
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
  }, []);

  // Filter + search users
  const filteredUsers = users.filter((u) => {
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

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);

  // Handle adding user
  const handleAddUser = async (user) => {
    try {
      const res = await addUser(user);
      setUsers((prev) => [...prev, res.data]);
      alert("User added successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to add user");
    }
  };

   const handleEditUser = (user) => {
    setEditUser(user);
    setShowEditModal(true);
  };

  const handleUpdateUser = async (updatedUser) => {
    try {
      const res = await updateUser(editUser.id, updatedUser);
      setUsers((prev) =>
        prev.map((u) => (u.id === editUser.id ? res.data : u))
      );
      setShowEditModal(false);
      alert("User updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update user");
    }
  };


  return (
    <div className="p-4">
  <h1 className="text-center mb-4">User Management Dashboard</h1>

  <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center justify-content-md-between gap-3 w-100">
    
    {/* Search Bar */}
    <div className="flex-fill">
      <SearchBar searchTerm={search} setSearchTerm={setSearch} />
    </div>

    {/* Filter Button */}
    <button
      className="btn btn-outline-primary px-4 py-2 w-100 w-md-auto"
      onClick={() => setShowFilter(true)}
    >
      Filters
    </button>

    {/* Rows per Page */}
    <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-2 w-100 w-md-auto">
      <label className="mb-0">Rows per page:</label>
      <select
        value={itemsPerPage}
        onChange={(e) => {
          setItemsPerPage(Number(e.target.value));
          setCurrentPage(1);
        }}
        className="form-select w-100 w-auto"
      >
        {[5, 10, 25, 50, 100].map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
    </div>

    {/* Add User Button */}
    <div className="flex-fill flex-md-grow-0">
      <AddUserPage
        setUsers={setUsers}
        users={users}
        onAddUser={handleAddUser}
      />
    </div>
  </div>


      <Filter
        show={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={(appliedFilters) => setFilter(appliedFilters)}
      />

      <UserTable users={currentUsers} setUsers={setUsers} />

      <Pagination
        totalItems={filteredUsers.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
      
    {editUser && (
        <AddUserPage
          show={showEditModal}
          setShow={setShowEditModal}
          editUser={editUser}
          onAddUser={handleUpdateUser} // reuse AddUserPage to update
        />
      )}
    </div>
  );
}

export default UserData;
