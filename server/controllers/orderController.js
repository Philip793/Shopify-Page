import Order from "../models/Order.js";

/**
 * Create a new order after successful payment
 */
export const createOrder = async (orderData) => {
  try {
    // Generate orderId if not provided
    if (!orderData.orderId) {
      orderData.orderId = `ORD-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 6)
        .toUpperCase()}`;
    }

    const order = new Order(orderData);
    await order.save();
    console.log(`✅ Order saved: ${order.orderId}`);
    return order;
  } catch (error) {
    console.error("❌ Failed to save order:", error.message);
    // Don't throw - payment already succeeded, we don't want to fail the response
    return null;
  }
};

/**
 * Get all orders (admin use)
 */
export const getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, customerEmail } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (customerEmail) filter["customer.email"] = customerEmail.toLowerCase();

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Order.countDocuments(filter);

    res.json({
      orders,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    console.error("❌ Get orders error:", error.message);
    res.status(500).json({ error: "Failed to retrieve orders" });
  }
};

/**
 * Get single order by ID
 */
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("❌ Get order error:", error.message);
    res.status(500).json({ error: "Failed to retrieve order" });
  }
};

/**
 * Update order status
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const order = await Order.findOneAndUpdate(
      { orderId },
      { status },
      { new: true },
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("❌ Update order error:", error.message);
    res.status(500).json({ error: "Failed to update order" });
  }
};

/**
 * Get order statistics
 */
export const getOrderStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$total" },
          averageOrderValue: { $avg: "$total" },
        },
      },
    ]);

    const statusCounts = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      overview: stats[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
      },
      statusCounts: statusCounts.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
    });
  } catch (error) {
    console.error("❌ Get stats error:", error.message);
    res.status(500).json({ error: "Failed to retrieve statistics" });
  }
};

export default {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStats,
};
