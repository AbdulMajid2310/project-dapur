'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePaymentMethods } from '@/lib/hooks/payment-method/usePaymentMentod';

type FilterType = 'BANK' | 'EWALLET' | 'QRIS';

type CardPaymentProps = {
    onSelectPayment: (paymentMethodId: string) => void;
};


const CardPayment = ({ onSelectPayment }: CardPaymentProps) => {

    const {
        allPaymentMethods,
        loadingAll,
        errorAll,
        getAllPaymentMethods,
    } = usePaymentMethods('');

    const [openSection, setOpenSection] = useState<FilterType | null>('BANK');
    const [selectedId, setSelectedId] = useState<string | null>(null);

    useEffect(() => {
        getAllPaymentMethods();
    }, []);

    const toggleSection = (type: FilterType) => {
        setOpenSection(openSection === type ? null : type);
    };

  const handleSelect = (id: string) => {
    setSelectedId(id);
    onSelectPayment(id);
};


    const bankPayments = allPaymentMethods.filter(p => p.type === 'BANK');
    const ewalletPayments = allPaymentMethods.filter(p => p.type === 'EWALLET');
    const qrisPayments = allPaymentMethods.filter(p => p.type === 'QRIS');

    if (loadingAll) {
        return (
            <div className="flex justify-center items-center h-40">
                <div className="animate-pulse text-gray-600">
                    Memuat metode pembayaran...
                </div>
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
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Metode Pembayaran
            </h2>

            <div className="space-y-4">
                <PaymentSection
                    title="Transfer Bank"
                    icon="🏦"
                    isOpen={openSection === 'BANK'}
                    onToggle={() => toggleSection('BANK')}
                >
                    <div className="p-2 bg-gray-50 flex flex-col gap-2">
                        {bankPayments.length === 0 ? (
                            <EmptyState text="Belum ada metode Transfer Bank." />
                        ) : (
                            bankPayments.map((item) => (
                                <SelectableCard
                                    key={item.paymentMethodId}
                                    selected={selectedId === item.paymentMethodId}
                                    onClick={() => handleSelect(item.paymentMethodId)}
                                >
                                    <div className='flex justify-between items-center'>

                                        <div className="flex justify-between items-center gap-2">
                                            
                                            <RadioIndicator
                                                checked={selectedId === item.paymentMethodId}
                                            />
                                            <div>
                                                <p className="text-xs text-gray-500">Bank</p>
                                                <p className="font-semibold text-gray-800">
                                                    {item.bankName}
                                                </p>
                                            </div>

                                        </div>

                                        <div className="mt-2">
                                            <p className="text-xs text-gray-500">No. Rekening</p>
                                            <p className="font-medium tracking-wide">
                                                {item.accountNumber}
                                            </p>
                                        </div>

                                        {item.description && (
                                            <p className="text-sm text-gray-600 ">
                                                {item.description}
                                            </p>
                                        )}
                                    </div>
                                </SelectableCard>
                            ))
                        )}
                    </div>
                </PaymentSection>

                <PaymentSection
                    title="E-Wallet"
                    icon="📱"
                    isOpen={openSection === 'EWALLET'}
                    onToggle={() => toggleSection('EWALLET')}
                >
                    <div className="p-4 bg-gray-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {ewalletPayments.length === 0 ? (
                            <EmptyState text="Belum ada metode E-Wallet." />
                        ) : (
                            ewalletPayments.map((item) => (
                                <SelectableCard
                                    key={item.paymentMethodId}
                                    selected={selectedId === item.paymentMethodId}
                                    onClick={() => handleSelect(item.paymentMethodId)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-xs text-gray-500">E-Wallet</p>
                                            <p className="font-semibold text-gray-800">
                                                {item.ewalletName}
                                            </p>
                                        </div>

                                        <RadioIndicator
                                            checked={selectedId === item.paymentMethodId}
                                        />
                                    </div>

                                    <div className="mt-2">
                                        <p className="text-xs text-gray-500">Akun</p>
                                        <p className="font-medium">{item.accountNumber}</p>
                                    </div>

                                    {item.description && (
                                        <p className="text-sm text-gray-600 mt-3 border-t pt-2">
                                            {item.description}
                                        </p>
                                    )}
                                </SelectableCard>
                            ))
                        )}
                    </div>
                </PaymentSection>

                <PaymentSection
                    title="QRIS"
                    icon="📷"
                    isOpen={openSection === 'QRIS'}
                    onToggle={() => toggleSection('QRIS')}
                >
                    <div className="p-4 bg-gray-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {qrisPayments.length === 0 ? (
                            <EmptyState text="Belum ada metode QRIS." />
                        ) : (
                            qrisPayments.map((item) => (
                                <SelectableCard
                                    key={item.paymentMethodId}
                                    selected={selectedId === item.paymentMethodId}
                                    onClick={() => handleSelect(item.paymentMethodId)}
                                    className="text-center"
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
                                                    width={160}
                                                    height={160}
                                                    className="rounded"
                                                    unoptimized
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <RadioIndicator
                                        checked={selectedId === item.paymentMethodId}
                                        center
                                    />

                                    {item.description && (
                                        <p className="text-sm text-gray-600 mt-2 border-t pt-2">
                                            {item.description}
                                        </p>
                                    )}
                                </SelectableCard>
                            ))
                        )}
                    </div>
                </PaymentSection>
            </div>
        </div>
    );
};

// ====== UI COMPONENTS ======

const PaymentSection = ({
    title,
    icon,
    isOpen,
    onToggle,
    children,
}: {
    title: string;
    icon: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}) => (
    <div className="border rounded-xl overflow-hidden shadow-sm bg-white">
        <button
            onClick={onToggle}
            className="w-full flex justify-between items-center px-4 py-3 hover:bg-gray-50 transition"
        >
            <span className="font-semibold text-gray-800">
                {icon} {title}
            </span>
            <span className="text-gray-600 transition-transform">
                {isOpen ? '▲' : '▼'}
            </span>
        </button>

        {isOpen && (
            <div className="transition-all duration-200 ease-in-out">
                {children}
            </div>
        )}
    </div>
);

const SelectableCard = ({
    children,
    selected,
    onClick,
    className = '',
}: {
    children: React.ReactNode;
    selected: boolean;
    onClick: () => void;
    className?: string;
}) => (
    <div
        onClick={onClick}
        className={`cursor-pointer border  rounded-xl p-2 bg-white shadow-sm 
        transition-all duration-150
        hover:shadow-md hover:border-blue-400
        ${selected ? 'border-blue-500 bg-blue-50' : ''}
        ${className}`}
    >
        {children}
    </div>
);

const RadioIndicator = ({
    checked,
    center = false,
}: {
    checked: boolean;
    center?: boolean;
}) => (
    <div
        className={`flex items-center ${center ? 'justify-end mt-2' : ''}`}
    >
        <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center 
            ${checked ? 'border-blue-600' : 'border-gray-300'}`}
        >
            {checked && (
                <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
            )}
        </div>

    </div>
);

const EmptyState = ({ text }: { text: string }) => (
    <p className="col-span-full text-gray-500 text-center py-4">
        {text}
    </p>
);

export default CardPayment;
