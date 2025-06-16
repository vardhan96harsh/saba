/* eslint-disable @typescript-eslint/no-unused-vars */
import { VideoData, Course, SecurityDomain, WorkspaceId, Podcast, Channel, ChannelSubs, CommentData } from '@/types/types';
import React, { useEffect, useState } from 'react';
import { createContext, useContext } from 'react';
import useGetWorkspaceInfo from '../hooks/useGetWorkspaceInfo';
import useIsOwner from '../hooks/useIsOwner';
import useIsPartner from '../hooks/useIsPartner';
import useData from '../hooks/useData';
import { Loader } from '../Loader';
import useImportSubData from '../hooks/useImportSubData';

interface ApiContextType {
  isPartner: boolean;
  isOwner: boolean;
  dataFileId: string;
  subDataFileId: string,
  commentDataFileId: string,
  ratingDataFileId: string,
  data: VideoData;
  subData: ChannelSubs;
  commentData: CommentData,
  commonData: any;
  ratingData: Object,
  homeCurData: Banner[];
  setHomeCurData: React.Dispatch<React.SetStateAction<Banner[]>>;
  announcementData: any;
  setAnnouncementData: React.Dispatch<React.SetStateAction<any>>;
  setCommonData: React.Dispatch<React.SetStateAction<any>>;
  hostData: Host[];
setHostData: React.Dispatch<React.SetStateAction<Host[]>>;
hostDataFileId: string;


  setData: React.Dispatch<React.SetStateAction<VideoData>>;
  setSubData: React.Dispatch<React.SetStateAction<ChannelSubs>>;
  setCommentData: React.Dispatch<React.SetStateAction<CommentData>>;
  setRatingData: React.Dispatch<React.SetStateAction<Object>>;
  updateRatingData: (videoId: string, userId: string, rating: number | null, bookmark: boolean) => void;

  // addSub: React.Dispatch<any>;
  // removeSub: React.Dispatch<any>;
  commonDataFileId: string,
  // channels: Channel[];
  workspaceId: WorkspaceId;
  userId: string;
  userName: string;
  apiCertificate: string;
  folderName: string;
  folderSecurityDomain: SecurityDomain;
  folderId: string;
  mergeDicts:any
}

const ApiContext = createContext<ApiContextType | null>(null);

export const useApiContext = () => {
  const apiContext = useContext(ApiContext);

  if (!apiContext) {
    throw new Error(
      'useApiContext has to be used within <ApiContext.Provider>'
    );
  }

  return apiContext;
};

export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
  const { workspaceUrls, userId, apiCertificate, userName } =
    useGetWorkspaceInfo();
  const { isOwner, isLoadingOwner } = { isOwner: true, isLoadingOwner: false }//useIsOwner();
  const { isPartner, isLoadingPartner } = { isPartner: true, isLoadingPartner: false }  //useIsPartner();
  // const { isOwner, isLoadingOwner } = useIsOwner();
  // const { isPartner, isLoadingPartner } = useIsPartner();
  const {
    workspaceData,
    dataFileId,
    folderName,
    folderSecurityDomain,
    folderId,
    subData: sData,
    commentDataFileId,
    isLoadingData,
    subDataFileId,
    ratingData: rData,
    commentData: cData,
    ratingDataFileId,
    commonDataFileId,
    commonData:common_Data,
    hostData: host_Data,
    hostDataFileId,

  } = useData();

  const [data, setData] = useState<VideoData>({});
  const [subData, setSubData] = useState<ChannelSubs>({});
  const [commentData, setCommentData] = useState<CommentData>({});
  const [hostData, setHostData] = useState<Host[]>([]);

  
  const [commonData, setCommonData] = useState<any>({});
  const [ratingData, setRatingData] = useState<Object>({});
  const [homeCurData, setHomeCurData] = useState<Banner[]>([]); 
  const [announcementData, setAnnouncementData] = useState<any>(null);

  const updateRatingData = (videoId: string, userId: string, rating: number | null, bookmark: boolean) => {
    const updatedData = { ...ratingData };

    if (!updatedData[videoId]) {
      updatedData[videoId] = {};
    }

    updatedData[videoId][userId] = {
      ...updatedData[videoId][userId],
      rating: rating ?? updatedData[videoId][userId]?.rating,
      bookmarked: bookmark,
    };

    setRatingData(updatedData);
  };


/*************  ✨ Codeium Command ⭐  *************/
  const mergeDicts = (dict1: Object, dict2: Object) => {
    return {...dict1, ...dict2};
  };



  useEffect(() => {
    setData(workspaceData);
    setSubData(sData);
    setCommentData(cData);
    setCommonData(common_Data);
    setRatingData(rData);
    setHostData(Array.isArray(host_Data) ? host_Data : []);

  }, [workspaceData]);

  return (
    <ApiContext.Provider
      value={{
        isPartner,
        dataFileId,
        ratingData,
        ratingDataFileId,
        setRatingData,
        data,
        setData,
        setSubData,
        setCommentData,
        isOwner,
        subDataFileId,
        subData,
        commentData,
        commentDataFileId,
        workspaceId: workspaceUrls,
        userId,
        userName,
        apiCertificate,
        folderName,
        folderSecurityDomain,
        folderId,
        homeCurData,
        setHomeCurData,
        announcementData,
        setAnnouncementData,
        updateRatingData, // Added here
        commonDataFileId,
        commonData,
        setCommonData,
        hostData,
setHostData,
hostDataFileId,
 // 🔁 Replace with your actual file ID or dynamically fetch it

        mergeDicts,
        
     
      }}
    >
      {isLoadingData || isLoadingOwner || isLoadingPartner ? (
        <Loader />
      ) : (
        children
      )}
    </ApiContext.Provider>
  );
};
