const format = (transaction) => ({
  id: transaction.id,
  do_number: transaction.do_number,
  seller: transaction.seller_user.full_name,
  customer: transaction.customer,
  quantity: transaction.quantity,
  transaction_date: transaction.transaction_date,
  status: transaction.transaction_status.name,
  createdAt: transaction.createdAt,
  updatedAt: transaction.updatedAt,
});

module.exports = { format };