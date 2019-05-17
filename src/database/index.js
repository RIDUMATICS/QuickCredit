import HelperUtils from '../utils/helperUtils';

const DB = {
  users: [
    {
      id: 1,
      firstName: 'Desmond',
      lastName: 'Edem',
      email: 'meetdesmond.edem@gmail.com',
      password: HelperUtils.hashPassword('secret'),
      address: '12 McNeil Street, Sabo-Yaba, Lagos',
      status: 'verified',
      isAdmin: true,
    },
  ],

  loans: [
    {
      id: 1,
      user: 'uchiha.obito@akatsuki.org',
      createdOn: Date(),
      status: 'approved',
      repaid: false,
      tenor: 3,
      amount: 20000.00,
      paymentInstallment: 7000,
      balance: 21000.0,
      interest: 1000,
    },
  ],

  repayments: [
    {
      id: 1,
      loanId: 1,
      createdOn: Date(Date.now()),
      amount: 20000,
      monthlyInstallments: 7000,
      paidAmount: 7000,
      balance: 14000,
    },
  ],
};

export default DB;
