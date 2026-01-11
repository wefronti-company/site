import React, { useState } from 'react';
import Head from 'next/head';
import { colors } from '../styles/colors';
import AppBar from '../components/layout/AppBar';
import Calendar from '../components/ui/Calendar';

const AgendarPage: React.FC = () => {
  const [step, setStep] = useState<'info' | 'calendar' | 'success'>('info');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    projectType: '',
    budget: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setError('Por favor, preencha nome e email');
      return;
    }
    setError('');
    setStep('calendar');
  };

  const handleBooking = async (selectedTime: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/cal/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start: selectedTime,
          end: new Date(new Date(selectedTime).getTime() + 30 * 60000).toISOString(),
          name: formData.name,
          email: formData.email,
          metadata: {
            company: formData.company,
            projectType: formData.projectType,
            budget: formData.budget,
            notes: formData.notes,
          },
        }),
      });

      if (!response.ok) throw new Error('Falha ao agendar');

      setStep('success');
    } catch (err) {
      setError('Erro ao agendar. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Agendar Reunião | Wefronti</title>
        <meta name="description" content="Agende uma reunião com nossa equipe para discutir seu projeto" />
      </Head>

      <AppBar />

      <main 
        className="min-h-screen pt-24 pb-12 px-4 md:px-8 lg:px-16"
        style={{ backgroundColor: colors.whiteColor }}
      >
        <div className="max-w-3xl mx-auto">
          {/* Cabeçalho */}
          <div className="text-center mb-8">
            <h1 
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: colors.blackColor }}
            >
              Agende uma reunião
            </h1>
            <p 
              className="text-lg max-w-2xl mx-auto"
              style={{ color: colors.blackColor, opacity: 0.7 }}
            >
              {step === 'info' && 'Conte-nos sobre seu projeto e escolha o melhor horário'}
              {step === 'calendar' && 'Escolha o melhor horário para conversarmos'}
              {step === 'success' && 'Reunião agendada com sucesso!'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#fee', color: '#c33' }}>
              {error}
            </div>
          )}

          {/* Step 1: Informações */}
          {step === 'info' && (
            <div 
              className="rounded-lg p-8"
              style={{ 
                backgroundColor: colors.whiteColor,
                border: `1px solid ${colors.borderLight}`,
              }}
            >
              <form onSubmit={handleInfoSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.blackColor }}>
                    Nome completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg"
                    style={{ 
                      border: `1px solid ${colors.borderLight}`,
                      backgroundColor: colors.whiteColor,
                      color: colors.blackColor,
                    }}
                    placeholder="Seu nome"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.blackColor }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg"
                    style={{ 
                      border: `1px solid ${colors.borderLight}`,
                      backgroundColor: colors.whiteColor,
                      color: colors.blackColor,
                    }}
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.blackColor }}>
                    Empresa
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg"
                    style={{ 
                      border: `1px solid ${colors.borderLight}`,
                      backgroundColor: colors.whiteColor,
                      color: colors.blackColor,
                    }}
                    placeholder="Nome da empresa"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.blackColor }}>
                    Tipo de projeto
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg"
                    style={{ 
                      border: `1px solid ${colors.borderLight}`,
                      backgroundColor: colors.whiteColor,
                      color: colors.blackColor,
                    }}
                  >
                    <option value="">Selecione...</option>
                    <option value="site">Site Institucional</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="app">Aplicativo Mobile</option>
                    <option value="saas">SaaS/Plataforma</option>
                    <option value="sistema">Sistema Web</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.blackColor }}>
                    Orçamento estimado
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg"
                    style={{ 
                      border: `1px solid ${colors.borderLight}`,
                      backgroundColor: colors.whiteColor,
                      color: colors.blackColor,
                    }}
                  >
                    <option value="">Selecione...</option>
                    <option value="5k-10k">R$ 5.000 - 10.000</option>
                    <option value="10k-25k">R$ 10.000 - 25.000</option>
                    <option value="25k-50k">R$ 25.000 - 50.000</option>
                    <option value="50k+">R$ 50.000+</option>
                    <option value="ainda-nao-sei">Ainda não sei</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.blackColor }}>
                    Conte mais sobre seu projeto
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg"
                    style={{ 
                      border: `1px solid ${colors.borderLight}`,
                      backgroundColor: colors.whiteColor,
                      color: colors.blackColor,
                    }}
                    placeholder="Descreva brevemente seu projeto e objetivos..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-4 text-base font-semibold rounded-lg transition-all hover:opacity-90"
                  style={{
                    background: `linear-gradient(90deg, ${colors.gradientOne} 0%, ${colors.gradientTwo} 100%)`,
                    color: colors.whiteColor,
                  }}
                >
                  Continuar para escolher horário
                </button>
              </form>
            </div>
          )}

          {/* Step 2: Calendário */}
          {step === 'calendar' && (
            <div>
              <Calendar onSelectTime={handleBooking} />
              
              <button
                onClick={() => setStep('info')}
                className="block mx-auto mt-6 text-sm px-4 py-2 rounded hover:opacity-70 transition-opacity"
                style={{ color: colors.blackColor, opacity: 0.7 }}
              >
                ← Voltar
              </button>
            </div>
          )}

          {/* Step 3: Sucesso */}
          {step === 'success' && (
            <div 
              className="rounded-lg p-8 text-center"
              style={{ 
                backgroundColor: colors.whiteColor,
                border: `1px solid ${colors.borderLight}`,
              }}
            >
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full" style={{ backgroundColor: 'rgba(69, 81, 186, 0.1)' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={colors.gradientOne} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: colors.blackColor }}>
                Reunião agendada!
              </h2>
              <p style={{ color: colors.blackColor, opacity: 0.7 }}>
                Você receberá um email de confirmação em breve com o link da reunião.
              </p>
            </div>
          )}

          {/* Informações adicionais */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-full" style={{ backgroundColor: 'rgba(69, 81, 186, 0.1)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.gradientOne} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <h3 className="font-semibold mb-2" style={{ color: colors.blackColor }}>
                Duração
              </h3>
              <p style={{ color: colors.blackColor, opacity: 0.7 }}>
                30 minutos
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-full" style={{ backgroundColor: 'rgba(69, 81, 186, 0.1)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.gradientOne} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                </svg>
              </div>
              <h3 className="font-semibold mb-2" style={{ color: colors.blackColor }}>
                Formato
              </h3>
              <p style={{ color: colors.blackColor, opacity: 0.7 }}>
                Reunião online (Google Meet)
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-full" style={{ backgroundColor: 'rgba(69, 81, 186, 0.1)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.gradientOne} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3 className="font-semibold mb-2" style={{ color: colors.blackColor }}>
                Consultoria
              </h3>
              <p style={{ color: colors.blackColor, opacity: 0.7 }}>
                Gratuita e sem compromisso
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AgendarPage;
