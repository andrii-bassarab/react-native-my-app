import RNFS, { DownloadResult } from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import { FILEROOM_API_KEY, BASE_DOCUMENT_API } from '~/constants/env';
import { Alert } from 'react-native';

export async function openFile(fileToRead: any, closeLoader: any) {
  try {
    // Download the file to a temporary path using react-native-fs
    const localFile = `${RNFS.DocumentDirectoryPath}/temporaryfile.${fileToRead.extension}`;
    const response: DownloadResult = await RNFS.downloadFile({
      fromUrl: `${BASE_DOCUMENT_API}/files/${fileToRead.id}`,
      toFile: localFile,
      headers: {
        "x-api-key": FILEROOM_API_KEY
      }
    }).promise;

    if (response.statusCode === 200) {
      // Open the downloaded file using react-native-file-viewer
      try {
        await FileViewer.open(localFile, { displayName: fileToRead.name, onDismiss: closeLoader });
      } catch (error) {
        closeLoader();
        console.error('Error opening file:', error);
        Alert.alert('Error opening file:', typeof error?.message === 'string' ? error?.message : ""); 
      }
    } else {
      console.error('Error downloading file:', response);
      closeLoader();
    }
  } catch (error) {
    console.error('Error downloadFile file:', error);
    closeLoader();
  }
}
