import React, { useCallback, useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, ResponsiveContainer, PieChart, Pie, Cell, Label } from 'recharts';
import { revenueDetail } from '../../../service/RevenueService';

const RevenuePage = () => {
    const [revenue, setRevenue] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [selectedYear, setSelectedYear] = useState(2024);

    useEffect(() => {
        document.title = "Revenue";
    }, []);

    const fetchDetailRevenue = useCallback(async () => {
        try {
            const data = await revenueDetail(selectedYear);
            if (data && data.code === 200 && data.result) {
                setRevenue(data.result.revenueDetails);
                setTotalRevenue(data.result.totalRevenue);
            }
        } catch (error) {
            console.log(error);
        }
    }, [selectedYear]);

    useEffect(() => {
        fetchDetailRevenue();
    }, [fetchDetailRevenue]);

    const processMonthlyRevenue = (data, year) => {
        const monthlyRevenue = Array.from({ length: 12 }, (_, i) => ({
            month: `Month ${i + 1}`,
            revenue: 0
        }));
        data
            .filter(item => item.year === year)
            .forEach(({ month, revenue }) => {
                monthlyRevenue[month - 1].revenue += revenue;
            });
        return monthlyRevenue;
    };

    const chartData = processMonthlyRevenue(revenue, selectedYear);

    // Dữ liệu cho biểu đồ tròn với màu sắc mới
    const pieData = [
        { name: 'Total Revenue', value: totalRevenue },
        { name: 'Remaining', value: 50000000 - totalRevenue } // Giả sử mục tiêu là 1 triệu VND
    ];
    const COLORS = ['#4A90E2', '#B0BEC5']; // Xanh lam nhạt và xám đậm

    return (
        <div className="revenue-content-page">
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h3>Total Revenue by Month for {selectedYear}</h3>

                <div className="revenue-select-container">
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        className="revenue-select-dropdown"
                    >
                        <option value={2024}>2024</option>
                        <option value={2023}>2023</option>
                        <option value={2022}>2022</option>
                        <option value={2021}>2021</option>
                    </select>
                </div>

                {/* Biểu đồ Line và Bar */}
                <div className="revenue-charts">
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={chartData} margin={{ top: 20, right: 40, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="revenue" stroke="#82ca9d" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>

                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 30, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="revenue" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Biểu đồ tròn hiển thị Total Revenue */}
                <div style={{ marginTop: '50px', textAlign: 'center' }}>
                    <h3>Total Revenue for {selectedYear}</h3>
                    <ResponsiveContainer width="50%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={90}
                                fill="#4A90E2"
                                paddingAngle={3}
                                startAngle={90}
                                endAngle={-270}
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                                <Label
                                    value={`${totalRevenue.toLocaleString('vi-VN')} VND`}
                                    position="center"
                                    style={{ fontSize: '20px', fontWeight: 'bold', fill: '#4A90E2' }}
                                />
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default RevenuePage;
