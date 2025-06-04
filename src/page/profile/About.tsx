import PostCreation from '@components/PostCreation';
import PostList from '@components/PostList';
import { useOutletContext } from 'react-router-dom';
type ProfileOutletContext = { userId: string; myProfile: boolean };

const About = () => {
  const { userId, myProfile } = useOutletContext<ProfileOutletContext>();
  return (
    <div className="mt-4">
      <div className=" flex flex-col md:flex-row gap-6">
        {/* Tab left  */}
        <div className="w-full sm:w-[40%] bg-light-100 flex flex-col gap-4 ">
          <div className="card">
            <h3 className="text-lg font-bold mb-2">Introduction</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
              nulla dolor, ornare at commodo non, feugiat non nisi. Phasellus
              faucibus mollis pharetra. Proin blandit ac massa sed rhoncus
            </p>
            {/* <p>
                      <LocationCity className="inline-block mr-1" />
                      Hà Nội City
                    </p> */}
          </div>
          <div className="card">
            <div className="flex justify-between items-center mb-3">
              {' '}
              <p className="text-lg font-bold mb-2">Ảnh</p>
              <p className="text-sm text-blue-600 mt-2 text-right cursor-pointer hover:underline">
                Xem tất cả ảnh
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <img
                src="/img/car.jpg"
                alt="Photo"
                className="w-full h-32 object-cover rounded-md"
              />
              <img
                src="/img/car.jpg"
                alt="Photo"
                className="w-full h-32 object-cover rounded-md"
              />
              <img
                src="/img/car.jpg"
                alt="Photo"
                className="w-full h-32 object-cover rounded-md"
              />
              <img
                src="/img/car.jpg"
                alt="Photo"
                className="w-full h-32 object-cover rounded-md"
              />
              <img
                src="/img/car.jpg"
                alt="Photo"
                className="w-full h-32 object-cover rounded-md"
              />
              <img
                src="/img/car.jpg"
                alt="Photo"
                className="w-full h-32 object-cover rounded-md"
              />
              <img
                src="/img/car.jpg"
                alt="Photo"
                className="w-full h-32 object-cover rounded-md"
              />
              <img
                src="/img/car.jpg"
                alt="Photo"
                className="w-full h-32 object-cover rounded-md"
              />
              <img
                src="/img/car.jpg"
                alt="Photo"
                className="w-full h-32 object-cover rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Sample posts */}
        <div className="flex-1">
          {myProfile && <PostCreation />}
          <PostList userId={userId} key={userId} />
        </div>
      </div>
    </div>
  );
};

export default About;
