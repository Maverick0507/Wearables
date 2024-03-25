import React, { useEffect, useState } from 'react'
import Layout from '../../../layout/Layout'
import './AllOrders.css'
import axios from 'axios'
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { Select } from 'antd'
import "./AllOders.css"


const { Option } = Select

const AllOrders = () => {

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);


  const [status, setStatus] = useState([
    "not process", "Processing", "Shipping", "Shipped"
  ])
  const [changeStatus, setChangeStatus] = useState([])


  const AllOrders = async () => {
    const res = await axios.get(` /api/v2/auth/admin/all-orders`)
    if (res) {
      setOrders(res.data)
    }
  }
  useEffect(() => {
    AllOrders()
  }, [])


  const handleChange = async (id, value) => {
    try {
      const res = await axios.put(` /api/v2/auth/order-status/${id}`, { status: value })
      AllOrders()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Layout>
      <div className="all-orders">
        {orders.map((order, i) => (
          <div key={i}>
       
            {order.products.map((p, j) => (
              <div className="orders">
                <p>{i + 1}</p>
                <img src={` /api/v2/product/get-photo/${p._id}`}
                  alt={p.name} />
                <p><span className='value'>Name: </span> {p.name}</p>
                <p><span className='value'>Price: </span> {p.price}</p>
                <p><span className='value'>Quantity: </span> {order.products.length}</p>
                <p><span className='value'>Order At: </span> {moment(order.createdAt).fromNow()}</p>
                <p><span className='value'>Payment: </span> {order.payment.success ? "Success" : "Failed"}</p>
                <p>
                  <Select onChange={(value) => handleChange(order._id, value)} defaultValue={order.status}>
                    {status.map((s, i) => (
                      <Option key={i} value={s}>
                        {s}
                      </Option>
                    ))}
                  </Select>
                </p>
                <p><span className='value'>Buyer: </span> {order.buyer.name}</p>

              </div>
            ))}
          
          </div>
        ))}
      </div>

    </Layout>
  )
}

export default AllOrders


// <div className='profile-left'>
// <h1>Orders</h1>
// {orders?.length > 0 ? (
//   <div className="orders">
//     <table>
//       <thead>
//         <tr>
//           <th scope='col'>#</th>
//           <th scope='col'>Status</th>
//           <th scope='col'>Buyer</th>
//           <th scope='col'>Date</th>
//           <th scope='col'>Orders</th>
//           <th scope='col'>Payments</th>
//         </tr>
//       </thead>
//       <tbody>
//         {orders.map((o, i) => (
//           <tr key={o._id}>
//             <td>{i + 1}</td>
//             <td>
//               <Select onChange={(value) => handleChange(o._id, value)} defaultValue={o.status}>
//                 {status.map((s, i) => (
//                   <Option key={i} value={s}>
//                     {s}
//                   </Option>
//                 ))}
//               </Select>
//             </td>
//             <td>{o.buyer.name}</td>
//             <td>{moment(o.createdAt).fromNow()}</td>
//             <td>{o.products.length}</td>
//             <td>{o.payment.success ? "Success" : "Failed"}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//     <div className="order-data">
//       {orders.map((o) =>
//         o.products.map((p) => (
//           <div onClick={() => navigate(`/product/${p.slug}`)} className="order-card">
//             <p key={p._id}>{p.name}</p>
//             <img src={` /api/v2/product/get-photo/${p._id}`}
//               alt={p.name} />
//             <p>{p.price}</p>
//           </div>

//         ))
//       )}
//     </div>

//   </div>
// ) : (
//   <p>No orders</p>
// )}
// </div>
