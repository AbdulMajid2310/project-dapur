'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePaymentMethods } from '@/lib/hooks/payment-method/usePaymentMentod';

type FilterType = 'BANK' | 'EWALLET' | 'QRIS';

const CardPayment = () => {
    const {
        allPaymentMethods,
        loadingAll,
        errorAll,
        getAllPaymentMethods,
    } = usePaymentMethods('');

    // default pertama terbuka = BANK
    const [openSection, setOpenSection] = useState<FilterType | null>('BANK');

    useEffect(() => {
        getAllPaymentMethods();
    }, []);

    const toggleSection = (type: FilterType) => {
        setOpenSection(openSection === type ? null : type);
    };

    const bankPayments = allPaymentMethods.filter(p => p.type === 'BANK');
    const ewalletPayments = allPaymentMethods.filter(p => p.type === 'EWALLET');
    const qrisPayments = allPaymentMethods.filter(p => p.type === 'QRIS');

    if (loadingAll) {
        return (
            <div className="flex justify-center items-center h-40">
                <p className="text-gray-600">Memuat payment methods...</p>
            </div>
        );
    }

    if (errorAll) {
        return (
            <div className="flex justify-center items-center h-40">
                <p className="text-red-500">{errorAll}</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto mt-6 px-4">
            <h2 className="text-xl font-bold mb-4">Metode Pembayaran</h2>

            <div className="space-y-3">
                {/* ====== BANK ====== */}
                <div className="border rounded-xl overflow-hidden">
                    <button
                        onClick={() => toggleSection('BANK')}
                        className="w-full flex justify-between items-center px-4 py-3 bg-white hover:bg-gray-50"
                    >
                        <span className="font-semibold">💳 Transfer Bank</span>
                        <span>{openSection === 'BANK' ? '▲' : '▼'}</span>
                    </button>

                    {openSection === 'BANK' && (
                        <div className="p-2 bg-gray-50 grid grid-cols-1  gap-4">
                            {bankPayments.length === 0 ? (
                                <p className="col-span-full text-gray-500">
                                    Belum ada metode Transfer Bank.
                                </p>
                            ) : (
                                bankPayments.map((item) => (
                                    <div
                                        key={item.paymentMethodId}
                                        className="border flex justify-between rounded-lg p-4 bg-white shadow-sm"
                                    >
                                        <div>

                                            <p className="text-xs text-gray-500">Bank</p>
                                            <p className="font-medium mb-2">{item.bankName}</p>
                                        </div>
                                        <div>

                                            <p className="text-xs text-gray-500">No. Rekening</p>
                                            <p className="font-medium">{item.accountNumber}</p>
                                        </div>

                                        {item.description && (
                                            <p className="text-sm text-gray-600 mt-2">
                                                {item.description}
                                            </p>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* ====== E-WALLET ====== */}
                <div className="border rounded-xl overflow-hidden">
                    <button
                        onClick={() => toggleSection('EWALLET')}
                        className="w-full flex justify-between items-center px-4 py-3 bg-white hover:bg-gray-50"
                    >
                        <span className="font-semibold">📱 E-Wallet</span>
                        <span>{openSection === 'EWALLET' ? '▲' : '▼'}</span>
                    </button>

                    {openSection === 'EWALLET' && (
                        <div className="p-4 bg-gray-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {ewalletPayments.length === 0 ? (
                                <p className="col-span-full text-gray-500">
                                    Belum ada metode E-Wallet.
                                </p>
                            ) : (
                                ewalletPayments.map((item) => (
                                    <div
                                        key={item.paymentMethodId}
                                        className="border rounded-lg p-4 bg-white shadow-sm"
                                    >
                                        <p className="text-xs text-gray-500">E-Wallet</p>
                                        <p className="font-medium mb-2">{item.ewalletName}</p>

                                        <p className="text-xs text-gray-500">Akun</p>
                                        <p className="font-medium">{item.accountNumber}</p>

                                        {item.description && (
                                            <p className="text-sm text-gray-600 mt-2 border-t pt-2">
                                                {item.description}
                                            </p>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* ====== QRIS ====== */}
                <div className="border rounded-xl overflow-hidden">
                    <button
                        onClick={() => toggleSection('QRIS')}
                        className="w-full flex justify-between items-center px-4 py-3 bg-white hover:bg-gray-50"
                    >
                        <span className="font-semibold">📷 QRIS</span>
                        <span>{openSection === 'QRIS' ? '▲' : '▼'}</span>
                    </button>

                    {openSection === 'QRIS' && (
                        <div className="p-4 bg-gray-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {qrisPayments.length === 0 ? (
                                <p className="col-span-full text-gray-500">
                                    Belum ada metode QRIS.
                                </p>
                            ) : (
                                qrisPayments.map((item) => (
                                    <div
                                        key={item.paymentMethodId}
                                        className="border rounded-lg p-4 bg-white shadow-sm text-center"
                                    >
                                        <p className="text-xs text-gray-500 mb-2">
                                            Scan QR untuk pembayaran
                                        </p>

                                        {item.qrCode && (
                                            <div className="flex justify-center mb-2">
                                                <div className="border p-2 rounded-lg bg-gray-50">
                                                    <Image
                                                        src={item.qrCode}
                                                        alt="QRIS"
                                                        width={180}
                                                        height={180}
                                                        className="rounded"
                                                        unoptimized={true}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {item.description && (
                                            <p className="text-sm text-gray-600 mt-2 border-t pt-2">
                                                {item.description}
                                            </p>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CardPayment;
