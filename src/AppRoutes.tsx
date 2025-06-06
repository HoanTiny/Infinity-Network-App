/* eslint-disable @typescript-eslint/no-explicit-any */
import { Routes, Route, useLocation } from 'react-router-dom';
import routes from './route';
import PostDetail from '@components/PostDetail';

function renderRoutes(routesArr: any[]) {
  return routesArr.map((route, idx) => {
    if (route.children) {
      return (
        <Route key={idx} path={route.path} element={route.element}>
          {renderRoutes(route.children)}
        </Route>
      );
    }
    return (
      <Route
        key={idx}
        path={route.path}
        element={route.element}
        index={route.index}
      />
    );
  });
}

export default function AppRoutes() {
  const location = useLocation();
  const state = location.state as { background?: Location };

  return (
    <>
      <Routes location={state?.background || location}>
        {renderRoutes(routes)}
      </Routes>
      {state?.background && (
        <Routes>
          <Route path="/posts/:postId" element={<PostDetail />} />
        </Routes>
      )}
    </>
  );
}
