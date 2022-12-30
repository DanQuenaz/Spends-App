import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { TelaSimples } from "../components/TelaSimples";
import { BackCard } from "../components/BackCard";
import colors from "../styles/colors";
import DropDownPicker from "react-native-dropdown-picker";
import moment from "moment/moment";
import 'moment/locale/pt-br';

import { useApi } from "../Hooks/useApi";
import { useLocalStorage } from "../Hooks/useLocalStorage";
import { getRandomColor } from "../functions/colorsf";
import { MonthSelector } from "../components/MonthSelector";


const Charts = () =>{
    moment.locale('pt-br');
    
    const [grafico, setGrafico] = useState(null);
    
    const [mes_ano_selecionado, setMesSelecionado] = useState({
        mes: parseInt(moment().subtract(0, "month").format('MM')),
        ano: parseInt(moment().subtract(0, "year").format('YYYY'))
    });
    const [spread_sheet_id, setSpreadSheetId] = useState();
    const [dados_tag, setDadosTag] = useState([]);
    const [dados_user, setDadosUser] = useState([]);
    const [dados_mes, setDadosMes] = useState([]);
    const [labels_mes, setLabelsMes] = useState([]);

   
    const [tipo_grafico, setTipoGrafico] = useState("tag");
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("Selecione o tipo de gráfico");
    const [items, setItems] = useState([
        {label: 'Despesas por categoria', value: 'tag'},
        {label: 'Despesas por mês', value: 'month'},
        {label: 'Despesas por usuário', value: 'user'}
    ]);

    const atualizaGraficos = ()=>{

        if(tipo_grafico == 'tag'){
            if(dados_tag[0]){
                setGrafico(
                    <>
                        <Text style={styles.chartCardTitle}>Despesas por categoria</Text>
                        <PieChart
                            data={dados_tag}
                            width={Dimensions.get("window").width*0.96} // from react-native
                            height={Dimensions.get("window").height*0.35}
                            chartConfig={{
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`
                            }}
                            accessor={"total"}
                            backgroundColor={"transparent"}
                            paddingLeft={"15"}
                            center={[0,0]}
                            absolute
                        />
                    </> 
                 );

            }else{
                setGrafico(
                    <View style={styles.semDadosBox}>
                        <Text style={styles.textoSemDados}>Nenhum dado encontrado...</Text>
                    </View>
                );
            }
            
        }else if(tipo_grafico == 'user'){
            if(dados_user[0]){
                setGrafico(
                    <>
                        <Text style={styles.chartCardTitle}>Despesas por usuario</Text>
                        <PieChart
                            data={dados_user}
                            width={Dimensions.get("window").width*0.96} // from react-native
                            height={Dimensions.get("window").height*0.35}
                            chartConfig={{
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`
                            }}
                            accessor={"total"}
                            backgroundColor={"transparent"}
                            paddingLeft={"15"}
                            center={[0,0]}
                            absolute
                        />
                    </> 
                 )

            }else{
                setGrafico(
                    
                    <View style={styles.semDadosBox}>
                        <Text style={styles.textoSemDados}>Nenhum dado encontrado...</Text>
                    </View>
                );
            }
            

        }else if(tipo_grafico == 'month'){
            if(dados_mes[0]){
                setGrafico(
                    <>
                        <Text style={styles.chartCardTitle}>Despesas por mês</Text>
                        <LineChart
                            data={{
                            labels: labels_mes,
                            datasets: [
                                {
                                data: dados_mes
                                }
                            ]
                            }}
                            width={Dimensions.get("window").width*0.96} // from react-native
                            height={Dimensions.get("window").height*0.35}
                            yAxisLabel="R$"
                            yAxisSuffix=""
                            yAxisInterval={1} // optional, defaults to 1
                            chartConfig={{
                                backgroundColor: "#e26a00",
                                backgroundGradientFrom: "#fb8c00",
                                backgroundGradientTo: "#ffa726",
                                decimalPlaces: 2, // optional, defaults to 2dp
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                style: {
                                    borderRadius: 0
                                },
                                propsForDots: {
                                    r: "6",
                                    strokeWidth: "2",
                                    stroke: "#ffa726"
                                }
                            }}
                            bezier
                            style={{
                                marginVertical: 8,
                                borderRadius: 8
                            }}
                        />
                    </> 
                 );

            }else{
                setGrafico(
                    <View style={styles.semDadosBox}>
                        <Text style={styles.textoSemDados}>Nenhum dado encontrado...</Text>
                    </View>
                );
            }
            
        }
    };

    useEffect(()=>{
        

        const planilhaPadaro = async ()=>{
            const aux = await useLocalStorage().getData("@DEFAULT_SHEET");
            setSpreadSheetId(aux);
        };

        planilhaPadaro();
    },[]);

    useEffect(()=>{
        
        const fetchData = async () =>{
            try{
                
                const result = await useApi(`/charts?spread_sheet_id=${spread_sheet_id}&type=${tipo_grafico}&month=${mes_ano_selecionado.mes}&year=${mes_ano_selecionado.ano}`, null, 'GET');
                if(result.status == 200){
                    console.log(result.data)
                    if(tipo_grafico == 'tag'){
                        var dados_aux = [];
                        var total_aux = 0;

                        result.data.forEach(item=>{
                            total_aux += Math.round(item.TOTAL);
                        });

                        result.data.forEach(item=>{
                            dados_aux.push({
                                name: item.NAME,
                                total: Math.round( item.TOTAL*100/total_aux),
                                color: getRandomColor(),
                                legendFontColor: colors.branco,
                                legendFontSize: 15
                              });
                        });
                        setDadosTag(dados_aux);
                    }else if(tipo_grafico == 'user'){
                        var dados_aux = [];
                        var total_aux = 0;

                        result.data.forEach(item=>{
                            total_aux += Math.round(item.TOTAL);
                        });

                        result.data.forEach(item=>{
                            dados_aux.push({
                                name: item.NICKNAME,
                                total: Math.round( item.TOTAL*100/total_aux),
                                color: getRandomColor(),
                                legendFontColor: colors.branco,
                                legendFontSize: 15
                              });
                        });
                        setDadosUser(dados_aux);
                    }else if(tipo_grafico == 'month'){
                        var dados_aux = [];
                        var labels_aux = [];

                        result.data.forEach(item=>{
                            dados_aux.push(Math.round(item.TOTAL));
                            labels_aux.push(moment(item.MES, 'MM').format('MMM'));
                        });
                        
                        setDadosMes(dados_aux);
                        setLabelsMes(labels_aux);
                        console.warn(dados_aux, labels_aux);
                    }
                }
            }catch(e){
                console.log(e)
            } 
        };
        fetchData();
    },[tipo_grafico, mes_ano_selecionado, spread_sheet_id]);

    useEffect(()=>{
        atualizaGraficos();
    },[dados_mes, dados_tag, dados_user])

    return(
        <TelaSimples titulo="Gráficos">
            <View style={{flex:1}}>

                <View style={styles.filterCard}>
                    <BackCard>
                        <View style={{flex:1}}>
                            <Text style={styles.chartCardTitle}>Filtros</Text>
                            <DropDownPicker
                                open={open}
                                value={tipo_grafico}
                                items={items}
                                setOpen={setOpen}
                                setValue={setTipoGrafico}
                                setItems={setItems}
                            />
                            <MonthSelector setMesSelecionado = {setMesSelecionado} mes_ano_selecionado = {mes_ano_selecionado}/>
                        
                        </View>
                    </BackCard>
                </View>

                <View style={styles.chartCard}>
                    <BackCard>
                        <View style={{flex:0.5}}>
                            {grafico}
                        </View>
                    </BackCard>
                </View>

               
            </View>
        </TelaSimples>
        
    )
};

const styles = StyleSheet.create({
    chartCard:{
        flex:0.5,
        marginTop:5,
        zIndex:0
    },
    chartCardTitle:{
        color: colors.branco,
        fontSize:28
    },
    filterCard:{
        flex:0.2,
        marginTop:5,
        zIndex:10
    },
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
    semDadosBox:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    textoSemDados:{
        color:colors.branco,
        fontSize:35,
        paddingTop:50
    }

});

export default Charts;