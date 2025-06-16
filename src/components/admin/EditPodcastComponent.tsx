import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';

import 'quill/dist/quill.snow.css';




 // Import styles for the editor
import { useApiContext } from '../contexts/ApiContext';
import { Button, TextField } from '../dataEntry';
import useImportData from '../hooks/useImportData';
import Note from '../Note';
import Select from 'react-select';
import { fetchVideoDataFromUrl } from '@/pages/helpers';
import TruncatedText from '../TruncatedText';
import useImportCommentData from '../hooks/useImportCommentData';
import useImportRatingData from '../hooks/useImportRatingData';

const ListComponent = ({ label, value, optionKey, options, propertyName, onChange, disabled, required }) => {

    const handleChange = (e) => {
        const selectedValue = options.find(option => (option[optionKey] ?? option) === e.target.value);
        onChange(selectedValue, propertyName);
    };

    return (
        <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700">
                {label}
                {required && <span className='text-red-600'>*</span>}
            </label>
            <select
                value={value ? value[optionKey] : ''}
                onChange={handleChange}
                className="border px-4 py-2 rounded-lg"
                disabled={disabled}
                required={required}
            >
                <option value="" disabled>Select {label}</option>
                {options.map((option, index) => (
                    <option key={index} value={option[optionKey]}>
                        {option[optionKey] ?? option}
                    </option>
                ))}
            </select>
        </div>
    );
};

const Dropdown = ({ value, options, propertyName, onChange, placeholder, disabled }) => {
    const handleChange = (e) => {
        onChange(e.target.value, propertyName);
    };

    return (
        <div className="flex flex-col">
            <select
                value={value || ''}
                onChange={handleChange}
                className="border px-4 py-2 rounded-lg"
                disabled={disabled}
            >
                <option value="" disabled>{placeholder}</option>
                {options.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};

const TagsInput = ({ tags, onChange, disabled }) => {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleInputKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim() && !disabled) {
            e.preventDefault();
            const newTags = [...tags, inputValue.trim()];
            onChange(newTags);
            setInputValue('');
        }
    };
    const handleRemoveTag = (index) => {
        const newTags = tags.filter((_, i) => i !== index);
        onChange(newTags);
    };

    return (
        <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700">
                Tags<span className='text-red-600'>*</span>
            </label>
            <div className="flex flex-wrap items-center border px-2 py-2 rounded-lg">
                {tags.map((tag, index) => (
                    <div key={index} className="flex items-center bg-gray-200 text-gray-700 rounded-lg px-2 py-1 mr-2 mb-2">
                        {tag}
                        <button type="button" onClick={() => handleRemoveTag(index)} className="ml-1 text-xs text-red-500">x</button>
                    </div>
                ))}
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    className="flex-grow px-2 py-1 border-none outline-none bg-transparent"
                    placeholder="Add a tag and press Enter..."
                    disabled={disabled}
                />
            </div>
        </div>
    );
};

