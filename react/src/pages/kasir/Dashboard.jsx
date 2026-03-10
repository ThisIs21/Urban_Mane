const Dashboard = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Kasir Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500">Total Transaksi Hari Ini</h3>
          <p className="text-3xl font-bold">12</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500">Total Pendapatan</h3>
          <p className="text-3xl font-bold">Rp 4.2M</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500">Permintaan Pending</h3>
          <p className="text-3xl font-bold">3</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
