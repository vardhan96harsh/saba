import { Host, VideoData } from '@/types/types';
import { useState, useRef } from 'react';
import { useApiContext } from '../contexts/ApiContext';
import { Button, TextField } from '../dataEntry';
import Note from '../Note';
import useImportHostData from '../hooks/useImportHostData'; // Adjust path if needed



interface EditHostComponentProps {} // or remove the prop altogether

const EditHostComponent = ({  }: EditHostComponentProps) => {
  const { hostData, setHostData } = useApiContext();
 

  const [host, setHost] = useState<Host>({});
  const [saved, setIsSaved] = useState(false);
  const [isEdit, handleIsEdit] = useState(false);
  const [toggle, handleToggle] = useState(false);
  const [index, handleIndex] = useState(-1);
  const [searchTerm, setSearchTerm] = useState('');
  const [emailError, setEmailError] = useState('');

  const tableRef = useRef<HTMLTableElement>(null);
  const { mutate: uploadHostData } = useImportHostData({
    onSuccess: () => {
      setIsSaved(true); // ✅ Only show success after real upload success
    },
    onError: () => {
      alert('❌ Upload failed. Please try again.');
    }
  });
  

  // const handleEdit = (index: number) => {
  //   setHost(data.hosts[index]);
  //   handleIsEdit(true);
  //   handleToggle(true);
  //   handleIndex(index);
  // };
  const handleEdit = (host: Host) => {
    setHost(host);
    handleIsEdit(true);
    handleToggle(true);
    handleIndex(hostData.findIndex(h => h.host_id === host.host_id)); // optional
  };
  

  const handleAddNew = () => {
    setHost({});
    handleIsEdit(false);
    handleIndex(-1);
    handleToggle(true);
  };

  const handleCancel = () => {
    handleToggle(!toggle);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this host?')) {
      const updatedHosts = hostData.filter((host) => host.host_id !== id);
      setHostData(updatedHosts);
      uploadHostData(updatedHosts);

    }
  };
  
  

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const isDuplicateHostId = (id: number): boolean =>
    hostData?.some((host) => host.host_id === id);
  
  const isDuplicateHostName = (name: string): boolean =>
    hostData?.some((host) => host.name?.toLowerCase() === name.toLowerCase());
  
  const isDuplicateEmail = (email: string): boolean =>
    hostData?.some((host) => host.email_id?.toLowerCase() === email.toLowerCase());
  

  return (
    <>
      {toggle ? (
        <Edit
          host={host}
          setHost={setHost}  
          index={index}
          isEdit={isEdit}
          handleCancel={handleCancel}
          validateEmail={validateEmail}
          setEmailError={setEmailError}
          emailError={emailError}
          isDuplicateHostId={isDuplicateHostId}
          isDuplicateHostName={isDuplicateHostName}
          isDuplicateEmail={isDuplicateEmail}
          uploadHostData={uploadHostData} 
        />
      ) : (
        <section className='p-2'>
          <section className="flex justify-between items-center mx-auto my-1">
            <button
              type="button"
              onClick={handleAddNew}
              className="bg-hpBlue text-white font-semibold text-sm rounded-sm py-2 px-10 ml-1 delay-150  hover:scale-110 transition-transform duration-300"
            >
              + Add New
            </button>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search Guest"
              className="bg-white border border-gray-300 rounded-md py-2 px-4"
            />
          </section>
          <section className='flex h-full flex-row overflow-hidden'>
            <div className='w-full md:max-h-[200px]  2xl:max-h-[300px] overflow-y-auto'>
              <table ref={tableRef} className="min-w-full  divide-y divide-gray-200 dark:divide-neutral-700">
                <thead className='bg-white'>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-start text-lg font-medium text-gray-500 uppercase dark:text-neutral-500">Name</th>
                    <th scope="col" className="px-6 py-3 text-center text-lg font-medium text-gray-500 uppercase dark:text-neutral-500">Email ID</th>
                    <th scope="col" className="px-10 py-3 text-end text-lg font-medium text-gray-500 uppercase dark:text-neutral-500">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-neutral-700  " >
                  {hostData && hostData
                    .filter(host => host.name?.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((host, index) => (
                      <tr key={host.host_id} className='hover:text-hpBlue hover:bg-gray-200 '>
                        <td className="px-6 py-3 whitespace-nowrap text-sm font-medium">{host.name}</td>
                        <td className="px-6 py-3 whitespace-nowrap text-center text-sm font-medium">{host.email_id}</td>
                        <td className="px-6 py-3 whitespace-nowrap text-end text-sm font-medium">
                          <button type="button" onClick={() => handleEdit(host)} className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400">Edit</button>|
                          <button type="button" onClick={() => handleDelete(host.host_id)} className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-red-600 hover:text-red-800 disabled:opacity-50 disabled:pointer-events-none dark:text-red-500 dark:hover:text-red-400">Delete</button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      )}
    </>
  );
};

interface EditProps {
  host: Host;
  setHost: React.Dispatch<React.SetStateAction<Host>>;
  index: number;
  isEdit: boolean;
  handleCancel: () => void;
  validateEmail: (email: string) => boolean;
  setEmailError: (error: string) => void;
  emailError: string;
  isDuplicateHostId: (id: number) => boolean;
  isDuplicateHostName: (name: string) => boolean;
  isDuplicateEmail: (email: string) => boolean;
  uploadHostData: (newHostData: Host[]) => void;  // <-- ADD THIS!
  
}

const categories = ["Core Team", "Computing", "Printing", "All"]; // Predefined categories

const Edit = ({ host,setHost, index, isEdit, handleCancel, validateEmail, setEmailError, emailError, isDuplicateHostId, isDuplicateHostName, isDuplicateEmail,uploadHostData  }: EditProps) => {
  const { hostData, setHostData } = useApiContext();

  const [saved, setIsSaved] = useState(false);
  const [hostIdError, setHostIdError] = useState('');
  const [hostNameError, setHostNameError] = useState('');
  const [profileError, setProfileError] = useState('');
  const [photoError, setPhotoError] = useState('');
  const [category, setcategory] = useState(null);
  

  const handleAdd = () => {
    let isValid = true;
  
    if (!host.name) {
      setHostNameError('Name is required');
      isValid = false;
    } else if (isDuplicateHostName(host.name) && !isEdit) {
      setHostNameError('Guest name already exists');
      isValid = false;
    } else {
      setHostNameError('');
    }
  
    if (!validateEmail(host.email_id || '')) {
      setEmailError('Invalid email format');
      isValid = false;
    }
    //  else if (isDuplicateEmail(host.email_id || '') && !isEdit) {
    //   setEmailError('Email ID already exists');
    //   isValid = false;
    // } 
    else {
      setEmailError('');
    }
  
    if (!isValid) return;

    if (!host.profile) {
      setProfileError('Profile is required');
      isValid = false;
    } else {
      setProfileError('');
    }

    if (!host.photo) {
      setPhotoError('Photo is required');
      isValid = false;
    } else {
      setPhotoError('');
    }

    if (!host.category) {
      setProfileError('Category is required');
      isValid = false;
    } else {
      setProfileError('');
    }

    if (!host.designation) {
      setProfileError('Designation is required');
      isValid = false;
    } else {
      setProfileError('');
    }
    if (!isValid) return;

    const updatedHosts = [...hostData];
    if (isEdit) {
      updatedHosts[index] = host;
    } else {
      const newHost = { ...host, host_id: Date.now() };
      updatedHosts.unshift(newHost);
    }
    setHostData(updatedHosts);
    
    uploadHostData(updatedHosts);

    setIsSaved(true);


   
   
    handleCancel();
  };

  const handleChange = async (value: any, propertyName: string) => {
    let updatedHost = { ...host };
    switch (propertyName) {
      case 'name':
        updatedHost.name = value;
        if (isDuplicateHostName(updatedHost.name)) {
          setHostNameError('Host name already exists');
        } else {
          setHostNameError('');
        }
        break;
      case 'email_id':
        updatedHost.email_id = value;
        if (validateEmail(value)) {
          setEmailError('');
        } else {
          setEmailError('Invalid email format');
        }
       
        break;
       case 'photo':
  const file = value.target.files[0];
  if (file.size > 200 * 1024) {
    setPhotoError('Image size should be less than 200 KB');
    return;
  } else {
    setPhotoError('');
    const base64Image = await toBase64(file);
    updatedHost.photo = base64Image;       // Save base64 image data
    updatedHost.photoName = file.name;      // Save file name here!
  }
  break;

        
      // case 'host_id':
      //   host.host_id = parseInt(value, 10);
      //   if (isDuplicateHostId(host.host_id)) {
      //     setHostIdError('Host ID already exists');
      //   } else {
      //     setHostIdError('');
      //   }
      //   break;
      case 'profile':
        updatedHost.profile = value;
        break;
      case 'category':  // Handle category input from the select dropdown
     updatedHost.category = value;
        setcategory(value);
        break;
      case 'designation':
       updatedHost.designation = value;
        break;

      default:
        break;
    }
    setHost( updatedHost );  // Re-render with the updated host state
  };

  const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

  return (
    <section className='flex h-full overflow-hidden'>
      <div className='flex-1 border-r py-2'>
        <fieldset className='flex h-full flex-col gap-4 overflow-auto max-h-96 px-4'>
          <div className='flex gap-2'>
            {/* <div className="flex-1 flex flex-col">
              <TextField
                required
                label='Guest ID'
                type='number'
                value={host.host_id?.toString() || ''}
                propertyName='host_id'
                onChange={handleChange}
              />
              {hostIdError && <p className="text-red-500 text-xs">{hostIdError}</p>}
            </div> */}
            <div className="flex-1 flex flex-col">
              <TextField
                required
                label='Name'
                value={host.name}
                propertyName='name'
                onChange={handleChange}
              />
              {hostNameError && <p className="text-red-500 text-xs">{hostNameError}</p>}
            </div>


            <div className='flex-1 flex flex-col'>
              <label className="block text-sm font-medium text-gray-700">Host Category</label>
              <select
                required
                value={host.category || ''}
                onChange={(e) => handleChange(e.target.value, 'category')}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="" disabled>Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {profileError && <p className="text-red-500 text-xs">{profileError}</p>}
            </div>
          </div>
          <div className='flex gap-4'>
            <div className='flex-1'>
              <TextField
                required
                label='Email ID'
                value={host.email_id}
                propertyName='email_id'
                onChange={handleChange}
                className='w-full'
              />
              {emailError && <p className="text-red-500 text-xs">{emailError}</p>}
            </div>

           
            <div className='flex-1'>
        <label className="block text-gray-400 w-full text-sm">
  <span>
    Host Photo (JPEG/PNG, minimum 300kb) <span className="text-red-500">*</span>
  </span>
  <input
    type="file"
    name="profile"
    accept="image/jpeg, image/png"
    onChange={(e) => handleChange(e, 'photo')}
    className="sr-only"  // visually hide the input but keep accessible
    id="file-upload"
  />
  <button
    type="button"
    onClick={() => document.getElementById('file-upload')?.click()}
    className="mt-1 block  py-1 px-4 text-sm  text-hpBlue  hover:bg-hpBlue hover:text-white border border-hpBlue"
  >
    Choose file
  </button>
  {/* {host.photoName && (
    <p className="text-sm text-gray-700 mt-1">Selected file: {host.photoName}</p>
  )} */}
   {host.photo && (
    <img
      src={host.photo}
      alt="Host Photo Preview"
      className="mt-2 w-16 h-16 object-cover rounded-md border border-gray-300"
    />
  )}
</label>

              {photoError && <p className="text-red-500 text-xs">{photoError}</p>}
            </div>
          </div>
          <div className='flex gap-2 w-full'>
            <div className=' flex-1'>
              <TextField
                required
                label='Bio'
                value={host.profile || ''}
                propertyName='profile'
                onChange={handleChange}
              />
              {profileError && <p className="text-red-500 text-xs">{profileError}</p>}
            </div>
            <div className="flex-1 ">

              <TextField
                required
                label='Designation'
                value={host.designation || ''}
                propertyName='designation'
                onChange={handleChange}
              />

            </div>

          </div>
          <div className='flex gap-2 text-lg'>
            <Button onClick={handleAdd}>Add</Button>
            <Button className='border-red-600 text-red-600 hover:bg-red-600 hover:text-whight-900' onClick={handleCancel}>Cancel</Button>
          </div>
          <div>
            {saved && <Note variant='success' duration={10000}>Data saved successfully on server.</Note>}
          </div>
        </fieldset>
      </div>
    </section>
  );
};

export default EditHostComponent;
