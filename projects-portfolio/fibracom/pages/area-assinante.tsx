import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

export default function AreaAssinante() {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrar com API de login
  };

  return (
    <>
      <Head>
        <title>Área do assinante | Fibracom</title>
        <meta name="description" content="Acesse sua área do assinante Fibracom." />
      </Head>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          minHeight: '100vh',
        }}
        className="login-layout"
      >
        <div
          style={{
            backgroundImage: 'url(/images/background/image-area-cliente.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            backgroundColor: '#ffffff',
          }}
        >
          <div style={{ width: '100%', maxWidth: 360 }}>
            <Link href="/" style={{ display: 'inline-block', marginBottom: '2rem', textDecoration: 'none' }}>
              <Image
                src="/images/brand/logo.png"
                alt="Fibracom"
                width={140}
                height={42}
                style={{ height: 'auto', maxHeight: '42px', width: 'auto' }}
              />
            </Link>
            <div
              style={{
                backgroundColor: 'rgba(75, 149, 116, 0.12)',
                border: '1px solid rgba(75, 149, 116, 0.45)',
                borderRadius: '12px',
                padding: '2rem',
              }}
            >
              <h1
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 400,
                  margin: 0,
                  marginBottom: '2rem',
                  color: '#1a1a1a',
                }}
              >
                Área do assinante
              </h1>
              <form onSubmit={handleSubmit}>
                <label htmlFor="cpf" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: '#374151', marginBottom: '0.35rem' }}>
                  CPF
                </label>
                <input
                id="cpf"
                type="text"
                inputMode="numeric"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  marginBottom: '1.25rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(0,0,0,0.15)',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
                />
                <label htmlFor="senha" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: '#374151', marginBottom: '0.35rem' }}>
                  Senha
                </label>
                <input
                id="senha"
                type="password"
                placeholder="Sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  marginBottom: '1.5rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(0,0,0,0.15)',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
                />
                <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '0.85rem 1.5rem',
                  backgroundColor: '#4B9574',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
                >
                  Entrar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
