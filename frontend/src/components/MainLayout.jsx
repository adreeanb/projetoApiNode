import Sidebar from './Sidebar';

const MainLayout = ({ children }) => {
  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      {/* O margin-left deve ser o mesmo da largura da sidebar (w-64 = 16rem) */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;