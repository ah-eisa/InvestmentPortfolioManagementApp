import { useState } from 'react';
import { Asset, Portfolio, Client } from '../App';
import { AssetForm } from './AssetForm';
import { Plus, Pencil, Trash2, TrendingUp, TrendingDown } from 'lucide-react';

interface AssetListProps {
  assets: Asset[];
  portfolios: Portfolio[];
  clients: Client[];
  onAdd: (asset: Asset) => void;
  onUpdate: (id: string, asset: Asset) => void;
  onDelete: (id: string) => void;
}

export function AssetList({ assets, portfolios, clients, onAdd, onUpdate, onDelete }: AssetListProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  const handleAdd = (asset: Asset) => {
    onAdd(asset);
    setIsFormOpen(false);
  };

  const handleEdit = (asset: Asset) => {
    onUpdate(asset.id, asset);
    setEditingAsset(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this asset?')) {
      onDelete(id);
    }
  };

  const getPortfolioInfo = (portfolioId: string) => {
    const portfolio = portfolios.find(p => p.id === portfolioId);
    if (!portfolio) return 'Unknown Portfolio';
    
    const client = clients.find(c => c.id === portfolio.clientId);
    return `${portfolio.name} (${client?.name || 'Unknown Client'})`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const calculateGainLoss = (asset: Asset) => {
    const currentValue = asset.quantity * asset.currentPrice;
    const purchaseValue = asset.quantity * asset.purchasePrice;
    const gainLoss = currentValue - purchaseValue;
    const gainLossPercent = ((currentValue - purchaseValue) / purchaseValue) * 100;
    
    return { gainLoss, gainLossPercent };
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
        <div>
          <h2 className="text-gray-900">Assets</h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">{assets.length} total assets</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Asset
        </button>
      </div>

      {isFormOpen && (
        <div className="mb-4 sm:mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-gray-900 mb-4">Add New Asset</h3>
          <AssetForm
            portfolios={portfolios}
            clients={clients}
            onSubmit={handleAdd}
            onCancel={() => setIsFormOpen(false)}
          />
        </div>
      )}

      {editingAsset && (
        <div className="mb-4 sm:mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-gray-900 mb-4">Edit Asset</h3>
          <AssetForm
            asset={editingAsset}
            portfolios={portfolios}
            clients={clients}
            onSubmit={handleEdit}
            onCancel={() => setEditingAsset(null)}
          />
        </div>
      )}

      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-700 text-xs sm:text-sm">Symbol</th>
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-700 text-xs sm:text-sm hidden lg:table-cell">Name</th>
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-700 text-xs sm:text-sm hidden sm:table-cell">Type</th>
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-700 text-xs sm:text-sm hidden xl:table-cell">Portfolio</th>
                <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-gray-700 text-xs sm:text-sm hidden md:table-cell">Qty</th>
                <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-gray-700 text-xs sm:text-sm hidden lg:table-cell">Purchase</th>
                <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-gray-700 text-xs sm:text-sm hidden md:table-cell">Current</th>
                <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-gray-700 text-xs sm:text-sm">P/L</th>
                <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-gray-700 text-xs sm:text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assets.map(asset => {
                const { gainLoss, gainLossPercent } = calculateGainLoss(asset);
                const isPositive = gainLoss >= 0;
                
                return (
                  <tr key={asset.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-900 text-xs sm:text-sm">{asset.symbol}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-600 text-xs sm:text-sm hidden lg:table-cell">{asset.name}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 hidden sm:table-cell">
                      <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                        {asset.assetType}
                      </span>
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-600 text-xs hidden xl:table-cell">
                      {getPortfolioInfo(asset.portfolioId)}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-gray-900 text-xs sm:text-sm hidden md:table-cell">{asset.quantity}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-gray-600 text-xs sm:text-sm whitespace-nowrap hidden lg:table-cell">
                      {formatCurrency(asset.purchasePrice)}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-gray-900 text-xs sm:text-sm whitespace-nowrap hidden md:table-cell">
                      {formatCurrency(asset.currentPrice)}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-right">
                      <div className={`flex items-center justify-end gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'} text-xs sm:text-sm`}>
                        {isPositive ? (
                          <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                        ) : (
                          <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
                        )}
                        <span className="whitespace-nowrap">
                          {formatCurrency(Math.abs(gainLoss))}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      <div className="flex justify-end gap-1 sm:gap-2">
                        <button
                          onClick={() => setEditingAsset(asset)}
                          className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(asset.id)}
                          className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {assets.length === 0 && (
          <div className="text-center py-12 text-gray-500 text-sm sm:text-base">
            No assets found. Add your first asset to get started.
          </div>
        )}
      </div>
    </div>
  );
}