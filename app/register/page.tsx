"use client";

import { useState } from 'react';
import { AiOutlineMail, AiOutlineLock, AiOutlineUser, AiOutlineCamera, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FaPhone } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axiosInstance from '@/lib/axiosInstance';
import { useRouter } from 'next/navigation';

interface RegisterForm {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    avatar?: File;
}

const Register = () => {
    const router = useRouter();
    const [form, setForm] = useState<RegisterForm>({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        avatar: undefined,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        if (name === 'avatar' && files && files[0]) {
            const file = files[0];
            setForm({ ...form, avatar: file });

            // Create preview for avatar
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('email', form.email);
            formData.append('password', form.password);
            formData.append('firstName', form.firstName);
            formData.append('lastName', form.lastName);
            if (form.phone) formData.append('phone', form.phone);
            if (form.avatar) formData.append('avatar', form.avatar);

            const response = await axiosInstance.post('/users', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Register success:', response.data);
            router.push('/login'); // redirect ke login
        } catch (err: any) {
            console.error(err);
            setError(err?.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-4xl overflow-hidden"
            >
                <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">Buat Akun Baru</h2>
                <p className="text-center text-gray-600 mb-6">Daftar untuk mengakses semua fitur</p>

                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm"
                    >
                        {error}
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Avatar Section - Takes 1 column on large screens */}
                    <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Foto Profil</h3>
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-4 border-white shadow-md">
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                                ) : (
                                    <AiOutlineUser className="text-5xl text-gray-400" />
                                )}
                            </div>
                            <label htmlFor="avatar" className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 cursor-pointer hover:bg-blue-600 transition-colors shadow-md">
                                <AiOutlineCamera className="text-white text-lg" />
                                <input
                                    type="file"
                                    id="avatar"
                                    name="avatar"
                                    accept="image/*"
                                    onChange={handleChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        <p className="text-xs text-gray-500 text-center mt-4">Unggah foto profil Anda (opsional)</p>
                    </div>

                    {/* Form Fields Section - Takes 2 columns on large screens */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* First Name & Last Name in one row */}
                            <div className="flex space-x-4">
                                <div className="relative flex-1">
                                    <AiOutlineUser className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="Nama Depan"
                                        value={form.firstName}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <div className="relative flex-1">
                                    <AiOutlineUser className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Nama Belakang"
                                        value={form.lastName}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="relative">
                                <AiOutlineMail className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            {/* Phone */}
                            <div className="relative">
                                <FaPhone className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="Nomor Telepon (opsional)"
                                    value={form.phone}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            {/* Password with show/hide toggle */}
                            <div className="relative">
                                <AiOutlineLock className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                                </button>
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed mt-6"
                            >
                                {loading ? 'Mendaftar...' : 'Daftar'}
                            </motion.button>

                            <div className="text-center mt-4 text-sm text-gray-600">
                                Sudah punya akun? <a href="/login" className="text-blue-500 hover:underline">Masuk</a>
                            </div>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;