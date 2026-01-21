import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const PanelPage: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 20;
  const router = useRouter();

  useEffect(() => {
    fetchData(page);
  }, [page]);

  async function fetchData(p = 1) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/quotes?page=${p}&perPage=${perPage}`);
      if (res.status === 401) {
        router.replace('/painel-admin/login');
        return;
      }
      const json = await res.json();
      if (!json.success) {
        console.error('error', json);
        return;
      }
      setItems(json.items || []);
      setTotal(json.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/painel-admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl">Painel Admin</h1>
          <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded">Logout</button>
        </div>

        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg mb-4">Submissões ({total})</h2>

          {loading ? (
            <p>Carregando...</p>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="border px-3 py-2 text-left">ID</th>
                    <th className="border px-3 py-2 text-left">Nome</th>
                    <th className="border px-3 py-2 text-left">E-mail</th>
                    <th className="border px-3 py-2 text-left">Celular</th>
                    <th className="border px-3 py-2 text-left">Empresa</th>
                    <th className="border px-3 py-2 text-left">Tipo</th>
                    <th className="border px-3 py-2 text-left">Investimento</th>
                    <th className="border px-3 py-2 text-left">Urgência</th>
                    <th className="border px-3 py-2 text-left">Criado</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => (
                    <tr key={it.id}>
                      <td className="border px-3 py-2">{it.id}</td>
                      <td className="border px-3 py-2">{it.name}</td>
                      <td className="border px-3 py-2">{it.email}</td>
                      <td className="border px-3 py-2">{it.phone}</td>
                      <td className="border px-3 py-2">{it.company}</td>
                      <td className="border px-3 py-2">{it.projecttype || it.projectType}</td>
                      <td className="border px-3 py-2">{it.investment}</td>
                      <td className="border px-3 py-2">{it.urgency}</td>
                      <td className="border px-3 py-2">{new Date(it.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex items-center justify-between mt-4">
                <div>
                  <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1 mr-2 border rounded">Anterior</button>
                  <button disabled={page * perPage >= total} onClick={() => setPage(page + 1)} className="px-3 py-1 border rounded">Próximo</button>
                </div>
                <div>Page {page}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PanelPage;
