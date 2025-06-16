import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useApiContext } from '../contexts/ApiContext';
import { Button, TextField } from '../dataEntry';
import useImportCommentData from '../hooks/useImportCommentData';
import useImportRatingData from '../hooks/useImportRatingData';
import useImportData from '../hooks/useImportData';
import useImportSubData from '../hooks/useImportSubData';
import { Channel, VideoData } from '@/types/types';

interface EditChannelComponentProps {
  data: VideoData;
  onAction: () => void;
}

const EditChannelComponent = ({ data, onAction }: EditChannelComponentProps) => {
  const { setData, subData, setSubData, commentData, setCommentData, ratingData, setRatingData } = useApiContext();
  const [channel, setChannel] = useState<Channel>({});
  const [isEdit, setIsEdit] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [index, setIndex] = useState(-1);
  const [searchTerm, setSearchTerm] = useState('');
  const { mutateAsync: mutateAsyncComments } = useImportCommentData();
  const { mutateAsync: mutateAsyncRatings } = useImportRatingData();
  const { mutateAsync } = useImportData();
  const { mutateAsync: mutateAsyncSubData } = useImportSubData();

  // Handle editing of a channel
  const handleEdit = (index: number) => {
    setChannel(data.channels[index]);
    setIsEdit(true);
    setToggle(true);
    setIndex(index);
  };

  // Handle adding a new channel
  const handleAddNew = () => {
    setChannel({});
    setIsEdit(false);
    setIndex(-1);
    setToggle(true);
  };

  // Cancel action for editing
  const handleCancel = () => {
    setToggle(false);
    setIsEditingSubcategory(null); // Reset the subcategory edit state
  };

  // Handle deleting a channel and associated data
  const handleDelete = async (index: number) => {
    if (window.confirm("Are you sure you want to delete this channel? This will also delete all associated podcasts, comments, ratings, and subscriptions.")) {
      const channelId = data.channels[index].id;

      const podcastsToDelete = data.podcasts.filter(podcast => podcast.channel_id === channelId);

      const updatedData = { ...data };
      updatedData.channels.splice(index, 1);
      updatedData.podcasts = updatedData.podcasts.filter(podcast => podcast.channel_id !== channelId);

      const updatedCommentData = { ...commentData };
      const updatedRatingData = { ...ratingData };
      podcastsToDelete.forEach(podcast => {
        delete updatedCommentData[podcast.id];
        delete updatedRatingData[podcast.id];
      });

      const updatedSubData = { ...subData };
      delete updatedSubData[channelId];

      setData(updatedData);
      setCommentData(updatedCommentData);
      setRatingData(updatedRatingData);
      setSubData(updatedSubData);

      try {
        await mutateAsyncComments({ podcasts: podcastsToDelete });
        await mutateAsyncRatings({ podcasts: podcastsToDelete });
        await mutateAsync(updatedData);
        await mutateAsyncSubData({ channelId });

        alert('Channel and all associated data have been successfully deleted.');
        onAction();
      } catch (error) {
        console.error('Failed to delete channel data from the server:', error);
        alert('An error occurred while deleting the channel data.');
      }
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
  };




  return (
    <>
      {toggle ? (
        <Edit channel={channel} index={index} isEdit={isEdit} handleCancel={handleCancel} onAction={onAction} />
      ) : (
        <section className='p-2'>
          <section className="flex justify-between items-center mx-auto mb-1">
            <button
              type="button"
              onClick={handleAddNew}
              className="bg-hpBlue text-white font-semibold text-sm rounded-sm py-2 px-10 ml-1 delay-150 tracking-widest hover:scale-110 transition-transform duration-300"
            >
              + Add New Channel
            </button>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search Channel"
              className="bg-white border border-gray-300 rounded-md py-2 px-4 tracking-wider"
            />
          </section>
          <section className='flex h-full flex-row overflow-hidden'>
            <div className='w-full h-96 overflow-y-auto'>
              <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                <thead className='bg-white'>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-start text-lg font-medium text-gray-500 uppercase dark:text-neutral-500 tracking-wider">Name</th>
                    <th scope="col" className="px-9 py-3 text-end text-lg font-medium text-gray-500 uppercase dark:text-neutral-500 tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                  {data.channels
                    .filter(channel => channel.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((channel, index) => (
                      <tr key={index} className='hover:text-hpBlue hover:bg-gray-200'>
                        <td className="px-6 py-2 whitespace-nowrap text-sm font-medium tracking-wider">{channel.name}</td>
                        <td className="px-6 py-2 whitespace-nowrap text-end text-sm font-medium tracking-wider">
                          <button type="button" onClick={() => handleEdit(index)} className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 tracking-wider">Edit</button>|
                          <button type="button" onClick={() => handleDelete(index)} className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-red-600 hover:text-red-800 disabled:opacity-50 disabled:pointer-events-none dark:text-red-500 dark:hover:text-red-400 tracking-wider">Delete</button>
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
  channel: Channel;
  index: number;
  isEdit: boolean;
  handleCancel: () => void;
  onAction: () => void;
}

const Edit = ({ channel, index, isEdit, handleCancel, onAction }: EditProps) => {
  const { data, setData, mutateAsync } = useApiContext(); // Ensure mutateAsync is available for server sync
  const [saved, setIsSaved] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [duplicateError, setDuplicateError] = useState(false);
  const [localChannel, setLocalChannel] = useState(channel);
  const [newSubcategory, setNewSubcategory] = useState(''); // For adding subcategories
  const [isEditingSubcategory, setIsEditingSubcategory] = useState<number | null>(null); // Track subcategory editing index
  const [editedSubcategory, setEditedSubcategory] = useState(''); // Store edited subcategory value
  const [editedSubcategoryImage, setEditedSubcategoryImage] = useState<File | null>(null);
  const [newSubcategoryImage, setNewSubcategoryImage] = useState<File | null>(null);



  const handleSubcategoryImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageBase64 = reader.result as string;
        const updatedSubcategories = [...(localChannel.subcategories || [])];
        updatedSubcategories[index] = {
          ...updatedSubcategories[index],
          image: imageBase64, // Store the base64 image
        };
        setLocalChannel({ ...localChannel, subcategories: updatedSubcategories });
      };
      reader.readAsDataURL(file);
    }
  };




  // Add subcategory to the local channel and sync with server
  const handleAddSubcategory = async () => {
    if (newSubcategory.trim() === '') return;
    if (!newSubcategoryImage) {
      alert('Please upload an image for the playlist.');
      return; // ⛔ Prevents further execution
    }


    let base64Image = '';
    if (newSubcategoryImage) {
      // Convert the image file to Base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        base64Image = reader.result as string;

        const newSubcategoryData = {
          name: newSubcategory,
          image: base64Image, // Base64 string for image
        };

        const updatedChannel = {
          ...localChannel,
          subcategories: [...(localChannel.subcategories || []), newSubcategoryData],
        };

        setLocalChannel(updatedChannel);
        setNewSubcategory('');
        setNewSubcategoryImage(null);

        // Sync updated data to server
        const updatedData = { ...data };
        updatedData.channels[index] = updatedChannel;
        setData(updatedData);

        try {
          await mutateAsync(updatedData); // Server sync
          alert('Subcategory added successfully.');
        } catch (error) {
          console.error('Failed to save subcategory:', error);
        }
      };

      reader.readAsDataURL(newSubcategoryImage); // Convert to Base64
    } else {
      // If no image is uploaded
      const newSubcategoryData = { name: newSubcategory, image: '' };
      const updatedChannel = {
        ...localChannel,
        subcategories: [...(localChannel.subcategories || []), newSubcategoryData],
      };

      setLocalChannel(updatedChannel);
      setNewSubcategory('');
      setNewSubcategoryImage(null);

      const updatedData = { ...data };
      updatedData.channels[index] = updatedChannel;
      setData(updatedData);

      try {
        await mutateAsync(updatedData);
        alert('Subcategory added successfully.');
      } catch (error) {
        console.error('Failed to save subcategory:', error);
      }
    }
  };


  // Remove a subcategory by index and sync with server
  const handleRemoveSubcategory = async (subcategoryIndex: number) => {
    const deletedSubcategory = localChannel.subcategories[subcategoryIndex];
    const updatedSubcategories = localChannel.subcategories?.filter((_, i) => i !== subcategoryIndex);
    setLocalChannel((prevChannel) => ({
      ...prevChannel,
      subcategories: updatedSubcategories,
    }));

    // Update podcasts to remove the deleted subcategory
    const updatedPodcasts = data.podcasts.map((podcast) => {
      if (podcast.channel_id === localChannel.id) {
        return {
          ...podcast,
          subcategories: podcast.subcategories?.filter(
            (sub) => sub !== deletedSubcategory
          ),
        };
      }
      return podcast;
    });

    setData({ ...data, podcasts: updatedPodcasts });

    try {
      await mutateAsync({ ...data, podcasts: updatedPodcasts });
      alert('Subcategory removed and associated podcasts updated successfully.');
    } catch (error) {
      console.error('Error updating subcategories and podcasts:', error);
    }
  };

  // Edit a subcategory
  const handleEditSubcategory = (subcategoryIndex: number) => {
    setIsEditingSubcategory(subcategoryIndex); // Correctly set the editing index
    setEditedSubcategory(localChannel.subcategories![subcategoryIndex].name);
    setEditedSubcategoryImage(null); // Reset image state
  };


  

  const handleSaveEditedSubcategory = async () => {
    if (!editedSubcategory.trim()) {
      alert('Subcategory name cannot be empty.');
      return;
    }

    const updatedSubcategories = [...(localChannel.subcategories || [])];

    // If an image is provided, update it
    if (editedSubcategoryImage) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;

        updatedSubcategories[isEditingSubcategory!] = {
          ...updatedSubcategories[isEditingSubcategory!],
          name: editedSubcategory,
          image: base64Image,
        };

        await applySubcategoryUpdates(updatedSubcategories);
      };
      reader.readAsDataURL(editedSubcategoryImage);
    } else {
      // Only update the name if no new image is provided
      updatedSubcategories[isEditingSubcategory!] = {
        ...updatedSubcategories[isEditingSubcategory!],
        name: editedSubcategory,
      };

      await applySubcategoryUpdates(updatedSubcategories);
    }
  };

  /**
   * Helper function to apply subcategory updates
   */
  const applySubcategoryUpdates = async (updatedSubcategories) => {
    const updatedChannel = { ...localChannel, subcategories: updatedSubcategories };
    setLocalChannel(updatedChannel);

    // Update associated podcasts that use the old subcategory name
    const oldSubcategoryName = localChannel.subcategories![isEditingSubcategory!].name;
    const updatedPodcasts = data.podcasts.map((podcast) => {
      if (podcast.channel_id === localChannel.id) {
        return {
          ...podcast,
          subcategories: podcast.subcategories?.map((sub) =>
            sub.name === oldSubcategoryName ? { ...sub, name: editedSubcategory } : sub
          ),
        };
      }
      return podcast;
    });

    // Update global data and sync with server
    const updatedData = {
      ...data,
      channels: data.channels.map((ch) =>
        ch.id === localChannel.id ? updatedChannel : ch
      ),
      podcasts: updatedPodcasts,
    };

    setData(updatedData);
    setIsEditingSubcategory(null);
    setEditedSubcategory('');
    setEditedSubcategoryImage(null);

    try {
      await mutateAsync(updatedData); // Sync with the server
      alert('Subcategory updated successfully.');
    } catch (error) {
      console.error('Error updating subcategory:', error);

    }
  };


  const handleAdd = async () => {
    if (!localChannel.name || !localChannel.description) {
      setIsEmpty(true);
      return;
    }

    const isDuplicate = data.channels.some(
      (ch, idx) => ch.name.toLowerCase() === localChannel.name.toLowerCase() && idx !== index
    );
    if (isDuplicate) {
      setDuplicateError(true);
      return;
    }

    const dataCopy: VideoData = JSON.parse(JSON.stringify(data));

    if (isEdit) {
      // Merge the updated localChannel with the existing channel data
      dataCopy.channels[index] = {
        ...data.channels[index], // Preserve original properties
        ...localChannel,        // Apply updated properties
      };

      const oldChannelName = data.channels[index].name;
      dataCopy.podcasts = dataCopy.podcasts.map((podcast) =>
        podcast.channel === oldChannelName
          ? { ...podcast, channel: localChannel.name } // Update channel name
          : podcast
      );

    } else {
      // Add a new channel
      localChannel.id = uuidv4();
      dataCopy.channels?.unshift(localChannel);
    }

    setIsSaved(true);
    setData({ ...dataCopy });

    try {
      await mutateAsync(dataCopy); // Save data including subcategories to the server
      alert('Channel saved successfully');
    } catch (error) {
      console.error('Error saving channel:', error);
    }

    handleCancel();
    onAction(); // Enable publish button
  };

  const handleChange = (value: string, propertyName: string) => {
    setLocalChannel((prevChannel) => ({ ...prevChannel, [propertyName]: value }));
    if (propertyName === 'name' && value) {
      setIsEmpty(false);
      setDuplicateError(false);
    }
  };


  // Handle the icon upload
  const handleIconUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result?.toString();
        if (base64String) {
          setLocalChannel((prevChannel) => ({ ...prevChannel, icon: base64String }));
        }
      };
      reader.readAsDataURL(file); // Convert file to base64
    }
  };

  return (
    <section className='flex h-full flex-col overflow-hidden'>
      <div className='flex-1 border-r py-1 overflow-y-auto'>
        <fieldset className='flex h-full flex-col gap-4 px-4'>
          <div className='flex  gap-2'>
            <div className=' gap-2 w-1/2'>
              <TextField
                label='Title'
                value={localChannel.name || ''}
                propertyName='name'
                onChange={(value) => handleChange(value, 'name')}
                required
              />
              <div className='flex mt-3 gap-2'>
                <label htmlFor="iconUpload">Channel Icon (SVG)</label>
                <input
                  type="file"
                  accept=".svg"
                  id="iconUpload"
                  onChange={handleIconUpload}
                />
              </div>
            </div>
            <div className='flex gap-2 w-1/2'>
              <TextField
                label='Description'
                value={localChannel.description || ''}
                propertyName='description'
                onChange={(value) => handleChange(value, 'description')}
                required
              />
            </div></div>


          {isEmpty && <p className='text-red-600'>This field is required.</p>}
          {duplicateError && <p className='text-red-600'>Channel name already exists.</p>}

          <div className='w-full'>
            <div className="flex mt-[25px] text-sm ">
              <TextField
               label={<span>New Playlist <span className="text-red-500">*</span></span>} 
                value={newSubcategory}
                onChange={(value) => setNewSubcategory(value)}
              />
             <div className="flex flex-col mt-2 ml-3">
  <label className="text-sm font-medium text-gray-700">
    Playlist Image <span className="text-red-500">*</span>
  </label>
  <input
    type="file"
    accept="image/*"
    onChange={(e) => setNewSubcategoryImage(e.target.files?.[0] ?? null)}
    className="ml-0 mt-1"
  />
</div>


              <Button className='ml-14 px-0 py-0 mt-7 text-sm h-6 w-32  text-hpblue  ' onClick={handleAddSubcategory}>
                Add Playlist
              </Button>
            </div>

            <div className=" md:max-h-[105px] xl:max-h-[220px] 2xl:max-h-[230px] overflow-y-auto mt-1 border  p-1 shadow-sm">
              {localChannel.subcategories?.map((subcategory, subcategoryIndex) => (
                <div key={subcategoryIndex} className="flex items-center justify-between mb-1 gap-2">
                  {isEditingSubcategory === subcategoryIndex ? ( // Fix comparison here
                    <>
                      <TextField
                        value={editedSubcategory}
                        onChange={(value) => setEditedSubcategory(value)}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setEditedSubcategoryImage(e.target.files?.[0] ?? null)}
                        className="ml-0"
                      />
                      <Button onClick={handleSaveEditedSubcategory} className=" text-hpblue ">
                        Save
                      </Button>
                      <Button onClick={() => setIsEditingSubcategory(null)} className="  text-red-500  ">
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className='flex'><span className='w-[350px]'>{subcategory.name}</span>
                        <span className=']'>    {subcategory.image && <img src={subcategory.image} alt="Subcategory" width={50}  className='ml-[100px]'/>}</span></div>
                      <div className="flex">
                        <Button
                          onClick={() => handleEditSubcategory(subcategoryIndex)} // Pass correct index
                          className="inline-flex items-center gap-x-2 text-sm font-semibold  border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 tracking-wider"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleRemoveSubcategory(subcategoryIndex)} // Pass correct index
                          className="inline-flex items-center gap-x-2 text-sm font-semibold  border border-transparent text-red-600 hover:text-red-800 disabled:opacity-50 disabled:pointer-events-none dark:text-red-500 hover:bg-red-600 tracking-wider"
                        >
                          Delete
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}

            </div>
          </div>

          <div className='flex gap-2 mt-[-10px]'>
            <Button onClick={handleAdd} className=" text-hpblue py-0 px-4 ">
              {isEdit ? 'Update' : 'Add'}
            </Button>
            <Button className=' text-red-500 py-2 px-4 ' onClick={handleCancel}>
              Cancel
            </Button>
          </div>

          <div>
            {saved && <p className='text-green-500'>Data saved successfully on server.</p>}
          </div>
        </fieldset>
      </div>
    </section>
  );
};

export default EditChannelComponent;
