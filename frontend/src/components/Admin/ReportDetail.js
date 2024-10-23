import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Grid,
  Divider,
} from '@mui/material';
import {
  DateRange,
  AttachMoney,
  ShoppingCart,
  Group,
  CreditCard,
  LocalShipping,
  Report,
} from '@mui/icons-material';
import axios, { all } from 'axios';
import { useParams } from 'react-router-dom';

function ReportDetail() {
  const [guestUsers, setGuestUsers] = useState(0)
  const [reportType, setReportType] = useState('')
  const [totalOrders, setTotalOrders] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [averageOrder, setAverageOrder] = useState(0);
  const [itemsBought, setItemsBought] = useState({});
  const [reportDateRange, setReportDateRange] = useState({});
  const [uniqueUsersCount, setUniqueUsersCount] = useState(0);
  const [cardPayments, setCardPayments] = useState(0);
  const [cashPayments, setCashPayments] = useState(0);
  const [deliveryBreakdown, setDeliveryBreakdown] = useState({
    delivered: 0,
    shipped: 0,
    pending: 0,
    cancelled: 0,
  });
  // products ones
  const [products, setProducts] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [numCategories, setNumCategories] = useState(0)
  const [lowStockItems, setLowStockItems] = useState([])
  const { id } = useParams();

  const fetchReport = async () => {
    try {
      const response = await axios.get(`/api/get-report/${id}`);
      const data = response.data.message;
      const reportType = data.report_type
      setReportType(reportType)


      if (data.report_type === 'orders'){
        createOrderReport(data)
      } else if (data.report_type === 'products') {
        createProductReport(data)
      } else if (data.report_type === 'users'){
        createUserReport()
      }

      renderReport(reportType)

      /*
      Products
      - total products - divider
      - table for low stock products - table
      - products added in the date picked - table
      - items on sale - divider
      - top 5 rated products, 5 worst - divider
      - in favourites

      */

    } catch (e) {
      console.log(e);
    }
  };

  const createProductReport = async (data) => {
    try {
      // stats for products across all time (such as low stock)
      const response = await axios.get('/api/products')
      const allProducts = response.data
      setAllProducts(allProducts)

      const categories = new Set()
      allProducts.forEach(product => {
        if (product.category) {
          categories.add(product.category)
        }
      })
      setNumCategories(categories.size)
     
    

      // stats for products within the date ranges
      const products = data.report_data;
      setProducts(products)
      console.log(products)
       const startDate = data.date_range.start_date;
       const endDate = data.date_range.end_date;
       setReportDateRange({ startDate, endDate });

       const numOfProducts = products.length
       console.log(numOfProducts)

       const newProducts = products.filter(product => product.tags.includes('new')).length
       console.log('sale', newProducts)

       const lowStockItems = allProducts.filter(product => product.stock <= 10)
       setLowStockItems(lowStockItems)


       

    }catch(e) {
      console.log(e)
    }
  }

  const createUserReport = () => {
    try {
      console.log('triggering user report')
    }catch(e) {
      console.log(e)
    }
  }


  const createOrderReport = (data) => {
    try {

       // Dates and Orders
       const orders = data.report_data;
       const startDate = data.date_range.start_date;
       const endDate = data.date_range.end_date;
       setReportDateRange({ startDate, endDate });
 
       // Calculate metrics
       const totalRevenue = orders.reduce(
         (acc, order) => acc + order.total_price,
         0
       );
       setTotalRevenue(totalRevenue);
       const averageOrder = totalRevenue / orders.length || 0;
       setAverageOrder(averageOrder);
 
       const guestUsers = orders.filter(order => order.user === null).length
       setGuestUsers(guestUsers)
 
       const orderLength = orders.length
       setTotalOrders(orderLength)
 
       // Unique users and payments
       const uniqueUsersSet = new Set();
       orders.forEach((order) => {
         if (order.user) {
           uniqueUsersSet.add(order.user);
         }
       });
       setUniqueUsersCount(uniqueUsersSet.size);
       const cardPaymentsCount = orders.filter(
         (order) => order.order_type === 'card'
       ).length;
       setCardPayments(cardPaymentsCount);
       const cashPaymentsCount = orders.filter(
         (order) => order.order_type === 'cash'
       ).length;
       setCashPayments(cashPaymentsCount);
 
       // Delivery breakdown
       const deliveryCounts = { delivered: 0, shipped: 0, pending: 0 };
       orders.forEach((order) => {
         if (order.order_status === 'delivered') {
           deliveryCounts.delivered += 1;
         } else if (order.order_status === 'shipped') {
           deliveryCounts.shipped += 1;
         } else if (order.order_status === 'pending') {
           deliveryCounts.pending += 1;
         } else if (order.order_status === 'cancelled') {
             deliveryCounts.cancelled += 1
         }
       });
       setDeliveryBreakdown(deliveryCounts);
 
       // Calculate items bought and their quantities
       const itemsBought = {};
       orders.forEach((order) => {
         order.line_items.forEach((item) => {
           if (!itemsBought[item.name]) {
             itemsBought[item.name] = {
               name: item.name,
               quantity: item.quantity,
               cost: item.unit_price,
             };
           } else {
             itemsBought[item.name].quantity += item.quantity;
             itemsBought[item.name].cost += item.unit_price / 100;
           }
         });
       });
       setItemsBought(itemsBought);

    }catch(e) {
      console.log(e)
    }
  }


  const renderReport = () => {

    switch (reportType) {
      case 'orders':
        return (
          <Box sx={{ padding: 2, marginTop:'64px' }}>
          {/* Report Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              <Report sx={{ fontSize: 30, verticalAlign: 'middle', marginRight: 1 }} />
              Cointology Report
            </Typography>
            {reportDateRange.startDate && reportDateRange.endDate && (
              <Typography variant="body2" align="right">
                Generated on: {new Date().toLocaleDateString()}<br />
                Date range: {new Date(reportDateRange.startDate).toLocaleDateString()} - {new Date(reportDateRange.endDate).toLocaleDateString()}
              </Typography>
            )}
          </Box>
    
          <Divider sx={{ marginY: 2, }} />
    
          {/* Overall Metrics Table */}
          <Typography variant="h6" sx={{ marginBottom: 1 }}>
            Overall Metrics
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Metric</TableCell>
                <TableCell align="right">Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Total Revenue</TableCell>
                <TableCell align="right">${totalRevenue.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Average Order Value</TableCell>
                <TableCell align="right">${averageOrder.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Unique Users (Logged In)</TableCell>
                <TableCell align="right">{uniqueUsersCount}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Guest Users</TableCell>
                <TableCell align="right">{guestUsers}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total Orders</TableCell>
                <TableCell align="right">{totalOrders}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
    
          {/* Payment Breakdown Table */}
          <Typography variant="h6" sx={{ marginY: 2 }}>
            Payment Breakdown
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Payment Type</TableCell>
                <TableCell align="right">Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Card Payments</TableCell>
                <TableCell align="right">{cardPayments}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Cash Payments</TableCell>
                <TableCell align="right">{cashPayments}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
    
          {/* Delivery Status Table */}
          <Typography variant="h6" sx={{ marginY: 2 }}>
            Delivery Status
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell align="right">Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Delivered</TableCell>
                <TableCell align="right">{deliveryBreakdown.delivered}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Shipped</TableCell>
                <TableCell align="right">{deliveryBreakdown.shipped}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Pending</TableCell>
                <TableCell align="right">{deliveryBreakdown.pending}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
    
          {/* Top Performing Items Table */}
          <Typography variant="h6" sx={{ marginY: 2 }}>
            Top Performing Items
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Item Name</TableCell>
                <TableCell align="right">Quantity Sold</TableCell>
                <TableCell align="right">Total Revenue</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(itemsBought).length > 0 ? (
                Object.entries(itemsBought).map(([itemName, itemDetails]) => (
                  <TableRow key={itemName}>
                    <TableCell>{itemDetails.name}</TableCell>
                    <TableCell align="right">{itemDetails.quantity}</TableCell>
                    <TableCell align="right">
                      ${(itemDetails.quantity * itemDetails.cost).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No items sold during this period.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
        );
      case 'products':
        return (
          <>
          <Box sx={{ padding: 2, marginTop:'64px' }}>
          {/* Report Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              <Report sx={{ fontSize: 30, verticalAlign: 'middle', marginRight: 1 }} />
              Cointology Report
            </Typography>
            {reportDateRange.startDate && reportDateRange.endDate && (
              <Typography variant="body2" align="right">
                Generated on: {new Date().toLocaleDateString()}<br />
                Date range: {new Date(reportDateRange.startDate).toLocaleDateString()} - {new Date(reportDateRange.endDate).toLocaleDateString()}
              </Typography>
            )}
          </Box>
    
          <Divider sx={{ marginY: 2, }} />

          <Typography variant="h6" sx={{ marginBottom: 1 }}>
            Overall Metrics
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Metric</TableCell>
                <TableCell align="right">Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Total Products</TableCell>
                <TableCell align="right">{allProducts.length}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Products Added within Dates</TableCell>
                <TableCell align="right">{products.length}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Product Categories</TableCell>
                <TableCell align="right">{numCategories}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total Reviews</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Average Review Rating</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Typography variant="h6" sx={{ mt: 1, p: '3px 0' }}>
  Low Stock
</Typography>
<Table size="small">
  <TableHead>
    <TableRow>
      <TableCell>Product</TableCell>
      <TableCell align="right">Quantities</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {lowStockItems.length > 0 ? (
      lowStockItems.map((item, i) => (
        <TableRow key={i}>
          <TableCell sx={{display: 'flex', alignItems: 'center'}}><Box component='img' src={item.front_image} sx={{height: 25, width: 25, m: '0 5px'}}></Box>{item.name}</TableCell>
          <TableCell align="right">{item.stock}</TableCell>
        </TableRow>
      ))
    ) : (
      <TableRow>
        <TableCell colSpan={2} align="center">
          No low stock items.
        </TableCell>
      </TableRow>
    )}
  </TableBody>
</Table>



<Typography variant="h6" sx={{ mt: 1, p: '3px 0' }}>
  Best Reviewed
</Typography>
<Table size="small">
  <TableHead>
    <TableRow>
      <TableCell>Product</TableCell>
      <TableCell align="right">Rating</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell>Football</TableCell>
      <TableCell sx={{textAlign: 'right'}}>4.6 (15)</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Boxing</TableCell>
      <TableCell sx={{textAlign: 'right'}}>4.2 (11)</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Archery</TableCell>
      <TableCell sx={{textAlign: 'right'}}>4.1 (12)</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Basketball</TableCell>
      <TableCell sx={{textAlign: 'right'}}>3.9 (6)</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Tennis</TableCell>
      <TableCell sx={{textAlign: 'right'}}>2.7 (1)</TableCell>
    </TableRow>
  </TableBody>
</Table>


          </Box>
          
          </>
        )
      default:
        break;
    }
  }


  useEffect(() => {
    fetchReport();
  }, [id]);

  return (
   <>
   {renderReport()}
   </>
  );
}

export default ReportDetail;
