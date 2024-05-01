import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useState } from 'react';
import { Alert, View } from 'react-native';
import { BottomNavigation, Card, Button as PaperButton, TextInput as PaperTextInput, Searchbar, Text, useTheme } from 'react-native-paper';

const ResourceRoute = () => {
    const theme = useTheme();

    const baseUrl: string = 'http://192.168.15.111:3000/api/v1/ws-resources';

    const [nomeRecurso, setNomeRecurso] = useState('');
    const [descricao, setDescricao] = useState('');

    const handleSalvarRecurso = async () => {
        try {
            const token = await AsyncStorage.getItem('token');

            console.log(token);

            await axios.post(`${baseUrl}`, {
                nome: nomeRecurso,
                descricao: descricao,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            console.log(token);
        } catch (error) {
            Alert.alert(`Seu token expirou`);
            console.error(error);
        }
    }
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 23, fontWeight: 'bold', marginBottom: 30 }}>Salve o seu recurso para compartilhar com outros moradores!</Text>
            <PaperTextInput
                label="Nome do recurso"
                value={nomeRecurso}
                mode='outlined'
                activeOutlineColor='#1976d2'
                onChangeText={text => setNomeRecurso(text)}
                style={{ width: '80%', marginBottom: 10 }}
            />
            <PaperTextInput
                label="Descrição"
                value={descricao}
                mode='outlined'
                activeOutlineColor='#1976d2'
                onChangeText={text => setDescricao(text)}
                style={{ width: '80%', marginBottom: 20 }}
            />
            <PaperButton mode="contained" onPress={handleSalvarRecurso} style={{ width: '80%', marginBottom: 10, marginTop: 20, backgroundColor: theme.colors.primary = '#1976d2' }}>
                Salvar recurso
            </PaperButton>
        </View>
    );
};

const SolicitacaoRoute = () => {
    const theme = useTheme();

    const baseUrl: string = 'http://192.168.15.111:3000/api/v1/ws-solicitacao';

    const [nomeRecurso, setPesquisaNomeRecurso] = useState('');
    const [dados, setDados] = useState<any | null>(null);
    const [cardIsVisible, setCardIsVisible] = useState(false);

    const handlePesquisar = async () => {
        try {
            const token = await AsyncStorage.getItem('token');

            const response = await axios.post(`${baseUrl}`, {
                nomeRecurso: nomeRecurso,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            setCardIsVisible(true);
            const data = response.data;
            setDados(data);
        } catch (error) {
            Alert.alert(`Seu token expirou`);
            console.error(error);
        }
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 30 }}>Faça uma solicitação de um recurso aqui!</Text>
            <Text style={{ fontSize: 10, fontWeight: '400', marginBottom: 15 }}>Faça a pesquisa de um recurso abaixo</Text>
            <Searchbar
                iconColor='#1976d2'
                placeholder='Pesquisar'
                value={nomeRecurso}
                onChangeText={text => setPesquisaNomeRecurso(text)}
                style={{ width: '80%', marginBottom: 10, backgroundColor: theme.colors.primary = '#F8F8FF' }}
                onClearIconPress={() => setPesquisaNomeRecurso('')}
                onIconPress={handlePesquisar}
            />
            <View style={{ marginTop: 30 }}>
                {cardIsVisible ? <Card>
                    <Card.Title title="Recurso solicitado" />
                    <Card.Content>
                        <Text>Status: {dados ? dados.status : 'Não tem dados desse recurso'}</Text>
                        <Text>ID: {dados ? dados.id : 'Não tem dados desse recurso'}</Text>
                        <Text>Nome do recurso: {dados && dados.recurso ? dados.recurso.nome : 'Não tem dados desse recurso'}</Text>
                        <Text>Nome do usuário: {dados && dados.recurso && dados.recurso.usuario ? dados.recurso.usuario.nome : 'Não tem dados desse recurso'}</Text>
                    </Card.Content>

                </Card> : cardIsVisible}
            </View>
        </View>
    );
};

const ConfirmarSolicitacao = () => <Text>Confirmação</Text>;

const FeedbackRoute = () => <Text>FeedBack</Text>;

export const Home = () => {
    const theme = useTheme();

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'resource', title: 'Recursos', focusedIcon: 'archive', unfocusedIcon: 'archive-outline' },
        { key: 'request', title: 'Solicitação', focusedIcon: 'check-decagram', unfocusedIcon: 'check-decagram-outline' },
        { key: 'confirm', title: 'Confirmar solicitação', focusedIcon: 'alert-octagram', unfocusedIcon: 'alert-octagram-outline' },
        { key: 'feedback', title: 'Feedback', focusedIcon: 'emoticon-excited', unfocusedIcon: 'emoticon-excited-outline' },
    ]);

    const renderScene = BottomNavigation.SceneMap({
        resource: ResourceRoute,
        request: SolicitacaoRoute,
        confirm: ConfirmarSolicitacao,
        feedback: FeedbackRoute,
    });

    return (
        <BottomNavigation
            activeColor='#1976d2'
            inactiveColor='#1976d2'
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene}
            sceneAnimationEnabled
            barStyle={{ backgroundColor: '#F8F8FF' }}
        />
    );
};