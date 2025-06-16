// import ExpertMap from './ExpertMap';
// import Header from './Header';
// import NavigationTabs from './NavigationTabs';
// import WhatIsIt from './WhatIsIt';
import { lazy, Suspense } from 'react';
import { useApiContext } from './contexts/ApiContext';
import { useCallback, useEffect, useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Loader } from './Loader';
import HostDetails from '../pages/HostDetails';
const Home = lazy(() => import('../pages/Home'));
const AdminPopover = lazy(() => import('./admin/AdminPopover'));
const ChannelPage = lazy(() => import('../pages/ChannelPage'));

const AppWrapper = () => {
  const { isOwner, data } = useApiContext();
  const [adminPanelOpen, setIsAdminPanelOpen] = useState(false);
  

  useEffect(() => {
    document.title = "Welcome to Podcast";
  }, []);
  const handleKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === ',') {
        if (isOwner) {
          console.log("is Owner");
          setIsAdminPanelOpen(!adminPanelOpen);
        }
      }
    },
    [adminPanelOpen, isOwner]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [handleKeydown]);

  return (
    <main>
      {/* <section>
        <Header
          backgroundImage='bg-header'
          title='Poly Technical Expert Program'
          description='To help our customers and partners to acquire and demonstrate technical competency on Poly solutions, Poly University offers a training and certification program that provides a flexible, modular approach to learning.'
        />
      </section>
      <section className='bg-backgroundGray'>
        <WhatIsIt />
        <ExpertMap />
      </section>
      <section>
        <NavigationTabs />
      </section> */}
      <HashRouter>
        <div className= 'max-w-[1920px]  mx-auto  '>
          <Routes>
            <Route path="/" element={<Suspense fallback={<Loader />}><Home /></Suspense>} />
            <Route path="/index.html" element={<Suspense fallback={<Loader />}><Home /></Suspense>} />
            <Route path="index.html" element={<Suspense fallback={<Loader />}><Home /></Suspense>} />
            <Route path="/channel" element={<Suspense fallback={<Loader />}><ChannelPage /></Suspense>} />
            <Route path="/host-details" element={<HostDetails />} />
          </Routes>
        </div>
      </HashRouter>


      <Suspense fallback={<Loader />}>
        <AdminPopover
          setIsAdminPanelOpen={setIsAdminPanelOpen}
          open={adminPanelOpen}
        /></Suspense>
    </main>
  );
};

export default AppWrapper;
