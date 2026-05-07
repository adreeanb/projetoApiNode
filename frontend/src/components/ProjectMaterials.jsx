import { useState, useEffect } from 'react';
import api from '../services/api';
import { Package, Plus, Trash2, Gauge } from 'lucide-react';

const ProjectMaterials = ({ projectId }) => {
  const [materials, setMaterials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', quantity_planned: '', unit: 'UN', cost_per_unit: '' });

  const fetchMaterials = async () => {
    try {
      const response = await api.get(`/projects/${projectId}/materials/list`);
      setMaterials(response.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchMaterials(); }, [projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${projectId}/materials/add`, formData);
      setFormData({ name: '', quantity_planned: '', unit: 'UN', cost_per_unit: '' });
      setShowForm(false);
      fetchMaterials();
    } catch (e) { alert("Erro ao salvar"); }
  };

  return (
    <div className="mt-12 mb-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <Package className="text-orange-500" /> MATERIAIS
        </h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-orange-500 text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2"
        >
          <Plus size={16} /> {showForm ? 'CANCELAR' : 'NOVO MATERIAL'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="text" placeholder="Material" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="px-4 py-2 bg-slate-50 border rounded-xl" />
          <input type="number" placeholder="Qtd Planejada" required value={formData.quantity_planned} onChange={e => setFormData({...formData, quantity_planned: e.target.value})} className="px-4 py-2 bg-slate-50 border rounded-xl" />
          <input type="text" placeholder="Unidade (Kg, Un)" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} className="px-4 py-2 bg-slate-50 border rounded-xl" />
          <button type="submit" className="bg-slate-800 text-white font-bold rounded-xl">ADICIONAR</button>
        </form>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Descrição</th>
              <th className="p-4 text-[10px] font-black text-slate-400 uppercase text-center">Planejado</th>
              <th className="p-4 text-[10px] font-black text-slate-400 uppercase text-center">Utilizado</th>
              <th className="p-4 text-[10px] font-black text-slate-400 uppercase text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {materials.map(m => (
              <tr key={m.id} className="border-b border-slate-50 last:border-0">
                <td className="p-4">
                  <p className="font-bold text-slate-800 uppercase text-sm">{m.material.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold">{m.material.unit}</p>
                </td>
                <td className="p-4 text-center font-bold text-slate-600">{m.quantity_planned}</td>
                <td className="p-4 text-center">
                  <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-black">
                    {m.quantity_used}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-slate-300 hover:text-red-500"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectMaterials;