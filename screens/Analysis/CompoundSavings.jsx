

import React, { useState } from 'react';
import { View, Button, Text, FlatList, Image, StyleSheet } from 'react-native';
import ImagePicker from '@/components/ImagePicker';
import ImageUploader from '../../components/ImageUploader';
// import { uploadImages } from '@/components/ImageUploader';


const CompoundSavings = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const propertyId = 11;

    return (
        <View style={styles.container}>
            <ImageUploader propertyId={propertyId} />
        </View>
    )
}

export default CompoundSavings

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})



// const ParentComponent = () => {
//     const [images, setImages] = useState([]);
//     const [uploadedImages, setUploadedImages] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const propertyId = 10;

//     const handleUpload = async () => {
//         try {
//             const response = await uploadImages(images, propertyId, setLoading, setError);
//             if (response && response.data) {
//                 setUploadedImages(response.data);
//                 setImages([]);
//                 alert(response.status);
//             }
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     return (
//         <View style={styles.container}>
//             <ImagePickerComponent onImagesSelected={setImages} />
//             <Button
//                 title={loading ? 'Uploading...' : 'Upload Images'}
//                 onPress={handleUpload}
//                 disabled={loading || images.length === 0}
//             />
//             {error && <Text style={styles.errorText}>{error}</Text>}

//             {uploadedImages.length > 0 && (
//                 <View style={styles.uploadedContainer}>
//                     <Text style={styles.successText}>Uploaded Images:</Text>
//                     <FlatList
//                         data={uploadedImages}
//                         keyExtractor={(item, index) => index.toString()}
//                         renderItem={({ item }) => (
//                             <View style={styles.imageContainer}>
//                                 <Image source={{ uri: item.image }} style={styles.imagePreview} />
//                             </View>
//                         )}
//                     />
//                 </View>
//             )}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 16,
//     },
//     errorText: {
//         color: 'red',
//         marginTop: 16,
//     },
//     successText: {
//         color: 'green',
//         marginTop: 16,
//         marginBottom: 8,
//     },
//     uploadedContainer: {
//         marginTop: 16,
//         width: '100%',
//         alignItems: 'center',
//     },
//     imageContainer: {
//         margin: 8,
//     },
//     imagePreview: {
//         width: 100,
//         height: 100,
//         resizeMode: 'cover',
//         borderRadius: 8,
//     },
// });

// export default ParentComponent;
