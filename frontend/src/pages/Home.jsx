import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Hero from '../components/Hero';
import { useSearch } from '../context/SearchContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const Home = () => {

    const [products, setProducts] = useState([]);
    const [ratings, setRatings] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("All");


    const renderStars = (avgRating) => {
        const stars = [];
        const fullStars = Math.floor(avgRating);
        const hasHalfStar = avgRating % 1 >= 0.5;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<span key={i} className="text-yellow-400">★</span>);
            } else if (i === fullStars && hasHalfStar) {
                stars.push(<span key={i} className="text-yellow-400">★</span>);
            } else {
                stars.push(<span key={i} className="text-gray-300">★</span>);
            }
        }
        return stars;
    };


    const { searchQuery } = useSearch();
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showConfirm } = useNotification();

    useEffect(() => {
        if (user && user.role === 'ADMIN') {
            navigate('/admin/dashboard', { replace: true });
        }
    }, [user, navigate]);

    useEffect(() => {
        const menuHeader = document.getElementById('menu-section');
        if (menuHeader) {
            menuHeader.scrollIntoView({ behavior: 'smooth' });
        }
    }, [selectedCategory]);

    useEffect(() => {

        Promise.all([
            fetch("https://bakery-backend-kt9m.onrender.com/api/products").then(res => res.ok ? res.json() : Promise.reject("Products failed")),
            fetch("https://bakery-backend-kt9m.onrender.com/api/feedback/ratings").then(res => res.ok ? res.json() : {}).catch(() => ({}))
        ])
            .then(([productsData, ratingsData]) => {
                setProducts(productsData);
                setRatings(ratingsData);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Could not load menu. Is Backend running?");
                setLoading(false);
            });
    }, []);


    const handleAddToCart = async (product) => {
        if (!user) {
            const confirmLogin = await showConfirm(
                "Please login to add items to cart.",
                "Login Required",
                "Login"
            );
            if (confirmLogin) {
                navigate('/login');
            }
            return;
        }
        addToCart(product);
    };


    if (loading) return <div className="text-center py-20 text-xl font-bold text-gray-500">Loading fresh cakes... 🧁</div>;
    if (error) return <div className="text-center py-20 text-red-500 font-bold">{error}</div>;

    const filteredProducts = products
        .filter(product => {
            const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        })
        .sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="flex flex-col min-h-screen">

            {!user && <Hero />}

            <div className="container-custom py-10 flex gap-8">
                { }
                <Sidebar
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                />

                { }
                <div className="flex-1">

                    <div id="menu-section" className="text-center mb-8 animate-fadeIn scroll-mt-24">
                        <h2 className="text-5xl font-serif font-bold mb-3 text-text-main animate-slideUp">
                            Our Fresh Menu
                        </h2>
                        <p className="text-text-secondary animate-slideUp stagger-1">
                            Baked with love, served with code.
                        </p>
                    </div>

                    { }
                    <div
                        key={selectedCategory}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {filteredProducts.map((cake, index) => (
                            <div
                                key={cake.id}
                                className="bg-white rounded-lg shadow-md border border-gray-100 flex flex-col card-interactive card-shine animate-slideUp"
                                style={{ animationDelay: `${index * 0.1}s`, opacity: 0, animationFillMode: 'forwards' }}
                            >
                                { }
                                <div
                                    onClick={() => navigate(`/product/${cake.id}`)}
                                    className="h-64 overflow-hidden relative group cursor-pointer img-zoom"
                                >
                                    <img
                                        src={cake.imageUrl}
                                        alt={cake.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full shadow-sm text-gray-700 transition-all duration-300 group-hover:bg-accent-1 group-hover:text-white group-hover:scale-105">
                                        {cake.category}
                                    </span>
                                </div>

                                { }
                                <div className="p-5 flex flex-col flex-grow">
                                    <div className="flex-grow">
                                        <h3
                                            onClick={() => navigate(`/product/${cake.id}`)}
                                            className="text-xl font-bold mb-1 text-text-main cursor-pointer hover:text-accent-1 transition-all duration-300 hover:translate-x-1"
                                        >
                                            {cake.name}
                                        </h3>
                                        { }
                                        {ratings[cake.id] && (
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="flex text-sm">
                                                    {renderStars(ratings[cake.id].avgRating)}
                                                </div>
                                                <span className="text-sm font-bold text-gray-700">
                                                    {ratings[cake.id].avgRating.toFixed(1)}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    ({ratings[cake.id].count})
                                                </span>
                                            </div>
                                        )}
                                        <p className="text-text-secondary text-sm line-clamp-2">{cake.description}</p>
                                        <p className="text-xs text-text-main/75 italic mt-2">Contains: {cake.ingredients}</p>
                                    </div>

                                    { }
                                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                                        <span className="text-2xl font-bold text-text-main transition-all duration-300 hover:scale-110 hover:text-accent-1">
                                            RM{cake.price.toFixed(2)}
                                        </span>

                                        {cake.stock > 0 ? (
                                            <button
                                                onClick={() => handleAddToCart(cake)}
                                                className="btn btn-primary shadow-md text-text-light hover:bg-accent-2 transition-all duration-300 hover:scale-105 active:scale-95"
                                            >
                                                Add to Cart
                                            </button>
                                        ) : (
                                            <button disabled className="px-5 py-2.5 rounded font-bold bg-gray-300 text-gray-500 cursor-not-allowed opacity-60">
                                                Sold Out
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;