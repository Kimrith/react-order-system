import { useState } from 'react';
import { Bell, Flame, CheckCircle2, Clock, Check, Receipt } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import ReceiptModal from './ReceiptModal';


// const initialOrders = [
//   {
//     id: 'ORD-005',
//     table: 'Table A5',
//     status: 'Pending',
//     paymentStatus: 'UNPAID',
//     paymentMethod: 'CASH',
//     items: [
//       { name: 'Pad Thai Noodles', qty: 1, price: 5.00 },
//       { name: 'Mango Sticky Rice', qty: 1, price: 3.50 },
//       { name: 'Coca-Cola', qty: 3, price: 4.50 },
//     ],
//     total: 13.00,
//     timeAgo: '2m ago',
//     notes: ''
//   },
//   {
//     id: 'ORD-001',
//     table: 'Table A1',
//     status: 'Pending',
//     paymentStatus: 'UNPAID',
//     paymentMethod: 'CASH',
//     items: [
//       { name: 'Coca-Cola', qty: 2, price: 3.00 },
//       { name: 'Beef Burger', qty: 1, price: 6.50 },
//     ],
//     total: 9.50,
//     timeAgo: '5m ago',
//     notes: 'No onions please'
//   },
//   {
//     id: 'ORD-002',
//     table: 'Table B3',
//     status: 'In Kitchen',
//     paymentStatus: 'PAID',
//     paymentMethod: 'KHQR',
//     items: [
//       { name: 'Iced Coffee', qty: 2, price: 5.00 },
//       { name: 'Crispy Spring Rolls', qty: 1, price: 3.00 },
//     ],
//     total: 8.00,
//     timeAgo: '12m ago',
//     notes: ''
//   },
//   {
//     id: 'ORD-003',
//     table: 'Table A3',
//     status: 'Served',
//     paymentStatus: 'PAID',
//     paymentMethod: 'KHQR',
//     items: [
//       { name: 'Grilled Salmon', qty: 1, price: 9.00 },
//       { name: 'Fresh Orange Juice', qty: 1, price: 3.00 },
//     ],
//     total: 12.00,
//     timeAgo: '40m ago',
//     notes: ''
//   },
//   {
//     id: 'ORD-004',
//     table: 'Table B2',
//     status: 'Served',
//     paymentStatus: 'UNPAID',
//     paymentMethod: 'CASH',
//     items: [
//       { name: 'Chicken Fried Rice', qty: 2, price: 9.00 },
//       { name: 'Thai Milk Tea', qty: 2, price: 5.50 },
//     ],
//     total: 14.50,
//     timeAgo: '1h 0m ago',
//     notes: 'Extra spicy'
//   }
// ];

const StatusIcon = ({ status }) => {
  switch (status) {
    case 'Pending': return <Bell size={14} className="text-yellow-500" />;
    case 'In Kitchen': return <Flame size={14} className="text-orange-500" />;
    case 'Served': return <CheckCircle2 size={14} className="text-emerald-500" />;
    default: return null;
  }
};

