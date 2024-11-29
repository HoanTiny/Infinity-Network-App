import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
// Supports weights 100-900
import '@fontsource-variable/public-sans';

function RootLayout() {
  return (
    <div>
      <Suspense>
        <div className="w-full flex items-center justify-center h-screen bg-[#F8F7FA] p-6">
          <div className="absolute lg:top-[3%] lg:left-[33%] top-0 left-6">
            <img src="/img/top-shape.svg" alt="" />
          </div>
          <div className="absolute lg:bottom-[3%] lg:right-[33%] bottom-0 right-6">
            <img src="/img/bottom-shape.svg" alt="" />
          </div>
          <div className="p-8 bg-white rounded-xl flex flex-col gap-6 w-[450px] items-center shadow-3xl z-10">
            <div>
              <img src="/img/Logo2.svg" alt="Logo" />
            </div>
            <Outlet />

            <div>or</div>
            <div className="flex gap-4">
              <div className="cursor-pointer">
                <img src="/img/Facebook.png" alt="Facebook" />
              </div>
              <div className="cursor-pointer">
                <img src="/img/Google.svg" alt="Google" />
              </div>
              <div className="cursor-pointer">
                <img src="/img/Twitter.svg" alt="Twitter" />
              </div>
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
}

export default RootLayout;
