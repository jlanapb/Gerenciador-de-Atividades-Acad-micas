import { FlatList, StyleSheet, TouchableOpacity,Button } from "react-native";
import { Text, View } from "@/components/Themed";
import { useAtividades } from "@/context/AtividadesContext";
import { useRouter } from "expo-router";


export default function ListaScreen() {
  const { atividades, excluirAtividade} = useAtividades();
  const router = useRouter();


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Atividades</Text>

      <FlatList
        data={atividades}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          console.log("Renderizando item:", item);
          return (
            <View style={styles.item}>
              <Text style={styles.nome}>{item.nome}</Text>
              <TouchableOpacity
                style={styles.botaoExcluir}
                onPress={() => excluirAtividade(item.id)}
              >
                <Text style={styles.textoBotao}>Excluir</Text>
              </TouchableOpacity>
            </View>
          );
        }}
        ListFooterComponent={<View style={{ height: 50 }} />}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,  // Aumenta o espaço interno
    marginVertical: 5,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    minHeight: 60, // 🚀 Garante que o botão tenha espaço para aparecer
  },
  container: { flex: 2, padding: 30 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: "auto" },
  card: { padding: 15, borderWidth: 1, borderColor: "#ccc", borderRadius: 5, marginBottom: 10 },
  nome: { fontSize: 18, fontWeight: "bold" },
  botaoExcluir: {backgroundColor: "white",paddingVertical: 10,paddingHorizontal: 10, borderRadius: 10},
  textoBotao: {color: "red",fontSize: 14, fontWeight: "bold",}
});
