import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Atividade } from "../types/types"; // Corrigido o import ✅

// Definição do contexto
interface AtividadesContextType {
  atividades: Atividade[];
  adicionarAtividade: (atividade: Atividade) => void;
  excluirAtividade: (id: number) => void;  // Adicionando a função de exclusão
  editarAtividade: (atividade: Atividade) => void;  // Adicionando a função de edição
}

const AtividadesContext = createContext<AtividadesContextType | undefined>(undefined);



export function AtividadesProvider({ children }: { children: ReactNode }) {
  const [atividades, setAtividades] = useState<Atividade[]>([]);

  useEffect(() => {
    async function carregarAtividades() {
      try {
        const atividadesSalvas = await AsyncStorage.getItem("atividades");
        if (atividadesSalvas) {
          setAtividades(JSON.parse(atividadesSalvas));
        }
      } catch (error) {
        console.error("Erro ao carregar atividades:", error);
        setAtividades([]); // Garante que não fique undefined
      }
    }
    carregarAtividades();
  }, []);

  const adicionarAtividade = async (atividade: Atividade) => {
    const novasAtividades = [...atividades, atividade];
    setAtividades(novasAtividades);
    try {
      await AsyncStorage.setItem("atividades", JSON.stringify(novasAtividades));
    } catch (error) {
      console.error("Erro ao salvar atividades:", error);
    }
  }; 

  const editarAtividade = async (atividadeEditada: Atividade) => {
    const novasAtividades = atividades.map((a) =>
      a.id === atividadeEditada.id ? atividadeEditada : a
    );
  
    setAtividades(novasAtividades);
    await AsyncStorage.setItem("atividades", JSON.stringify(novasAtividades));
  };

  function excluirAtividade(id: number) {
    setAtividades((prevAtividades) => prevAtividades.filter((atividade) => atividade.id !== id));
  }
  
  return (
    <AtividadesContext.Provider value={{ atividades, adicionarAtividade, excluirAtividade, editarAtividade}}>
      {children}
    </AtividadesContext.Provider>
  );

  
}



// Hook para usar o contexto
export function useAtividades() {
  const context = useContext(AtividadesContext);
  if (!context) {
    throw new Error("useAtividades deve ser usado dentro de AtividadesProvider");
  }
  return context;
}
