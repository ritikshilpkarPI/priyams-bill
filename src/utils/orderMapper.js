export const orderMapper = (orders) => {
    return orders.reduce((a, v) => ({ ...a, [v._id]: v}), {}) 
}