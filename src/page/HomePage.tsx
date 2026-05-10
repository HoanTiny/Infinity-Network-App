import Feed from '@components/Feed';
import StoriesRow from '@components/Feed/StoriesRow';
import Sidebar from '@components/Sidebar.tsx';

function HomePage() {
  return (
    <div className="min-h-screen bg-ig-bg text-ig-text">
      <Sidebar />

      <main className="pl-[72px]">
        <div className="mx-auto w-full max-w-[615px] sm:py-6 flex flex-col items-center">
          <StoriesRow />
          <Feed />
        </div>
      </main>
    </div>
  );
}

export default HomePage;
