import React from 'react';

const StatCard = ({ title, value, icon, iconColor = 'text-blue-500', iconBg = 'bg-blue-50', suffix, trend }) => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-semibold text-gray-500 tracking-wide uppercase">{title}</p>
                    <div className="mt-3 flex items-baseline gap-2">
                        <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">{value}</h3>
                        {suffix && <span className="text-sm text-gray-500 font-medium">{suffix}</span>}
                    </div>
                    {trend && (
                        <p className={`text-xs font-bold mt-2 flex items-center gap-1 ${trend > 0 ? 'text-emerald-600' : 'text-rose-500'} bg-opacity-10 px-2 py-1 rounded-full w-fit ${trend > 0 ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                            <i className={`fa-solid ${trend > 0 ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'}`}></i>
                            {Math.abs(trend)}% vs last week
                        </p>
                    )}
                </div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${iconBg} shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                    <i className={`fa-solid ${icon} text-2xl ${iconColor}`}></i>
                </div>
            </div>
        </div>
    );
};

export default StatCard;
