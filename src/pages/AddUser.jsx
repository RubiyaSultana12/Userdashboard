import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import UserForm from "../components/UserForm";

function AddUserPage({ onAddUser }) {
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (user) => {
    try {
      await onAddUser(user); //  to update table
      setShowModal(false);
      alert("User added successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to add user");
    }
  };

  return (
    <>
      <Button variant="info" onClick={() => setShowModal(true)}>
        Add User
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UserForm
            onSubmit={handleSubmit}
            onCancel={() => setShowModal(false)}
            mode="add"
          />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AddUserPage;
