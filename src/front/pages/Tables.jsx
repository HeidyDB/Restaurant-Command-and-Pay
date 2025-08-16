import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import Select from "react-select";

const Tables = () => {
  const [mesas, setMesas] = useState([]);
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchMesas = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${BASE_URL}/tables`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setMesas(data.result);
        console.log(data.result);
      } catch (err) {
        console.error("Error loading tables", err);
      }
    };

    fetchMesas();
  }, []);

  const handleStateChange = async (tableId, newState) => {
    try {
      const res = await fetch(`${BASE_URL}/tables/${tableId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ state: newState }),
      });

      const data = await res.json();
      if (res.ok) {
        setMesas((mesasActuales) =>
          [...mesasActuales.map((mesa) =>
            mesa.id === tableId ? { ...mesa, state: newState } : mesa
          )].sort((a, b) => a.id - b.id)
        );
      } else {
        console.error("Error updating state:", data);
        alert("Failed to update state.");
      }

      console.log("Table updated:", data);
    } catch (error) {
      console.error("Network error:", error);
      alert("Error connecting to server.");
    }
  };

  const createNewOrder = async (mesaId) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('user_id');

      const res = await fetch(`${BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mesa_id: parseInt(mesaId),
          usuario_id: parseInt(userId),
          guest_notes: "",
          platos: []
        }),
      });

      const data = await res.json();
      console.log("Respuesta de comanda:", data);

      if (res.ok) {
        const order_ID = data.result.id;
        console.log("el ID de la comanda:", order_ID);
        navigate(`/table-order/${order_ID}`);
        setOrder({ ...data.result, platos: [] });
      } else {
        console.error("Error al crear comanda:", data.msg);
      }
    } catch (error) {
      console.error("Error al crear comanda:", error);
    }
  };

  const handleClick = async (mesaId) => {
    try {
      const res = await fetch(`${BASE_URL}/orders/by-table/${mesaId}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      const data = await res.json();

      if (res.ok) {
        const orderId = data.order_id;
        navigate(`/table-order/${orderId}`);
      } else if (res.status === 404) {
        await createNewOrder(mesaId);
      } else {
        console.error("Error:", data.msg);
      }
    } catch (err) {
      console.error("Error al buscar comanda por mesa:", err);
    }
  };

  const stateOptions = [
    { value: "available", label: "✅ Available" },
    { value: "busy", label: "❌ Busy" },
    { value: "reserved", label: "⏳ Reserved" },
    { value: "closed", label: "🔒 Closed" },
  ];

  if (!mesas) return <p className='text-center text-light mt-5'>NO EXISTEN MESAS EN ESTE RESTAURANTE!</p>;

  return (
    <div className="container mt-4 px-2 px-sm-4">
      <h2 className="mb-4 text-light">Tables</h2>

      <div className="row g-4">
        {mesas.map((table) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={table.id}>
            <div
              className="card h-100 p-2"
              style={{
                border:
                  table.state === "available"
                    ? "2px solid #28a745"
                    : table.state === "busy"
                      ? "2px solid #dc3545"
                      : table.state === "reserved"
                        ? "2px solid #ffc107"
                        : "2px solid #6c757d",
                backgroundColor:
                  table.state === "available"
                    ? "#e8f5e9"
                    : table.state === "busy"
                      ? "#f8d7da"
                      : table.state === "reserved"
                        ? "#fff3cd"
                        : "#e2e3e5",
                cursor: "pointer",
              }}
              onClick={() => {
                if (table.state === "available" || table.state === "busy") { handleClick(table.id) }
                else {

                  if (table.state === "closed")
                    Swal.fire({
                      icon: 'error',
                      title: `Table ${table.id} is Not available`,
                      text: 'Change the status to Available to use the table',
                      width: "200px",
                      timer: 5000,
                      customClass: {
                        title: 'fs-5',
                        popup: 'p-2',
                        confirmButton: 'btn btn-danger btn-sm',
                      },
                    });
                  else {
                    if (table.state === "reserved")
                      Swal.fire({
                        icon: 'error',
                        title: `This Table ${table.id} is reserved`,
                        text: 'if you want to use the table change its status',
                        width: "200px",
                        timer: 5000,
                        customClass: {
                          title: 'fs-5',
                          popup: 'p-2',
                          confirmButton: 'btn btn-danger btn-sm',
                        },
                      });
                  }
                }
              }}
            >
              <img
                src={"https://th.bing.com/th/id/OIP.mw32uZEpQETk42EZ_7BlUQHaEJ?w=318&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7"}
                className="card-img-top img-fluid"
                alt={`Mesa ${table.id}`}
                style={{ height: "150px", objectFit: "cover" }}
              />
              <div className="card-body text-center">
                <h5 className="card-title">Table {table.id}</h5>

                <div className="card-text">
                  🪑 Seats: {table.seats}
                  <br />
                  {table.state === "available" && (
                    <span className="text-success">✅ Available</span>
                  )}
                  {table.state === "busy" && (
                    <span className="text-danger">❌ Busy</span>
                  )}
                  {table.state === "reserved" && (
                    <span className="text-warning">⏳ Reserved</span>
                  )}
                  {table.state === "closed" && (
                    <span className="text-secondary">🔒 Closed</span>
                  )}
                </div>

                <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                  <Select
                    value={stateOptions.find((option) => option.value === table.state)}
                    onChange={(selectedOption) =>
                      handleStateChange(table.id, selectedOption.value)
                    }
                    options={stateOptions}
                    isSearchable={false}
                    styles={{
                      control: (base) => ({
                        ...base,
                        minHeight: "30px",
                        height: "30px",
                        fontSize: "0.85rem",
                        borderRadius: "8px",
                      }),
                      dropdownIndicator: (base) => ({
                        ...base,
                        padding: 4,
                      }),
                      indicatorsContainer: (base) => ({
                        ...base,
                        height: "30px",
                      }),
                      menu: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tables;
