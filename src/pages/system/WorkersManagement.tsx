import React, { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { ArrowRight, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import WorkerFormDialog from '../../components/workers/WorkerFormDialog';
import WorkersTable from '../../components/workers/WorkersTable';
import { useWorkers, useDivisions, useDepartments, useProcurementTeams, useOrganizationalRoles, useCreateRecord, useUpdateRecord, useDeleteRecord, queryKeys } from '../../hooks/useApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

interface WorkerRecord {
  id: number;
  employeeId: string;
  roleCode: number;
  fullName: string;
  roleDescription?: string;
  divisionId?: number;
  departmentId?: number;
  procurementTeam?: string;
  password: string;
  availableWorkDays?: string;
  email?: string;
  divisionName?: string;
  departmentName?: string;
}

interface OrganizationalRole {
  id: number;
  roleCode: number;
  description: string;
  permissions?: string;
}

interface Division {
  id: number;
  name: string;
}

interface Department {
  id: number;
  name: string;
  divisionId: number;
}

interface ProcurementTeam {
  id: number;
  name: string;
}

const WorkersManagement: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // API hooks
  const { data: workersResponse, isLoading, error, refetch } = useWorkers();
  const { data: divisionsResponse } = useDivisions();
  const { data: departmentsResponse } = useDepartments();
  const { data: procurementTeamsResponse } = useProcurementTeams();
  const { data: organizationalRolesResponse } = useOrganizationalRoles();
  
  const createWorkerMutation = useCreateRecord('/system/workers', queryKeys.workers);
  const updateWorkerMutation = useUpdateRecord('/system/workers', queryKeys.workers);
  const deleteWorkerMutation = useDeleteRecord('/system/workers', queryKeys.workers);
  
  const records = workersResponse?.data || [];
  const divisions = divisionsResponse?.data || [];
  const departments = departmentsResponse?.data || [];
  const procurementTeams = procurementTeamsResponse?.data || [];
  const organizationalRoles = organizationalRolesResponse?.data || [];

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<WorkerRecord | null>(null);
  const [formData, setFormData] = useState<Partial<WorkerRecord>>({});

  const initializeForm = (record?: WorkerRecord) => {
    if (record) {
      setFormData(record);
    } else {
      setFormData({
        employeeId: '',
        roleCode: undefined,
        fullName: '',
        roleDescription: '',
        password: '',
        divisionId: undefined,
        departmentId: undefined,
        procurementTeam: '',
        availableWorkDays: '',
        email: ''
      });
    }
  };

  const handleAdd = () => {
    console.log('Opening add dialog with organizational roles:', organizationalRoles);
    initializeForm();
    setEditingRecord(null);
    setIsAddDialogOpen(true);
  };

  const handleEdit = (record: WorkerRecord) => {
    console.log('Opening edit dialog for record:', record);
    initializeForm(record);
    setEditingRecord(record);
    setIsAddDialogOpen(true);
  };

  const validateForm = () => {
    if (!formData.employeeId || formData.employeeId.length !== 4 || !/^\d{4}$/.test(formData.employeeId)) {
      toast({
        title: "שגיאה",
        description: "קוד עובד חייב להיות בן 4 ספרות בדיוק",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.roleCode || ![0, 1, 2, 3, 4, 5, 9].includes(formData.roleCode)) {
      toast({
        title: "שגיאה",
        description: "נא לבחור תפקיד מהרשימה",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.fullName) {
      toast({
        title: "שגיאה",
        description: "שם מלא הוא שדה חובה",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.password || (formData.password !== '******' && formData.password.length !== 6)) {
      toast({
        title: "שגיאה",
        description: "סיסמה חייבת להיות בת 6 תווים בדיוק",
        variant: "destructive"
      });
      return false;
    }

    const existingRecord = records.find(r => 
      r.employeeId === formData.employeeId && r.id !== editingRecord?.id
    );
    if (existingRecord) {
      toast({
        title: "שגיאה",
        description: "קוד עובד כבר קיים במערכת",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    console.log('Saving worker with form data:', formData);
    
    if (!validateForm()) return;

    try {

      const processedData = { ...formData };
      
      // Clear irrelevant fields based on role
      if (formData.roleCode !== 4 && formData.roleCode !== 5) {
        processedData.divisionId = undefined;
        processedData.departmentId = undefined;
      }
      
      if (formData.roleCode !== 2 && formData.roleCode !== 3) {
        processedData.procurementTeam = '';
        processedData.availableWorkDays = '';
      }

      console.log('Processed data for mock save:', processedData);

      if (editingRecord) {
        // Update existing worker
        await updateWorkerMutation.mutateAsync({
          id: editingRecord.id,
          data: processedData
        });
      } else {
        // Create new worker
        await createWorkerMutation.mutateAsync(processedData);
        
        // Redirect to home page after adding user
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }

      setIsAddDialogOpen(false);
      setEditingRecord(null);
      setFormData({});
    } catch (error) {
      console.error('Error saving worker:', error);
      toast({
        title: "שגיאה",
        description: "שגיאה בשמירת הנתונים",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק רשומה זו?')) {
      try {
        await deleteWorkerMutation.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting worker:', error);
      }
    }
  };

  const handleInputChange = (key: keyof WorkerRecord, value: any) => {
    console.log('Form input changed:', key, value);
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <AppLayout currentRoute="/system-settings">
        <LoadingSpinner text="טוען נתוני עובדים..." />
      </AppLayout>
    );
  }
  
  if (error) {
    return (
      <AppLayout currentRoute="/system-settings">
        <ErrorMessage onRetry={() => refetch()} />
      </AppLayout>
    );
  }

  return (
    <AppLayout currentRoute="/system-settings">
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              onClick={() => navigate('/system-settings')}
              className="flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              חזרה להגדרות מערכת
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 text-right">
              ניהול עובדים
            </h1>
          </div>
          
          <Card>
            <CardHeader className="text-right">
              <div className="flex justify-between items-center">
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={handleAdd}>
                      <Plus className="w-4 h-4 ml-2" />
                      הוספת עובד חדש
                    </Button>
                  </DialogTrigger>
                  <WorkerFormDialog
                    isOpen={isAddDialogOpen}
                    onClose={() => setIsAddDialogOpen(false)}
                    onSave={handleSave}
                    editingRecord={editingRecord}
                    formData={formData}
                    onInputChange={handleInputChange}
                    divisions={divisions}
                    departments={departments}
                    procurementTeams={procurementTeams}
                    organizationalRoles={organizationalRoles}
                  />
                </Dialog>
                <div>
                  <CardTitle className="text-xl">Workers</CardTitle>
                  <p className="text-gray-600 mt-1">ניהול רשימת העובדים ומשתמשי המערכת (מצב הדגמה)</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <WorkersTable
                records={records}
                onEdit={handleEdit}
                onDelete={handleDelete}
                divisions={divisions}
                departments={departments}
                procurementTeams={procurementTeams}
                organizationalRoles={organizationalRoles}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default WorkersManagement;