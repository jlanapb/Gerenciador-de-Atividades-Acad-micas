import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import { useLocalSearchParams } from "expo-router";
import { RootStackParamList } from "../../types/types";
import { useAtividades } from "@/context/AtividadesContext";


export default function DetalhesScreen() {
  
  const params = useLocalSearchParams();
  const { atividades } = useAtividades();
  const nome = Array.isArray(params.nome) ? params.nome[0] : params.nome ?? "Sem Nome";
  const responsavel = Array.isArray(params.responsavel) ? params.responsavel[0] : params.responsavel ?? "Não informado";
  const descricao = Array.isArray(params.descricao) ? params.descricao[0] : params.descricao ?? "Sem descrição";
  const data = Array.isArray(params.data) ? params.data[0] : params.data ?? "Sem data";
  const id = params.id ? Number(params.id) : null;

  console.log("Parâmetros recebidos:", params);
  console.log("Lista de atividades:", atividades);
  console.log("ID buscado:", id);

  if (atividades.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Carregando atividades...</Text>
      </View>
    );
  }
  // Procura a atividade correspondente pelo ID
  const atividade = atividades.find((a) => String(a.id) === String(id));

if (!atividade) {
  return (
    <View style={styles.container}>
      <Text style={styles.error}>Atividade não encontrada!</Text>
      <Text>ID buscado: {id}</Text>
      <Text>Atividades disponíveis:</Text>
      {atividades.map((a) => (
        <Text key={a.id}>ID: {a.id} - {a.nome}</Text>
      ))}
    </View>
  );
}

 
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{atividade?.nome}</Text>
      <Text>Responsável: {atividade?.responsavel}</Text>
      <Text>Data: {atividade?.data}</Text>
      <Text style={styles.descricao}>Descrição: {atividade?.descricao}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  descricao: { marginTop: 10, fontStyle: "italic" },
  error: { fontSize: 18, color: "red" },
});
