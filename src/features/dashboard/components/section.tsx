import { motion } from "framer-motion";

interface ISectionProps {
  title: string;
  children: React.ReactNode;
}

export const Section: React.FC<ISectionProps> = ({ title, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="font-bold text-xl text-gray-800 mb-6">{title}</h2>
      {children}
    </motion.div>
  );
};
