import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, Alert, KeyboardAvoidingView} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';



export const CreateEmployee = ( {navigation, route} ) => {

    const getDetails = (type) => {
       if(route.params){
          switch(type) {
            case 'name':
              return route.params.name
            case 'phone':
              return route.params.phone
            case 'email':
              return route.params.email
            case 'salary':
              return route.params.salary
            case 'picture':
              return route.params.picture 
            case 'position':
              return route.params.position    
           }
          }

          return ''
       } 
         
    const [name, setName] = useState(getDetails('name'));
    const [phone, setPhone] = useState(getDetails('phone'));
    const [email, setEmail] = useState(getDetails('email'));
    const [salary, setSalary] = useState(getDetails('salary'));
    const [picture, setPicture] = useState(getDetails('picture'));
    const [position, setPosition] = useState(getDetails('position'));
    const [modal, setModal] = useState( false );
    const [enableShift, setEnableShift] = useState(false)

   
    const submitData = () => {
       fetch('http://10.0.2.2:3000/send-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              name,
              email,
              phone,
              salary,
              picture,
              position
          })
       })
       .then(res => res.json())
       .then(data => {
         Alert.alert(`${data.name} saved successfully`);
          navigation.navigate('Home');
       }).catch(err => {
        Alert.alert('Something went wrong');
      });
    }
  
    

    const updateDetails = () => {
      fetch('http://10.0.2.2:3000/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: route.params._id,
            name,
            email,
            phone,
            salary,
            picture,
            position
        })
     })
     .then(res => res.json())
     .then(data => {
       Alert.alert(`${data.name} is updated`);
        navigation.navigate('Home');
     })
     .catch(err => {
      Alert.alert('Something went wrong');
    });
    }
    


    const pickFromGallery = async () => {
     const { granted } = await Permissions.askAsync( Permissions.CAMERA_ROLL );
     if( granted ) {
        let data =  await ImagePicker.launchImageLibraryAsync({
           mediaTypes: ImagePicker.MediaTypeOptions.Images,
           allowsEditing: true,
           aspect: [1,1],
           quality: 0.5
         });
       
         if( !data.cancelled ) {
          let newFile = {
            uri: data.uri,
            type: `test/${ data.uri.split('.')[1] }`,
            name: `test/${ data.uri.split('.')[1] }`,
          }
          hadleUpload( newFile );
        }
         
     } else {
        Alert.alert( "you need to give up permission to work" );
     }
    }


    const pickFromCamera = async () => {
      const { granted } = await Permissions.askAsync( Permissions.CAMERA );
      if( granted ) {
         let data =  await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1,1],
            quality: 0.5
          });
         
          if( !data.cancelled ) {
            let newFile = {
              uri: data.uri,
              type: `test/${ data.uri.split('.')[1] }`,
              name: `test/${ data.uri.split('.')[1] }`,
            }
            hadleUpload( newFile );
          }
          
      } else {
         Alert.alert( "you need to give up permission to work" );
      }
     }

 
     const hadleUpload = (image) => {
         const data = new FormData()
         data.append('file', image)
         data.append('upload_preset', 'employee-app')
         data.append('cloud_name', 'dhw8k5rpd')
         fetch('https://api.cloudinary.com/v1_1/dhw8k5rpd/image/upload', {
           method: 'post',
           body: data
         }).then( res => res.json())
           .then( data => {
             setPicture( data.url );
             setModal( false );
           }).catch(err => {
            Alert.alert('Error while uploading');
          });
     }
    
    
    return (
      <KeyboardAvoidingView
       behavior="position"
       style={ StyleSheet.root }
       enabled={enableShift}
       > 
        <View >
            <TextInput
                style={ styles.inputStyle }
                label="name"
                value={ name }
                theme={ theme }
                onFocus={() => setEnableShift(false)}
                mode="outlined"
                onChangeText={text => setName(text)}
            />

              <TextInput
                style={ styles.inputStyle }
                label="email"
                value={ email}
                theme={ theme }
                onFocus={() => setEnableShift(false)}
                mode="outlined"
                onChangeText={text => setEmail(text)}
            />

              <TextInput
                style={ styles.inputStyle }
                label="phone"
                value={ phone }
                onFocus={() => setEnableShift(false)}
                theme={ theme }
                keyboardType= "number-pad"
                mode="outlined"
                onChangeText={text => setPhone(text)}
            />

              <TextInput
                style={ styles.inputStyle }
                label="salary"
                value={ salary }
                onFocus={() => setEnableShift(true)}
                theme={ theme }
                mode="outlined"
                onChangeText={text => setSalary(text)}
            />
              
              <TextInput
                style={ styles.inputStyle }
                label="position"
                value={ position }
                onFocus={() => setEnableShift(true)}
                theme={ theme }
                mode="outlined"
                onChangeText={text => setPosition(text)}
            />

              <Button
                 style={ styles.inputStyle } 
                 icon={ picture == ''? 'upload': 'check' }  
                 mode="contained" 
                 onPress={() => setModal( true ) }
               > 
                Upload Image
               </Button> 

              {
                (route.params) ?
                <Button
                style={ styles.inputStyle } 
                icon="content-save"
                mode="contained" 
                onPress={() => updateDetails()}> 
               Update details
              </Button> 
              :
              <Button
              style={ styles.inputStyle } 
              icon="content-save"
              mode="contained" 
              onPress={() => submitData()}> 
             Save
            </Button> 
              
              }
              
              
             


              <Modal
                 animationType="slide"
                 transparent={ true }
                 visible={ modal }
                 onRequestClose={ () => {
                     setModal( false )
                 }}
              >
                 <View style={ styles.modalView } >
                      <View style={ styles.modalButtonView } >
                         <Button 
                         icon="camera"
                         theme={ theme }
                         mode="contained" 
                         onPress={() => pickFromCamera()}
                          
                         > 
                         Camera
                         </Button>

                           <Button 
                         icon="image-area"
                         theme={ theme }
                         mode="contained" 
                         onPress={() => pickFromGallery() }
                         > 
                         Gallery
                         </Button> 

                      </View>

                    <Button 
                     theme={ theme }
                     onPress={() => setModal( false ) }
                    > 
                   Cancel
                   </Button> 
                 </View>

              </Modal>
            </View>
            </KeyboardAvoidingView>

    )
}


const theme = {
    colors: {
        primary: "#006aff"
    }
}



const styles = StyleSheet.create({

    root: {
        flex: 1,

    },
    inputStyle: {
        margin: 5
    },
    modalView: {
        position: "absolute",
        bottom: 2,
        width: "100%",
        backgroundColor: "white"
    },
    modalButtonView: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10
    },
  
});


export default CreateEmployee;