const Edit = ({ podcast, index, isEdit, handleCancel, channels, setData, data, hosts }) => {
    const [saved, setIsSaved] = useState(false);
    const [currentPodcast, setCurrentPodcast] = useState({
        ...podcast,
        subcategories: podcast.subcategories || [], // Initialize as array
    });

    const [linkError, setLinkError] = useState('');
    const [thumbnailError, setThumbnailError] = useState('');
    const [fetching, setFetching] = useState(false);
    const { mutateAsync, isSuccess, isPending, isError } = useImportData();
    const [subcategories, setSubcategories] = useState([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [allSubcategories, setAllSubcategories] = useState([]);
    const [enabledFields, setEnabledFields] = useState({
        channel: true,
        episode: true,
        title: true,
        hosts: true,
        link: true,
        video_id: true,
        thumbnail: true,
        duration: true,
        publish_date: true,
        tags: true,
        description: true,
    });

    const isValidUrl = (url) => {
        const regex = /^(https?:\/\/)?([\w\d-]+\.)*[\w\d-]+(:\d+)?(\/[\w\d-._~:/?#\[\]@!$&'()*+,;=]*)?$/;
        return regex.test(url);
    };

    const fetchDataFromUrl = async (url) => {
        try {
            setFetching(true);
            let data = await fetchVideoDataFromUrl(url);
            setFetching(false);
            return data;
        } catch (error) {
            console.error("Error fetching data from URL", error);
            setFetching(false);
            return false;
        }
    };

    const validateUniqueTitleAndEpisode = (channel, title, episode, isEdit, index) => {
        return data.podcasts.every((p, i) => {
            if (isEdit && i === index) {
                return true;
            }
            return !(p.channel === channel && (p.title === title || p.episode === episode));
        });
    };

    // const validateFields = () => {
    //     const requiredFields = ['title', 'link', 'length', 'video_id', 'publish_date', 'channel', 'hosts', 'episode', 'description'];
    //     // const allFieldsFilled = requiredFields.every(field => currentPodcast[field] && currentPodcast[field].toString().trim().length > 0);
    //     const isLinkValid = isValidUrl(currentPodcast.link);
    //     const isThumbnailValid = isValidUrl(currentPodcast.thumbnail);

    //     if (!isLinkValid) {
    //         setLinkError('Please enter a valid URL for the link.');
    //         return false;
    //     } else {
    //         setLinkError('');
    //     }

    //     if (!isThumbnailValid) {
    //         setThumbnailError('Please enter a valid URL for the thumbnail.');
    //         return false;
    //     } else {
    //         setThumbnailError('');
    //     }

    //     if (!validateUniqueTitleAndEpisode(currentPodcast.channel, currentPodcast.title, currentPodcast.episode, isEdit, index)) {
    //         alert('The title and episode number must be unique within the same channel.');
    //         return false;
    //     }

    //     if (data.podcasts.some((p, i) => p.link === currentPodcast.link && (!isEdit || i !== index))) {
    //         alert('The link must be unique.');
    //         return false;
    //     }

    //     return true;
    // };

    const validateFields = () => {
        const requiredFields = ['title', 'link', 'length', 'video_id', 'publish_date', 'channel', 'hosts', 'episode', 'description'];
        const isLinkValid = isValidUrl(currentPodcast.link);
        const isThumbnailValid = isValidUrl(currentPodcast.thumbnail);
    
        if (!isLinkValid) {
            setLinkError('Please enter a valid URL for the link.');
            return false;
        } else {
            setLinkError('');
        }
    
        if (!isThumbnailValid) {
            setThumbnailError('Please enter a valid URL for the thumbnail.');
            return false;
        } else {
            setThumbnailError('');
        }
    
        // Ensure unique title and episode number within the same channel
        const isDuplicateEpisode = data.podcasts.some((p, i) =>
            p.channel === currentPodcast.channel &&
            (p.title === currentPodcast.title || p.episode === currentPodcast.episode) &&
            (!isEdit || i !== index) // Exclude current podcast if editing
        );
    
        if (isDuplicateEpisode) {
            alert('The title and episode number must be unique within the same channel.');
            return false;
        }
    
        // Ensure the same link is not repeated within the same channel
        const isDuplicateLinkInSameChannel = data.podcasts.some((p, i) =>
            p.channel === currentPodcast.channel &&
            p.link === currentPodcast.link &&
            (!isEdit || i !== index) // Exclude current podcast if editing
        );
    
        if (isDuplicateLinkInSameChannel) {
            alert('The link must be unique within the same channel.');
            return false;
        }
    
        return true;
    };
    

    const handleAdd = async () => {
        if (!validateFields()) {
            return;
        }

        const canFetchData = await fetchDataFromUrl(currentPodcast.link);
        if (!canFetchData) {
            setLinkError('Unable to fetch data from the provided link.');
            return;
        }
        const dataCopy = { ...data, podcasts: [...data.podcasts] };

        // const dataCopy = JSON.parse(JSON.stringify(data));
        if (isEdit) {
            dataCopy.podcasts[index] = currentPodcast;
        } else {
            dataCopy.podcasts.unshift(currentPodcast);
        }
        setIsSaved(true);
        setData(dataCopy);
        handleCancel();
    };
    console.log(subcategories);
    const handleChange = async (value, propertyName) => {
        switch (propertyName) {
            case 'title':
                currentPodcast.title = value;
                break;
            case 'link':
                currentPodcast.link = value;
                let linkData = await fetchDataFromUrl(value);
                if (linkData) {
                    currentPodcast.thumbnail = linkData?.poster;
                    currentPodcast.description = linkData?.description;
                    currentPodcast.tags = linkData?.tags;
                    currentPodcast.id = linkData?.id;
                    currentPodcast.video_id = linkData?.id;
                    currentPodcast.publish_date = linkData.published_at;
                    let len = linkData.sources?.length - 1;
                    currentPodcast.wise_link = linkData?.sources[len]?.src;
                    let duration = linkData?.sources[len]?.duration;
                    duration = Math.floor(duration / 1000);
                    currentPodcast.length = `${Math.floor(duration / 3600).toString().padStart(2, '0')}:${Math.floor((duration % 3600) / 60).toString().padStart(2, '0')}:${(duration % 60).toString().padStart(2, '0')}`;
                }
                break;
            case 'thumbnail':
                currentPodcast.thumbnail = value;
                break;
            case 'length':
                currentPodcast.length = value;
                break;
            case 'music':
                currentPodcast.music = value;
                break;
            case 'notes':
                currentPodcast.notes = value;
                break;
            case 'channel':
                currentPodcast.channel = value.name;
                currentPodcast.channel_id = value.id;
                const selectedChannel = channels.find(channel => channel.id === value.id);

                setSubcategories(selectedChannel.subcategories || []);
                currentPodcast.subcategory = '';
                setSelectedSubcategory('');
                break;

            case 'subcategory':
                currentPodcast.subcategories = value;
                setSelectedSubcategory(value);
                break;
            case 'publish_date':
                currentPodcast.publish_date = value;
                break;
            case 'video_id':
                currentPodcast.video_id = value;
                break;
            case 'wise_link':
                currentPodcast.wise_link = value;
                break;
            case 'tags':
                currentPodcast.tags = value;
                break;
            case 'hosts':

                currentPodcast.hosts = value.map((host) => host.value);
                break;
            case 'episode':
                currentPodcast.episode = value;
                break;
            case 'description':
                currentPodcast.description = value; // Updates the `description` in the podcast object
                break;

            default:
                break;
        }

        const nextField = {
            channel: 'episode',
            episode: 'title',
            title: 'hosts',
            hosts: 'link',
            link: 'video_id',
            video_id: 'thumbnail',
            thumbnail: 'publish_date',
            publish_date: 'tags',
            tags: 'description',
        };

        if (value) {
            setEnabledFields({ ...enabledFields, [nextField[propertyName]]: true });
        }

        setCurrentPodcast({ ...currentPodcast });
    };


    // useEffect(() => {
    //     const subs = channels.flatMap((channel) =>
    //         channel.subcategories?.map((subcat) => ({
    //             value: subcat.name, // Unique identifier
    //             label: subcat.name, // Display name
    //         })) || []
    //     );
    //     setAllSubcategories(subs);
    //     setCurrentPodcast(podcast);
    // }, [channels, podcast]);

    useEffect(() => {
        const subs = channels.flatMap((channel) =>
            channel.subcategories?.map((subcat) => ({
                value: subcat.name,
                label: subcat.name,
            })) || []
        );
        setAllSubcategories(subs);
    
        // Filter out deleted playlists from current podcast
        const validSubcatNames = subs.map((sub) => sub.value);
        const filteredSubcategories = (podcast.subcategories || []).filter((sub) =>
            validSubcatNames.includes(sub.name)
        );
    
        setCurrentPodcast({ ...podcast, subcategories: filteredSubcategories });
    }, [channels, podcast]);

    const hoursOptions = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
    const minutesOptions = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
    const secondsOptions = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

    const handleDurationChange = (value, unit) => {
        const [hours, minutes, seconds] = (currentPodcast.length || '00:00:00').split(':');
        let newLength = '';
        if (unit === 'hours') {
            newLength = `${value}:${minutes}:${seconds}`;
        } else if (unit === 'minutes') {
            newLength = `${hours}:${value}:${seconds}`;
        } else if (unit === 'seconds') {
            newLength = `${hours}:${minutes}:${value}`;
        }
        handleChange(newLength, 'length');
    };

    return (
        <section className='flex h-full overflow-hidden'>
            <div className='flex-1 border-r py-2'>
                <fieldset className='flex h-full flex-col gap-4 overflow-auto px-4'>
                    <div className='flex gap-2 w-full'>
                        <div className='w-1/2'>
                            <ListComponent
                                label='Channel'
                                value={channels.find(ch => ch.name === currentPodcast.channel)} 
                                optionKey='name'
                                options={channels}
                                propertyName='channel'
                                onChange={handleChange}
                                disabled={!enabledFields.channel}
                                required={false}
                            />
                        </div>
                        <div className='w-1/2'>
                            <label className="mb-2 text-sm font-medium text-gray-700">Playlist </label>
                            <Select
                                isMulti
                                value={(currentPodcast.subcategories || []).map((subcat) => ({
                                    value: subcat.name, // Use `name` as the value
                                    label: subcat.name, // Use `name` as the label
                                }))}
                                options={allSubcategories} // Ensure options are [{ value, label }]
                                onChange={(selected) =>
                                    handleChange(selected.map((option) => ({ name: option.value })), 'subcategory') // Save as objects with `name`
                                }
                                placeholder="Select playlists"
                            />

                        </div>

                        <div className='w-1/2'>
                            <TextField
                                required
                                label='Episode No'
                                value={currentPodcast?.episode || ''}
                                propertyName='episode'
                                onChange={(value) => handleChange(value, 'episode')}
                                disabled={!enabledFields.episode}
                            />
                        </div>
                    </div>
                    <div className='flex gap-2 w-full'>
                        <div className='w-1/2'>
                            <TextField
                                required
                                label='Title'
                                value={currentPodcast?.title || ''}
                                propertyName='title'
                                onChange={(value) => handleChange(value, 'title')}
                                disabled={!enabledFields.title}
                            />
                        </div>
                        <div className='w-1/2'>
                            <label className="mb-2 text-sm font-medium text-gray-600">Guest(s)<span className='text-red-600'>*</span></label>
                            <Select
                                isMulti
                                value={(currentPodcast.hosts || []).map((hostId) => {

                                    const host = hosts.find((h) => h.host_id === hostId);
                                    if (host) {
                                        return { value: host.host_id, label: host.name }; // Ensure correct mapping
                                    }
                                    return null;
                                })}
                                onChange={(selected) => handleChange(selected, 'hosts')}
                                options={hosts.map((host) => ({ value: host.host_id, label: host.name }))}
                                isDisabled={!enabledFields.hosts}
                                styles={{
                                    menu: (base) => ({
                                        ...base,
                                        backgroundColor: '#fff',
                                        borderRadius: 10,
                                        border: '1px solid #ccc',
                                        overflow: 'hidden',
                                    }),
                                    menuList: (base) => ({
                                        ...base,
                                        backgroundColor: '#fff',
                                        //marginLeft: 10,
                                    }),
                                    option: (base, state) => ({
                                        ...base,
                                        backgroundColor: state.isFocused ? '#fff' : '#fff',
                                        color: 'black',
                                        padding: '2px 10px 0px',
                                        height: 25,
                                        '&:hover': {
                                            backgroundColor: '#1967d2',
                                            color: 'white',
                                        },
                                    }),
                                }}
                            />
                        </div>
                    </div>
                    <div className='flex gap-2 w-full'>
                        <TextField
                            required
                            label='Link'
                            value={currentPodcast?.link || ''}
                            propertyName='link'
                            onChange={(value) => handleChange(value, 'link')}
                        />
                        {linkError && <span className="text-red-500 text-xs">{linkError}</span>}
                    </div>
                    <div className='flex gap-2 w-full'>
                        <div className='w-1/2'>
                            <TextField
                                required
                                label='Podcast ID'
                                value={currentPodcast?.video_id || ''}
                                propertyName='video_id'
                                onChange={(value) => handleChange(value, 'video_id')}
                                disabled={!enabledFields.video_id}
                            />
                        </div>
                        <div className='w-1/2'>
                            <div className='flex flex-col'>
                                <TextField
                                    required
                                    label='Thumbnail Link'
                                    value={currentPodcast?.thumbnail || ''}
                                    propertyName='thumbnail'
                                    onChange={(value) => handleChange(value, 'thumbnail')}
                                    disabled={!enabledFields.thumbnail}
                                />
                                {thumbnailError && <span className="text-red-500 text-xs">{thumbnailError}</span>}
                            </div>
                        </div>
                    </div>
                    <div className='flex gap-2 w-full'>
                        <div className='flex flex-col w-1/2'>
                            <label className="mb-2 text-sm font-medium text-gray-700">Duration<span className='text-red-600'>*</span></label>
                            <div className='flex gap-2'>
                                <Dropdown
                                    value={currentPodcast?.length?.split(':')[0] || '00'}
                                    options={hoursOptions}
                                    propertyName='hours'
                                    placeholder='HH'
                                    onChange={(value) => handleDurationChange(value, 'hours')}
                                />
                                <Dropdown
                                    value={currentPodcast?.length?.split(':')[1] || '00'}
                                    options={minutesOptions}
                                    propertyName='minutes'
                                    placeholder='MM'
                                    onChange={(value) => handleDurationChange(value, 'minutes')}
                                />
                                <Dropdown
                                    value={currentPodcast?.length?.split(':')[2] || '00'}
                                    options={secondsOptions}
                                    propertyName='seconds'
                                    placeholder='SS'
                                    onChange={(value) => handleDurationChange(value, 'seconds')}
                                />
                            </div>
                        </div>
                        <div className='w-1/2'>
                            <TextField
                                required
                                label='Publish Date'
                                value={currentPodcast?.publish_date || ''}
                                propertyName='publish_date'
                                onChange={(value) => handleChange(value, 'publish_date')}
                                disabled={!enabledFields.publish_date}
                            />
                        </div>
                    </div>
                    <div className='flex gap-2 w-full'>
                        <div className='w-1/2 hover:text-hpBlue'>
                            <TagsInput
                                tags={currentPodcast.tags || []}
                                onChange={(tags) => handleChange(tags, 'tags')}
                                disabled={!enabledFields.tags}
                            />
                        </div>
                        <div className='w-1/2'>
                            <label className="mb-2 text-sm font-medium text-gray-700">Description</label>
                            <ReactQuill
                                theme="snow"
                                value={currentPodcast?.description || ''}
                                onChange={(value) => handleChange(value, 'description')}
                                modules={{
                                    toolbar: [
                                        ['bold', 'italic', 'underline', 'strike'], // Formatting options
                                        ['link'], // Add hyperlink button
                                        [{ list: 'ordered' }, { list: 'bullet' }],
                                        ['clean'],
                                    ],
                                }}

                            />
                        </div>
                    </div>
                    <div className='flex gap-2'>
                        <Button onClick={handleAdd} disabled={fetching}>{isEdit ? 'Update' : 'Add'}</Button>
                        <Button className='border-red-600 text-red-600 hover:bg-red-600 hover:text-white' onClick={handleCancel}>Cancel</Button>
                    </div>
                    <div>
                        {saved && <Note variant='success'>Data saved successfully on server.</Note>}
                    </div>
                </fieldset>
            </div>
        </section>
    );
};

const EditPodcastComponent = () => {
    const { data, setData, commentData, setCommentData, ratingData, setRatingData, hostData } = useApiContext();
    const [podcast, setPodcast] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [toggle, setToggle] = useState(false);
    const [index, setIndex] = useState(-1);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPodcasts, setFilteredPodcasts] = useState(data.podcasts || []);
    const { mutateAsync: mutateAsyncComments } = useImportCommentData();
    const { mutateAsync: mutateAsyncRatings } = useImportRatingData();
    const { mutateAsync } = useImportData();

    const channels = data.channels;
    const scrollPositionRef = useRef(0);


    const tableRef = useRef(null);

    const handleEdit = (index) => {
        scrollPositionRef.current = tableRef.current?.scrollTop || 0;
        setPodcast(filteredPodcasts[index]);
        setIsEdit(true);
        setToggle(true);
        setIndex(index);
    };

    const handleAddNew = () => {
        setPodcast({});
        setIsEdit(false);
        setIndex(-1);
        setToggle(true);
    };

    const handleCancel = () => {
        setToggle(false); // Switch to list view

    // 🔵 Restore scroll position after view switches back
    setTimeout(() => {
        if (tableRef.current) {
            tableRef.current.scrollTop = scrollPositionRef.current;
        }
    }, 100);
    };

    const handleDelete = async (index) => {
        if (window.confirm('Are you sure you want to delete this podcast? This will also delete all associated comments and ratings.')) {
            const podcastId = data.podcasts[index].id;

            // Remove podcast from the list
            const newPodcasts = data.podcasts.filter((_, i) => i !== index);
            setData({ ...data, podcasts: newPodcasts });
            setFilteredPodcasts(newPodcasts);

            // Remove associated comments and ratings from the state
            const newCommentData = { ...commentData };
            const newRatingData = { ...ratingData };
            delete newCommentData[podcastId];
            delete newRatingData[podcastId];
            setCommentData(newCommentData);
            setRatingData(newRatingData);

            // Ensure to remove comments, ratings, and the podcast on the server as well
            try {
                // Delete comments on the server
                await mutateAsyncComments({ podcastId, comments: null });

                // Delete ratings on the server
                await mutateAsyncRatings({ podcastId, ratings: null });

                // Delete podcast on the server
                await mutateAsync(newPodcasts);

                alert('Podcast and all associated data have been successfully deleted.');
            } catch (error) {
                console.error('Failed to delete podcast data from the server:', error);
               
            }
        }
    };

    // const handleSearchChange = (e) => {
    //     const query = e.target.value.toLowerCase();
    //     setSearchQuery(e.target.value); // keep the original case for display

    //     const filtered = data.podcasts.filter(podcast =>
    //         podcast.title && podcast.title.toLowerCase().includes(query)
    //     );

    //     setFilteredPodcasts(filtered);

    //     // Scroll to the first matched podcast
    //     if (filtered.length > 0) {
    //         const rowElement = document.getElementById(`podcast-row-${filtered[0].id}`);
    //         if (rowElement && tableRef.current) {
    //             tableRef.current.scrollTop = rowElement.offsetTop;
    //         }
    //     }
    // };

    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(e.target.value); // Keep original case for display
    
        const filtered = data.podcasts.filter(podcast =>
            (podcast.title && podcast.title.toLowerCase().includes(query)) || 
            (podcast.episode && podcast.episode.toString().includes(query)) // Allow searching by episode number
        );
    
        setFilteredPodcasts(filtered);
    
        // Scroll to the first matched podcast
        if (filtered.length > 0) {
            const rowElement = document.getElementById(`podcast-row-${filtered[0].id}`);
            if (rowElement && tableRef.current) {
                tableRef.current.scrollTop = rowElement.offsetTop;
            }
        }
    };
    

    const truncateTitle = (title, wordLimit) => {
        const words = title.split(' ');
        if (words.length > wordLimit) {
          return words.slice(0, wordLimit).join(' ') + '...';
        }
        return title;
      };

    const handleDropdownChange = (value) => {
        if (value === "all") {
            setFilteredPodcasts(data.podcasts); // Reset to all podcasts
        } else if (value === "sortAlphabetically") {
            const sorted = [...filteredPodcasts].sort((a, b) =>
                a.title.localeCompare(b.title)
            );
            setFilteredPodcasts(sorted);
        } else if (value === "sortByEpisodeAsc") {
            const sorted = [...filteredPodcasts].sort((a, b) =>
                parseInt(a.episode) - parseInt(b.episode)
            );
            setFilteredPodcasts(sorted);
        } else if (value === "sortByEpisodeDesc") {
            const sorted = [...filteredPodcasts].sort((a, b) =>
                parseInt(b.episode) - parseInt(a.episode)
            );
            setFilteredPodcasts(sorted);
        } else {
            const filtered = data.podcasts.filter(
                (podcast) => podcast.channel === value
            );
            setFilteredPodcasts(filtered);
        }
    };

    useEffect(() => {
        setFilteredPodcasts(data.podcasts || []);
    }, [data.podcasts]);




    useEffect(() => {
        console.log("Hosts data:", data.hosts);
        setFilteredPodcasts(data.podcasts || []);
    }, [data.podcasts, data.hosts, data.channels]);

    return (
        <>
            {toggle ? (
                <Edit
                    podcast={podcast}
                    index={index}
                    isEdit={isEdit}
                    handleCancel={handleCancel}
                    channels={channels}
                    hosts={hostData && hostData.length > 0 ? hostData : data.hosts || []}
                    // Ensure hosts is an array
                    setData={setData}
                    data={data}
                />
            ) : (
                <section className='p-2 h-full'>
                    <section className="flex justify-between items-center mx-auto my-1">
                        <button
                            onClick={handleAddNew}
                            type="button"
                            className="bg-hpBlue text-white font-semibold text-sm rounded-sm py-2 px-10 ml-1 hover:scale-110 transition-transform duration-300 tracking-wider"
                        >
                            + Add New Podcast
                        </button>
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="Search by Podcast Name"
                                className="px-4 py-2 border rounded-lg wd-100"
                            />
                        </div>
                        <div className="">
                            <select
                                onChange={(e) => handleDropdownChange(e.target.value)}
                                className="px-1 py-2 border rounded-lg"
                            >
                                <option value="all">All Channels</option>
                                {channels.map((channel) => (
                                    <option key={channel.id} value={channel.name}>
                                        {channel.name}
                                    </option>
                                ))}
                                <option value="sortAlphabetically">Sort Alphabetically(A-Z)</option>
                                <option value="sortByEpisodeAsc">Sort by Episode (Ascending)</option>
                                <option value="sortByEpisodeDesc">Sort by Episode (Descending)</option>
                            </select>
                        </div>

                    </section>


                    <section className='h-full xl:h-[24vh]  md:h-[26vh] 2xl:h-[17vh] overflow-auto' ref={tableRef}>
                        <table className="table-auto min-w-full divide-y divide-gray-100  overflow-auto">
                            <thead className="sticky top-0 z-10 bg-white">
                                <tr> <th scope="col" className="px-3 py-3 text-start text-sm font-medium text-gray-500 uppercase dark:text-neutral-500 tracking-wider">Ep. No.</th>
                                    <th scope="col" className="px-6 py-3 text-start text-sm font-medium text-gray-500 uppercase dark:text-neutral-500 tracking-wider">Name</th>
                                    <th scope="col" className="px-3 py-3 text-start text-sm font-medium text-gray-500 uppercase dark:text-neutral-500 tracking-wider">Duration</th>
                                    <th scope="col" className="px-3 py-3 text-start text-sm font-medium text-gray-500 uppercase dark:text-neutral-500 tracking-wider">Publish Date</th>
                                    <th scope="col" className="px-4 py-3 pl-5 text-start text-sm font-medium text-gray-500 uppercase dark:text-neutral-500 tracking-wider">Channel</th>
                                    <th scope="col" className="px-4 pr-8 py-3 text-end text-sm font-medium text-gray-500 uppercase dark:text-neutral-500 tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                                {filteredPodcasts

                                    .map((podcast, index) => (
                                        <tr key={index + 'td'} id={`podcast-row-${podcast.id}`} className="hover:text-hpBlue hover:bg-gray-200">
                                            <td className="px-6 py-2 whitespace-nowrap text-sm font-medium tracking-wider">{podcast.episode}</td>
                                            <td className="px-6 py-2 whitespace-nowrap text-sm font-medium tracking-wider">
                                                {truncateTitle(podcast.title, 6)}  
                                            </td>
                                            <td className="px-3 py-2 whitespace-nowrap text-sm font-medium tracking-wider">{podcast.length}</td>
                                            <td className="px-3 py-2 whitespace-nowrap text-sm font-medium tracking-wider">{new Date(podcast.publish_date).toLocaleDateString()}</td>
                                            <td className="px-6 py-2 whitespace-nowrap text-sm font-medium tracking-wider">{podcast.channel?.name || podcast.channel}</td>
                                            <td className="px-6 py-2 whitespace-nowrap text-end text-sm font-medium">
                                                <button type="button" onClick={() => handleEdit(index)} className="inline-flex tracking-wider items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-hpBlue">Edit</button>|
                                                <button type="button" onClick={() => handleDelete(index)} className="inline-flex items-center tracking-wider gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-red-600 hover:text-red-800 disabled:opacity-50 disabled:pointer-events-none">Delete</button>
                                            </td>
                                        </tr>
                                    ))}

                            </tbody>
                        </table>
                    </section>
                </section>
            )}
        </>
    );
};

export default EditPodcastComponent;
