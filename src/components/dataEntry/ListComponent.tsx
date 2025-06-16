import { Listbox } from '@headlessui/react';
import { Fragment } from 'react';

interface ListComponentProps<T> {
  label: string;
  value: string;
  options: string[];
  propertyName: keyof T;
  optionKey?: string;
  onChange: (value: string, propertyName: keyof T) => void;
}

const ListComponent = <T,>({
  label,
  value,
  options,
  propertyName,
  optionKey,
  onChange,
}: ListComponentProps<T>) => {
  const handleChange = (value: string) => {
    onChange(value, propertyName);
  };

  return (
    <Listbox
      value={value}
      onChange={handleChange}
      as='div'
      className='relative flex w-full flex-col gap-1'
    >
      <Listbox.Label className='font-goodHeadlineMedium text-sm text-black text-opacity-50'>
        {label}
      </Listbox.Label>
      <Listbox.Button
        className={`relative flex w-full items-center justify-between rounded-md bg-hpBlue bg-opacity-5 px-2 py-2 text-left transition-colors hover:bg-hpBlue hover:bg-opacity-10 focus:outline-none`}
      >
        <span>{value}</span>
        <span>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='16'
            height='16'
            fill='currentColor'
            viewBox='0 0 16 16'
            className='rotate-90'
          >
            <path
              fillRule='evenodd'
              d='M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z'
            />
          </svg>
        </span>
      </Listbox.Button>
      <Listbox.Options className='absolute top-full z-20 mt-1 max-h-60 w-full rounded-md bg-white text-base shadow-lg focus:outline-none sm:text-sm'>
        {options.map((option) => (
          <Listbox.Option
            key={option}
            value={option}
            as={Fragment}
          >
            {({ selected }) => (
              <li
                className={`cursor-pointer px-2 py-1 text-lg hover:bg-hpBlue hover:bg-opacity-5 ${selected ? 'text-hpBlue' : ''
                  }`}
              >
                {optionKey ? option[optionKey] : option}
              </li>
            )}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  );
};

export default ListComponent;
