import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import UserForm from "../components/UserForm";
import { updateUser } from "../api/api";

function EditUserModal({ user, show, onClose, onUserUpdated }) {
  const [formData, setFormData] = useState(user);

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleSubmit = async (updatedUserData) => {
    try {
      const res = await updateUser(user.id, updatedUserData);
      onUserUpdated(res.data); 
      alert("User updated successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update user");
    }
  };

  if (!show) return null;

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {user ? (
          <UserForm
            user={formData} // 
            onSubmit={handleSubmit}
            onCancel={onClose}
            mode="edit"
          />
        ) : (
          <p>User not found</p>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default EditUserModal;
