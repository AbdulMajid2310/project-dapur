// UserList.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUsers,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaTimes,
  FaSave,
} from "react-icons/fa";

// Type definitions
interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  joinDate: string;
}

// Initial data
const initialCustomers: Customer[] = [
  {
    id: 1,
    name: "Budi Santoso",
    email: "budi@example.com",
    phone: "081234567890",
    address: "Jl. Sudirman No. 45, Jakarta Selatan",
    totalOrders: 12,
    joinDate: "2023-01-15",
  },
  {
    id: 2,
    name: "Siti Nurhaliza",
    email: "siti@example.com",
    phone: "081234567891",
    address: "Jl. Thamrin No. 12, Jakarta Pusat",
    totalOrders: 8,
    joinDate: "2023-02-20",
  },
  {
    id: 3,
    name: "Ahmad Fauzi",
    email: "ahmad@example.com",
    phone: "081234567892",
    address: "Jl. Gatot Subroto No. 30, Jakarta Selatan",
    totalOrders: 15,
    joinDate: "2023-01-10",
  },
  {
    id: 4,
    name: "Dewi Lestari",
    email: "dewi@example.com",
    phone: "081234567893",
    address: "Jl. Rasuna Said No. 5, Jakarta Selatan",
    totalOrders: 6,
    joinDate: "2023-03-05",
  },
  {
    id: 5,
    name: "Rudi Hermawan",
    email: "rudi@example.com",
    phone: "081234567894",
    address: "Jl. MH Thamrin No. 20, Jakarta Pusat",
    totalOrders: 10,
    joinDate: "2023-02-15",
  },
];

export default function UserList() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(initialCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Filter customers
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.phone.includes(searchTerm)
      );
      setFilteredCustomers(filtered);
    }
  }, [searchTerm, customers]);

  // Customer CRUD functions
  const openAddCustomerModal = () => {
    setSelectedCustomer({
      id: customers.length + 1,
      name: "",
      email: "",
      phone: "",
      address: "",
      totalOrders: 0,
      joinDate: new Date().toISOString().split("T")[0],
    });
    setIsCustomerModalOpen(true);
  };

  const openEditCustomerModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsCustomerModalOpen(true);
  };

  const handleCustomerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSelectedCustomer((prev) => {
      if (!prev) return null;
      return { ...prev, [name]: value };
    });
  };

  const saveCustomer = () => {
    if (!selectedCustomer) return;

    if (selectedCustomer.id > customers.length) {
      // Add new customer
      setCustomers([...customers, selectedCustomer]);
    } else {
      // Update existing customer
      setCustomers(
        customers.map((customer) =>
          customer.id === selectedCustomer.id ? selectedCustomer : customer
        )
      );
    }
    setIsCustomerModalOpen(false);
    alert("Pelanggan berhasil disimpan!");
  };

  const deleteCustomer = (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pelanggan ini?")) {
      setCustomers(customers.filter((customer) => customer.id !== id));
      alert("Pelanggan berhasil dihapus!");
    }
  };

  // Handle search change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Render customer modal
  const renderCustomerModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800">
              {selectedCustomer && selectedCustomer.id > customers.length
                ? "Tambah Pelanggan"
                : "Edit Pelanggan"}
            </h3>
            <button
              onClick={() => setIsCustomerModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="name"
              value={selectedCustomer?.name || ""}
              onChange={handleCustomerChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={selectedCustomer?.email || ""}
              onChange={handleCustomerChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telepon
            </label>
            <input
              type="text"
              name="phone"
              value={selectedCustomer?.phone || ""}
              onChange={handleCustomerChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alamat
            </label>
            <textarea
              name="address"
              value={selectedCustomer?.address || ""}
              onChange={handleCustomerChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Pesanan
              </label>
              <input
                type="number"
                name="totalOrders"
                value={selectedCustomer?.totalOrders || 0}
                onChange={handleCustomerChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Bergabung
              </label>
              <input
                type="date"
                name="joinDate"
                value={selectedCustomer?.joinDate || ""}
                onChange={handleCustomerChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={() => setIsCustomerModalOpen(false)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg mr-3"
          >
            Batal
          </button>
          <button
            onClick={saveCustomer}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Kelola Pelanggan</h2>

        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari pelanggan..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <button
            onClick={openAddCustomerModal}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FaPlus className="mr-2" /> Tambah Pelanggan
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Telepon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Pesanan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Bergabung
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {filteredCustomers.map((customer) => (
                  <motion.tr
                    key={customer.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {customer.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {customer.address.substring(0, 30)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {customer.totalOrders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.joinDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openEditCustomerModal(customer)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteCustomer(customer.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Modal */}
      {isCustomerModalOpen && renderCustomerModal()}
    </div>
  );
}