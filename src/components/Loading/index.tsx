import { motion } from 'framer-motion';

function Loading() {
  return (
    <div className="flex justify-center items-center min-h-28">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <div className="h-10 w-10 rounded-full border-4 border-[#246AA3] border-t-transparent" />
      </motion.div>
    </div>
  );
}

export default Loading;
