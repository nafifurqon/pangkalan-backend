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

const transaction = {
  do_number: 'do1',
  seller: 1,
  customer: 'Pak RW',
  quantity: 5,
  status: 2,
};

const statuses = [
  { id: 1, name: 'Success' },
  { id: 2, name: 'Pending' },
  { id: 3, name: 'Failed' },
];

module.exports = {
  roles,
  user,
  transaction,
  statuses,
};
