import React from "react";
import { Carousel } from "react-responsive-carousel";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Home = () => {


    // Simulating loading state for skeletons
    const isLoading = true;

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
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <input type="text" placeholder="Search by title, ISBN, description" className="input input-bordered w-full" />
                    <select className="select select-bordered w-full">
                        <option disabled selected>Genre</option>
                        <option>Fiction</option>
                        <option>Non-fiction</option>
                    </select>
                    <select className="select select-bordered w-full">
                        <option disabled selected>Author</option>
                        <option>George Orwell</option>
                        <option>Jane Austen</option>
                    </select>
                    <input type="number" placeholder="Price Min" className="input input-bordered w-full" />
                    <input type="number" placeholder="Price Max" className="input input-bordered w-full" />
                    <select className="select select-bordered w-full">
                        <option disabled selected>Language</option>
                        <option>English</option>
                        <option>Spanish</option>
                    </select>
                    <select className="select select-bordered w-full">
                        <option disabled selected>Format</option>
                        <option>Paperback</option>
                        <option>Hardcover</option>
                        <option>Signed</option>
                    </select>
                </div>
            </div>

            {/* Book Catalog - Skeleton Version */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, idx) => (
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
                ))}
            </div>

        </div>
    );
};

export default Home;
