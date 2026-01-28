import React, { useState } from 'react';
import { BarChart3, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Card, CardContent, Button, Input } from '../components/ui';
import useStore from '../store/useStore';
import { toast } from '../components/ui/Toast';

export const LoginPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, registrar } = useStore();
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      const resultado = login(formData.email, formData.senha);
      if (resultado.success) {
        toast.success('Login realizado com sucesso!');
        onLogin();
      } else {
        toast.error(resultado.error);
      }
    } else {
      if (formData.senha !== formData.confirmarSenha) {
        toast.error('As senhas não coincidem');
        return;
      }
      if (formData.senha.length < 6) {
        toast.error('A senha deve ter pelo menos 6 caracteres');
        return;
      }
      const resultado = registrar(formData.nome, formData.email, formData.senha);
      if (resultado.success) {
        toast.success('Conta criada! Faça login para continuar.');
        setIsLogin(true);
      } else {
        toast.error(resultado.error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Dashboard Analytics Pro</h1>
          <p className="text-slate-400 mt-2">Mensure o ROI dos seus projetos de IA</p>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 mb-8">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">87M+</p>
            <p className="text-xs text-slate-500">Economia calculada</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-cyan-400">500+</p>
            <p className="text-xs text-slate-500">Projetos analisados</p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-lg font-semibold text-white text-center mb-4">
                {isLogin ? 'Entrar na sua conta' : 'Criar nova conta'}
              </h2>

              {!isLogin && (
                <Input
                  label="Nome completo"
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Seu nome"
                  required
                  icon={User}
                />
              )}

              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="seu@email.com"
                required
                icon={Mail}
              />

              <Input
                label="Senha"
                type="password"
                value={formData.senha}
                onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                placeholder="••••••••"
                required
                icon={Lock}
              />

              {!isLogin && (
                <Input
                  label="Confirmar senha"
                  type="password"
                  value={formData.confirmarSenha}
                  onChange={(e) => setFormData({ ...formData, confirmarSenha: e.target.value })}
                  placeholder="••••••••"
                  required
                  icon={Lock}
                />
              )}

              <Button type="submit" className="w-full" icon={ArrowRight} iconPosition="right">
                {isLogin ? 'Entrar' : 'Criar conta'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                {isLogin ? 'Não tem conta? Criar agora' : 'Já tem conta? Fazer login'}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
