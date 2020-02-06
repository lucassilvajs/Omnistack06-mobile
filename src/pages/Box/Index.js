import React, { Component } from 'react';

import api from '../../services/api';

import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';

import socket from 'socket.io-client';

import styles from './styles';
import Icon from 'react-native-vector-icons/MaterialIcons';

import ImagePicker from 'react-native-image-picker';


import { formatDistance } from 'date-fns';
import  pt from 'date-fns/locale/pt'


import logo from '../../assets/logo.png'

export default class Box extends Component {

    state = {
        box: ''
    }

    async componentDidMount() {
        const box = await AsyncStorage.getItem('@RocketBox:box');
        this.subscribeToNewFiles(box);
        const response = await api.get(`boxes/${box}`);
        this.setState({ box: response.data});
    }

    openFile = async (file) => {
        try {
            const filePath = `${RNFS.DocumentDirectoryPath}/${file.title}`;
            await RNFS.downloadFile({
                fromUrl: file.url,
                toFile: filePath,
            });
            await FileViewer.open(filePath);
            
        } catch ( err ) {

        }
    }

    renderItem = ( { item } ) => (
        <TouchableOpacity
            style={styles.file}
            onPress={() => {this.openFile(item)}}
        >
            <View style={styles.fileInfo}>
                <Icon name="insert-drive-file" size={24} color="#a5cfff" />
                <Text style={styles.fileTitle}>{item.title}</Text>
            </View>           

            <Text style={styles.fileDate}>
                {formatDistance(new Date(item.createdAt), new Date(), {
                        locale: pt
                    })
                }
            </Text> 
        </TouchableOpacity>
    );

    handleUpload = async () => {
        ImagePicker.launchImageLibrary({}, async upload => {
            if(upload.error) {

            }else if(upload.didCancel) {

            }else{
                const data = new FormData();

                const [prefix, suffix] = upload.fileName.split('.');
                const ext = suffix.toLocaleLowerCase() === 'heic' ? 'jpg' : suffix;
                data.append('file', {
                    uri: upload.uri,
                    type: upload.type,
                    name: `${prefix}.${ext}`
                });

                console.log('Await')
                const idBox = this.state.box._id
                const resp = await api.post(`boxes/${idBox}/files`, data);
                console.log(resp)
            }
        })
    }

    subscribeToNewFiles = (box) => {
        const io = socket('https://omnistack06.herokuapp.com');
        io.emit('connectRoom', box);
        io.on('file', data => {
            this.setState({
                box:  {...this.state.box, files: [data, ...this.state.box.files ]}
            })
        })
    }

    exitBox = async () => {
        await AsyncStorage.removeItem('@RocketBox:box');
        this.props.navigation.navigate("Main");
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={this.exitBox}>
                    <Text style={styles.boxTile}>{this.state.box.title}</Text>
                </TouchableOpacity>
                <FlatList style={styles.list}
                    data={this.state.box.files}
                    keyExtractor={file => file._id}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    renderItem={this.renderItem}
                />

                <TouchableOpacity style={styles.fab} onPress={this.handleUpload}>
                    <Icon name="cloud-upload" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
        );
    }
}