import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 text-center px-4">
            <h1 className="text-6xl font-bold text-error mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-base-content mb-2">Page Not Found</h2>
            <p className="text-base-content mb-6">
                Oops! The page you're looking for doesn't exist.
            </p>
            <Link to="/" className="btn btn-primary">
                Go Back to Home
            </Link>
        </div>
    );
};

export default NotFound;
