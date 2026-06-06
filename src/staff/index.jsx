import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Navbar from './layout/navbar';
import OrderBoard from './components/order';
import CreateOrder from './components/createOrder';
import Products from './components/product';
import History from './components/history';
import { ChevronDown, Plus } from 'lucide-react';
import { fetchOrders, updateOrderStatus } from './api/orders';

const API_URL = import.meta.env.VITE_API_URL || "/api";
const SOCKET_URL = API_URL.replace('/api', '');

export default function StaffDashboard() {
  const [activeTab, setActiveTab] = useState('Orders');
  const [orders, setOrders] = useState([]);
  const [apiRevenue, setApiRevenue] = useState(0); // Store API revenue
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch initial orders
    const loadOrders = async () => {
      try {
        const data = await fetchOrders();
        if (data) {
          // If the API returns an object with orders array
          if (data.orders && Array.isArray(data.orders)) {
            setOrders(data.orders);
            setApiRevenue(data.totalAllAmount || 0);
          } else if (Array.isArray(data)) {
            setOrders(data);
          }
        }
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();

    // 2. Setup Socket.io listener
    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      // Assuming CORS is enabled on the backend
    });

    socket.on('connect', () => {
      console.log('Connected to WebSocket server via Socket.io');
    });

    socket.on('newOrder', (order) => {
      console.log('New order received:', order);
      setOrders((prev) => [...prev, order]);
    });

    socket.on('orderStatusUpdated', (updatedOrder) => {
      console.log('Order status updated:', updatedOrder);
      setOrders((prev) => 
        prev.map(o => o.id === updatedOrder.id ? updatedOrder : o)
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      // Optimistic UI update
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
      
      await updateOrderStatus(id, newStatus);
    } catch (err) {
      console.error('Failed to update status', err);
      // Revert if failed by re-fetching
      const data = await fetchOrders();
      if (data && data.length > 0) setOrders(data);
    }
  };

  // Calculate dynamic stats
  const totalOrders = orders.length;
  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const inKitchenCount = orders.filter(o => o.status === 'In Kitchen').length;
  // Use the API's totalAllAmount as the single source of truth for revenue
  const revenue = apiRevenue;

  return (
    <div className="flex h-screen bg-[#15192b] text-white font-sans overflow-hidden">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col p-8 overflow-hidden h-full">
        {/* Only show Dashboard Header and Stats on Orders tab */}
        {activeTab === 'Orders' && (
          <>
            {/* Header */}
            <header className="flex justify-between items-start mb-8 shrink-0">
              <div>
                <h1 className="text-2xl font-bold mb-1">Live Dashboard</h1>
                <p className="text-gray-400 text-sm">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 bg-[#1e2336] text-gray-300 px-4 py-2.5 rounded-lg text-base border border-gray-800 hover:bg-[#232942] transition-colors">
                  All Orders <ChevronDown size={18} />
                </button>
                <button 
                  onClick={() => setActiveTab('Create Order')}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-orange-950 px-4 py-2.5 rounded-lg font-bold text-base transition-colors"
                >
                  <Plus size={18} strokeWidth={3} /> Create Order
                </button>
              </div>
            </header>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 shrink-0">
              <div className="bg-[#1e2336] rounded-xl p-6 flex flex-col items-center justify-center shadow-lg shadow-black/20">
                <span className="text-3xl font-black text-white mb-1">{totalOrders}</span>
                <span className="text-gray-500 text-sm font-bold tracking-wider">TOTAL ORDERS</span>
              </div>
              <div className="bg-[#1e2336] rounded-xl p-6 flex flex-col items-center justify-center shadow-lg shadow-black/20">
                <span className="text-3xl font-black text-blue-400 mb-1">{pendingCount}</span>
                <span className="text-gray-500 text-sm font-bold tracking-wider">PENDING</span>
              </div>
              <div className="bg-[#1e2336] rounded-xl p-6 flex flex-col items-center justify-center shadow-lg shadow-black/20">
                <span className="text-3xl font-black text-orange-400 mb-1">{inKitchenCount}</span>
                <span className="text-gray-500 text-sm font-bold tracking-wider">IN KITCHEN</span>
              </div>
              <div className="bg-[#1e2336] rounded-xl p-6 flex flex-col items-center justify-center shadow-lg shadow-black/20">
                <span className="text-3xl font-black text-yellow-500 mb-1">${revenue.toFixed(2)}</span>
                <span className="text-gray-500 text-sm font-bold tracking-wider">REVENUE (PAID)</span>
              </div>
            </div>
          </>
        )}

        {/* Board Container */}
        <div className="flex-1 min-h-0">
          {activeTab === 'Orders' ? (
            <OrderBoard 
              orders={orders} 
              isLoading={isLoading} 
              onUpdateStatus={handleUpdateStatus} 
            />
          ) : activeTab === 'Create Order' ? (
            <CreateOrder />
          ) : activeTab === 'Products' ? (
            <Products />
          ) : activeTab === 'History' ? (
            <History />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>{activeTab} module coming soon...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
