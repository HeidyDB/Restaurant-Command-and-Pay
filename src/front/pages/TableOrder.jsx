import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import Menu from './Menu';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const TableOrder = () => {
  const [order, setOrder] = useState(null);
  const [table, setTable] = useState([]);
  const { id } = useParams();
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        const platosOrdenados = [...data.result.platos].sort((a, b) => a.id - b.id);
        setOrder({ ...data.result, platos: platosOrdenados });
      } else if (res.status === 404) {
        await createNewOrder();
      } else {
        console.error(data.msg);
      }
    } catch (err) {
      console.error("Error cargando la orden:", err);
    }
  };

  const createNewOrder = async () => {
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
          mesa_id: parseInt(id),
          usuario_id: parseInt(userId),
          guest_notes: "",
          platos: []
        }),
      });
      const data = await res.json();
      console.log("Respuesta de comanda:", data)
      if (res.ok) {
        const order_ID = data.order_id;
         console.log("el ID de la comanda:", order_ID)

        navigate(`/table-order/${order_ID}`);
        setOrder({ ...data.result, platos: [] });
      } else {
        console.error("Error al crear comanda:", data.msg);
      }
    } catch (error) {
      console.error("Error al crear comanda:", error);
    }
  };

  const handleChangeCantidad = async (platoId, accion) => {
    let nuevosPlatos = [...order.platos];
    nuevosPlatos = nuevosPlatos.map(plato => {
      if (plato.plato_id === platoId) {
        const nuevaCantidad =
          accion === "add" ? plato.cantidad + 1 :
            accion === "subtract" ? Math.max(plato.cantidad - 1, 1) :
              plato.cantidad;
        return { ...plato, cantidad: nuevaCantidad };
      }
      return plato;
    });
    await updateOrderBackend(nuevosPlatos);
  };

  const handleDeletePlato = async (platoId) => {
    const nuevosPlatos = order.platos.map(plato => {
      if (plato.plato_id === platoId) {
        return { ...plato, cantidad: 0 }
      }
      return plato;
    });
    await updateOrderBackend(nuevosPlatos);
  };

  const updateOrderBackend = async (platosActualizados) => {
    const token = localStorage.getItem('token');
    const body = {
      platos: platosActualizados.map(p => ({
        plate_id: p.plato_id,
        cantidad: p.cantidad
      })),
      guest_notes: order.guest_notes,
      date: order.date
    };
    const response = await fetch(`${BASE_URL}/orders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    if (response.ok) {
      const platosOrdenados = [...data.result.platos].sort((a, b) => a.id - b.id);
      setOrder({ ...data.result, platos: platosOrdenados });
    } else {
      console.error(data.msg || data.error);
    }
  };

  if (!order) return <p className='text-center text-light mt-5'>There are no dishes ordered yet!</p>;

  const totalPrice = order.platos.reduce((sum, plato) => sum + plato.subtotal, 0);

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <h2 className='text-light'>Table🍽️#{order.mesa_id}</h2>
        <div className="d-flex flex-column flex-sm-row gap-2">
          <label className="form-label text-light fw-bold mb-0 text-center">
            {order.date}
          </label>
          <button
            className="table-order-btn on text-nowrap rounded"
            onClick={() => navigate("/tables")}
          >
            Tables
          </button>
          <button
            className="table-order-btn text-nowrap rounded"
            onClick={() => navigate(`/menu/${params.id}`)}
          >
            Add Dishes
          </button>
        </div>
      </div>

      <ul className="table-order-card list-unstyled">
        {order.platos.map((plato) => (
          <li key={plato.id} className="list-group-item mb-3 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
            <div>
              <strong className="fs-5">{plato.nombre_plato}</strong><br />
              Cantidad: {plato.cantidad} <br />
              Subtotal: €{plato.subtotal.toFixed(2)} <br />
              Estado: <span className="table-order-btn badge">{plato.status_plate}</span>
            </div>
            <div className="d-flex flex-wrap gap-2">
              <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeletePlato(plato.plato_id)}>Delete</button>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => handleChangeCantidad(plato.plato_id, 'subtract')}>-</button>
              <button className="btn btn-sm btn-outline-success" onClick={() => handleChangeCantidad(plato.plato_id, 'add')}>+</button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mb-4 position-relative">
        <label className="form-label text-light fs-5">Order Notes📋</label>
        <textarea
          className="table-order-note form-control pe-5"
          rows="3"
          placeholder="Example: No salt, gluten allergy, etc."
          value={order.guest_notes || ""}
          onChange={(e) => setOrder({ ...order, guest_notes: e.target.value })}
        />
        <button
          className="table-order-btn btn btn-sm btn-outline-success position-absolute"
          style={{
            bottom: "10px",
            right: "10px",
            backgroundColor: "transparent",
            boxShadow: "none",
            outline: "none",
            color: "#198754",
            borderColor: "#198754"
          }}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => updateOrderBackend(order.platos)}
        >
          Send Command
        </button>
      </div>

      <div className="mt-4 text-end text-light">
        <h4 className="btn btn-sm btn-outline-success">Total: €{totalPrice.toFixed(2)}</h4>
      </div>
    </div>
  );
};

export default TableOrder;
