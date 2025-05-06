import React, { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import BookCard from "../Components/BookCard";
import { useGetBooksQuery } from "../Redux/APIService";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const Home = () => {
    const [author, setAuthor] = useState("");
    const [genre, setGenre] = useState([]);
    const [language, setLanguage] = useState("");
    const [format, setFormat] = useState("");
    const [publisher, setPublisher] = useState("");
    const [isbn, setIsbn] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [minRating, setMinRating] = useState("");
    const [maxRating, setMaxRating] = useState("");
    const [isPhysicalAvailable, setIsPhysicalAvailable] = useState("");
    const [minStock, setMinStock] = useState("");
    const [maxStock, setMaxStock] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const [filterParams, setFilterParams] = useState({});

    // Only include non-null, non-empty params that match backend
    const bookQueryParams = { ...filterParams };
    bookQueryParams.page = page;
    bookQueryParams.pageSize = pageSize;
    const { data, isLoading, isError } = useGetBooksQuery(bookQueryParams);
    const navigate = useNavigate();

    const handleAddToCart = () => {};
    const handleViewDetails = (book) => {
        if (book && book.id) {
            navigate(`/product/${book.id}`);
        }
    };
    const handleSearch = (e) => {
        e.preventDefault();
        const params = {};
        if (author) params.author = author;
        if (genre.length > 0) params.genre = genre;
        if (language) params.language = language;
        if (format) params.format = format;
        if (publisher) params.publisher = publisher;
        if (isbn) params.isbn = isbn;
        if (title) params.title = title;
        if (description) params.description = description;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (minRating) params.minRating = minRating;
        if (maxRating) params.maxRating = maxRating;
        if (isPhysicalAvailable !== "") params.isPhysicalAvailable = isPhysicalAvailable;
        if (minStock) params.minStock = minStock;
        if (maxStock) params.maxStock = maxStock;
        if (sortBy) params.sortBy = sortBy;
        if (sortOrder) params.sortOrder = sortOrder;
        setFilterParams(params);
    };

    return (
        <div className="p-6 space-y-8">
            {/* Carousel Section */}
            <div className="carousel-wrapper">
                <Carousel
                    showThumbs={false}
                    autoPlay
                    infiniteLoop
                    showStatus={false}
                    interval={5000}
                    className="rounded-lg overflow-hidden shadow-xl"
                >
                    <div className="bg-primary text-white p-6" style={{ height: "40vh" }}>
                        <div className="h-full flex items-center justify-center text-2xl">
                            📚 New Arrivals — Grab Your Favorites!
                        </div>
                    </div>
                    <div className="bg-secondary text-white p-6" style={{ height: "40vh" }}>
                        <div className="h-full flex items-center justify-center text-2xl">
                            💥 Deals of the Month — Up to 30% Off!
                        </div>
                    </div>
                    <div className="bg-accent text-white p-6" style={{ height: "40vh" }}>
                        <div className="h-full flex items-center justify-center text-2xl">
                            🏆 Award-Winning Reads Now Available!
                        </div>
                    </div>
                </Carousel>
            </div>

            {/* Filters */}
            <div className="card bg-base-100 shadow-md p-4">
                <h2 className="text-lg font-semibold mb-4">🔍 Filter Books</h2>
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-center">
                    <input type="text" placeholder="Author" className="input input-bordered w-full" value={author} onChange={e => setAuthor(e.target.value)} />
                    <select className="select select-bordered w-full" multiple value={genre} onChange={e => setGenre(Array.from(e.target.selectedOptions, option => option.value))}>
                        <option value="">Genre</option>
                        <option>Fiction</option>
                        <option>Non-fiction</option>
                        <option>Science</option>
                        <option>Biography</option>
                        <option>History</option>
                        <option>Children</option>
                    </select>
                    <input type="text" placeholder="Language" className="input input-bordered w-full" value={language} onChange={e => setLanguage(e.target.value)} />
                    <input type="text" placeholder="Format" className="input input-bordered w-full" value={format} onChange={e => setFormat(e.target.value)} />
                    <input type="text" placeholder="Publisher" className="input input-bordered w-full" value={publisher} onChange={e => setPublisher(e.target.value)} />
                    <input type="text" placeholder="ISBN" className="input input-bordered w-full" value={isbn} onChange={e => setIsbn(e.target.value)} />
                    <input type="text" placeholder="Title" className="input input-bordered w-full" value={title} onChange={e => setTitle(e.target.value)} />
                    <input type="text" placeholder="Description" className="input input-bordered w-full" value={description} onChange={e => setDescription(e.target.value)} />
                    <input type="number" placeholder="Min Price" className="input input-bordered w-full" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
                    <input type="number" placeholder="Max Price" className="input input-bordered w-full" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
                    <input type="number" placeholder="Min Rating" className="input input-bordered w-full" value={minRating} onChange={e => setMinRating(e.target.value)} />
                    <input type="number" placeholder="Max Rating" className="input input-bordered w-full" value={maxRating} onChange={e => setMaxRating(e.target.value)} />
                    <select className="select select-bordered w-full" value={isPhysicalAvailable} onChange={e => setIsPhysicalAvailable(e.target.value)}>
                        <option value="">Physical Availability</option>
                        <option value="true">Available</option>
                        <option value="false">Not Available</option>
                    </select>
                    <input type="number" placeholder="Min Stock" className="input input-bordered w-full" value={minStock} onChange={e => setMinStock(e.target.value)} />
                    <input type="number" placeholder="Max Stock" className="input input-bordered w-full" value={maxStock} onChange={e => setMaxStock(e.target.value)} />
                    <select className="select select-bordered w-full" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                        <option value="">Sort By</option>
                        <option value="title">Title</option>
                        <option value="publicationdate">Publication Date</option>
                        <option value="price">Price</option>
                        <option value="popularity">Popularity</option>
                    </select>
                    <select className="select select-bordered w-full" value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                    <button type="submit" className="btn btn-primary flex items-center gap-2 mt-2" aria-label="Search">
                        <FaSearch size={18} />
                        Search
                    </button>
                </form>
            </div>

            {/* Book Catalog */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {isLoading || !data ? (
                    Array.from({ length: 8 }).map((_, idx) => (
                        <div key={idx} className="card bg-base-100 shadow-xl">
                            <figure className="border border-gray-300 rounded-lg overflow-hidden">
                                <Skeleton height={256} width="100%" />
                            </figure>
                            <div className="card-body space-y-2">
                                <Skeleton height={24} width="80%" />
                                <Skeleton height={16} width="60%" />
                                <Skeleton height={20} width="40%" />
                                <Skeleton height={20} width="30%" />
                                <div className="card-actions justify-end mt-2 space-x-2">
                                    <Skeleton height={32} width={80} />
                                    <Skeleton height={32} width={80} />
                                </div>
                            </div>
                        </div>
                    ))
                ) : isError ? (
                    <div className="col-span-full text-center text-error">Failed to load books.</div>
                ) : (
                    Array.isArray(data?.books) && data.books.length > 0 ? (
                        data.books.map((book) => (
                            <BookCard
                                key={book.id}
                                book={book}
                                onAddToCart={handleAddToCart}
                                onViewDetails={() => handleViewDetails(book)}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center text-warning">No books found.</div>
                    )
                )}
            </div>
        </div>
    );
};

export default Home;
