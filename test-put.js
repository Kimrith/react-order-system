process.env.NODE_TLS_REJECT_UNAUTHORIZED='0'; 
const order = {"id":2,"orderId":"ORD-609E7","tableId":3,"status":"In Kitchen","paymentStatus":"","totalAmount":4.00,"createdAt":"0001-01-01T00:00:00","items":[{"id":2,"productId":1,"quantity":4,"specialInstructions":"","subtotal":4.00,"product":{"id":1,"productImg":"","name":"coca","description":"","price":1,"isAvailable":false,"categoryId":0}}]}; 
fetch('https://localhost:7293/api/Orders/2', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order) })
  .then(async res => console.log(res.status, await res.text()))
  .catch(console.error);
