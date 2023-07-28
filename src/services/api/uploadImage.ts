import { FILEROOM_API_KEY } from "~/constants/env";
import { Asset } from "react-native-image-picker";
import {Platform} from 'react-native';

export const uploadImage = async (singleFile: Asset, inspectionId: string, email: string) => {
  const metadata = {
    user: email,
    createdOn: "02/15/2023",
    department: "Maintenance",
    documentType: "inspection",
    documentFormat: "image",
    inspectionId,
  };
  const data = new FormData();

  data.append("Authority", "pfdylv");
  data.append("Name", "Test Document - Screenshot");
  data.append("IsGlobal", "false");
  data.append("Version", "1");
  data.append("IsGlobal", "false");
  data.append("Tags", "Inspection, Image, Other Identifier");
  data.append("Description", "Image Upload Test");
  data.append("Metadata", JSON.stringify(metadata));

  // @ts-ignore // ALERT КОСТИЛЬ!!! 
  data.append('Files', {
    name: singleFile.fileName,
    type: singleFile.type,
    uri: Platform.OS === 'android' ? singleFile.uri! : singleFile.uri!.replace('file://', ''),
  });

  // const fileResponse = await fetch(singleFile.uri!);
  // const fileBlob =  await fileResponse.blob();


  // const file = new File([singleFile.base64!], singleFile.uri!, {
  //   type: singleFile.type,
  // });
  
    // Append the file to the FormData
  // data.append("Files", file, singleFile.fileName);
  
  console.log('====================================');
  // console.log("file", singleFile)
  console.log("data", data);
  console.log('====================================');

  try {
    const uploadResponse: Response = await fetch(
      "https://xjnnqual9j.execute-api.us-west-2.amazonaws.com/dev/api/files",
      {
        method: "POST",
        headers: {
          "x-api-key": FILEROOM_API_KEY,
          "Content-Type": "multipart/form-data",
          "accept": "text/plain"
        },
        body: data,
      }
    );

    if (uploadResponse.ok) {
      const responseData = await uploadResponse.json();
      console.log("Upload result:", responseData);
      return responseData;
    } else {
      console.log(
        "Upload failed:",
        uploadResponse.status,
        uploadResponse.statusText
      );
    }
  } catch (error) {
    console.log("Upload error:", error);
  }
};
