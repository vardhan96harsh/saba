import { useState } from 'react';

interface TextFieldProps<T> {
  label: string;
  value: string;
  disabled?:boolean;
  required?:boolean;
  propertyName: keyof T;
  onChange: (value: string, propertyName: keyof T) => void;
  height?: string;
}

const LabelComponent = ({ label,required=false }: { label: string,required?:boolean }) => (
  <label className='font-goodHeadlineMedium text-sm text-black text-opacity-50'>
    {label} {required&&<span className='text-red-600'>*</span>}
  </label>
);
const InputComponent = <T,>({
  label,
  onChange,
  propertyName,
  value,
  disabled,
  height,
}: TextFieldProps<T>) => {
  const [focused, setIsFocused] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(event.target.value, propertyName);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const isBioField = propertyName === 'profile' || propertyName === 'description'; 

  
   

  return isBioField ? (
    <textarea
      className={`relative w-full rounded-md bg-hpBlue bg-opacity-5 px-2 py-2 transition-colors hover:bg-hpBlue hover:bg-opacity-10 focus:outline-none ${
        focused ? 'cursor-text bg-opacity-10' : 'cursor-pointer'
      }`}
      placeholder={`Add ${label}...`}
      disabled={disabled ?? false}
      defaultValue={value}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      aria-label={label}
      style={{
        height: height,
        textAlign: 'start', // Ensure text starts from left
        whiteSpace: 'pre-wrap', // Allows for multi-line input
        wordWrap: 'break-word', // Handles word wrapping
        overflowY: 'auto', // Allows for scrolling if content overflows
        verticalAlign: 'top', // Align text to top
      }}
    />
  ) : (
    // For Other Fields
    <input
      className={`relative w-full rounded-md bg-hpBlue bg-opacity-5 px-2 py-2 transition-colors hover:bg-hpBlue hover:bg-opacity-10 focus:outline-none ${
        focused ? 'cursor-text bg-opacity-10' : 'cursor-pointer'
      }`}
      placeholder={`Add ${label}...`}
      disabled={disabled ?? false}
      defaultValue={value}
      type={typeof value === 'number' ? 'number' : 'text'}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      aria-label={label}
      style={{
        height: height,
        textAlign: 'start', // Ensure text starts from left
        whiteSpace: 'nowrap', // Single-line input
        overflow: 'hidden',
        verticalAlign: 'middle',
      }}
    />
  );
};


const TextField = <T,>({
  label,
  value,
  propertyName,
  onChange,
  disabled = false,
  required = false,
  height, // Accept height as a prop
}: TextFieldProps<T>) => {
  const getHeight = () => {
    if (propertyName === 'profile') {  // Check if the input is for "Bio"
      return '70px';  // Height for the Bio field
    }
    else if (propertyName === 'description'){
      return '100px'; 
    }
    return height || '40px'; // Default height for other fields
  };

  return (
    <div className='relative flex w-full flex-col gap-1'>
      <LabelComponent label={label} required={required} />
      <InputComponent
        label={label}
        disabled={disabled}
        propertyName={propertyName}
        value={value}
        onChange={onChange}
        height={getHeight()} // Set dynamic height
      />
    </div>
  );
};
export default TextField;




