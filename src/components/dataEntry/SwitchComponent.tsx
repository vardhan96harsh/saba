import { Switch } from '@headlessui/react';

interface SwitchComponentProps<T> {
  label: string;
  enabled: boolean;
  propertyName: keyof T;
  onChange: (checked: boolean, propertyName: keyof T) => void;
}

const SwitchComponent = <T,>({
  label,
  enabled,
  propertyName,
  onChange,
}: SwitchComponentProps<T>) => {
  const handleChange = (checked: boolean) => {
    onChange(checked, propertyName);
  };

  return (
    <Switch.Group>
      <div
        className={`flex items-center rounded-full border p-2 transition-colors ${
          enabled
            ? 'border-lava border-opacity-50'
            : 'border-black border-opacity-10'
        }`}
      >
        <Switch.Label
          className={`mr-2 ${
            enabled ? 'text-lava' : 'text-black text-opacity-50'
          }`}
        >
          {label}
        </Switch.Label>
        <Switch
          checked={enabled}
          onChange={handleChange}
          className={`${
            enabled ? 'bg-lava' : 'bg-gray-200'
          } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
          <span
            className={`${
              enabled ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
          />
        </Switch>
      </div>
    </Switch.Group>
  );
};

export default SwitchComponent;
