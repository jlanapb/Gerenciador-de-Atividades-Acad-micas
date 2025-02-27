import { useState, useEffect } from "react";
import { StyleSheet, TextInput, Button, Alert } from "react-native";
import { Text, View } from "@/components/Themed";
import { useAtividades } from "@/context/AtividadesContext";
import { useLocalSearchParams, useRouter} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Atividade } from "../../types/types";


export default function CadastroScreen() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const params = useLocalSearchParams(); // Obtém parâmetros da rota
  const { atividades, adicionarAtividade } = useAtividades(); // Pega as atividades existentes

  const [id, setId] = useState<number | null>(params.id ? parseInt(params.id as string) : null);
  const [atividade, setAtividade] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");
  const formatarData = (input: string) => {
    // Remove tudo que não for número
    const digits = input.replace(/\D/g, "");
  
    // Formata a string no padrão DD/MM/AAAA
    let formatted = "";
    if (digits.length <= 2) {
      formatted = digits;
    } else if (digits.length <= 4) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    } else {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
    }
  
    return formatted;
  };

  const validarData = (data: string) => {
    const regexData = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!regexData.test(data)) return false;
  
    const [_, dia, mes, ano] = data.match(regexData) || [];
    const dataObj = new Date(Number(ano), Number(mes) - 1, Number(dia));
  
    return (
      dataObj.getFullYear() === Number(ano) &&
      dataObj.getMonth() === Number(mes) - 1 &&
      dataObj.getDate() === Number(dia)
    );
  };

  useEffect(() => {
    setIsMounted(true); // Define que o layout foi montado
  }, []);
  
  const handleSubmit = async() => {
    if (!atividade.trim() || !responsavel.trim() || !descricao.trim() || !data.trim()) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    if (!validarData(data)) {
      Alert.alert("Erro", "Data inválida! Use o formato DD/MM/AAAA.");
      return;
    }

    if (id) {
      // Se tiver ID, significa que está editando uma atividade existente
      const atividadesAtualizadas = atividades.map((a) =>
        a.id === id ? { id, nome: atividade, responsavel, descricao, data } : a
      );
      
      await AsyncStorage.setItem("atividades", JSON.stringify(atividadesAtualizadas));
      Alert.alert("Sucesso", "Atividade editada com sucesso!");
    }  else {
      // Se não tiver ID, cria uma nova atividade
      adicionarAtividade({ id: Date.now(), nome: atividade, responsavel, descricao, data });
      Alert.alert("Sucesso", "Atividade cadastrada!");
      setAtividade("");
      setResponsavel("");
      setDescricao("");
      setData("");
    }
    if (isMounted) {
      router.push("/Lista");
    }
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar Atividade</Text>
 
      <TextInput style={styles.input} placeholder="Nome da Atividade" value={atividade} onChangeText={setAtividade} />
      <TextInput style={styles.input} placeholder="Nome do Responsável" value={responsavel} onChangeText={setResponsavel} />
      <TextInput style={styles.input} placeholder="Descrição" value={descricao} onChangeText={setDescricao} multiline />
      <TextInput style={styles.input} placeholder="Data (DD/MM/AAAA)" value={data} onChangeText={(text) => setData(formatarData(text))} keyboardType="numeric" maxLength={10} />

      <View style={styles.buttonContainer}>
  <View style={styles.buttonWrapper}>
    <Button title="Salvar" onPress={handleSubmit} />
  </View>
  <View style={styles.buttonWrapper}>
    <Button title="Ver Lista" onPress={() => router.push("/Lista")} />
  </View>
</View>
    </View>
    
  );

}


const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  input: { width: "100%", height: 40, borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginBottom: 10 },
 
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  buttonWrapper: {
    flex: 1, // Faz com que os botões ocupem o mesmo espaço
    marginHorizontal: 5, // Dá um espaço entre os botões
  },
});
export { CadastroScreen };
