import React from 'react';
import useAuth from '../../contexts/AuthContext';

const Header = ({ title }) => {
    const { user } = useAuth();

    return (
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 lg:px-8">
            <h1 className="text-xl font-bold text-gray-800">{title}</h1>

            <div className="flex items-center gap-6">
                <button className="relative text-gray-400 hover:text-gray-600 transition-colors">
                    <i className="fa-regular fa-bell text-xl"></i>
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="h-8 w-px bg-gray-200"></div>

                <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-semibold text-gray-700 leading-none">
                            {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.username || 'Parent'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Parent Account</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                        {user?.avatarUrl ? (
                            <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <i className="fa-solid fa-user text-gray-400"></i>
                        )}
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 lg:hidden">
                        <i className="fa-solid fa-bars text-xl"></i>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
