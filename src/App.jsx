import React, { useState } from 'react';
import useStore from './store/useStore';
import { ToastContainer } from './components/ui/Toast';
import LoginPage from './pages/LoginPage';
import ProjetosPage from './pages/ProjetosPage';
import ProjetoPage from './pages/ProjetoPage';

function App() {
  const { usuarioLogado } = useStore();
  const [projetoAtual, setProjetoAtual] = useState(null);

  // Não logado
  if (!usuarioLogado) {
    return (
      <>
        <LoginPage onLogin={() => {}} />
        <ToastContainer />
      </>
    );
  }

  // Projeto selecionado
  if (projetoAtual) {
    return (
      <>
        <ProjetoPage 
          projetoId={projetoAtual} 
          onBack={() => setProjetoAtual(null)} 
        />
        <ToastContainer />
      </>
    );
  }

  // Lista de projetos
  return (
    <>
      <ProjetosPage onSelectProjeto={setProjetoAtual} />
      <ToastContainer />
    </>
  );
}

export default App;
