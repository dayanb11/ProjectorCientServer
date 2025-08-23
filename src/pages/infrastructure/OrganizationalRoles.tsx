
import React, { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SystemTableManager from '../../components/system/SystemTableManager';
import { OrganizationalRole } from '../../types';
import { dataService } from '../../services/dataService';
import { useEffect } from 'react';

const OrganizationalRoles: React.FC = () => {
  const navigate = useNavigate();

  const [records, setRecords] = useState<OrganizationalRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await dataService.getOrganizationalRoles();
      
      // Transform data
      const transformedData = data.map((item: any) => ({
        id: item.id,
        roleCode: item.role_code,
        description: item.description,
        permissions: item.permissions
      }));
      
      setRecords(transformedData);
    } catch (error) {
      console.error('Error loading organizational roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'roleCode', label: 'קוד תפקיד (0-6)', type: 'number' as const, required: true },
    { key: 'description', label: 'תיאור תפקיד', type: 'text' as const, required: true },
    { key: 'permissions', label: 'פירוט הרשאות', type: 'text' as const, required: false }
  ];

  const handleAdd = async (record: Omit<OrganizationalRole, 'id'>) => {
    try {
      const dbData = {
        role_code: record.roleCode,
        description: record.description,
        permissions: record.permissions
      };
      
      await dataService.createOrganizationalRole(dbData);
      await loadData();
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  };

  const handleUpdate = async (id: number, record: Partial<OrganizationalRole>) => {
    try {
      const dbData = {
        role_code: record.roleCode,
        description: record.description,
        permissions: record.permissions
      };
      
      await dataService.updateOrganizationalRole(id, dbData);
      await loadData();
    } catch (error) {
      console.error('Error updating role:', error);
      throw error;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await dataService.deleteOrganizationalRole(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting role:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <AppLayout currentRoute="/infrastructure-maintenance">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">טוען נתונים...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout currentRoute="/infrastructure-maintenance">
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              onClick={() => navigate('/infrastructure-maintenance')}
              className="flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              חזרה לתחזוקת תשתיות
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 text-right">
              תפקידים ארגוניים
            </h1>
          </div>
          
          <SystemTableManager
            title="תפקידים ארגוניים"
            description="Organizational Role - הגדרת התפקידים והרשאות במערכת"
            fields={fields}
            records={records}
            onAdd={handleAdd}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default OrganizationalRoles;
