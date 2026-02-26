import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return { redirect: { destination: '/admin/dashboard/clientes/manutencao', permanent: true } };
};

const ClientesAtivosRedirect: React.FC = () => null;
export default ClientesAtivosRedirect;
