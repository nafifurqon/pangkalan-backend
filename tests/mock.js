/* eslint-disable camelcase */
const roles = [
  { id: 1, name: 'Agen' },
  { id: 2, name: 'Pangkalan' },
  { id: 3, name: 'UMKM' },
  { id: 4, name: 'Admin' },
];

const user = {
  email: 'test@email.com',
  password: 'pa$$wordTest8',
  full_name: 'Pangkalan Test Tambun Selatan',
  address: 'Tambun Selatan',
  role_id: roles[1].id,
};

const statuses = [
  { id: 1, name: 'Success' },
  { id: 2, name: 'Pending' },
  { id: 3, name: 'Failed' },
];

const transaction = {
  do_number: 'do1',
  seller: 1,
  customer: 'Pak RW',
  quantity: 5,
  status: statuses[1].id,
};

const another_transaction = {
  do_number: 'do2',
  seller: 1,
  customer: 'Warung Pak Budi',
  quantity: 10,
  status: statuses[1].id,
};

const expiresIn = '1d';

const loginUser = {
  email: 'test@email.com',
  password: 'pa$$wordTest8',
};

module.exports = {
  roles,
  user,
  transaction,
  statuses,
  another_transaction,
  expiresIn,
  loginUser,
};
