# Como fazer o botão Filtro aparecer na página Pagamentos

O botão de filtro **não está no arquivo atual** – é preciso incluir o trecho abaixo.

## 1. No topo do arquivo, altere o import:

**De:**
```ts
import React, { useState, useEffect, useCallback } from 'react';
```
**Para:**
```ts
import React, { useState, useEffect, useCallback, useRef } from 'react';
```

**E na linha dos ícones, adicione `Filter` e remova `Calendar`:**
```ts
import { Filter, ChevronLeft, ChevronRight, FileDown, AlertCircle, Wallet, CheckCircle2, Clock, Banknote } from 'lucide-react';
```

## 2. Depois de `const [pagando, setPagando] = useState<string | null>(null);` adicione:

```ts
  const [filtroAberto, setFiltroAberto] = useState(false);
  const [diaSelecionado, setDiaSelecionado] = useState<number | null>(null);
  const filtroRef = useRef<HTMLDivElement>(null);
```

## 3. Depois do `useEffect` que chama `load()`, adicione:

```ts
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (filtroAberto && filtroRef.current && !filtroRef.current.contains(e.target as Node)) setFiltroAberto(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, [filtroAberto]);
```

## 4. Depois de `const anoSelecionado = dados?.ano ?? anoAtual;` adicione:

```ts
  const mesSelecionado = mesRef % 100;
  const nomeMesExibicao = dados?.nomeMes ?? (new Date(anoSelecionado, mesSelecionado - 1, 1).toLocaleString('pt-BR', { month: 'long' }).replace(/^./, (c) => c.toUpperCase()));
  const textoDataBotao = diaSelecionado != null ? `${diaSelecionado} de ${nomeMesExibicao} ${anoSelecionado}` : `${nomeMesExibicao} ${anoSelecionado}`;
```

## 5. Substitua a linha do título

**De:**
```tsx
        <h1 style={pageTitleStyle}>Pagamentos</h1>

        {/* Cards de resumo */}
```

**Para:** (botão de filtro ao lado do título – o popover completo está no arquivo que o assistente tentou gravar; este é o mínimo para o botão aparecer)

```tsx
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[4], flexWrap: 'wrap', marginBottom: spacing[4] }}>
          <h1 style={{ ...pageTitleStyle, marginBottom: 0 }}>Pagamentos</h1>
          <div ref={filtroRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setFiltroAberto((v) => !v)}
              aria-label="Filtrar por data"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: spacing[2],
                padding: `${spacing[2]}px ${spacing[3]}px`,
                borderRadius: 12,
                border: `1px solid ${colors.neutral.borderDark}`,
                background: colors.admin.inactive,
                color: colors.text.light,
                fontSize: fontSizes.sm,
                cursor: 'pointer',
              }}
            >
              <Filter size={18} aria-hidden />
              <span>{textoDataBotao}</span>
            </button>
            {filtroAberto && (
              <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: spacing[2], padding: spacing[4], background: colors.admin.inactive, border: `1px solid ${colors.neutral.borderDark}`, borderRadius: 12, boxShadow: '0 10px 40px rgba(0,0,0,0.3)', zIndex: 50, minWidth: 300 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing[3] }}>
                  <button type="button" onClick={() => { const n = Math.max(2024, anoSelecionado - 1); setMesRef(n * 100 + mesSelecionado); setDiaSelecionado(null); load(); }} disabled={anoSelecionado <= 2024} style={{ background: 'none', border: 'none', color: colors.text.light, cursor: 'pointer', padding: spacing[1], opacity: anoSelecionado <= 2024 ? 0.4 : 1 }}><ChevronLeft size={20} /></button>
                  <span style={{ fontWeight: 600, color: colors.text.light }}>{anoSelecionado}</span>
                  <button type="button" onClick={() => { const n = Math.min(2030, anoSelecionado + 1); setMesRef(n * 100 + mesSelecionado); setDiaSelecionado(null); load(); }} disabled={anoSelecionado >= 2030} style={{ background: 'none', border: 'none', color: colors.text.light, cursor: 'pointer', padding: spacing[1], opacity: anoSelecionado >= 2030 ? 0.4 : 1 }}><ChevronRight size={20} /></button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: spacing[2], marginBottom: spacing[4] }}>
                  {['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'].map((nome, i) => {
                    const mes = i + 1;
                    const ativo = mesRef === anoSelecionado * 100 + mes;
                    return <button key={nome} type="button" onClick={() => { setMesRef(anoSelecionado * 100 + mes); setDiaSelecionado(null); load(); }} style={{ padding: spacing[2], borderRadius: 8, border: 'none', background: ativo ? colors.blue.primary : colors.admin.inactive, color: ativo ? '#fff' : colors.text.light, fontSize: fontSizes.xs, cursor: 'pointer' }}>{nome}</button>;
                  })}
                </div>
                <p style={{ margin: 0, marginBottom: spacing[2], fontSize: fontSizes.xs, color: colors.text.light, opacity: 0.8 }}>Dia</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: spacing[4] }}>
                  {['D','S','T','Q','Q','S','S'].map((d) => <span key={d} style={{ textAlign: 'center', fontSize: fontSizes.xs, color: colors.text.light, opacity: 0.6 }}>{d}</span>)}
                  {(() => { const ult = new Date(anoSelecionado, mesSelecionado, 0).getDate(); const prim = new Date(anoSelecionado, mesSelecionado - 1, 1).getDay(); const arr: (number|null)[] = []; for (let i = 0; i < prim; i++) arr.push(null); for (let d = 1; d <= ult; d++) arr.push(d); return arr; })().map((d, i) => d === null ? <span key={`e-${i}`} /> : <button key={d} type="button" onClick={() => setDiaSelecionado(d)} style={{ padding: 6, borderRadius: 6, border: 'none', background: (anoSelecionado === anoAtual && mesSelecionado === mesAtual && d === diaAtual) || diaSelecionado === d ? colors.blue.primary : colors.admin.inactive, color: (anoSelecionado === anoAtual && mesSelecionado === mesAtual && d === diaAtual) || diaSelecionado === d ? '#fff' : colors.text.light, fontSize: fontSizes.xs, cursor: 'pointer' }}>{d}</button>)}
                </div>
                <button type="button" onClick={() => { setFiltroAberto(false); load(); }} style={{ width: '100%', padding: `${spacing[2]}px ${spacing[3]}px`, borderRadius: 8, border: 'none', background: colors.blue.primary, color: '#fff', fontSize: fontSizes.sm, fontWeight: 600, cursor: 'pointer' }}>Aplicar filtro</button>
              </div>
            )}
          </div>
        </div>

        {/* Cards de resumo */}
```

Depois disso, **remova o card "Calendário"** (o primeiro card da grade, com título "Calendário" e setas de mês).

Salve o arquivo (Ctrl+S) e recarregue a página de Pagamentos no navegador.
