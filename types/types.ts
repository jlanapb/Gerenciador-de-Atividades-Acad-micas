export type Atividade = {
    id: number;
    nome: string;
    responsavel: string;
    descricao: string;
    data: string;
  };
  
  export type RootStackParamList = {
    Cadastro: undefined;
    Lista: undefined;
    Detalhes: { atividade: Atividade };
  };
  