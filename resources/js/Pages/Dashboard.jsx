import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend,
    AreaChart, Area, ComposedChart 
} from 'recharts';

export default function Dashboard({ auth, chartData = [], stats = {} }) {
    const [statusFilter, setStatusFilter] = useState('All');
    const [yearFilter, setYearFilter] = useState('All');

    const user = auth?.user || { name: 'Guest Professor' };
    
    const totalRev = Number(stats?.totalRevenue || 0);
    const badDebt = Number(stats?.badDebt || 0);
    const receivables = Number(stats?.receivables || 0);

    const PIE_COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6366f1']; 

    const filteredData = useMemo(() => {
        if (!Array.isArray(chartData)) return [];
        return chartData.filter(item => {
            const matchesStatus = statusFilter === 'All' || item.claim_status === statusFilter;
            const matchesYear = yearFilter === 'All' || 
                               (item.claim_billing_date && item.claim_billing_date.includes(yearFilter));
            return matchesStatus && matchesYear;
        }).sort((a, b) => new Date(a.claim_billing_date) - new Date(b.claim_billing_date));
    }, [statusFilter, yearFilter, chartData]);

    const pieData = [
        { name: 'Paid', value: totalRev - badDebt - receivables },
        { name: 'Pending', value: receivables },
        { name: 'Bad Debt', value: badDebt }
    ];

    return (
        <AuthenticatedLayout
            user={user} 
            header={<h2 className="font-bold text-2xl text-indigo-900 leading-tight">Hospital Financial Command Center</h2>}
        >
            <Head title="FINAL COURSE REQUIREMENT: Health Data Dashboard" />

            <div className="py-8 px-6 max-w-7xl mx-auto space-y-8">
                
                {/* 1. TOP STATS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                        <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">💰</div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Gross Billed</p>
                            <p className="text-2xl font-black text-gray-900">${totalRev.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                        <div className="p-3 bg-red-100 rounded-lg text-red-600">⚠️</div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Denials</p>
                            <p className="text-2xl font-black text-red-600">${badDebt.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center space-x-4">
                        <div className="p-3 bg-green-100 rounded-lg text-green-600">📈</div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Net Receivables</p>
                            <p className="text-2xl font-black text-green-600">${receivables.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* 2. INTERACTIVE SLICERS */}
                <div className="bg-indigo-900 p-6 rounded-2xl shadow-lg flex flex-col md:flex-row gap-6 items-center justify-between">
                    <h3 className="text-white font-bold">Interactive Data Slicers:</h3>
                    <div className="flex gap-4 w-full md:w-auto">
                        <select 
                            className="bg-white/10 text-white border-white/20 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option className="text-black" value="All">All Claim Statuses</option>
                            <option className="text-black" value="Pending">Pending</option>
                            <option className="text-black" value="Denied">Denied</option>
                            <option className="text-black" value="Paid">Paid</option>
                        </select>
                        <select 
                            className="bg-white/10 text-white border-white/20 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400"
                            value={yearFilter}
                            onChange={(e) => setYearFilter(e.target.value)}
                        >
                            <option className="text-black" value="All">All Years</option>
                            <option className="text-black" value="2024">Fiscal Year 2024</option>
                            <option className="text-black" value="2025">Fiscal Year 2025</option>
                        </select>
                    </div>
                </div>

                {/* 3. VISUALIZATION GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* CHART 1: COMPOSED CHART */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-96">
                        <h4 className="font-bold text-gray-700 mb-4 italic underline text-sm">1. Billed vs. Paid Comparison</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={filteredData.slice(0,8)} margin={{ bottom: 40 }}>
                                <XAxis dataKey="insurance_provider" tick={{fontSize: 9}} angle={-45} textAnchor="end" interval={0} height={60}/>
                                <YAxis />
                                <Tooltip />
                                <Legend verticalAlign="top"/>
                                <Bar dataKey="billed_amount" name="Billed" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                <Line type="monotone" dataKey="paid_amount" name="Paid" stroke="#10b981" strokeWidth={3} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>

                    {/* CHART 2: AREA CHART */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-96">
                        <h4 className="font-bold text-gray-700 mb-4 italic underline text-sm">2. Revenue Flow Volume</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={filteredData.slice(0, 20)}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="claim_billing_date" tick={{fontSize: 10}} />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="billed_amount" stroke="#6366f1" fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* CHART 3: PIE CHART */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-96">
                        <h4 className="font-bold text-gray-700 mb-4 italic underline text-sm">3. AR Status Distribution</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie 
                                    data={pieData} 
                                    innerRadius={60} 
                                    outerRadius={80} 
                                    paddingAngle={5} 
                                    dataKey="value"
                                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend layout="vertical" align="right" verticalAlign="middle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* CHART 4: FIXED BAR CHART (PROVIDER PERFORMANCE) */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-96">
                        <h4 className="font-bold text-gray-700 mb-4 italic underline text-sm">4. Provider Performance Analysis</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={filteredData.slice(0, 8)} margin={{ bottom: 50 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis 
                                    dataKey="insurance_provider" 
                                    tick={{fontSize: 9}} 
                                    angle={-45} 
                                    textAnchor="end" 
                                    interval={0} 
                                    height={70} // Extra height for rotated labels
                                />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="billed_amount" fill="#f59e0b" radius={[10, 10, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 4. FOOTER */}
                <div className="text-center py-6 border-t border-gray-200">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">
                        Official Data Source: 
                        <a 
                            href="https://www.kaggle.com/datasets/abuthahir1998/synthetic-ar-medical-dataset-with-realistic-denial" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-indigo-600 hover:text-indigo-800 hover:underline ml-1"
                        >
                            Kaggle Synthetic AR Medical Dataset | Q1 2025
                        </a>
                    </p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}