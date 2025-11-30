import { Client, Portfolio, Asset } from '../App';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Users, Briefcase, PieChart as PieChartIcon } from 'lucide-react';

interface DashboardProps {
  clients: Client[];
  portfolios: Portfolio[];
  assets: Asset[];
}

export function Dashboard({ clients, portfolios, assets }: DashboardProps) {
  // Calculate client performance data
  const clientPerformance = clients.map(client => {
    const clientPortfolios = portfolios.filter(p => p.clientId === client.id);
    const portfolioIds = clientPortfolios.map(p => p.id);
    const clientAssets = assets.filter(a => portfolioIds.includes(a.portfolioId));

    const totalCurrentValue = clientAssets.reduce((sum, asset) => 
      sum + (asset.quantity * asset.currentPrice), 0
    );

    const totalPurchaseValue = clientAssets.reduce((sum, asset) => 
      sum + (asset.quantity * asset.purchasePrice), 0
    );

    const totalGainLoss = totalCurrentValue - totalPurchaseValue;
    const gainLossPercent = totalPurchaseValue > 0 ? (totalGainLoss / totalPurchaseValue) * 100 : 0;

    return {
      client,
      totalCurrentValue,
      totalPurchaseValue,
      totalGainLoss,
      gainLossPercent,
      portfolioCount: clientPortfolios.length,
      assetCount: clientAssets.length
    };
  });

  // Overall statistics
  const totalAUM = clientPerformance.reduce((sum, cp) => sum + cp.totalCurrentValue, 0);
  const totalInvested = clientPerformance.reduce((sum, cp) => sum + cp.totalPurchaseValue, 0);
  const totalPL = totalAUM - totalInvested;
  const totalPLPercent = totalInvested > 0 ? (totalPL / totalInvested) * 100 : 0;

  // Asset allocation data
  const assetTypeData = assets.reduce((acc, asset) => {
    const currentValue = asset.quantity * asset.currentPrice;
    const existing = acc.find(item => item.name === asset.assetType);
    if (existing) {
      existing.value += currentValue;
    } else {
      acc.push({ name: asset.assetType, value: currentValue });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Client comparison data for bar chart
  const clientComparisonData = clientPerformance.map(cp => ({
    name: cp.client.name.split(' ')[0], // First name only for cleaner display
    currentValue: Math.round(cp.totalCurrentValue),
    invested: Math.round(cp.totalPurchaseValue),
    gainLoss: Math.round(cp.totalGainLoss)
  }));

  // Top performing assets
  const topPerformingAssets = assets
    .map(asset => {
      const currentValue = asset.quantity * asset.currentPrice;
      const purchaseValue = asset.quantity * asset.purchasePrice;
      const gainLoss = currentValue - purchaseValue;
      const gainLossPercent = (gainLoss / purchaseValue) * 100;
      return { ...asset, gainLoss, gainLossPercent };
    })
    .sort((a, b) => b.gainLossPercent - a.gainLossPercent)
    .slice(0, 5);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-gray-900">Performance Dashboard</h2>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">Overview of all client portfolios and performance metrics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-blue-700 text-xs sm:text-sm">Total AUM</p>
              <p className="text-gray-900 mt-1 text-lg sm:text-2xl truncate">{formatCurrency(totalAUM)}</p>
            </div>
            <div className="bg-blue-500 p-2 sm:p-3 rounded-lg flex-shrink-0">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className={`bg-gradient-to-br ${totalPL >= 0 ? 'from-green-50 to-green-100' : 'from-red-50 to-red-100'} p-4 sm:p-6 rounded-lg border ${totalPL >= 0 ? 'border-green-200' : 'border-red-200'}`}>
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className={`${totalPL >= 0 ? 'text-green-700' : 'text-red-700'} text-xs sm:text-sm`}>Total P/L</p>
              <p className="text-gray-900 mt-1 text-lg sm:text-2xl truncate">{formatCurrency(totalPL)}</p>
              <p className={`text-xs sm:text-sm mt-1 ${totalPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercent(totalPLPercent)}
              </p>
            </div>
            <div className={`${totalPL >= 0 ? 'bg-green-500' : 'bg-red-500'} p-2 sm:p-3 rounded-lg flex-shrink-0`}>
              {totalPL >= 0 ? (
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              ) : (
                <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              )}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 sm:p-6 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-purple-700 text-xs sm:text-sm">Total Clients</p>
              <p className="text-gray-900 mt-1 text-lg sm:text-2xl">{clients.length}</p>
            </div>
            <div className="bg-purple-500 p-2 sm:p-3 rounded-lg flex-shrink-0">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 sm:p-6 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-orange-700 text-xs sm:text-sm">Total Portfolios</p>
              <p className="text-gray-900 mt-1 text-lg sm:text-2xl">{portfolios.length}</p>
            </div>
            <div className="bg-orange-500 p-2 sm:p-3 rounded-lg flex-shrink-0">
              <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Client Performance Table */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
        <h3 className="text-gray-900 mb-3 sm:mb-4">Client Performance</h3>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-700 text-xs sm:text-sm">Client</th>
                  <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-gray-700 text-xs sm:text-sm">Portfolios</th>
                  <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-gray-700 text-xs sm:text-sm hidden sm:table-cell">Assets</th>
                  <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-gray-700 text-xs sm:text-sm">Current</th>
                  <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-gray-700 text-xs sm:text-sm hidden md:table-cell">Invested</th>
                  <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-gray-700 text-xs sm:text-sm">P/L</th>
                  <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-gray-700 text-xs sm:text-sm">Return %</th>
                </tr>
              </thead>
              <tbody>
                {clientPerformance.map(cp => (
                  <tr key={cp.client.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-900 text-xs sm:text-sm">{cp.client.name}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-gray-600 text-xs sm:text-sm">{cp.portfolioCount}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-gray-600 text-xs sm:text-sm hidden sm:table-cell">{cp.assetCount}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-gray-900 text-xs sm:text-sm whitespace-nowrap">
                      {formatCurrency(cp.totalCurrentValue)}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-gray-600 text-xs sm:text-sm whitespace-nowrap hidden md:table-cell">
                      {formatCurrency(cp.totalPurchaseValue)}
                    </td>
                    <td className={`py-2 sm:py-3 px-2 sm:px-4 text-right text-xs sm:text-sm whitespace-nowrap ${cp.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(cp.totalGainLoss)}
                    </td>
                    <td className={`py-2 sm:py-3 px-2 sm:px-4 text-right text-xs sm:text-sm ${cp.gainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <div className="flex items-center justify-end gap-1">
                        {cp.gainLossPercent >= 0 ? (
                          <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                        ) : (
                          <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
                        )}
                        <span className="whitespace-nowrap">{formatPercent(cp.gainLossPercent)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Client Comparison Bar Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
          <h3 className="text-gray-900 mb-3 sm:mb-4">Client Portfolio Comparison</h3>
          <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
            <BarChart data={clientComparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="currentValue" fill="#3b82f6" name="Current Value" />
              <Bar dataKey="invested" fill="#94a3b8" name="Invested" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Asset Allocation Pie Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
          <h3 className="text-gray-900 mb-3 sm:mb-4">Asset Allocation</h3>
          <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
            <PieChart>
              <Pie
                data={assetTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {assetTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performing Assets */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
        <h3 className="text-gray-900 mb-3 sm:mb-4">Top Performing Assets</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {topPerformingAssets.map(asset => (
            <div
              key={asset.id}
              className={`p-3 sm:p-4 rounded-lg border-2 ${
                asset.gainLossPercent >= 0
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="min-w-0 flex-1">
                  <p className="text-gray-900 text-sm sm:text-base truncate">{asset.symbol}</p>
                  <p className="text-xs text-gray-600 truncate">{asset.assetType}</p>
                </div>
                {asset.gainLossPercent >= 0 ? (
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 ml-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0 ml-1" />
                )}
              </div>
              <p className={`text-xs sm:text-sm ${asset.gainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercent(asset.gainLossPercent)}
              </p>
              <p className="text-xs text-gray-600 mt-1 truncate">
                {formatCurrency(asset.gainLoss)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* P/L Summary by Client */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
        <h3 className="text-gray-900 mb-3 sm:mb-4">Client P/L Summary</h3>
        <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
          <BarChart data={clientComparisonData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="gainLoss" fill="#10b981" name="Gain/Loss">
              {clientComparisonData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.gainLoss >= 0 ? '#10b981' : '#ef4444'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}