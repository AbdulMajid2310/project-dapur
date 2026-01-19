import { motion } from "framer-motion"
import { FaClock, FaCreditCard, FaQrcode, FaUtensils } from "react-icons/fa";


const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const orderStepsData = [
    {
      id: 1,
      title: "Pilih Menu",
      description: "Pilih menu favorit Anda dari aplikasi",
      icon: <FaUtensils className="text-2xl" />,
    },
    {
      id: 2,
      title: "Konfirmasi Pesanan",
      description: "Periksa kembali pesanan Anda sebelum checkout",
      icon: <FaQrcode className="text-2xl" />,
    },
    {
      id: 3,
      title: "Pembayaran",
      description: "Bayar dengan QRIS atau transfer bank",
      icon: <FaCreditCard className="text-2xl" />,
    },
    {
      id: 4,
      title: "Tunggu Pesanan",
      description: "Pesanan Anda akan selesai dalam 30-45 menit",
      icon: <FaClock className="text-2xl" />,
    },
  ];

export default function PaymentStep(){
    return(

       
          <motion.section
            id="how-to-order"
            className="py-20 px-4 rounded-3xl bg-[#9C633D]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
          >
            <div className="container mx-auto">
              <motion.div
                className="text-center max-w-2xl mx-auto mb-16"
                variants={itemVariants}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                  Cara Pemesanan Online
                </h2>
                <p className="text-orange-100 text-lg">
                  Ikuti langkah mudah untuk menikmati makanan favorit Anda
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {orderStepsData.map((step) => (
                  <motion.div
                    key={step.id}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl text-center"
                    variants={itemVariants}
                    whileHover={{ y: -10 }}
                  >
                    <div className="text-orange-300 text-4xl mb-4 flex justify-center">
                      {step.icon}
                    </div>
                    <div className="text-orange-200 font-bold mb-2">
                      Langkah {step.id}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-orange-50/80">{step.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
    )
}