'use client';

import { useEffect, useState } from 'react';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [statusUpdates, setStatusUpdates] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/orders');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleStatusChange = (orderId, status) => {
    setStatusUpdates((prev) => ({ ...prev, [orderId]: status }));
  };

  const updateStatus = async (orderId) => {
    try {
      const newStatus = statusUpdates[orderId];
      if (!newStatus) return;

      await fetch(`http://localhost:8000/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div className="orders-container">
      {orders.map((order) => (
        <div key={order.order_id} className="order-card">
          <h2 className="order-title">Order #{order.order_id}</h2>
          <p className="order-info">User ID: {order.user_id}</p>
          <p className="order-info">Total Price: ${order.total_price}</p>
          <p className="order-status">Status: {order.status}</p>
          <p className="order-info">Created At: {order.created_at}</p>

          <div className="status-update">
            <input
              type="text"
              placeholder="New Status"
              value={statusUpdates[order.order_id] || ''}
              onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
              className="status-input"
            />
            <button
              onClick={() => updateStatus(order.order_id)}
              className="update-button"
            >
              Update Status
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
