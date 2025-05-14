import React from 'react'
import {  useGetMyBookmarksQuery } from '../Redux/APIService'
import { useRemoveFromBookmarkMutation } from '../Redux/APIService'

const Bookmarks = () => {
    const{data, isLoading} = useGetMyBookmarksQuery()
    const [removeFromBookmark, { isLoading: isRemoving }] = useRemoveFromBookmarkMutation();
  return (
    <div>
      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "120px" }}>
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
          {Array.isArray(data) && data.length > 0 ? (
            data.map(book => (
              <div key={book.id} style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "12px", width: "220px", position: "relative" }}>
                <button
                  onClick={() => removeFromBookmark({ bookId: book.id })}
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                  title="Remove from bookmarks"
                  disabled={isRemoving}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#FFD700" viewBox="0 0 24 24" width="28" height="28">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                </button>
                <img src={`https://localhost:7018${book.image}`} alt={book.title} style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "4px" }} />
                <h3>{book.title}</h3>
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>Genre:</strong> {Array.isArray(book.genre) ? book.genre.join(", ") : book.genre}</p>
                <p><strong>Price:</strong> ${book.price}</p>
              </div>
            ))
          ) : (
            <p>No bookmarks found.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default Bookmarks