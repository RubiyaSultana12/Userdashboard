import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUsers, updateUser } from "../api/api";
import UserForm from "../components/UserForm";


function EditUserPage() {
  const { id } = useParams(); // get user id from URL
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // store user data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUsers(); // JSONPlaceholder returns all users
        const foundUser = res.data.find((u) => u.id === parseInt(id));
        if (foundUser) setUser(foundUser);
        else alert("User not found");
      } catch (err) {
        console.error(err);
        alert("Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleSubmit = async (updatedUser) => {
    try {
      await updateUser(id, updatedUser);
      alert("User updated successfully!");
      navigate("/users");
    } catch (err) {
      console.error(err);
      alert("Failed to update user");
    }
  };

  if (loading) return <p>Loading user data...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Edit User</h1>

      <UserForm user={user} onSubmit={handleSubmit} onCancel={() => navigate("/users")}  />

      
    </div>
  );
}

export default EditUserPage;
