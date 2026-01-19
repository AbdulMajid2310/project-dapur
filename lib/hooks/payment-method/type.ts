export type PaymentType = 'BANK' | 'EWALLET' | 'QRIS';
export type BankType = 'BCA' | 'MANDIRI' | 'BRI' | 'BNI' | 'OTHER';
export type EWalletType = 'OVO' | 'GOPAY' | 'DANA' | 'SHOPEEPAY' | 'OTHER';

export interface PaymentMethod {
  paymentMethodId: string;
  type: PaymentType;
  bankName?: BankType;
  ewalletName?: EWalletType;
  accountNumber?: string;
  description?: string;
  qrCode?: string;
  createdAt: string;
  updatedAt: string;
}
