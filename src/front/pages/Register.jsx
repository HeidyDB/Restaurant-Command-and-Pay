import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Select from "react-select";

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [rol, setRol] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");// "success" | "danger"

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const EstadoRol = ["camarero", "cocinero", "barman", "admin"];
  

  const Registrarse = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Passwords do not match",
        text: "Verify that both passwords are the same",
        width: "200px",
        timer: 3000,
        customClass: {
          title: "fs-5",
          popup: "p-2",
          confirmButton: "btn btn-danger btn-sm",
        },
      });
      return;
    }

    try {
      const res = await fetch(BASE_URL + "/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, rol, password }),
      });

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "¡User registered successfully!",
          confirmButtonText: "Log in",
          width: "200px",
          timer: 3000,
          customClass: {
            title: "fs-5",
            popup: "p-2",
            confirmButton: "btn btn-danger btn-sm",
          },
        }).then(() => {
          setEmail("");
          setName("");
          setRol("");
          setPassword("");
          setConfirmPassword("");
          navigate("/login");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Register Error",
          text: data.msg || "The registration could not be completed.",
          width: "200px",
          timer: 3000,
          customClass: {
            title: "fs-5",
            popup: "p-3",
            confirmButton: "btn btn-danger btn-sm",
          },
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "It was not possible to connect to the backend.",
        width: "200px",
      });
    }
  };
  const options = EstadoRol.map((rol) => ({
    value: rol,
    label: rol
  }));

  return (
    <div className="register-background-wrapper">
      <form
        onSubmit={Registrarse}
        className="register-card pink-bordered-card"
        style={{ width: "100%", maxWidth: "420px" }}
      >
        <h2 className="mb-3 fw-bold text-center">Create an Account🚀</h2>

        <div className="mb-2">
          <input
            className="form-control"
            style={{ fontWeight: "bold" }}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-2">
          <input
            className="form-control"
            style={{ fontWeight: "bold" }}
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-2">
          <Select
            className="form-control"
            options={options}
            value={options.find((o) => o.value === rol)}
            onChange={(selected) => setRol(selected.value)}
            placeholder="Select a role"
            styles={{
              control: (base) => ({
                ...base,
                background: "linear-gradient(to bottom, #e4a2b0, white)",
                fontWeight: "bold",
                borderRadius: "8px",
                borderColor: "#ccc",
                boxShadow: "none",
                fontSize: "0.9rem",
              }),
              menu: (base) => ({ ...base, zIndex: 9999 }),
            }}
          />
        </div>

        <div className="mb-2">
          <input
            className="form-control"
            style={{ fontWeight: "bold" }}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-2">
          <input
            className="form-control"
            style={{ fontWeight: "bold" }}
            type="password"
            placeholder="Repeat Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="register-button btn w-100"
          style={{
            background: "linear-gradient(to bottom, #e4a2b0, white)",
            color: "2f2531",
            fontWeight: "bold",
            border: "none",
          }}
        >
          Register
        </button>

        {message && (
          <div className={`alert alert-${messageType} mt-3`} role="alert">
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default Register;
