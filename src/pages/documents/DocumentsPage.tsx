import React from 'react';
import { DocumentChamber } from '../../components/documents/DocumentChamber';

export const DocumentsPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Document Chamber</h1>
        <p className="text-gray-600">Manage your deals, contracts, and documents</p>
      </div>
      
      <DocumentChamber />
    </div>
  );
};
