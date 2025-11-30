import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { ClientList } from './components/ClientList';
import { PortfolioList } from './components/PortfolioList';
import { AssetList } from './components/AssetList';
import { LayoutDashboard, Users, Briefcase, TrendingUp } from 'lucide-react';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
}

export interface Portfolio {
  id: string;
  clientId: string;
  name: string;
  description: string;
  totalValue: number;
  createdDate: string;
}

export interface Asset {
  id: string;
  portfolioId: string;
  symbol: string;
  name: string;
  assetType: 'Stock' | 'Bond' | 'ETF' | 'Mutual Fund' | 'Crypto' | 'Real Estate' | 'Other';
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: string;
}

type Tab = 'dashboard' | 'clients' | 'portfolios' | 'assets';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      joinDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 (555) 234-5678',
      joinDate: '2024-02-20'
    }
  ]);

  const [portfolios, setPortfolios] = useState<Portfolio[]>([
    {
      id: 'p1',
      clientId: '1',
      name: 'Retirement Portfolio',
      description: 'Long-term retirement investments',
      totalValue: 150000,
      createdDate: '2024-01-20'
    },
    {
      id: 'p2',
      clientId: '1',
      name: 'Growth Portfolio',
      description: 'Aggressive growth stocks',
      totalValue: 75000,
      createdDate: '2024-03-01'
    },
    {
      id: 'p3',
      clientId: '2',
      name: 'Conservative Portfolio',
      description: 'Low-risk bonds and stable stocks',
      totalValue: 200000,
      createdDate: '2024-02-25'
    }
  ]);

  const [assets, setAssets] = useState<Asset[]>([
    {
      id: 'a1',
      portfolioId: 'p1',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      assetType: 'Stock',
      quantity: 100,
      purchasePrice: 150.00,
      currentPrice: 175.00,
      purchaseDate: '2024-01-25'
    },
    {
      id: 'a2',
      portfolioId: 'p1',
      symbol: 'VTI',
      name: 'Vanguard Total Stock Market ETF',
      assetType: 'ETF',
      quantity: 200,
      purchasePrice: 220.00,
      currentPrice: 235.00,
      purchaseDate: '2024-02-10'
    },
    {
      id: 'a3',
      portfolioId: 'p2',
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      assetType: 'Stock',
      quantity: 50,
      purchasePrice: 200.00,
      currentPrice: 245.00,
      purchaseDate: '2024-03-05'
    },
    {
      id: 'a4',
      portfolioId: 'p3',
      symbol: 'BND',
      name: 'Vanguard Total Bond Market ETF',
      assetType: 'Bond',
      quantity: 500,
      purchasePrice: 78.00,
      currentPrice: 79.50,
      purchaseDate: '2024-03-01'
    }
  ]);

  const addClient = (client: Client) => {
    setClients([...clients, client]);
  };

  const updateClient = (id: string, updatedClient: Client) => {
    setClients(clients.map(c => c.id === id ? updatedClient : c));
  };

  const deleteClient = (id: string) => {
    setClients(clients.filter(c => c.id !== id));
    // Also delete associated portfolios and assets
    const clientPortfolioIds = portfolios.filter(p => p.clientId === id).map(p => p.id);
    setPortfolios(portfolios.filter(p => p.clientId !== id));
    setAssets(assets.filter(a => !clientPortfolioIds.includes(a.portfolioId)));
  };

  const addPortfolio = (portfolio: Portfolio) => {
    setPortfolios([...portfolios, portfolio]);
  };

  const updatePortfolio = (id: string, updatedPortfolio: Portfolio) => {
    setPortfolios(portfolios.map(p => p.id === id ? updatedPortfolio : p));
  };

  const deletePortfolio = (id: string) => {
    setPortfolios(portfolios.filter(p => p.id !== id));
    // Also delete associated assets
    setAssets(assets.filter(a => a.portfolioId !== id));
  };

  const addAsset = (asset: Asset) => {
    setAssets([...assets, asset]);
  };

  const updateAsset = (id: string, updatedAsset: Asset) => {
    setAssets(assets.map(a => a.id === id ? updatedAsset : a));
  };

  const deleteAsset = (id: string) => {
    setAssets(assets.filter(a => a.id !== id));
  };

  const tabs = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients' as Tab, label: 'Clients', icon: Users },
    { id: 'portfolios' as Tab, label: 'Portfolios', icon: Briefcase },
    { id: 'assets' as Tab, label: 'Assets', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <h1 className="text-gray-900">Investment Portfolio Manager</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage clients, portfolios, and assets</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="bg-white rounded-lg shadow">
          {/* Tabs */}
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="flex -mb-px min-w-max">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6">
            {activeTab === 'dashboard' && (
              <Dashboard
                clients={clients}
                portfolios={portfolios}
                assets={assets}
              />
            )}
            {activeTab === 'clients' && (
              <ClientList
                clients={clients}
                onAdd={addClient}
                onUpdate={updateClient}
                onDelete={deleteClient}
              />
            )}
            {activeTab === 'portfolios' && (
              <PortfolioList
                portfolios={portfolios}
                clients={clients}
                onAdd={addPortfolio}
                onUpdate={updatePortfolio}
                onDelete={deletePortfolio}
              />
            )}
            {activeTab === 'assets' && (
              <AssetList
                assets={assets}
                portfolios={portfolios}
                clients={clients}
                onAdd={addAsset}
                onUpdate={updateAsset}
                onDelete={deleteAsset}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}