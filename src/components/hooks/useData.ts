import { VideoData, FolderData, WorkspaceData, WorkspaceId, ChannelSubs } from '@/types/types';
import { useQuery } from '@tanstack/react-query';
import localData from '../../data/data.json';
import useGetWorkspaceInfo from './useGetWorkspaceInfo';

interface GetFolderParamsBase {
  signal: AbortSignal;
  apiCertificate: string;
}

interface GetFolderIdParams extends GetFolderParamsBase {
  locationId: WorkspaceId;
}

interface GetDataParams extends GetFolderParamsBase {
  locationId: string;
}

interface GetJsonParams extends GetFolderParamsBase {
  contentId: string;
  contentLocation: string;
}

const dummyDomain = {
  id: '',
  displayName: '',
};

const getFolderId = async ({
  signal,
  apiCertificate,
  locationId,
}: GetFolderIdParams) => {
  const fetchUrl = `https://hpi-api.sabacloud.com/v1/content/?q=(content_location%3D%3D${locationId.contentLocation})&f=(folder_id)&includeDetails=true`;
  const response = await fetch(fetchUrl, {
    signal,
    headers: {
      sabaCertificate: apiCertificate,
    },
  });

  const workspaceData: WorkspaceData = await response.json();

  const { url, securityDomain } = workspaceData?.results?.[0] || {};
  const { id, displayName } = workspaceData?.results?.[0]?.folder_id || {};

  return { id, displayName, url, securityDomain };
};

const getData = async ({
  signal,
  apiCertificate,
  locationId,
}: GetDataParams) => {
  const url = `https://hpi-api.sabacloud.com/v1/content/?q=(folder_id%3D%3D${locationId})&includeDetails=true&count=500`;
  const response = await fetch(url, {
    signal,
    headers: {
      sabaCertificate: apiCertificate,
    },
  });

  const folderData: FolderData = await response.json();

  const data = folderData?.results?.find(
    (result) => result.file_display_name === 'data.json'
  );

  const sData = folderData?.results?.find(
    (result) => result.file_display_name === 'subscribe.json'
  );


  const commentData = folderData?.results?.find(
    (result) => result.file_display_name === 'comments.json'
  );


  const ratingData = folderData?.results?.find(
    (result) => result.file_display_name === 'ratings.json'
  );
  //commondata 
  
  
  const commonData = folderData?.results?.find(
    (result) => result.file_display_name === 'common.json'
  );

console.log(commonData);
const hostData = folderData?.results?.find(
  (result) => result.file_display_name === 'host.json'
);




  return {
     dataLocation: data?.content_location,
     dataFileId: data?.id,
     subDataLocation: sData?.content_location, 
     subDataFileId: sData?.id, 
     commentFileId: commentData?.id, 
     commentDataLocation: commentData?.content_location, 
     ratingFileId: ratingData?.id, 
     ratingDataLocation: ratingData?.content_location, 
     commonFileId: commonData?.id, 
     commonDataLocation: commonData?.content_location,
     hostDataFileId: hostData?.id, 
     hostDataLocation: hostData?.content_location, };
};

const getJson = async ({
  signal,
  apiCertificate,
  contentId,
  contentLocation,
}: GetJsonParams) => {
  // const baseUrl = window.location.origin;
  const baseUrl = 'https://hpi.sabacloud.com';
  const url = `${baseUrl}/production/${contentId}/${contentLocation}/content.json?timestamp=` + new Date().getTime();
  const response = await fetch(url, {
    signal,
    headers: {
      sabaCertificacontentLocationte: apiCertificate,
    },
  });
  const jsonData: VideoData = await response.json();
  return jsonData;
};

const getSubJson = async ({
  signal,
  apiCertificate,
  contentId,
  contentLocation,
}: GetJsonParams) => {
  // const baseUrl = window.location.origin;
  const baseUrl = 'https://hpi.sabacloud.com';
  const url = `${baseUrl}/production/${contentId}/${contentLocation}/content.json?timestamp=` + new Date().getTime();
  const response = await fetch(url, {
    signal,
    headers: {
      sabaCertificate: apiCertificate,
    },
  });
  const jsonData: ChannelSubs = await response.json();
  return jsonData;
};

const getCommentJson = async ({
  signal,
  apiCertificate,
  contentId,
  contentLocation,
}: GetJsonParams) => {
  // const baseUrl = window.location.origin;
  const baseUrl = 'https://hpi.sabacloud.com';
  const url = `${baseUrl}/production/${contentId}/${contentLocation}/content.json?timestamp=` + new Date().getTime();
  const response = await fetch(url, {
    signal,
    headers: {
      sabaCertificate: apiCertificate,
    },
  });
  const jsonData: ChannelSubs = await response.json();
  return jsonData;
};

