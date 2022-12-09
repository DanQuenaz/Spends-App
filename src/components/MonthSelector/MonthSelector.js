import React, {useState, useEffect} from "react";
import { Text, View, FlatList, TouchableOpacity, StyleSheet, Dimensions} from "react-native";

import moment from "moment";
import colors from "../../styles/colors";


const MonthSelector = (props) =>{
    const [ultimos_meses, setUltimosMeses] = useState([]);

    useEffect(()=>{
        const geraMeses = ()=>{
            const meses = [5, 4, 3, 2, 1, 0];
            var meses_aux = []
            meses.forEach(item=>{
                meses_aux.push( 
                    {
                        mes:moment().subtract(item, "month").format('MMM'),
                        id:parseInt(moment().subtract(item, "month").format('MM'))
                    } 
                );
            });
            setUltimosMeses(meses_aux);
        };

        geraMeses();
    }, []);

    return(
        <View>
            <FlatList
            data={ultimos_meses}
            keyExtractor={(item)=>item.id}
            horizontal={true}
            renderItem={({item})=>(
                <TouchableOpacity style={[styles.itemFiltroMes, {backgroundColor: props.mes_selecionado==item.id ? colors.cinza_3 : colors.cinza_2 } ]} onPress={()=>{props.setMesSelecionado(item.id);}}>
                    <Text style={{color:colors.branco}}>{item.mes}</Text>
                </TouchableOpacity>
            )}
        />
        </View>
    );

};

const styles = StyleSheet.create({

    itemFiltroMes:{
        backgroundColor:colors.cinza_3,
        marginHorizontal:3,
        marginVertical:5,
        justifyContent:'center',
        alignItems:'center',
        paddingHorizontal:10,
        width:Dimensions.get("window").width/6.87,
        height:30,
        borderRadius:8
    },

});

export default MonthSelector;


