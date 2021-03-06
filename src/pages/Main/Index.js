import React, { Component } from 'react';

import api from '../../services/api';

import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import styles from './styles';

import logo from '../../assets/logo.png'

export default class Main extends Component {

    state = {
        newBox: ''
    }

    async componentDidMount() {
        const box = await AsyncStorage.getItem('@RocketBox:box');

        if(box) {
            this.props.navigation.navigate("Box");
        }
    }

    handleSignIn = async () => {
        const response = await api.post('boxes', {
            title: this.state.newBox
        });

        await AsyncStorage.setItem('@RocketBox:box', response.data._id);
      
        this.props.navigation.navigate("Box");
    }

    render() {
        return (
            <View style={styles.container}>
                <Image style={styles.logo} source={logo} />
                <TextInput style={styles.input}
                    placeholder="Crie um box"
                    placeholderTextColor="#999"
                    autoCapitalize="none"
                    autoCorrect={false}
                    underlineColorAndroid="transparent"
                    onChangeText={text => this.setState({newBox: text})}
                />

                <TouchableOpacity onPress={this.handleSignIn} style={styles.button}>
                    <Text style={styles.buttonText}>Criar</Text>
                </TouchableOpacity> 
            </View>
        )
    }
}