const getRatingJson = async ({
  signal,
  apiCertificate,
  contentId,
  contentLocation,
}: GetJsonParams) => {
  // const baseUrl = window.location.origin;
  const baseUrl = 'https://hpi.sabacloud.com';
  const url = `${baseUrl}/production/${contentId}/${contentLocation}/content.json?timestamp=` + new Date().getTime();
  const response = await fetch(url, {
    signal,
    headers: {
      sabaCertificate: apiCertificate,
    },
  });
  const jsonData: any = await response.json();
  return jsonData;
};

 
const getCommonJson = async ({
  signal,
  apiCertificate,
  contentId,
  contentLocation,
}: GetJsonParams) => {
  const baseUrl = 'https://hpi.sabacloud.com';
  const url = `${baseUrl}/production/${contentId}/${contentLocation}/content.json?timestamp=` + new Date().getTime();
  const response = await fetch(url, {
    signal,
    headers: {
      sabaCertificate: apiCertificate,
    },
  });
  const jsonData = await response.json();
  return jsonData;
};
const getHostJson = async ({
  signal,
  apiCertificate,
  contentId,
  contentLocation,
}: GetJsonParams) => {
  const baseUrl = 'https://hpi.sabacloud.com';
  const url = `${baseUrl}/production/${contentId}/${contentLocation}/content.json?timestamp=` + new Date().getTime();
  const response = await fetch(url, {
    signal,
    headers: {
      sabaCertificate: apiCertificate,
    },
  });

  const jsonData = await response.json();
  return jsonData;
};


const useData = () => {
  const { apiCertificate, workspaceUrls } = useGetWorkspaceInfo();


  // console.log('api certs', apiCertificate, workspaceUrls);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['data'],
    queryFn: async ({ signal }) => {
      const { id, displayName, securityDomain } = await getFolderId({
        signal,
        apiCertificate,
        locationId: workspaceUrls,
      });

      const dataUrl = await getData({
        signal,
        apiCertificate,
        locationId: id,
      });

      console.log('data', dataUrl);


      if (!workspaceUrls.contentId || !dataUrl.dataLocation) return null;

      const jsonData = await getJson({
        signal,
        apiCertificate,
        contentId: workspaceUrls.contentId,
        contentLocation: dataUrl.dataLocation,
      });

      const subData = await getSubJson({
        signal,
        apiCertificate,
        contentId: workspaceUrls.contentId,
        contentLocation: dataUrl.subDataLocation,
      });


      const commentData = await getCommentJson({
        signal,
        apiCertificate,
        contentId: workspaceUrls.contentId,
        contentLocation: dataUrl.commentDataLocation,
      });


      const ratingData = await getRatingJson({
        signal,
        apiCertificate,
        contentId: workspaceUrls.contentId,
        contentLocation: dataUrl.ratingDataLocation,
      });

      const commonData = await getCommonJson({
        signal,
        apiCertificate,
        contentId: workspaceUrls.contentId,
        contentLocation: dataUrl.commonDataLocation,
      });

      const hostData = await getHostJson({
        signal,
        apiCertificate,
        contentId: workspaceUrls.contentId,
        contentLocation: dataUrl.hostDataLocation,
      });
      


      return {
        jsonData,
        dataFileId: dataUrl.dataFileId,
        subDataFileID: dataUrl.subDataFileId,
        commentDataFileId: dataUrl.commentFileId,
        ratingDataFileId: dataUrl.ratingFileId,
        commonDataFileId: dataUrl.commonFileId,
        hostDataFileId: dataUrl.hostDataFileId,  
        displayName,
        subData,
        commentData,
        ratingData,
        commonData,
        hostData,
        securityDomain,
        id,
      };
    },
    retry: false,
  });

  return {
    workspaceData: data?.jsonData || (localData as VideoData),
    subData: data?.subData || {},
    commentData: data?.commentData || {},
    ratingData: data?.ratingData || {},
    commonData: data?.commonData || {},
    commentDataFileId: data?.commentDataFileId || '',
    commonDataFileId: data?.commonDataFileId || '',
    ratingDataFileId: data?.ratingDataFileId || '',
    subDataFileId: data?.subDataFileID || '',
    dataFileId: data?.dataFileId || '',
    hostDataFileId: data?.hostDataFileId || '', 
    hostData: data?.hostData || [], // ✅ Add this

    
    folderName: data?.displayName || '',
    folderSecurityDomain: data?.securityDomain || dummyDomain,
    folderId: data?.id || '',
    isLoadingData: isLoading,
    isErrorData: isError,
  };
};

export default useData;
