import { useState } from 'react';
import { Portfolio, Client } from '../App';
import { PortfolioForm } from './PortfolioForm';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface PortfolioListProps {
  portfolios: Portfolio[];
  clients: Client[];
  onAdd: (portfolio: Portfolio) => void;
  onUpdate: (id: string, portfolio: Portfolio) => void;
  onDelete: (id: string) => void;
}

export function PortfolioList({ portfolios, clients, onAdd, onUpdate, onDelete }: PortfolioListProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null);

  const handleAdd = (portfolio: Portfolio) => {
    onAdd(portfolio);
    setIsFormOpen(false);
  };

  const handleEdit = (portfolio: Portfolio) => {
    onUpdate(portfolio.id, portfolio);
    setEditingPortfolio(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this portfolio? This will also delete all associated assets.')) {
      onDelete(id);
    }
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.name || 'Unknown Client';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
        <div>
          <h2 className="text-gray-900">Portfolios</h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">{portfolios.length} total portfolios</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Portfolio
        </button>
      </div>

      {isFormOpen && (
        <div className="mb-4 sm:mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-gray-900 mb-4">Add New Portfolio</h3>
          <PortfolioForm
            clients={clients}
            onSubmit={handleAdd}
            onCancel={() => setIsFormOpen(false)}
          />
        </div>
      )}

      {editingPortfolio && (
        <div className="mb-4 sm:mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-gray-900 mb-4">Edit Portfolio</h3>
          <PortfolioForm
            portfolio={editingPortfolio}
            clients={clients}
            onSubmit={handleEdit}
            onCancel={() => setEditingPortfolio(null)}
          />
        </div>
      )}

      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-700 text-xs sm:text-sm">Portfolio</th>
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-700 text-xs sm:text-sm hidden md:table-cell">Client</th>
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-700 text-xs sm:text-sm hidden lg:table-cell">Description</th>
                <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-gray-700 text-xs sm:text-sm">Value</th>
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-700 text-xs sm:text-sm hidden sm:table-cell">Created</th>
                <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-gray-700 text-xs sm:text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {portfolios.map(portfolio => (
                <tr key={portfolio.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-900 text-xs sm:text-sm">{portfolio.name}</td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-600 text-xs sm:text-sm hidden md:table-cell">{getClientName(portfolio.clientId)}</td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-600 text-xs sm:text-sm hidden lg:table-cell">{portfolio.description}</td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-gray-900 text-xs sm:text-sm whitespace-nowrap">
                    {formatCurrency(portfolio.totalValue)}
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-600 text-xs sm:text-sm hidden sm:table-cell">
                    {new Date(portfolio.createdDate).toLocaleDateString()}
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4">
                    <div className="flex justify-end gap-1 sm:gap-2">
                      <button
                        onClick={() => setEditingPortfolio(portfolio)}
                        className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(portfolio.id)}
                        className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {portfolios.length === 0 && (
          <div className="text-center py-12 text-gray-500 text-sm sm:text-base">
            No portfolios found. Add your first portfolio to get started.
          </div>
        )}
      </div>
    </div>
  );
}