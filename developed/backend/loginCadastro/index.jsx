import { Image, View, StyleSheet, Text, Pressable, Alert } from "react-native";
import { Link, router } from 'expo-router'
import { apiConfig } from "@/utils/api";
import { Input, Icon } from 'react-native-elements'
import { useEffect, useState } from "react";
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();

export default function LoginPage()
{
    //State usado exclusivamente para controlar o icone e o efeito de secureTextEntry no campo senha
    const [passwordVisible, SetPasswordVisible] = useState(true)

    //States feitos para controlar oque o usuario esta digitando nos Inputs
    // Por questão visual apenas, foi colocado valores iniciais quaisquer nos states 
    const [email, setEmail] = useState('@')
    const [password, setPassword] = useState('_password_')

    //Campos feitos para controlar se os campos tem de erro
    const [isEmailError, setIsEmailError] = useState(false)
    const [isPasswordError, setIsPasswordError] = useState(false)

    useEffect(() => {
        if(!email.trim().includes('@') || email == null)
            setIsEmailError(true)
        else
            setIsEmailError(false)
        if(password.length != 10 || password == null)
            setIsPasswordError(true)
        else
            setIsPasswordError(false)
    }, [email, password]);

        //Função usada pra enviar o post para a rota da api responsavel pelo login
        async function login()
        {
            if(!isPasswordError && !isEmailError && email != '@' && password != '_password_')
            {
                try
                {
                    //Ja que a API é padrão para todo o sistema, isolei as configurações gerais
                    //e apenas importo elas aonde preciso e uso o método http que eu quero
    
                    let res = await apiConfig.post('/login',{
                        email: email,
                        senha: password
                    });
    
                    if(res.status == 204){
                        return Alert.alert('Ops...','Usuario ou senha incorretos!',
                            [
                                {
                                    text: 'Ok'
                                }
                            ]
                        )
                    }
                    else
                    router.replace('/(home)')
                }
                catch(error)
                {
                    console.log(error)
                    throw new Error('Erro ao logar... :(');        
                }
            }
        }

    return(
        <View style={estilo.tela}>
                            <Image
                    style={estilo.imagem}
                    source={require('../assets/images/LogoPreparaVest.png')}
                    resizeMode="stretch"
                />
            <View style={estilo.form}>
                <Text style={estilo.texto}>Login</Text>
                <View>
                <Input 
                    placeholder="Digite o email..."
                    label="Email"
                    onChangeText={text => setEmail(text)}
                    errorMessage={isEmailError ? 'Email invalido!' : ''}
                    inputContainerStyle={
                        !isEmailError?
                        estilo.input_container
                        :
                        estilo.input_container_error
                    }
                />
                <Input 
                     placeholder="Digite a senha..."
                     label="Senha"
                     onChangeText={text => setPassword(text)}
                     secureTextEntry={passwordVisible}
                     errorMessage={isPasswordError ? 'Senha invalida!' : ''}
                     maxLength={10}
                     inputContainerStyle={
                         !isPasswordError?
                         estilo.input_container
                         :
                         estilo.input_container_error
                     }
                     rightIcon={
                         passwordVisible ? 
                         <Icon 
                             name="visibility-off"
                             type="material"
                             size={22}
                             onPress={()=> SetPasswordVisible(!passwordVisible)}
                         />
                         :
                         <Icon 
                             name="visibility"
                             type="material"
                             size={22}
                             onPress={()=> SetPasswordVisible(!passwordVisible)}
                         />
                     }   
                />
                </View>
                <View style={estilo.view_botoes}>
                        <Pressable style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}
                        onPress={() => navigation.navigate('Cadastro')}>
                            <Text>Cadastrar-se</Text>
                        </Pressable>
                    <Link href={'(screens)/(home)/index'} asChild>
                    <Pressable style={estilo.botoes} onPress={()=> navigation.navigate("Login")}>
                        <Text style={estilo.texto_botoes} >Entrar</Text>
                    </Pressable>          
                    </Link>    
                </View>
            </View>
        </View>
    )
}

const estilo = StyleSheet.create({
    tela: {
        flex: 1,
        backgroundColor:"#38B6FF",
        alignItems: 'center',
        justifyContent: 'center',
      },
      form: {
        height:450,
        width:350,
        backgroundColor: "#FCFCFC",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: 'center',
        fontFamily: 'Kollektif',
        padding: 20 
      },
    imagem: {
        width: 500,
        height: 250,
        margin: -50
      },
      texto: {
        color: "#000",
        fontSize: 40,   
        textAlign: 'center',
        padding: 20
      },
    input_container_error : {
        borderWidth: 0,
        backgroundColor: "#ECECEC",
        height: 50,
        width: 300,
        margin: 10,
        borderRadius: 10,
        padding:30,
        color: '#797976',
        fontSize: 18
    },
    input_container: {
      backgroundColor: "#ECECEC",
      height: 50,
      width: 300,
      margin: 10,
      borderRadius: 10,
      padding:30,
      color: '#797976',
      fontSize: 18
    },
    view_botoes: {
        //marginTop: 10,
        //flexDirection: 'row', 
        width: '100%',
        gap: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    botoes: {
        height: 50,
        width: 100,
        backgroundColor: '#4776DF',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
      },
    texto_botoes : {
        color: 'white',
        fontSize: 20
    }
})