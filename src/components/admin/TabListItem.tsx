import { Fragment } from 'react';
import { Tab } from '@headlessui/react';

interface TabListItemProps {
  label: string;
}

const TabListItem = ({ label }: TabListItemProps) => (
  <Tab as={Fragment}>
    {({ selected }) => (
      <button
        className={`relative px-4 py-2 text-left font-goodHeadlineMedium text-lg leading-6 text-black text-opacity-70 transition-colors after:absolute after:left-0 after:top-0 after:h-full after:w-[2px] after:bg-hpBlue  after:transition-colors after:content-[""] hover:text-hpbg-hpBlue hover:text-opacity-80 ${
          selected
            ? 'bg-hpBlue bg-opacity-5 text-hpBlue text-opacity-100 after:bg-opacity-100 '
            : 'after:bg-opacity-0'
        }`}
      >
        {label}
      </button>
    )}
  </Tab>
);

export default TabListItem;
