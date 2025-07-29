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

const EditChannelComponent = ({
  data,
  onAction,
}: EditChannelComponentProps) => {
  const {
    setData,
    subData,
    setSubData,
    commentData,
    setCommentData,
    ratingData,
    setRatingData,
  } = useApiContext();
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
    if (
      window.confirm(
        'Are you sure you want to delete this channel? This will also delete all associated podcasts, comments, ratings, and subscriptions.'
      )
    ) {
      const channelId = data.channels[index].id;

      const podcastsToDelete = data.podcasts.filter(
        (podcast) => podcast.channel_id === channelId
      );

      const updatedData = { ...data };
      updatedData.channels.splice(index, 1);
      updatedData.podcasts = updatedData.podcasts.filter(
        (podcast) => podcast.channel_id !== channelId
      );

      const updatedCommentData = { ...commentData };
      const updatedRatingData = { ...ratingData };
      podcastsToDelete.forEach((podcast) => {
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

        alert(
          'Channel and all associated data have been successfully deleted.'
        );
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
        <Edit
          channel={channel}
          index={index}
          isEdit={isEdit}
          handleCancel={handleCancel}
          onAction={onAction}
        />
      ) : (
        <section className='p-2'>
          <section className='mx-auto mb-1 flex items-center justify-between'>
            <button
              type='button'
              onClick={handleAddNew}
              className='ml-1 rounded-sm bg-hpBlue px-10 py-2 text-sm font-semibold tracking-widest text-white transition-transform delay-150 duration-300 hover:scale-110'
            >
              + Add New Channel
            </button>
            <input
              type='text'
              value={searchTerm}
              onChange={handleSearch}
              placeholder='Search Channel'
              className='rounded-md border border-gray-300 bg-white px-4 py-2 tracking-wider'
            />
          </section>
          <section className='flex h-full flex-row overflow-hidden'>
            <div className='h-96 w-full overflow-y-auto'>
              <table className='min-w-full divide-y divide-gray-200 dark:divide-neutral-700'>
                <thead className='bg-white'>
                  <tr>
                    <th
                      scope='col'
                      className='px-6 py-3 text-start text-lg font-medium uppercase tracking-wider text-gray-500 dark:text-neutral-500'
                    >
                      Name
                    </th>
                    <th
                      scope='col'
                      className='px-9 py-3 text-end text-lg font-medium uppercase tracking-wider text-gray-500 dark:text-neutral-500'
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 dark:divide-neutral-700'>
                  {data.channels
                    .filter((channel) =>
                      channel.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .map((channel, index) => (
                      <tr
                        key={index}
                        className='hover:bg-gray-200 hover:text-hpBlue'
                      >
                        <td className='whitespace-nowrap px-6 py-2 text-sm font-medium tracking-wider'>
                          {channel.name}
                        </td>
                        <td className='whitespace-nowrap px-6 py-2 text-end text-sm font-medium tracking-wider'>
                          <button
                            type='button'
                            onClick={() => handleEdit(index)}
                            className='inline-flex items-center gap-x-2 rounded-lg border border-transparent text-sm font-semibold tracking-wider text-blue-600 hover:text-blue-800 disabled:pointer-events-none disabled:opacity-50 dark:text-blue-500 dark:hover:text-blue-400'
                          >
                            Edit
                          </button>
                          |
                          <button
                            type='button'
                            onClick={() => handleDelete(index)}
                            className='inline-flex items-center gap-x-2 rounded-lg border border-transparent text-sm font-semibold tracking-wider text-red-600 hover:text-red-800 disabled:pointer-events-none disabled:opacity-50 dark:text-red-500 dark:hover:text-red-400'
                          >
                            Delete
                          </button>
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

const Edit = ({
  channel,
  index,
  isEdit,
  handleCancel,
  onAction,
}: EditProps) => {
  const { data, setData, mutateAsync } = useApiContext(); // Ensure mutateAsync is available for server sync
  const [saved, setIsSaved] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [duplicateError, setDuplicateError] = useState(false);
  const [localChannel, setLocalChannel] = useState(channel);
  const [newSubcategory, setNewSubcategory] = useState(''); // For adding subcategories
  const [isEditingSubcategory, setIsEditingSubcategory] = useState<
    number | null
  >(null); // Track subcategory editing index
  const [editedSubcategory, setEditedSubcategory] = useState(''); // Store edited subcategory value
  const [editedSubcategoryImage, setEditedSubcategoryImage] =
    useState<File | null>(null);
  const [newSubcategoryImage, setNewSubcategoryImage] = useState<File | null>(
    null
  );

  const handleSubcategoryImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
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
        setLocalChannel({
          ...localChannel,
          subcategories: updatedSubcategories,
        });
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
          subcategories: [
            ...(localChannel.subcategories || []),
            newSubcategoryData,
          ],
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
        subcategories: [
          ...(localChannel.subcategories || []),
          newSubcategoryData,
        ],
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
    const updatedSubcategories = localChannel.subcategories?.filter(
      (_, i) => i !== subcategoryIndex
    );
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
      alert(
        'Subcategory removed and associated podcasts updated successfully.'
      );
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
    const updatedChannel = {
      ...localChannel,
      subcategories: updatedSubcategories,
    };
    setLocalChannel(updatedChannel);

    // Update associated podcasts that use the old subcategory name
    const oldSubcategoryName =
      localChannel.subcategories![isEditingSubcategory!].name;
    const updatedPodcasts = data.podcasts.map((podcast) => {
      if (podcast.channel_id === localChannel.id) {
        return {
          ...podcast,
          subcategories: podcast.subcategories?.map((sub) =>
            sub.name === oldSubcategoryName
              ? { ...sub, name: editedSubcategory }
              : sub
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
      (ch, idx) =>
        ch.name.toLowerCase() === localChannel.name.toLowerCase() &&
        idx !== index
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
        ...localChannel, // Apply updated properties
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
    setLocalChannel((prevChannel) => ({
      ...prevChannel,
      [propertyName]: value,
    }));
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
          setLocalChannel((prevChannel) => ({
            ...prevChannel,
            icon: base64String,
          }));
        }
      };
      reader.readAsDataURL(file); // Convert file to base64
    }
  };

  return (
    <section className='flex h-full flex-col overflow-hidden'>
      <div className='flex-1 overflow-y-auto border-r py-1'>
        <fieldset className='flex h-full flex-col gap-4 px-4'>
          <div className='flex  gap-2'>
            <div className=' w-1/2 gap-2'>
              <TextField
                label='Title'
                value={localChannel.name || ''}
                propertyName='name'
                onChange={(value) => handleChange(value, 'name')}
                required
              />
              <div className='mt-3 flex gap-2'>
                <label htmlFor='iconUpload'>Channel Icon (SVG)</label>
                <input
                  type='file'
                  accept='.svg'
                  id='iconUpload'
                  onChange={handleIconUpload}
                />
              </div>
            </div>
            <div className='flex w-1/2 gap-2'>
              <TextField
                label='Description'
                value={localChannel.description || ''}
                propertyName='description'
                onChange={(value) => handleChange(value, 'description')}
                required
              />
            </div>
          </div>

          {isEmpty && <p className='text-red-600'>This field is required.</p>}
          {duplicateError && (
            <p className='text-red-600'>Channel name already exists.</p>
          )}

          <div className='w-full'>
            <div className='mt-[25px] flex text-sm '>
              <TextField
                label={
                  <span>
                    New Playlist <span className='text-red-500'>*</span>
                  </span>
                }
                value={newSubcategory}
                onChange={(value) => setNewSubcategory(value)}
              />
              <div className='ml-3 mt-2 flex flex-col'>
                <label className='text-sm font-medium text-gray-700'>
                  Playlist Image <span className='text-red-500'>*</span>
                </label>
                <input
                  type='file'
                  accept='image/*'
                  onChange={(e) =>
                    setNewSubcategoryImage(e.target.files?.[0] ?? null)
                  }
                  className='ml-0 mt-1'
                />
              </div>

              <Button
                className='text-hpblue ml-14 mt-7 h-6 w-32 px-0 py-0  text-sm  '
                onClick={handleAddSubcategory}
              >
                Add Playlist
              </Button>
            </div>

            <div className=' mt-1 overflow-y-auto border p-1 shadow-sm md:max-h-[105px]  xl:max-h-[220px] 2xl:max-h-[230px]'>
              {localChannel.subcategories?.map(
                (subcategory, subcategoryIndex) => (
                  <div
                    key={subcategoryIndex}
                    className='mb-1 flex items-center justify-between gap-2'
                  >
                    {isEditingSubcategory === subcategoryIndex ? ( // Fix comparison here
                      <>
                        <TextField
                          value={editedSubcategory}
                          onChange={(value) => setEditedSubcategory(value)}
                        />
                        <input
                          type='file'
                          accept='image/*'
                          onChange={(e) =>
                            setEditedSubcategoryImage(
                              e.target.files?.[0] ?? null
                            )
                          }
                          className='ml-0'
                        />
                        <Button
                          onClick={handleSaveEditedSubcategory}
                          className=' text-hpblue '
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => setIsEditingSubcategory(null)}
                          className='  text-red-500  '
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className='flex'>
                          <span className='w-[350px]'>{subcategory.name}</span>
                          <span className=']'>
                            {' '}
                            {subcategory.image && (
                              <img
                                src={subcategory.image}
                                alt='Subcategory'
                                width={50}
                                className='ml-[100px]'
                              />
                            )}
                          </span>
                        </div>
                        <div className='flex'>
                          <Button
                            onClick={() =>
                              handleEditSubcategory(subcategoryIndex)
                            } // Pass correct index
                            className='inline-flex items-center gap-x-2 border border-transparent  text-sm font-semibold tracking-wider text-blue-600 hover:text-blue-800 disabled:pointer-events-none disabled:opacity-50 dark:text-blue-500 dark:hover:text-blue-400'
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() =>
                              handleRemoveSubcategory(subcategoryIndex)
                            } // Pass correct index
                            className='inline-flex items-center gap-x-2 border border-transparent  text-sm font-semibold tracking-wider text-red-600 hover:bg-red-600 hover:text-red-800 disabled:pointer-events-none disabled:opacity-50 dark:text-red-500'
                          >
                            Delete
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                )
              )}
            </div>
          </div>

          <div className='mt-[-10px] flex gap-2'>
            <Button
              onClick={handleAdd}
              className=' text-hpblue px-4 py-0 '
            >
              {isEdit ? 'Update' : 'Add'}
            </Button>
            <Button
              className=' px-4 py-2 text-red-500 '
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>

          <div>
            {saved && (
              <p className='text-green-500'>
                Data saved successfully on server.
              </p>
            )}
          </div>
        </fieldset>
      </div>
    </section>
  );
};

export default EditChannelComponent;
