import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function Filter({ show, onClose, onApply }) {
  const [filters, setFilters] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Company: "",
  });

  // input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // apply filters
  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  // clear filters
  const handleClear = () => {
    const cleared = {
      FirstName: "",
      LastName: "",
      Email: "",
      Company: "",
    };
    setFilters(cleared);
    onApply(cleared);
    onClose();
  };

  return (
      // Modal
    <Modal show={show} onHide={onClose} centered> 
      <Modal.Header closeButton>
        <Modal.Title>Filter Users</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              name="FirstName"   
              value={filters.FirstName}
              onChange={handleChange}
              placeholder="Enter first name"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              name="LastName"   
              value={filters.LastName}
              onChange={handleChange}
              placeholder="Enter last name"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="Email"   
              value={filters.Email}
              onChange={handleChange}
              placeholder="Enter Email"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Company</Form.Label>
            <Form.Control
              type="text"
              name="Company"  
              value={filters.Company}
              onChange={handleChange}
              placeholder="Enter Company"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleApply}>
          Apply Filter
        </Button>
        <Button variant="secondary" onClick={handleClear}>
          Reset
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Filter;
