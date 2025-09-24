import { useState, useEffect } from "react";
import splitName from "../split/SplitName";

function UserForm({ user, onSubmit, onCancel, mode = "add" }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
  });

  useEffect(() => {
    if (user) {
      const { firstName, lastName } = splitName(user.name);
      setFormData({
        firstName,
        lastName,
        email: user.email,
        company: user.company?.name || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { firstName, lastName, email, company } = formData;

    if (!firstName || !lastName || !email || !company) {
      alert("All fields are required");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      alert("Enter a valid email");
      return;
    }

    onSubmit({
      name: `${firstName} ${lastName}`,
      email,
      company: { name: company },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="mb-2">
        <label>First Name</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-2">
        <label>Last Name</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-2">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-2">
        <label>Company</label>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="d-flex gap-2 mt-3">
        <button type="submit" className="btn btn-primary px-4 py-2 rounded">
          {mode === "edit" ? "Update User" : "Add User"}
        </button>
        <button
          type="button"
          className="btn btn-danger px-4 py-2 rounded"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default UserForm;
