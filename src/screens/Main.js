import React, {useEffect, useState} from "react";
import { Text, View } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";



import axios from "axios";
import LocalStorage from "../class/LocalStorage";

import login_style from "../styles/login_styles";
import colors from "../styles/colors";
import { Image } from "react-native";

const Main = () =>{
    const navigation = useNavigation();
    

    useEffect(()=>{


    //    return ()=> OneSignal.removeEventListener('opened', onOpened);
    }, []);

    useFocusEffect(
        React.useCallback(() => {

            async function fetchData(){
                const localStorage = new LocalStorage()
                const token = await localStorage.getData("@TOKEN");
    
                if(!(token == null)){
                    axios.defaults.headers.common['Authorization'] = `bearer ${token}`
                    navigation.navigate("HomeIndex")
                }else{
                    navigation.navigate("Login")
                }
            };
    
            fetchData();
            
            return () => {

                // alert('Screen was unfocused');
                // Useful for cleanup functions

            };
        }, [])
    );


    return(
        (
            <View style={login_style.container}>
                <Image
                    source={require('../assets/imgs/logo/spends_bg.png')}
                    style={{width:'65%', height:'35%'}}
                />
            </View>
            
      
        )
    )
};

export default Main;