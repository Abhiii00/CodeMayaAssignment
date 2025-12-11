import { useEffect, useState } from "react";
import Header from "../directives/header";
import Footer from "../directives/footer";
import Sidebar from "../directives/sidebar";
import DataTable from "react-data-table-component";
import { Button, Modal, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { getUser, createNewUser, updateUser, deleteUser } from "../Action/action";
import Cookies from "js-cookie";

export default function UserList() {
  const [loader, setLoader] = useState(false);
  const [userData, setUserData] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [selectedUser, setSelectedUser] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "USER",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const loginData = Cookies.get("Code_Maya_Assignment")
    ? JSON.parse(Cookies.get("Code_Maya_Assignment"))
    : null;

  const userPermissions = loginData?.user?.permissions || [];

  useEffect(() => {
    fetchUserList();
  }, []);

  const fetchUserList = async () => {
    setLoader(true);
    try {
      const res = await getUser();
      if (res?.data) {
        setUserData(res.data);
      } else {
        Swal.fire("Error", "Failed to fetch users", "error");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      Swal.fire("Error", "Something went wrong while fetching users", "error");
    } finally {
      setLoader(false);
    }
  };

  const validate = () => {
    let temp = { name: "", email: "", password: "", role: "" };
    let valid = true;

    if (!form.name.trim()) {
      temp.name = "Name is required";
      valid = false;
    }

    if (!form.email.trim()) {
      temp.email = "Email is required";
      valid = false;
    }

    if (modalType === "add" && !form.password.trim()) {
      temp.password = "Password is required";
      valid = false;
    }

    if (!form.role.trim()) {
      temp.role = "Role is required";
      valid = false;
    }

    setErrors(temp);
    return valid;
  };

  const openAddModal = () => {
    setModalType("add");
    setForm({ name: "", email: "", role: "USER", password: "" });
    setErrors({});
    setSelectedUser(null);
    setShowModal(true);
  };

  const openEditModal = (row) => {
    setModalType("edit");
    setSelectedUser(row);
    setForm({
      name: row.name,
      email: row.email,
      role: row.role,
      password: "",
    });
    setErrors({});
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      let res;
      if (modalType === "add") {
        res = await createNewUser(form);
      } else {
        res = await updateUser(selectedUser._id, form);
      }

      if (res?.success) {
        Swal.fire(
          "Success",
          modalType === "add" ? "User Added Successfully" : "User Updated Successfully",
          "success"
        );
        fetchUserList();
        setShowModal(false);
      } else {
        Swal.fire("Error", res?.message || "Operation failed", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this user.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteUser(id);
          if (res?.success) {
            Swal.fire("Success", "User Deleted", "success");
            fetchUserList();
          } else {
            Swal.fire("Error", res?.message || "Delete failed", "error");
          }
        } catch (error) {
          Swal.fire("Error", "Something went wrong", "error");
        }
      }
    });
  };

  const columns = [
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true },
    { name: "Role", selector: (row) => row.role, sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <>
          {userPermissions.includes("edit:users") && (
            <Button size="sm" className="btn btn-info" onClick={() => openEditModal(row)}>
              Edit
            </Button>
          )}
          &nbsp;
          {userPermissions.includes("delete:users") && (
            <Button size="sm" className="btn btn-danger" onClick={() => handleDelete(row._id)}>
              Delete
            </Button>
          )}
        </>
      ),
    },
  ];

  return (
    <>
      <div className="wrapper">
        <Header />
        <Sidebar />

        <div className="content-wrapper">
          <section className="content">
            <div className="box">
              <div className="box-header with-border">
                <h4 className="box-title">User List</h4>
                {userPermissions.includes("manage:users") && (
                  <Button className="btn btn-primary" onClick={openAddModal}>
                    + Add User
                  </Button>
                )}
              </div>

              <div className="box-body">
                {!loader ? (
                  <DataTable columns={columns} data={userData} pagination highlightOnHover />
                ) : (
                  <center>
                    <h4>
                      <i className="fa fa-spinner fa-spin"></i> Loading...
                    </h4>
                  </center>
                )}
              </div>
            </div>
          </section>
        </div>

        <Footer />
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalType === "add" ? "Add New User" : "Edit User"}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            {/* Name */}
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={form.name}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: "" });
                }}
              />
              {errors.name && <small className="text-danger">{errors.name}</small>}
            </Form.Group>

            {/* Email */}
            <Form.Group className="mt-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
              />
              {errors.email && <small className="text-danger">{errors.email}</small>}
            </Form.Group>

            {/* Password for Add Only */}
            {userPermissions.includes("manage:users") && modalType === "add" && (
              <Form.Group className="mt-2">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={form.password}
                  onChange={(e) => {
                    setForm({ ...form, password: e.target.value });
                    if (errors.password) setErrors({ ...errors, password: "" });
                  }}
                />
                {errors.password && <small className="text-danger">{errors.password}</small>}
              </Form.Group>
            )}

            {/* Role */}
            {userPermissions.includes("manage:users") && (
              <Form.Group className="mt-2">
                <Form.Label>Role</Form.Label>
                <Form.Select
                  value={form.role}
                  onChange={(e) => {
                    setForm({ ...form, role: e.target.value });
                    if (errors.role) setErrors({ ...errors, role: "" });
                  }}
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="USER">USER</option>
                </Form.Select>
                {errors.role && <small className="text-danger">{errors.role}</small>}
              </Form.Group>
            )}
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          {userPermissions.includes("manage:users") && (
            <Button variant="primary" onClick={handleSubmit}>
              {modalType === "add" ? "Add User" : "Update User"}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}
