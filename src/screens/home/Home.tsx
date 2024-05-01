import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { BottomNavigation, Button, Card, Chip, Icon, Button as PaperButton, TextInput as PaperTextInput, Searchbar, Text, TextInput, useTheme } from 'react-native-paper';

const ResourceRoute = () => {
    const theme = useTheme();

    const baseUrl: string = 'http://192.168.15.111:3000/api/v1/ws-resources';

    const [nomeRecurso, setNomeRecurso] = useState('');
    const [descricao, setDescricao] = useState('');

    const handleSalvarRecurso = async () => {
        try {
            const token = await AsyncStorage.getItem('token');

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
                {cardIsVisible && dados ? (
                    <Card mode='elevated' theme={{ colors: { elevation: { level1: '#F8F8FF' } } }} style={{ width: 250 }}>
                        <Text style={{ fontSize: 15, marginBottom: 20, marginTop: 10, textAlign: 'center', fontWeight: 'bold' }}>Recurso solicitado com sucesso<Icon source={'check'} size={20}></Icon></Text>
                        <Card.Content>
                            <Chip
                                selectedColor='#FFF'
                                style={dados.status === 'pendente' ? { backgroundColor: '#FFD700' } : { backgroundColor: '#32CD32' }}
                            >
                                Status: {dados.status}
                            </Chip>
                            <Text style={{ marginTop: 20, fontWeight: '500' }}>Nome do recurso: {dados.recurso ? dados.recurso.nome : 'Não tem dados desse recurso'}</Text>
                            <Text style={{ marginTop: 10, fontWeight: '500' }}>Nome do usuário: {dados.recurso && dados.recurso.usuario ? dados.recurso.usuario.nome : 'Não tem dados desse recurso'}</Text>
                        </Card.Content>
                    </Card>
                ) : (
                    <Text>Nenhum resultado encontrado</Text>
                )}
            </View>
        </View>
    );
};

const ConfirmarSolicitacao = () => {
    const baseUrl: string = 'http://192.168.15.111:3000/api/v1/ws-solicitacao/pendentes';

    const [solicitacoes, setSolicitacoes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const handleGetAllPendentes = async () => {
        try {
            const token = await AsyncStorage.getItem('token');

            const response = await axios.get(`${baseUrl}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSolicitacoes(response.data);
            setLoading(false);
        } catch (error) {
            Alert.alert('Não foi possível fazer a requisição. Tente novamente mais tarde.');
            setLoading(false);
            console.error(error);
        }
    }

    useEffect(() => { handleGetAllPendentes() }, []);

    const handleConfirmar = async (id: any) => {
        try {
            const baseUrl: string = 'http://192.168.15.111:3000/api/v1/ws-solicitacao';

            const token = await AsyncStorage.getItem('token');

            await axios.post(`${baseUrl}/${id}/confirmar`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            })

            handleGetAllPendentes();
        } catch (error) {
            Alert.alert(`Não foi possível confirmar a solicitação. Tente novamente mais tarde.`);
            console.error(error);
        }
    }

    return (
        <ScrollView>
            {loading ? (
                <Text>Carregando solicitações...</Text>
            ) : solicitacoes.length === 0 ? (
                <Text>Não tem nenhuma solicitação. Faça uma na aba ao lado.</Text>
            ) : (
                solicitacoes.map((solicitacao: any) => (
                    <Card key={solicitacao.id} style={{ margin: 10 }}>
                        <Card.Content>
                            <Chip
                                selectedColor='#FFF'
                                style={solicitacao.status === 'pendente' ? { backgroundColor: '#FFD700' } : { backgroundColor: '#32CD32' }}
                            >
                                Status: {solicitacao ? solicitacao.status : 'Não tem dados desse recurso'}
                            </Chip>
                            <Text style={{ marginTop: 10, fontWeight: '500' }}>Nome do recurso: {solicitacao.recurso.nome}</Text>
                            <Button style={{ marginTop: 20 }} onPress={() => handleConfirmar(solicitacao.id)}>Confirmar Solicitação</Button>
                        </Card.Content>
                    </Card>
                )))}
        </ScrollView>
    );
};

const FeedbackRoute = () => {
    const baseUrl: string = 'http://192.168.15.111:3000/api/v1/ws-solicitacao';
    const baseUrlFeedback: string = 'http://192.168.15.111:3000/api/v1/ws-feedback';

    const [solicitacoes, setSolicitacoes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [nota, setNota] = useState('');
    const [comentario, setComentario] = useState('');
    const [expandedCardIndex, setExpandedCardIndex] = useState<number | null>(null);

    const handleGetAll = async () => {
        try {
            const token = await AsyncStorage.getItem('token');

            if (!token) {
                throw new Error(`O token não foi recuperado ${token}`);
            }

            const response = await axios.get(`${baseUrl}/todas`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSolicitacoes(response.data);
            setLoading(false);
        } catch (error) {
            Alert.alert('Não foi possível fazer as busca das solicitações. Tente novamente mais tarde.');
            setLoading(false);
        }
    }

    useEffect(() => { handleGetAll() }, []);

    const handleFeedback = async (avaliadoId: any, solicitacaoId: any) => {
        try {
            const token = await AsyncStorage.getItem('token');

            await axios.post(`${baseUrlFeedback}`, {
                avaliadoId: avaliadoId,
                solicitacaoId: solicitacaoId,
                nota: nota,
                comentario: comentario
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            Alert.alert('Não foi possível dar o feedback. Tente novamente mais tarde.');
            console.error(error);
        }
    }

    const toggleCardExpansion = (index: number) => {
        setExpandedCardIndex(expandedCardIndex === index ? null : index);
    }

    return (
        <ScrollView>
            {loading ? (
                <Text>Carregando solicitações, aguarde...</Text>
            ) : solicitacoes.length === 0 ? (
                <Text>Você não tem nenhuma solicitação, faça uma na aba ao lado.</Text>
            ) : (
                solicitacoes.map((solicitacao: any) => (
                    <Card key={solicitacao.id} style={{ margin: 10 }}>
                        <Card.Content>
                            <Chip
                                selectedColor='#FFF'
                                style={solicitacao.status === 'pendente' ? { backgroundColor: '#FFD700' } : { backgroundColor: '#32CD32' }}
                            >
                                Status: {solicitacao ? solicitacao.status : 'Não tem dados desse recurso'}
                            </Chip>
                            <Text style={{ marginTop: 10, fontWeight: '500' }}>Nome do proprietário: {solicitacao.proprietario.nome}</Text>
                            <Button style={{ marginTop: 20 }} onPress={() => toggleCardExpansion(solicitacao.id)} icon={'emoticon-excited'}>Dar um feedback</Button>
                        </Card.Content>
                        {expandedCardIndex === solicitacao.id && (<Card.Content>
                            <TextInput
                                mode='outlined'
                                label='Nota'
                                value={nota}
                                onChangeText={text => setNota(text)}
                            />
                            <TextInput
                                mode='outlined'
                                label='Comentário'
                                value={comentario}
                                onChangeText={text => setComentario(text)}
                            />
                            <Button onPress={() => {
                                handleFeedback(solicitacao.proprietario.id, solicitacao.id);
                                setExpandedCardIndex(null);
                            }}>Enviar Feedback</Button>
                        </Card.Content>)}
                    </Card>
                )))}
        </ScrollView>
    );
};

export const Home = () => {
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