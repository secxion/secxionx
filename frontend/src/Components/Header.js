import React, { useContext, useState, useMemo, useCallback, useEffect } from "react";
import { FcSearch } from "react-icons/fc";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setUserDetails } from "../store/userSlice";
import Context from "../Context";
import { useDebounce } from "../hooks/useDebounce";
import NotificationBadge from "../helper/NotificationBadge";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import ROLE from "../common/role";
import SummaryApi from "../common";
import { BiSearch } from 'react-icons/bi';
import SidePanel from "./SidePanel";
import './Header.css';

const Header = () => {
    const dispatch = useDispatch();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user } = useSelector((state) => state.user);
    const { token } = useContext(Context);
    const navigate = useNavigate();
    const searchInput = useLocation();

    const searchQuery = useMemo(() => {
        const URLSearch = new URLSearchParams(searchInput.search);
        return URLSearch.get("q") || "";
    }, [searchInput]);

    const [search, setSearch] = useState(searchQuery);
    const debouncedSearch = useDebounce(search, 300);

    useEffect(() => {
        if (debouncedSearch.trim()) {
            navigate(`/search?q=${encodeURIComponent(debouncedSearch)}`);
        }
    }, [debouncedSearch, navigate]);

    const handleLogout = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(SummaryApi.logout_user.url, {
                method: SummaryApi.logout_user.method,
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();

            if (data.success) {
                toast.success(data.message);
                dispatch(setUserDetails(null));
                navigate("/login");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Logout failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [dispatch, navigate, token]);

    const toggleMobileMenu = useCallback(() => setMobileMenuOpen((prev) => !prev), []);
    const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

    return (
        <>
            <header className="header-spa left-0 right-0 top-0 pt-6 mb-4 inset-0 bg-black/70 backdrop-blur-sm fixed w-full z-50 border border-white/20 shadow-md transition-all duration-300 flex items-center justify-between px-6 sm:px-6 lg:px-8">
                <div className="w-full mx-auto flex items-center justify-between px-4 md:px-6 lg:px-8">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleMobileMenu}
                            className="text-gray-300 hover:text-white md:hidden"
                            aria-expanded={mobileMenuOpen}
                        >
                            <FontAwesomeIcon icon={faBars} className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Search for Desktop */}
                    <Link to="/" className="hidden md:flex items-center  rounded-md px-3 py-1 w-64 lg:w-72 font-bold text-xl text-primary-500 mr-4">
                        Secxion
                    </Link>
                    <div className="hidden md:flex items-center bg-gray-100 border border-blue-400 rounded-md px-4 py-1 mr-12 w-72 lg:w-72">
                        <FcSearch className="text-gray-500 h-4 w-4 mr-2" />
                        <input
                            type="text"
                            placeholder="Search gift cards..."
                            className="bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Search for Mobile */}
                    <div className="md:hidden flex items-center w-full mx-4">
                        <div className="flex items-center bg-gray-100 border border-blue-400 rounded-md px-2 py-1 w-full">
                            <BiSearch className="text-gray-500 h-5 w-5 mr-2" />
                            <input
                                type="text"
                                placeholder="Search gift cards..."
                                className="bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <nav className="hidden md:flex items-center gap-3 text-sm font-medium">
                        <Link
                            to="/record"
                            className="px-2 py-1 border border-cyan-500 text-cyan-300 hover:bg-cyan-800 hover:text-white rounded transition"
                        >
                            Trade Status
                        </Link>
                        <Link
                            to="/mywallet"
                            className="px-2 py-1 border border-pink-500 text-pink-300 hover:bg-pink-700 hover:text-white rounded transition"
                        >
                            Wallet
                        </Link>
                        <Link
                            to="/datapad"
                            className="px-2 py-1 border border-yellow-500 text-yellow-300 hover:bg-yellow-600 hover:text-black rounded transition"
                        >
                            DataPad
                        </Link>
                        {user?.role === ROLE.ADMIN && (
                            <Link
                                to="/admin-panel"
                                className="px-2 py-1 border border-purple-600 text-purple-300 hover:bg-purple-700 hover:text-white rounded transition"
                            >
                                Admin
                            </Link>
                        )}
                        <Link
                            to="/notifications"
                            className="px-2 py-1 border border-emerald-500 text-emerald-300 hover:bg-emerald-700 hover:text-white rounded relative"
                            title="Notifications"
                        >
                            <NotificationBadge />
                        </Link>
                        {user?._id && (
                            <button
                                onClick={handleLogout}
                                disabled={loading}
                                className="px-2 py-1 border border-red-500 text-red-300 hover:bg-red-600 hover:text-white rounded transition flex items-center"
                            >
                                <FontAwesomeIcon icon={faSignOutAlt} className="mr-1" />
                                Logout
                            </button>
                        )}
                    </nav>
                </div>

                <SidePanel
                    open={mobileMenuOpen}
                    setOpen={setMobileMenuOpen}
                    handleLogout={handleLogout}
                    loading={loading}
                    onCloseMenu={closeMobileMenu}
                />
            </header>
        </>
    );
};

export default Header;
