const Dashboard = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Owner Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500">Total Pegawai</h3>
          <p className="text-3xl font-bold">8</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500">Pendapatan Bulan Ini</h3>
          <p className="text-3xl font-bold">Rp 125M</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500">Rating</h3>
          <p className="text-3xl font-bold">4.8/5</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
