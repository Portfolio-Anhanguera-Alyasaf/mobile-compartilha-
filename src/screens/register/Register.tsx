import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { MD3Theme, Button as PaperButton, TextInput as PaperTextInput, useTheme } from 'react-native-paper';

const Register = () => {
    const baseUrl: string = 'http://192.168.15.111:3000/api/v1/ws-user';

    const navigation = useNavigation<any>();

    const theme: MD3Theme = useTheme();

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            await axios.post(`${baseUrl}`, {
                nome: nome,
                email: email,
                senha: password
            });
            Alert.alert('Você foi registrado com sucesso. Faça login');
        } catch (error) {
            Alert.alert(`Não foi possível registrar. Tente novamente mais tarde.`);
            console.error(error);
        }

    };

    const handleRedirect = () => {
        navigation.navigate('Login');
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Bem-vindo</Text>
            <Text style={{ fontSize: 10, fontWeight: '400', marginTop: 10 }}>Por favor, faça seu registro abaixo</Text>
            <PaperTextInput
                textColor='#000'
                label={'Nome'}
                mode='outlined'
                activeOutlineColor='#1976d2'
                value={nome}
                onChangeText={text => setNome(text)}
                style={{ width: '80%', marginBottom: 10, marginTop: 20 }}
            />
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
            <PaperButton mode="contained" onPress={handleRegister} style={{ width: '80%', marginBottom: 10, backgroundColor: theme.colors.primary = '#1976d2' }}>
                Registrar
            </PaperButton>
            <Text style={{ marginTop: 10 }}>
                Você já tem uma conta? <Text onPress={handleRedirect} style={{ fontWeight: 'bold' }}>Faça login</Text>
            </Text>
        </View>
    );
};

export default Register;