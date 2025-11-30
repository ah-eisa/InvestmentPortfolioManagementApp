import { useState } from 'react';
import { Client } from '../App';
import { ClientForm } from './ClientForm';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface ClientListProps {
  clients: Client[];
  onAdd: (client: Client) => void;
  onUpdate: (id: string, client: Client) => void;
  onDelete: (id: string) => void;
}

export function ClientList({ clients, onAdd, onUpdate, onDelete }: ClientListProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const handleAdd = (client: Client) => {
    onAdd(client);
    setIsFormOpen(false);
  };

  const handleEdit = (client: Client) => {
    onUpdate(client.id, client);
    setEditingClient(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this client? This will also delete all associated portfolios and assets.')) {
      onDelete(id);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
        <div>
          <h2 className="text-gray-900">Clients</h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">{clients.length} total clients</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Client
        </button>
      </div>

      {isFormOpen && (
        <div className="mb-4 sm:mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-gray-900 mb-4">Add New Client</h3>
          <ClientForm
            onSubmit={handleAdd}
            onCancel={() => setIsFormOpen(false)}
          />
        </div>
      )}

      {editingClient && (
        <div className="mb-4 sm:mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-gray-900 mb-4">Edit Client</h3>
          <ClientForm
            client={editingClient}
            onSubmit={handleEdit}
            onCancel={() => setEditingClient(null)}
          />
        </div>
      )}

      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-700 text-xs sm:text-sm">Name</th>
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-700 text-xs sm:text-sm hidden md:table-cell">Email</th>
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-700 text-xs sm:text-sm hidden lg:table-cell">Phone</th>
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-700 text-xs sm:text-sm hidden sm:table-cell">Join Date</th>
                <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-gray-700 text-xs sm:text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-900 text-xs sm:text-sm">{client.name}</td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-600 text-xs sm:text-sm hidden md:table-cell">{client.email}</td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-600 text-xs sm:text-sm hidden lg:table-cell">{client.phone}</td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-600 text-xs sm:text-sm hidden sm:table-cell">
                    {new Date(client.joinDate).toLocaleDateString()}
                  </td>
                  <td className="py-2 sm:py-3 px-2 sm:px-4">
                    <div className="flex justify-end gap-1 sm:gap-2">
                      <button
                        onClick={() => setEditingClient(client)}
                        className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
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
        {clients.length === 0 && (
          <div className="text-center py-12 text-gray-500 text-sm sm:text-base">
            No clients found. Add your first client to get started.
          </div>
        )}
      </div>
    </div>
  );
}