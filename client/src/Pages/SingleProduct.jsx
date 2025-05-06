import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetBookByIdQuery, useGetBookmarksQuery, useAddToBookmarkMutation, useRemoveFromBookmarkMutation, useAddToCartMutation } from "../Redux/APIService";
import { BACKEND_URL } from "../../Config";
import { FaRegStar, FaStar } from "react-icons/fa";
import toast from "react-hot-toast";

const SingleProduct = () => {
  const { id } = useParams();
  const { data: book, isLoading, isError } = useGetBookByIdQuery(id);
  const user = useSelector((state) => state.auth.user);
  const userId = user?.id;
  const { data: bookmarksData, refetch } = useGetBookmarksQuery(userId, { skip: !userId });
  const [addToBookmark, { isLoading: isAdding }] = useAddToBookmarkMutation();
  const [removeFromBookmark, { isLoading: isRemoving }] = useRemoveFromBookmarkMutation();
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();

  const isBookmarked = useMemo(() => {
    const items = (bookmarksData && Array.isArray(bookmarksData.Items)) ? bookmarksData.Items : [];
    return items.some((b) => String(b.Id) === String(id));
  }, [bookmarksData, id]);

  const handleBookmarkToggle = async () => {
    if (!userId || !book?.id) return;
    if (isBookmarked) {
      try {
        await removeFromBookmark({ userId, bookId: book.id }).unwrap();
        toast.success("Removed from bookmarks");
        refetch();
      } catch (err) {
        toast.error("Failed to remove bookmark");
      }
    } else {
      try {
        await addToBookmark({ userId, bookId: book.id }).unwrap();
        toast.success("Added to bookmarks");
        refetch();
      } catch (err) {
        if (err && err.data && err.data.message === "Book already bookmarked") {
          toast("Book is already bookmarked", { icon: "⭐" });
          refetch();
        } else {
          toast.error("Failed to add bookmark");
        }
      }
    }
  };

  const handleAddToCart = async () => {
    if (!userId || !book?.id) return;
    try {
      await addToCart({ userId, bookId: book.id }).unwrap();
      toast.success("Added to cart");
    } catch (err) {
      if (err && err.data && err.data.message === "Book already in cart") {
        toast("Book is already in cart", { icon: "🛒" });
      } else {
        toast.error("Failed to add to cart");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (isError || !book) {
    return (
      <div className="flex justify-center items-center h-96 text-error">
        Failed to load product.
      </div>
    );
  }

  const imageUrl =`https://localhost:7018/${book.image}`;

  return (
    <div className="flex flex-col md:flex-row gap-8 p-8 justify-center items-center">
      <div className="card w-80 bg-base-100 shadow-xl">
        <figure>
          <img src={imageUrl} alt={book.title} className="h-96 w-64 object-cover rounded" />
        </figure>
      </div>
      <div className="card bg-base-100 shadow-xl p-8 w-full max-w-xl">
        <div className="card-body">
          <div className="flex items-center justify-between mb-2">
            <h2 className="card-title text-3xl">{book.title}</h2>
            {userId && (
              <button
                className={
                  "btn btn-ghost " + (isBookmarked ? "text-warning" : "text-gray-400")
                }
                onClick={handleBookmarkToggle}
                disabled={isAdding || isRemoving}
                aria-label={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
              >
                {isBookmarked ? <FaStar size={28} /> : <FaRegStar size={28} />}
              </button>
            )}
          </div>
          <p className="text-lg text-gray-600 mb-2">by {book.author}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {book.genre && book.genre.map((g, idx) => (
              <span key={idx} className="badge badge-secondary badge-outline text-xs">{g}</span>
            ))}
          </div>
          <p className="mb-4 text-gray-700">{book.description}</p>
          <div className="flex items-center gap-6 mb-4">
            <span className="text-success font-bold text-2xl">${book.price}</span>
            <span className="text-xs text-gray-400">Stock: {book.stock}</span>
          </div>
          <button className="btn btn-primary w-full" onClick={handleAddToCart} disabled={isAddingToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;