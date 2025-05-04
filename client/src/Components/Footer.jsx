import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { GiBookshelf } from 'react-icons/gi';
import { AiOutlineHome, AiOutlineTags, AiOutlineFileSearch } from 'react-icons/ai';

const Footer = () => {
    return (
        <footer className="bg-base-200 text-base-content py-8">
            <div className="container mx-auto flex flex-wrap justify-between">
                {/* Left Section: Store Information */}
                <div className="w-full md:w-1/3 mb-6 md:mb-0">
                    <h4 className="text-xl font-semibold mb-4">Book Library Store</h4>
                    <p className="text-sm">
                        Explore our vast collection of books, from bestsellers to exclusive editions. We offer in-store pickup for all orders.
                    </p>
                    <p className="mt-4 text-sm">
                        <strong>Address:</strong> 123 Bookstore Ave, City, Country
                    </p>
                </div>

                {/* Center Section: Quick Links */}
                <div className="w-full md:w-1/3 mb-6 md:mb-0">
                    <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#all-books" className="flex items-center space-x-2 text-link"><GiBookshelf /> <span>All Books</span></a></li>
                        <li><a href="#bestsellers" className="flex items-center space-x-2 text-link"><AiOutlineTags /> <span>Bestsellers</span></a></li>
                        <li><a href="#award-winners" className="flex items-center space-x-2 text-link"><AiOutlineTags /> <span>Award Winners</span></a></li>
                        <li><a href="#new-releases" className="flex items-center space-x-2 text-link"><AiOutlineFileSearch /> <span>New Releases</span></a></li>
                        <li><a href="#deals" className="flex items-center space-x-2 text-link"><AiOutlineTags /> <span>Deals & Discounts</span></a></li>
                        <li><a href="#contact-us" className="flex items-center space-x-2 text-link"><AiOutlineHome /> <span>Contact Us</span></a></li>
                    </ul>
                </div>

                {/* Right Section: Social Media */}
                <div className="w-full md:w-1/3">
                    <h4 className="text-xl font-semibold mb-4">Follow Us</h4>
                    <div className="flex space-x-4">
                        <a href="https://facebook.com" className="text-link">
                            <FaFacebook size={24} />
                        </a>
                        <a href="https://twitter.com" className="text-link">
                            <FaTwitter size={24} />
                        </a>
                        <a href="https://instagram.com" className="text-link">
                            <FaInstagram size={24} />
                        </a>
                        <a href="https://linkedin.com" className="text-link">
                            <FaLinkedin size={24} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Copyright & Legal */}
            <div className="mt-8 text-center">
                <p className="text-sm">&copy; 2025 Book Library Store. All rights reserved.</p>
                <p className="text-xs text-gray-500">Terms & Conditions | Privacy Policy</p>
            </div>
        </footer>
    );
};

export default Footer;
