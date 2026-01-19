// FinancialReport.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMoneyBillWave,
  FaArrowUp,
  FaArrowDown,
  FaDollarSign,
  FaCheck,
  FaSearch,
  FaFilter,
  FaDownload,
  FaChevronLeft,
  FaChevronRight,
  FaFileExcel,
  FaFilePdf,
  FaFileCsv,
  FaChartLine,
} from "react-icons/fa";

// Type definitions
interface FinancialData {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  paymentMethod: string;
  status: "completed" | "pending" | "failed";
}

interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  pendingTransactions: number;
  completedTransactions: number;
  failedTransactions: number;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

// Initial data
const initialFinancialData: FinancialData[] = [
  {
    id: "TRX001",
    date: "2023-08-15",
    description: "Penjualan Makanan",
    category: "Food Sales",
    amount: 450000,
    type: "income",
    paymentMethod: "GoPay",
    status: "completed",
  },
  {
    id: "TRX002",
    date: "2023-08-15",
    description: "Penjualan Minuman",
    category: "Beverage Sales",
    amount: 120000,
    type: "income",
    paymentMethod: "OVO",
    status: "completed",
  },
  {
    id: "TRX003",
    date: "2023-08-14",
    description: "Pembelian Bahan Baku",
    category: "Ingredients",
    amount: 350000,
    type: "expense",
    paymentMethod: "Transfer",
    status: "completed",
  },
  {
    id: "TRX004",
    date: "2023-08-14",
    description: "Biaya Listrik",
    category: "Utilities",
    amount: 85000,
    type: "expense",
    paymentMethod: "Transfer",
    status: "completed",
  },
  {
    id: "TRX005",
    date: "2023-08-13",
    description: "Penjualan Catering",
    category: "Catering",
    amount: 1200000,
    type: "income",
    paymentMethod: "BCA",
    status: "completed",
  },
  {
    id: "TRX006",
    date: "2023-08-13",
    description: "Gaji Karyawan",
    category: "Salary",
    amount: 2500000,
    type: "expense",
    paymentMethod: "Transfer",
    status: "completed",
  },
  {
    id: "TRX007",
    date: "2023-08-12",
    description: "Penjualan Makanan",
    category: "Food Sales",
    amount: 380000,
    type: "income",
    paymentMethod: "Cash",
    status: "completed",
  },
  {
    id: "TRX008",
    date: "2023-08-12",
    description: "Biaya Sewa",
    category: "Rent",
    amount: 1500000,
    type: "expense",
    paymentMethod: "Transfer",
    status: "completed",
  },
  {
    id: "TRX009",
    date: "2023-08-11",
    description: "Penjualan Minuman",
    category: "Beverage Sales",
    amount: 95000,
    type: "income",
    paymentMethod: "DANA",
    status: "pending",
  },
  {
    id: "TRX010",
    date: "2023-08-11",
    description: "Biaya Marketing",
    category: "Marketing",
    amount: 300000,
    type: "expense",
    paymentMethod: "Transfer",
    status: "completed",
  },
];

const categories: CategoryData[] = [
  { name: "Food Sales", value: 45, color: "#FF6384" },
  { name: "Beverage Sales", value: 20, color: "#36A2EB" },
  { name: "Catering", value: 15, color: "#FFCE56" },
  { name: "Ingredients", value: 10, color: "#4BC0C0" },
  { name: "Utilities", value: 5, color: "#9966FF" },
  { name: "Salary", value: 10, color: "#FF9F40" },
  { name: "Rent", value: 20, color: "#C9CBCF" },
  { name: "Marketing", value: 5, color: "#7CFC00" },
];

const paymentMethods = [
  { name: "GoPay", value: 35, color: "#00AED9" },
  { name: "OVO", value: 25, color: "#EB0029" },
  { name: "DANA", value: 15, color: "#0080FF" },
  { name: "BCA", value: 15, color: "#0066B2" },
  { name: "Cash", value: 10, color: "#4CAF50" },
];

