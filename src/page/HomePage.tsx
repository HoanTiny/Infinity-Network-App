import Feed from '@components/Feed';
import StoriesRow from '@components/Feed/StoriesRow';
import Sidebar from '@components/Sidebar.tsx';

function HomePage() {
  return (
    <div className="min-h-screen bg-ig-bg text-ig-text">
      <Sidebar />

      <main className="pl-[72px]">
        <div className="mx-auto w-full max-w-[470px] sm:py-6">
          <StoriesRow />
          <Feed />
        </div>
      </main>
    </div>
  );
}

export default HomePage;
