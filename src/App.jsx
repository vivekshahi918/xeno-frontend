import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, Users, ShoppingBag, DollarSign, 
  RefreshCw, LogOut, TrendingUp, Package, ArrowUpRight, Search, Filter 
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, ComposedChart, Legend 
} from 'recharts';

const API_URL = "http://localhost:4000/api";
const TENANT_ID = "xeno-demo-store";

function App() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ totalCustomers: 0, totalOrders: 0, totalRevenue: 0 });
  const [chartData, setChartData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); // Controls which page is shown

  // Fetch Data
  const fetchData = async () => {
    try {
      const statsRes = await axios.get(`${API_URL}/stats?tenantId=${TENANT_ID}`);
      const chartRes = await axios.get(`${API_URL}/chart?tenantId=${TENANT_ID}`);
      
      setStats(statsRes.data);
      
      const formattedChart = chartRes.data.map(item => ({
        date: new Date(item.createdAtDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount: item.totalPrice,
      }));
      setChartData(formattedChart);

      const recent = chartRes.data.slice(-5).reverse().map((item, idx) => ({
        id: `#ORD-${1000 + idx}`,
        customer: `Customer ${idx + 1}`,
        date: new Date(item.createdAtDate).toLocaleDateString(),
        amount: item.totalPrice,
        status: "Paid"
      }));
      setRecentOrders(recent);

    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const handleSync = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/ingest`, { tenantId: TENANT_ID });
      await fetchData();
      alert("Sync Complete! Data updated.");
    } catch (error) {
      alert("Sync Failed");
    }
    setLoading(false);
  };

  // --- MOCK DATA FOR TAB VIEWS ---
  const customersList = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", spent: "$1,200", orders: 5 },
    { id: 2, name: "Bob Smith", email: "bob@test.com", spent: "$850", orders: 3 },
    { id: 3, name: "Charlie Brown", email: "charlie@domain.com", spent: "$2,100", orders: 8 },
    { id: 4, name: "David Wilson", email: "david@demo.com", spent: "$450", orders: 2 },
    { id: 5, name: "Eve Davis", email: "eve@sample.com", spent: "$3,200", orders: 12 },
  ];

  const productsList = [
    { id: 1, name: "Classic T-Shirt", category: "Apparel", price: "$25.00", stock: 120 },
    { id: 2, name: "Denim Jeans", category: "Apparel", price: "$60.00", stock: 85 },
    { id: 3, name: "Running Shoes", category: "Footwear", price: "$120.00", stock: 40 },
    { id: 4, name: "Leather Wallet", category: "Accessories", price: "$45.00", stock: 200 },
    { id: 5, name: "Wrist Watch", category: "Accessories", price: "$250.00", stock: 15 },
  ];

  // --- VIEW: LOGIN SCREEN ---
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-gray-900">
        <div className="bg-white/10 backdrop-blur-lg p-10 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-indigo-500 rounded-lg shadow-lg">
              <RefreshCw className="text-white w-8 h-8" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-center text-white">Xeno <span className="text-indigo-400">Insights</span></h1>
          <p className="text-gray-300 mb-8 text-center">Enterprise Data Ingestion Platform</p>
          <button 
            onClick={() => setUser({ email: "admin@xeno.com" })}
            className="w-full bg-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-indigo-500 transition-all shadow-lg hover:shadow-indigo-500/30 flex items-center justify-center gap-2"
          >
            Enter Dashboard <ArrowUpRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER CONTENT BASED ON TAB ---
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} icon={<DollarSign size={24} className="text-emerald-600" />} trend="+12.5%" trendUp={true} bg="bg-emerald-50" border="border-emerald-100" />
              <StatCard title="Total Orders" value={stats.totalOrders} icon={<ShoppingBag size={24} className="text-blue-600" />} trend="+5 new today" trendUp={true} bg="bg-blue-50" border="border-blue-100" />
              <StatCard title="Total Customers" value={stats.totalCustomers} icon={<Users size={24} className="text-violet-600" />} trend="+2 this week" trendUp={true} bg="bg-violet-50" border="border-violet-100" />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-gray-400"/> Revenue Trend</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} tickFormatter={(val) => `$${val}`} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                      <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Volume</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="date" hide />
                      <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{ borderRadius: '8px' }} />
                      <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Recent Ingested Orders</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                    <tr><th className="px-6 py-3">Order ID</th><th className="px-6 py-3">Date</th><th className="px-6 py-3">Amount</th><th className="px-6 py-3">Status</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentOrders.length > 0 ? recentOrders.map((order, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{order.id}</td>
                        <td className="px-6 py-4 text-gray-500">{order.date}</td>
                        <td className="px-6 py-4 font-bold text-gray-800">${order.amount.toFixed(2)}</td>
                        <td className="px-6 py-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">{order.status}</span></td>
                      </tr>
                    )) : <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-400">Sync data to populate.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'customers':
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-300">
             <div className="px-6 py-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">All Customers</h3>
                <div className="flex gap-2">
                  <button className="p-2 border rounded-lg hover:bg-gray-50"><Filter size={18} className="text-gray-500"/></button>
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-3 text-gray-400"/>
                    <input type="text" placeholder="Search customers..." className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                  </div>
                </div>
              </div>
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                  <tr><th className="px-6 py-4">Name</th><th className="px-6 py-4">Email</th><th className="px-6 py-4">Total Spent</th><th className="px-6 py-4">Orders</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {customersList.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{c.name}</td>
                      <td className="px-6 py-4 text-gray-500">{c.email}</td>
                      <td className="px-6 py-4 font-medium text-green-600">{c.spent}</td>
                      <td className="px-6 py-4">{c.orders}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
        );

      case 'products':
        return (
           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-300">
             <div className="px-6 py-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">Products Inventory</h3>
                 <button className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800">Add Product</button>
              </div>
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                  <tr><th className="px-6 py-4">Product Name</th><th className="px-6 py-4">Category</th><th className="px-6 py-4">Price</th><th className="px-6 py-4">Stock</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {productsList.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                      <td className="px-6 py-4 text-gray-500"><span className="bg-gray-100 px-2 py-1 rounded text-xs">{p.category}</span></td>
                      <td className="px-6 py-4">{p.price}</td>
                      <td className="px-6 py-4 font-medium text-blue-600">{p.stock} units</td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
        );

      case 'analytics':
        // Mock Data for Advanced Charts
        const performanceData = [
          { name: 'Mon', revenue: 4000, target: 2400, conversion: 24 },
          { name: 'Tue', revenue: 3000, target: 1398, conversion: 22 },
          { name: 'Wed', revenue: 2000, target: 9800, conversion: 22 },
          { name: 'Thu', revenue: 2780, target: 3908, conversion: 20 },
          { name: 'Fri', revenue: 1890, target: 4800, conversion: 21 },
          { name: 'Sat', revenue: 2390, target: 3800, conversion: 25 },
          { name: 'Sun', revenue: 3490, target: 4300, conversion: 21 },
        ];

        const categoryData = [
          { name: 'Apparel', value: 400 },
          { name: 'Electronics', value: 300 },
          { name: 'Home', value: 300 },
          { name: 'Beauty', value: 200 },
        ];
        const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header with Actions */}
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Performance Analytics</h3>
                <p className="text-sm text-gray-500">Deep dive into store metrics</p>
              </div>
              <div className="flex gap-3">
                <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>This Year</option>
                </select>
                <button className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-100 transition">
                  Download Report
                </button>
              </div>
            </div>

            {/* Row 1: The Big Composed Chart (Revenue vs Target) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h4 className="text-lg font-bold text-gray-800 mb-6">Revenue vs Target (Mixed Metrics)</h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={performanceData}>
                    <CartesianGrid stroke="#f5f5f5" vertical={false} />
                    <XAxis dataKey="name" scale="band" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Legend />
                    <Bar dataKey="revenue" barSize={20} fill="#6366f1" radius={[10, 10, 0, 0]} />
                    <Line type="monotone" dataKey="target" stroke="#ff7300" strokeWidth={3} dot={{r: 4}} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Row 2: Two Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Pie Chart: Sales by Category */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h4 className="text-lg font-bold text-gray-800 mb-2">Sales by Category</h4>
                <div className="h-64 flex justify-center items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Area Chart: Customer Growth */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h4 className="text-lg font-bold text-gray-800 mb-4">Customer Acquisition Cost</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceData}>
                      <defs>
                        <linearGradient id="colorCv" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0"/>
                      <XAxis dataKey="name" hide />
                      <Tooltip contentStyle={{ borderRadius: '8px' }} />
                      <Area type="monotone" dataKey="conversion" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCv)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3 font-bold text-xl tracking-tight">
          <div className="p-1.5 bg-indigo-500 rounded-md"><RefreshCw size={20} /></div> Xeno FDE
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <SidebarItem icon={<LayoutDashboard size={20}/>} label="Overview" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={<Users size={20}/>} label="Customers" active={activeTab === 'customers'} onClick={() => setActiveTab('customers')} />
          <SidebarItem icon={<Package size={20}/>} label="Products" active={activeTab === 'products'} onClick={() => setActiveTab('products')} />
          <SidebarItem icon={<TrendingUp size={20}/>} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
        </nav>
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">JD</div>
            <div className="text-sm"><p className="font-medium">John Doe</p><p className="text-slate-400 text-xs">Admin</p></div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 capitalize">{activeTab}</h2>
            <p className="text-sm text-gray-500">Tenant: <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-indigo-600">{TENANT_ID}</span></p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleSync} disabled={loading} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-all shadow-md ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800 hover:shadow-lg'}`}>
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> {loading ? "Syncing..." : "Sync Data"}
            </button>
            <button onClick={() => setUser(null)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"><LogOut size={20} /></button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

const SidebarItem = ({ icon, label, active, onClick }) => (
  <div onClick={onClick} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
    {icon} <span className="font-medium">{label}</span>
  </div>
);

const StatCard = ({ title, value, icon, trend, bg, border, trendUp }) => (
  <div className={`bg-white p-6 rounded-2xl shadow-sm border ${border} relative overflow-hidden group hover:shadow-md transition-all`}>
    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform`}>{icon}</div>
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${bg}`}>{icon}</div>
      {trend && <span className={`text-xs font-bold px-2 py-1 rounded-full ${trendUp ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{trend}</span>}
    </div>
    <p className="text-gray-500 text-sm font-medium">{title}</p>
    <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
  </div>
);

export default App;