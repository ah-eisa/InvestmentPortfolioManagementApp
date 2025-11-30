import { useState } from 'react';
import { Portfolio, Client } from '../App';

interface PortfolioFormProps {
  portfolio?: Portfolio;
  clients: Client[];
  onSubmit: (portfolio: Portfolio) => void;
  onCancel: () => void;
}

export function PortfolioForm({ portfolio, clients, onSubmit, onCancel }: PortfolioFormProps) {
  const [formData, setFormData] = useState({
    clientId: portfolio?.clientId || '',
    name: portfolio?.name || '',
    description: portfolio?.description || '',
    totalValue: portfolio?.totalValue?.toString() || '0',
    createdDate: portfolio?.createdDate || new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPortfolio: Portfolio = {
      id: portfolio?.id || Date.now().toString(),
      clientId: formData.clientId,
      name: formData.name,
      description: formData.description,
      totalValue: parseFloat(formData.totalValue),
      createdDate: formData.createdDate
    };

    onSubmit(newPortfolio);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 mb-2 text-sm sm:text-base">Client *</label>
          <select
            required
            value={formData.clientId}
            onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          >
            <option value="">Select a client</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2 text-sm sm:text-base">Portfolio Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            placeholder="Retirement Portfolio"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-gray-700 mb-2 text-sm sm:text-base">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            placeholder="Long-term retirement investments"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2 text-sm sm:text-base">Total Value *</label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={formData.totalValue}
            onChange={(e) => setFormData({ ...formData, totalValue: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            placeholder="100000"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2 text-sm sm:text-base">Created Date *</label>
          <input
            type="date"
            required
            value={formData.createdDate}
            onChange={(e) => setFormData({ ...formData, createdDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
        >
          {portfolio ? 'Update Portfolio' : 'Add Portfolio'}
        </button>
      </div>
    </form>
  );
}