import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import { motion } from 'framer-motion';

function RootLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Instagram-style gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-pink-500 via-orange-400 to-cyan-500" />

      {/* Ambient blobs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-purple-500/35 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-orange-400/35 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-pink-400/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-56 h-56 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

      <Suspense>
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-[420px] mx-auto px-4 py-8"
        >
          {/* Fully opaque white card — no gradient bleed-through */}
          <div className="rounded-3xl p-8 md:p-10 flex flex-col gap-6 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
            {/* Logo */}
            <div className="flex justify-center pt-1">
              <img
                src="/img/Logo2.svg"
                alt="Logo"
                className="h-9 w-auto object-contain"
              />
            </div>

            <Outlet />
          </div>
        </motion.div>
      </Suspense>
    </div>
  );
}

export default RootLayout;
