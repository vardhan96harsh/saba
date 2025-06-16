/* eslint-disable @typescript-eslint/no-unused-vars */
import { useApiContext } from '../contexts/ApiContext';
import { Popover, PopoverContent } from '../utility/Popover';
import { Tab, TabPanels, TabPanel, TabGroup, TabList } from '@headlessui/react';
import TabListItem from './TabListItem';
// import TabPanel from './TabPanel';
import EditChannelComponent from './EditChannelComponent';
import EditPodcastComponent from './EditPodcastComponent';
import EditHostComponent from './EditHostComponent';
import FooterButtons from './FooterButtons';
import AdminPanelHeader from './AdminPanelHeader';
import Addplaylist from './Addplaylist';

interface AdminPopoverProps {
  open: boolean;
  setIsAdminPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminPopover = ({ open, setIsAdminPanelOpen }: AdminPopoverProps) => {
  const { data } = useApiContext();
  
  // Ensure data and channels are defined
  if (!data || !data.channels) {
    console.error('Data or channels are not defined', data);
    return null;
  }

  console.log('AdminPopover data:', data);

  const handleCloseAdminPanel = () => {
    setIsAdminPanelOpen(false);
  };

  return (
    <Popover open={open} modal fixed>
      <PopoverContent className='fixed left-0 top-0 flex h-full w-full items-start overflow-hidden  bg-black bg-opacity-10 py-8 backdrop-blur-md z-50'>
        <div className='relative mx-auto flex max-h-[600px] w-full max-w-[1000px] flex-col bg-white bg-opacity-90 shadow-2xl'>
          <AdminPanelHeader onClose={handleCloseAdminPanel} />

          <div className='flex h-[65vh] xl:h-[75vh] overflow-hidden border-b border-t border-black border-opacity-10'>
            <TabGroup className='flex w-full'>
              <TabList className='flex=col flex max-w-[190px] flex-col overflow-auto border-r border-black border-opacity-10'>
                <TabListItem label="Channel" />
                <TabListItem label="Podcast" />
                <TabListItem label="Guest" />
               
              </TabList>
              <TabPanels className='flex-1'>
                <TabPanel>
                  <EditChannelComponent data={data} />
                </TabPanel>
                <TabPanel className='h-full'>
                  {data.channels.length > 0 ? (
                    <EditPodcastComponent key={data.channels[0].name} />
                  ) : (
                    <div>No channels available</div>
                  )}
                </TabPanel>
                <TabPanel>
                  <EditHostComponent data={data} />
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </div>
          <FooterButtons data={data} />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AdminPopover;
