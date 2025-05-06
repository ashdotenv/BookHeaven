import React from 'react'
import { BACKEND_URL } from '../../Config'

const BookCard = ({ book, onAddToCart, onViewDetails }) => {
    const imageUrl =`https://localhost:7018/${book.image}`
    return (
        <div className="card w-72 bg-base-100 shadow-xl">
            <figure>
                <img src={imageUrl} alt={book.title} className="h-48 w-32 object-cover rounded" />
            </figure>
            <div className="card-body items-center text-center">
                <h2 className="card-title">{book.title}</h2>
                <p className="text-gray-600">by {book.author}</p>
                <div className="flex flex-wrap gap-1 justify-center mb-2">
                    {book.genre && book.genre.map((g, idx) => (
                        <span key={idx} className="badge badge-secondary badge-outline text-xs">{g}</span>
                    ))}
                </div>
                <p className="text-sm text-gray-700 mb-2 line-clamp-2">{book.description}</p>
                <div className="flex items-center justify-between w-full mb-2">
                    <span className="text-success font-semibold">${book.price}</span>
                    <span className="text-xs text-gray-400">Stock: {book.stock}</span>
                </div>
                <div className="card-actions justify-end w-full mt-2">
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => onAddToCart(book)}
                    >
                        Add to Cart
                    </button>
                    <button
                        className="btn btn-outline btn-sm"
                        onClick={() => onViewDetails(book)}
                    >
                        View Details
                    </button>
                </div>
            </div>
        </div>
    )
}

export default BookCard