import React, { useEffect, useState } from 'react';
import { useGetRecentPurchasesQuery } from '../Redux/APIService';

const OrderToast = () => {
  const { data } = useGetRecentPurchasesQuery();
  const [visibleOrders, setVisibleOrders] = useState([]);

  // Track which orderIds have already been shown to avoid duplicates
  const shownOrderIds = React.useRef(new Set());

  useEffect(() => {
    if (data && Array.isArray(data)) {
      data.forEach((order) => {
        if (!shownOrderIds.current.has(order.orderId)) {
          shownOrderIds.current.add(order.orderId);

          // Add order to visible list
          setVisibleOrders((prev) => [...prev, order]);

          // Set timeout to remove it after 3 seconds
          setTimeout(() => {
            setVisibleOrders((prev) =>
              prev.filter((o) => o.orderId !== order.orderId)
            );
          }, 3000);
        }
      });
    }
  }, [data]);

  return (
    <div className="fixed bottom-4 left-4 z-50 space-y-2">
      {visibleOrders.map((order) => (
        <div key={order.orderId} className="alert alert-info shadow-lg w-80">
          <div>
            <span className="font-semibold">{order.userFullName}</span> bought:&nbsp;
            {order.books.map((book) => (
              <span key={book.bookId}>
                <strong>{book.bookTitle}</strong> (x{book.quantity})&nbsp;
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderToast;
