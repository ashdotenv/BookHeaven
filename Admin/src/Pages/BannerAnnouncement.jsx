import React, { useState } from "react";
import {
  useGetAllBannersQuery,
  useCreateBannerAnnouncementMutation,
  useEditBannerMutation,
  useDeleteBannerMutation,
} from "../Redux/APIService";
import toast from "react-hot-toast";

const BannerAnnouncement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [createBanner, { isLoading }] = useCreateBannerAnnouncementMutation();
  const {
    data: banners,
    isLoading: isBannersLoading,
    isError: isBannersError,
    refetch,
  } = useGetAllBannersQuery();
  const [editBanner] = useEditBannerMutation();
  const [deleteBanner] = useDeleteBannerMutation();
  const [editId, setEditId] = useState(null);
  const [editMessage, setEditMessage] = useState("");
  const [editStartTime, setEditStartTime] = useState("");
  const [editEndTime, setEditEndTime] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message || !startTime || !endTime) {
      toast.error("Please fill in all fields.");
      return;
    }
    
    // Validate that end time is after start time
    if (new Date(endTime) <= new Date(startTime)) {
      toast.error("End time must be after start time.");
      return;
    }
    
    try {
      await createBanner({ message, startTime, endTime }).unwrap();
      toast.success("Banner announcement created!");
      setMessage("");
      setStartTime("");
      setEndTime("");
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      toast.error("Failed to create banner announcement.");
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setMessage("");
    setStartTime("");
    setEndTime("");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      try {
        await deleteBanner(id);
        toast.success("Banner deleted successfully");
        refetch();
      } catch (err) {
        toast.error("Failed to delete banner");
      }
    }
  };

  const handleEdit = async () => {
    if (!editMessage || !editStartTime || !editEndTime) {
      toast.error("Please fill in all fields.");
      return;
    }
    
    // Validate that end time is after start time
    if (new Date(editEndTime) <= new Date(editStartTime)) {
      toast.error("End time must be after start time.");
      return;
    }
    
    try {
      await editBanner({ 
        id: editId, 
        message: editMessage, 
        startTime: editStartTime, 
        endTime: editEndTime 
      });
      toast.success("Banner updated successfully");
      setEditId(null);
      refetch();
    } catch (err) {
      toast.error("Failed to update banner");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded shadow mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Banner Announcements</h2>
        <button 
          className="btn btn-primary" 
          onClick={openModal}
        >
          Add Announcement
        </button>
      </div>

      {/* Modal for adding announcements */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Add New Announcement</h3>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block font-semibold mb-1">Message</label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter banner message"
                  rows={4}
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-1">Start Time</label>
                <input
                  type="datetime-local"
                  className="input input-bordered w-full"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-1">End Time</label>
                <input
                  type="datetime-local"
                  className="input input-bordered w-full"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating..." : "Create Announcement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mt-6">
        {isBannersLoading && <div>Loading banners...</div>}
        {isBannersError && <div className="text-error">Failed to load banners.</div>}
        {!isBannersLoading && banners?.length === 0 && (
          <div className="text-gray-500">No banners found.</div>
        )}
        {banners && banners.length > 0 && (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Message</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {banners.map((banner) => (
                  <tr key={banner.id}>
                    <td>
                      {editId === banner.id ? (
                        <textarea
                          value={editMessage}
                          onChange={(e) => setEditMessage(e.target.value)}
                          className="textarea textarea-bordered w-full"
                          rows={2}
                        />
                      ) : (
                        banner.message
                      )}
                    </td>
                    <td>
                      {editId === banner.id ? (
                        <input
                          type="datetime-local"
                          value={editStartTime}
                          onChange={(e) => setEditStartTime(e.target.value)}
                          className="input input-bordered w-full"
                        />
                      ) : (
                        new Date(banner.startTime).toLocaleString()
                      )}
                    </td>
                    <td>
                      {editId === banner.id ? (
                        <input
                          type="datetime-local"
                          value={editEndTime}
                          onChange={(e) => setEditEndTime(e.target.value)}
                          className="input input-bordered w-full"
                        />
                      ) : (
                        new Date(banner.endTime).toLocaleString()
                      )}
                    </td>
                    <td>
                      {editId === banner.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={handleEdit}
                            className="btn btn-sm btn-success"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditId(null)}
                            className="btn btn-sm btn-ghost"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditId(banner.id);
                              setEditMessage(banner.message);
                              setEditStartTime(banner.startTime);
                              setEditEndTime(banner.endTime);
                            }}
                            className="btn btn-sm btn-warning"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(banner.id)}
                            className="btn btn-sm btn-error"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerAnnouncement;