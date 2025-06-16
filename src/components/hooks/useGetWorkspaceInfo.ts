import { CustomWindow } from '@/types/types';
import useGetUserInfo from './useGetUserInfo';

const dummyCertificate ='TkEyUFJEMDAwNF4jXl91WW85aWU0WFFKaFQ4Wkc3Z0t1WXEtY2R4UWptLUtxUDdFejE0STNiY3drdkJwVWdFVjNmUFh5TlVOb2pHbWtpeEluajlsbE5DOERqY2phRmgyRlQ5SnFXRkJSOHI1MENsYlJ0S1JCRVhqazkzdEVTQjZNMHAtMHotMFFkVjMzOF80NWljUldrZHNNOVA0eDhtdGhLQQ';
const dummyUrl = '/production/NA2PRD0004/sabacr283185534517346391/';
const dummyUserId = 'emplo000000003174501';

const iFrame =
  window.parent.document.querySelector<HTMLIFrameElement>('#workspace');
 
  console.log('iframe',iFrame);
const splitUrl =
  iFrame?.contentWindow?.location.pathname.split('/') || dummyUrl.split('/');

const customWindow = window.parent.parent as CustomWindow;

const useGetWorkspaceInfo = () => {
  const { userData } = useGetUserInfo();
  
  const workspaceUrls = {
    contentId: splitUrl[2],
    contentLocation: splitUrl[3],
  };

  const userId = customWindow?.Saba?.site?.env?.session?.userId || dummyUserId;
  const apiCertificate =
    customWindow?.Saba?.site?.env?.microapp?.apiCertificate || dummyCertificate;
  
  return {
    workspaceUrls,
    userId,
    userName: userData?.userName || '',
    userData:userData ||{},
    apiCertificate,
  };
};

export default useGetWorkspaceInfo;