export default function FinancialReport() {
  const [financialData, setFinancialData] =
    useState<FinancialData[]>(initialFinancialData);
  const [filteredFinancialData, setFilteredFinancialData] =
    useState<FinancialData[]>(initialFinancialData);
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary>({
    totalIncome: 0,
    totalExpense: 0,
    netProfit: 0,
    pendingTransactions: 0,
    completedTransactions: 0,
    failedTransactions: 0,
  });
  const [dateRange, setDateRange] = useState({
    start: "2023-08-01",
    end: "2023-08-15",
  });
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Calculate financial summary
  useEffect(() => {
    const totalIncome = financialData
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + item.amount, 0);

    const totalExpense = financialData
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + item.amount, 0);

    const pendingTransactions = financialData.filter(
      (item) => item.status === "pending"
    ).length;
    const completedTransactions = financialData.filter(
      (item) => item.status === "completed"
    ).length;
    const failedTransactions = financialData.filter(
      (item) => item.status === "failed"
    ).length;

    setFinancialSummary({
      totalIncome,
      totalExpense,
      netProfit: totalIncome - totalExpense,
      pendingTransactions,
      completedTransactions,
      failedTransactions,
    });
  }, [financialData]);

  // Filter financial data
  useEffect(() => {
    let result = financialData;

    // Filter by date range
    if (dateRange.start && dateRange.end) {
      result = result.filter((item) => {
        const itemDate = new Date(item.date);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // Filter by type
    if (selectedType !== "all") {
      result = result.filter((item) => item.type === selectedType);
    }

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (item) =>
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredFinancialData(result);
    setCurrentPage(1);
  }, [financialData, dateRange, selectedCategory, selectedType, searchTerm]);

  // Handle date range change
  const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  // Handle type change
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
  };

  // Handle search change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFinancialItems = filteredFinancialData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalFinancialPages = Math.ceil(
    filteredFinancialData.length / itemsPerPage
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Prepare chart data
  const incomeData = financialData
    .filter((item) => item.type === "income")
    .reduce((acc: { [key: string]: number }, item) => {
      const date = item.date;
      acc[date] = (acc[date] || 0) + item.amount;
      return acc;
    }, {});

  const expenseData = financialData
    .filter((item) => item.type === "expense")
    .reduce((acc: { [key: string]: number }, item) => {
      const date = item.date;
      acc[date] = (acc[date] || 0) + item.amount;
      return acc;
    }, {});

  const dates = Object.keys({ ...incomeData, ...expenseData }).sort();

  const chartData: ChartData = {
    labels: dates,
    datasets: [
      {
        label: "Pendapatan",
        data: dates.map((date) => incomeData[date] || 0),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Pengeluaran",
        data: dates.map((date) => expenseData[date] || 0),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Laporan Keuangan</h2>

        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
          <div className="flex items-center space-x-2">
            <input
              type="date"
              name="start"
              value={dateRange.start}
              onChange={handleDateRangeChange}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <span>s/d</span>
            <input
              type="date"
              name="end"
              value={dateRange.end}
              onChange={handleDateRangeChange}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Cari transaksi..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <select
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="all">Semua Kategori</option>
            {Array.from(
              new Set(financialData.map((item) => item.category))
            ).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            value={selectedType}
            onChange={handleTypeChange}
          >
            <option value="all">Semua Tipe</option>
            <option value="income">Pendapatan</option>
            <option value="expense">Pengeluaran</option>
          </select>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-linear-to-r from-green-500 to-green-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Pendapatan</p>
              <p className="text-2xl font-bold">
                Rp {financialSummary.totalIncome.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-400 bg-opacity-30">
              <FaArrowUp className="text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-linear-to-r from-red-500 to-red-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Total Pengeluaran</p>
              <p className="text-2xl font-bold">
                Rp {financialSummary.totalExpense.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="p-3 rounded-full bg-red-400 bg-opacity-30">
              <FaArrowDown className="text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-linear-to-r from-blue-500 to-blue-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Laba Bersih</p>
              <p className="text-2xl font-bold">
                Rp {financialSummary.netProfit.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-400 bg-opacity-30">
              <FaDollarSign className="text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-linear-to-r from-purple-500 to-purple-600 rounded-xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Transaksi Selesai</p>
              <p className="text-2xl font-bold">
                {financialSummary.completedTransactions}
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-400 bg-opacity-30">
              <FaCheck className="text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">
              Grafik Pendapatan vs Pengeluaran
            </h3>
            <div className="flex space-x-2">
              <button className="text-gray-500 hover:text-gray-700 p-2">
                <FaFilter />
              </button>
              <button className="text-gray-500 hover:text-gray-700 p-2">
                <FaDownload />
              </button>
            </div>
          </div>

          <div className="h-64 flex items-end space-x-2">
            {chartData.labels.map((label, index) => {
              const income = chartData.datasets[0].data[index];
              const expense = chartData.datasets[1].data[index];
              const maxValue = Math.max(
                ...chartData.datasets[0].data,
                ...chartData.datasets[1].data
              );

              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center"
                >
                  <div className="text-xs text-gray-500 mb-1">
                    {label.split("-")[2]}
                  </div>
                  <div className="flex items-end justify-center space-x-1 w-full">
                    <div
                      className="w-1/2 bg-green-400 rounded-t"
                      style={{ height: `${(income / maxValue) * 100}%` }}
                    ></div>
                    <div
                      className="w-1/2 bg-red-400 rounded-t"
                      style={{ height: `${(expense / maxValue) * 100}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center mt-4 space-x-6">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-400 rounded mr-2"></div>
              <span className="text-sm">Pendapatan</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-400 rounded mr-2"></div>
              <span className="text-sm">Pengeluaran</span>
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">
              Distribusi Kategori
            </h3>
            <div className="flex space-x-2">
              <button className="text-gray-500 hover:text-gray-700 p-2">
                <FaFilter />
              </button>
              <button className="text-gray-500 hover:text-gray-700 p-2">
                <FaDownload />
              </button>
            </div>
          </div>

          <div className="h-64 flex items-center justify-center">
            <div className="relative w-48 h-48 rounded-full overflow-hidden">
              {categories.map((category, index) => {
                const total = categories.reduce(
                  (sum, cat) => sum + cat.value,
                  0
                );
                const percentage = (category.value / total) * 100;
                const rotation = categories
                  .slice(0, index)
                  .reduce((sum, cat) => sum + (cat.value / total) * 360, 0);

                return (
                  <div
                    key={index}
                    className="absolute top-0 left-0 w-full h-full"
                    style={{
                      clipPath: `conic-linear(transparent ${rotation}deg, ${
                        category.color
                      } ${rotation}deg ${
                        rotation + percentage
                      }deg, transparent ${rotation + percentage}deg)`,
                    }}
                  ></div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            {categories.map((category, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: category.color }}
                ></div>
                <span className="text-sm">{category.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Methods Chart */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            Metode Pembayaran
          </h3>
          <div className="flex space-x-2">
            <button className="text-gray-500 hover:text-gray-700 p-2">
              <FaFilter />
            </button>
            <button className="text-gray-500 hover:text-gray-700 p-2">
              <FaDownload />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {paymentMethods.map((method, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{method.name}</span>
                <span className="text-sm font-medium">{method.value}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full"
                  style={{
                    width: `${method.value}%`,
                    backgroundColor: method.color,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            Riwayat Transaksi
          </h3>
          <div className="flex space-x-2">
            <button className="text-gray-500 hover:text-gray-700 p-2">
              <FaFilter />
            </button>
            <div className="relative group">
              <button className="text-gray-500 hover:text-gray-700 p-2">
                <FaDownload />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <FaFileExcel className="mr-2 text-green-500" /> Export Excel
                </button>
                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <FaFilePdf className="mr-2 text-red-500" /> Export PDF
                </button>
                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <FaFileCsv className="mr-2 text-blue-500" /> Export CSV
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deskripsi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Metode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {currentFinancialItems.map((transaction) => (
                  <motion.tr
                    key={transaction.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.category}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}Rp{" "}
                      {transaction.amount.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : transaction.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.status === "completed"
                          ? "Selesai"
                          : transaction.status === "pending"
                          ? "Pending"
                          : "Gagal"}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalFinancialPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() =>
                  paginate(currentPage > 1 ? currentPage - 1 : 1)
                }
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  paginate(
                    currentPage < totalFinancialPages
                      ? currentPage + 1
                      : totalFinancialPages
                  )
                }
                disabled={currentPage === totalFinancialPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">{indexOfFirstItem + 1}</span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredFinancialData.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">
                    {filteredFinancialData.length}
                  </span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() =>
                      paginate(currentPage > 1 ? currentPage - 1 : 1)
                    }
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Previous</span>
                    <FaChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  {Array.from(
                    { length: totalFinancialPages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => paginate(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === page
                          ? "z-10 bg-orange-50 border-orange-500 text-orange-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      paginate(
                        currentPage < totalFinancialPages
                          ? currentPage + 1
                          : totalFinancialPages
                      )
                    }
                    disabled={currentPage === totalFinancialPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Next</span>
                    <FaChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}