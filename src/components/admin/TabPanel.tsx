import { Fragment, ReactNode } from 'react';
import { Tab } from '@headlessui/react';


interface TabPanelProps {
  children: ReactNode;
}

const TabPanel = ({ children }: TabPanelProps) => (
  <Tab.Panel as={Fragment}>{children}</Tab.Panel>
);

export default TabPanel;
