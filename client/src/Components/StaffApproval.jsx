import React, { useState } from 'react';
import { useApprovePurchaseMutation, useRejectPurchaseMutation, useGetAllOrdersQuery } from '../Redux/APIService';
import { Button } from '@headlessui/react';
import toast from 'react-hot-toast';

const StaffApproval = () => {
  const { data: orders, isLoading: isOrdersLoading, isError: isOrdersError } = useGetAllOrdersQuery();
  const [approvePurchase] = useApprovePurchaseMutation();
  const [rejectPurchase] = useRejectPurchaseMutation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Check user authorization
  const userRole = JSON.parse(localStorage.getItem('user') || '{}').role;
  if (userRole !== 'Staff') {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center text-xl font-semibold text-red-500">
          You are not authorized to view this page
        </div>
      </div>
    );
  }

  // Handle approve order
  const handleApprove = async (orderId) => {
    try {
      setLoading(true);
      setError(null);
      if (window.confirm('Are you sure you want to approve this order?')) {
        await approvePurchase(orderId).unwrap();
      }
    } catch (err) {
      setError(err?.data?.message || 'Failed to approve order');
    } finally {
      setLoading(false);
    }
  };

  // Handle reject order
  const handleReject = async (orderId) => {
    try {
      setLoading(true);
      setError(null);
      if (window.confirm('Are you sure you want to reject this order?')) {
        await rejectPurchase(orderId).unwrap();
      }
    } catch (err) {
      setError(err?.data?.message || 'Failed to reject order');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (isOrdersLoading) return (
    <div className="flex justify-center items-center h-screen text-xl">
      Loading orders...
    </div>
  );

  // Error state
  if (isOrdersError) return (
    <div className="flex justify-center items-center h-screen text-xl text-red-500">
      Failed to load orders
    </div>
  );

  // Show all orders but only enable buttons for Pending status
  const allOrders = orders || [];
    
    return (
      <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl text-center mb-8 font-bold">Staff Approval</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          {error}
        </div>
      )}

      {allOrders.length === 0 ? (
        <div className="text-center text-gray-500 text-xl">
          No orders found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {allOrders.map(({ order }) => (
            <div 
              key={order.id} 
              className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="mb-4">
                <p className="text-gray-600">Order ID: <span className="font-semibold">{order.id}</span></p>
                <p className="text-gray-600">Total Amount: <span className="font-semibold">${order.totalAmount.toFixed(2)}</span></p>
                <p className="text-gray-600">Created At: <span className="font-semibold">
                  {new Date(order.createdAt).toLocaleString()}
                </span></p>
                <p className="text-gray-600">Status: <span className={`font-semibold ${order.status === 'Paid' ? 'text-green-600' : order.status === 'Rejected' ? 'text-red-600' : 'text-yellow-600'}`}>{order.status}</span></p>
                <p className="text-gray-600">Claimcode: <span className={`font-semibold`}>{order.claimCode}</span></p>
              </div>
              {(order.status === 'Pending' || order.status === 'Paid' || order.status === 'Approved') && (
                <div className="flex space-x-4">
                  <Button 
                    onClick={() => handleApprove(order.id)} 
                    disabled={loading}
                    className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-50"
                  >
                    Approve
                  </Button>
                  <Button 
                    onClick={() => handleReject(order.id)} 
                    disabled={loading}
                    className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 disabled:opacity-50"
                  >
                    Reject
                  </Button>
                </div>
              )}
              {(order.status === 'Paid' || order.status === 'Approved') && (
                <div className="flex items-center justify-center mt-4">
                  <span className="bg-green-100 text-green-700 px-4 py-2 rounded font-semibold">{order.status === 'Paid' ? 'Paid' : 'Approved'}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffApproval;