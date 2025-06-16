import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useState } from 'react';
import HeadsetIcon from './icons/HeadsetIcon';
import VoiceIcon from './icons/VoiceIcon';
import VideoIcon from './icons/VideoIcon';
import InfrastructureIcon from './icons/InfrastructureIcon';
import Headset from '@/pages/Headset';
import Voice from '@/pages/Voice';
import Video from '@/pages/Video';
import Infrastructure from '@/pages/Infrastructure';

const navigationButtons = [
  {
    id: 0,
    title: 'headset',
    icon: <HeadsetIcon />,
  },
  {
    id: 1,
    title: 'voice',
    icon: <VoiceIcon />,
  },
  {
    id: 2,
    title: 'video',
    icon: <VideoIcon />,
  },
  {
    id: 3,
    title: 'infrastructure',
    icon: <InfrastructureIcon />,
  },
];

const NavigationTabs = () => {
  const [active, setActive] = useState(0);

  const handleSelect = (index: number, lastIndex: number) => {
    if (index !== lastIndex) {
      setActive(index);
    }
  };

  return (
    <Tabs
      selectedTabClassName='nav-selected'
      onSelect={handleSelect}
      selectedIndex={active}
    >
      <TabList className='grid grid-cols-4'>
        {navigationButtons.map((btn, index) => (
          <Tab
            key={btn.id}
            className={`${
              active === index
                ? 'text-hpBlue hover:bg-navigationHoverActive'
                : 'text-[#666] hover:bg-navigationHover'
            } flex cursor-pointer flex-col  items-center py-8 transition-colors focus:border-0 focus:outline-0`}
          >
            {btn.icon}
            <p className='mt-4 text-xl uppercase'>{btn.title}</p>
          </Tab>
        ))}
      </TabList>

      <TabPanel>
        <Headset />
      </TabPanel>
      <TabPanel>
        <Voice />
      </TabPanel>
      <TabPanel>
        <Video />
      </TabPanel>
      <TabPanel>
        <Infrastructure />
      </TabPanel>
    </Tabs>
  );
};

export default NavigationTabs;
