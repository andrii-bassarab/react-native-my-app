import RNFS, { DownloadResult } from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import { FILEROOM_API_KEY, BASE_DOCUMENT_API } from '~/constants/env';

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
      console.log("rendered")
      await FileViewer.open(localFile, { displayName: fileToRead.name, onDismiss: closeLoader });
    } else {
      console.error('Error downloading DOC file:', response);
    }
  } catch (error) {
    console.error('Error opening file:', error);
  }
}