const StatusBadge = ({ status }) => {
  const styles = {
    'Pending': 'bg-blue-600/20 text-blue-400',
    'In Kitchen': 'bg-orange-500/20 text-orange-400',
    'Served': 'bg-emerald-500/20 text-emerald-400'
  };

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium ${styles[status]}`}>
      <StatusIcon status={status} />
      {status === 'Pending' ? 'Waiting' : status}
    </div>
  );
};

const OrderCard = ({ order, onUpdateStatus, onViewReceipt }) => {
  return (
    <div className="bg-[#15192b] rounded-xl p-4 border border-gray-800/50 flex flex-col gap-4 relative overflow-hidden group shrink-0">
      {/* Top Border Accent */}
      {order.status === 'Pending' && <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500/80"></div>}
      {order.status === 'In Kitchen' && <div className="absolute top-0 left-0 w-full h-1 bg-orange-500/80"></div>}
      {order.status === 'Served' && <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/80"></div>}

      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-white font-bold text-lg">{order.displayId || order.orderId || order.id}</h3>
          <p className="text-gray-400 text-sm">{order.table || `Table ${order.tableId}`}</p>
        </div>
        <div className="flex items-center gap-2">
          {!order.paymentStatus || order.paymentStatus.toUpperCase() === 'UNPAID' ? (
            <div className="flex bg-[#2a2a35] rounded-md overflow-hidden text-xs font-bold">
              <span className="text-red-400 px-2 py-1 flex items-center gap-1">
                <span className="text-red-500">▲</span> UNPAID
              </span>
              <span className="text-gray-400 px-2 py-1 bg-[#1e2336]">{order.paymentMethod || 'CASH'}</span>
            </div>
          ) : (
            <div className="flex bg-[#2a2a35] rounded-md overflow-hidden text-xs font-bold">
              <span className="text-emerald-400 px-2 py-1 flex items-center gap-1">
                <Check size={12} /> PAID
              </span>
              <span className="text-gray-400 px-2 py-1 bg-[#1e2336]">{order.paymentMethod || 'KHQR'}</span>
            </div>
          )}
        </div>
      </div>

      <div>
        <StatusBadge status={order.status} />
      </div>

      <div className="flex flex-col gap-2 mt-2">
        {(order.items || []).map((item, idx) => {
          const itemName = item.name || item.product?.name || 'Item';
          const itemQty = item.qty || item.quantity || 1;
          const itemPrice = item.price ?? item.product?.price ?? item.subtotal ?? 0;
          return (
            <div key={idx} className="flex justify-between items-center text-sm">
              <span className="text-gray-300">{itemName}</span>
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-sm">x{itemQty}</span>
                <span className="text-white font-medium w-14 text-right">${itemPrice.toFixed(2)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {(() => {
        // Collect notes from either the order level or item level specialInstructions
        const orderNotes = order.notes;
        const itemNotes = (order.items || []).map(i => i.specialInstructions).filter(n => n).join(', ');
        const notesToDisplay = orderNotes || itemNotes;
        if (!notesToDisplay) return null;

        return (
          <div className="bg-[#1e2336] p-2.5 rounded-md flex items-start gap-2">
            <span className="text-gray-400 text-sm mt-0.5">📝</span>
            <p className="text-gray-400 text-sm italic">{notesToDisplay}</p>
          </div>
        );
      })()}

      <div className="flex justify-between items-center mt-2">
        <span className="text-yellow-500 font-bold text-xl">${(order.total ?? order.totalAmount ?? order.totalAllAmount ?? 0).toFixed(2)}</span>
        <div className="flex items-center gap-1.5 text-gray-500 text-xs">
          <Clock size={14} />
          {order.timeAgo || 'Just now'}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3 pt-4 border-t border-gray-800">
        {order.status === 'Pending' && (
          <button
            onClick={() => onUpdateStatus && onUpdateStatus(order.id, 'In Kitchen')}
            className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-yellow-950 font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Bell size={14} /> Accept
          </button>
        )}
        {order.status === 'In Kitchen' && (
          <button
            onClick={() => onUpdateStatus && onUpdateStatus(order.id, 'Served')}
            className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <CheckCircle2 size={14} /> Finish
          </button>
        )}

        {(!order.paymentStatus || order.paymentStatus.toUpperCase() === 'UNPAID') && (
          <button className="flex-1 bg-orange-500 hover:bg-orange-400 text-orange-950 font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors">
            <span className="text-[10px] leading-none mb-[1px]">@</span> Mark Paid
          </button>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewReceipt && onViewReceipt(order);
          }}
          className="flex-1 bg-[#2a2a35] hover:bg-[#32323e] text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <Receipt size={14} /> Receipt
        </button>
      </div>
    </div>
  );
};

export default function OrderBoard({ orders = [], isLoading, onUpdateStatus }) {
  const [activeReceiptOrder, setActiveReceiptOrder] = useState(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Use API orders directly
  const displayOrders = orders;

  const pendingOrders = displayOrders.filter(o => o.status === 'Pending');
  const kitchenOrders = displayOrders.filter(o => o.status === 'In Kitchen');
  const servedOrders = displayOrders.filter(o => o.status === 'Served');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-0">

      {/* Pending Column */}
      <div className="flex flex-col bg-[#1e2336] rounded-xl overflow-hidden h-full">
        <div className="flex items-center justify-between p-4 bg-[#232942] border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-yellow-500" />
            <h2 className="text-gray-300 font-bold text-base">Pending</h2>
          </div>
          <span className="bg-[#15192b] text-gray-400 text-xs font-bold px-3 py-1 rounded-full">{pendingOrders.length}</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 hide-scrollbar">
          {pendingOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onUpdateStatus={onUpdateStatus}
              onViewReceipt={setActiveReceiptOrder}
            />
          ))}
        </div>
      </div>

      {/* In Kitchen Column */}
      <div className="flex flex-col bg-[#1e2336] rounded-xl overflow-hidden h-full">
        <div className="flex items-center justify-between p-4 bg-[#232942] border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Flame size={18} className="text-orange-500" />
            <h2 className="text-gray-300 font-bold text-base">In Kitchen</h2>
          </div>
          <span className="bg-[#15192b] text-gray-400 text-xs font-bold px-3 py-1 rounded-full">{kitchenOrders.length}</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 hide-scrollbar">
          {kitchenOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onUpdateStatus={onUpdateStatus}
              onViewReceipt={setActiveReceiptOrder}
            />
          ))}
        </div>
      </div>

      {/* Served Column */}
      <div className="flex flex-col bg-[#1e2336] rounded-xl overflow-hidden h-full">
        <div className="flex items-center justify-between p-4 bg-[#232942] border-b border-gray-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-500" />
            <h2 className="text-gray-300 font-bold text-base">Served</h2>
          </div>
          <span className="bg-[#15192b] text-gray-400 text-xs font-bold px-3 py-1 rounded-full">{servedOrders.length}</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 hide-scrollbar">
          {servedOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onUpdateStatus={onUpdateStatus}
              onViewReceipt={setActiveReceiptOrder}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeReceiptOrder && (
          <ReceiptModal
            order={activeReceiptOrder}
            onClose={() => setActiveReceiptOrder(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
