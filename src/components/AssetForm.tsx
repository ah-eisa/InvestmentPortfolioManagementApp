import { useState } from "react";
import { Asset, Portfolio, Client } from "../App";

interface AssetFormProps {
  asset?: Asset;
  portfolios: Portfolio[];
  clients: Client[];
  onSubmit: (asset: Asset) => void;
  onCancel: () => void;
}

const assetTypes: Asset["assetType"][] = [
  "Stock",
  "Bond",
  "ETF",
  "Mutual Fund",
  "Crypto",
  "Real Estate",
  "Other",
];

export function AssetForm({
  asset,
  portfolios,
  clients,
  onSubmit,
  onCancel,
}: AssetFormProps) {
  const [formData, setFormData] = useState({
    portfolioId: asset?.portfolioId || "",
    symbol: asset?.symbol || "",
    name: asset?.name || "",
    assetType:
      asset?.assetType || ("Stock" as Asset["assetType"]),
    quantity: asset?.quantity?.toString() || "1",
    purchasePrice: asset?.purchasePrice?.toString() || "0",
    currentPrice: asset?.currentPrice?.toString() || "0",
    purchaseDate:
      asset?.purchaseDate ||
      new Date().toISOString().split("T")[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newAsset: Asset = {
      id: asset?.id || Date.now().toString(),
      portfolioId: formData.portfolioId,
      symbol: formData.symbol,
      name: formData.name,
      assetType: formData.assetType,
      quantity: parseFloat(formData.quantity),
      purchasePrice: parseFloat(formData.purchasePrice),
      currentPrice: parseFloat(formData.currentPrice),
      purchaseDate: formData.purchaseDate,
    };

    onSubmit(newAsset);
  };

  const getPortfolioLabel = (portfolio: Portfolio) => {
    const client = clients.find(
      (c) => c.id === portfolio.clientId,
    );
    return `${portfolio.name} (${client?.name || "Unknown"})`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-gray-700 mb-2 text-sm sm:text-base">
            Portfolio *
          </label>
          <select
            required
            value={formData.portfolioId}
            onChange={(e) =>
              setFormData({
                ...formData,
                portfolioId: e.target.value,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          >
            <option value="">Select a portfolio</option>
            {portfolios.map((portfolio) => (
              <option key={portfolio.id} value={portfolio.id}>
                {getPortfolioLabel(portfolio)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2 text-sm sm:text-base">
            Symbol/Ticker *
          </label>
          <input
            type="text"
            required
            value={formData.symbol}
            onChange={(e) =>
              setFormData({
                ...formData,
                symbol: e.target.value.toUpperCase(),
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            placeholder="AAPL"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2 text-sm sm:text-base">
            Asset Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            placeholder="Apple Inc."
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2 text-sm sm:text-base">
            Asset Type *
          </label>
          <select
            required
            value={formData.assetType}
            onChange={(e) =>
              setFormData({
                ...formData,
                assetType: e.target.value as Asset["assetType"],
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          >
            {assetTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2 text-sm sm:text-base">
            Quantity *
          </label>
          <input
            type="number"
            required
            min="0"
            step="0.001"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({
                ...formData,
                quantity: e.target.value,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            placeholder="100"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2 text-sm sm:text-base">
            Purchase Price *
          </label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={formData.purchasePrice}
            onChange={(e) =>
              setFormData({
                ...formData,
                purchasePrice: e.target.value,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            placeholder="150.00"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2 text-sm sm:text-base">
            Current Price *
          </label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={formData.currentPrice}
            onChange={(e) =>
              setFormData({
                ...formData,
                currentPrice: e.target.value,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            placeholder="175.00"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2 text-sm sm:text-base">
            Purchase Date *
          </label>
          <input
            type="date"
            required
            value={formData.purchaseDate}
            onChange={(e) =>
              setFormData({
                ...formData,
                purchaseDate: e.target.value,
              })
            }
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
          {asset ? "Update Asset" : "Add Asset"}
        </button>
      </div>
    </form>
  );
}