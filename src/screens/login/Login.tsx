import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { MD3Theme, Button as PaperButton, TextInput as PaperTextInput, useTheme } from 'react-native-paper';

export const Login = () => {
    const baseUrl: string = 'http://192.168.15.111:3000/auth/login';

    const navigation = useNavigation<any>();

    const theme: MD3Theme = useTheme();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${baseUrl}`, {
                email: email,
                senha: password
            });

            const token = response.data.access_token;

            if (token !== null) {
                await AsyncStorage.setItem('token', token);
                navigation.navigate('Home');
            } else {
                Alert.alert(`Por favor, faça login. Token: ${token}`);
            }
        } catch (error) {
            Alert.alert(`Não foi possível fazer login. Tente novamente mais tarde.`);
            console.error(error);
        }

    };

    const handleRedirect = () => {
        navigation.navigate('Cadastro');
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Login</Text>
            <Text style={{ fontSize: 10, fontWeight: '400', marginTop: 10 }}>Por favor, faça seu login abaixo</Text>
            <PaperTextInput
                label="E-mail"
                value={email}
                mode='outlined'
                activeOutlineColor='#1976d2'
                onChangeText={text => setEmail(text)}
                style={{ width: '80%', marginBottom: 10 }}
            />
            <PaperTextInput
                label="Senha"
                value={password}
                mode='outlined'
                activeOutlineColor='#1976d2'
                onChangeText={text => setPassword(text)}
                secureTextEntry
                style={{ width: '80%', marginBottom: 20 }}
            />
            <PaperButton mode="contained" onPress={handleLogin} style={{ width: '80%', marginBottom: 10, backgroundColor: theme.colors.primary = '#1976d2' }}>
                Login
            </PaperButton>
            <Text style={{ marginTop: 10 }}>
                Não tem uma conta? <Text onPress={handleRedirect} style={{ fontWeight: 'bold' }}>Faça o seu registro</Text>
            </Text>
        </View>
    )
}
