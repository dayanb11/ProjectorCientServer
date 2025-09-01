import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { apiClient, ApiResponse } from '../lib/api-client';
import { useToast } from './use-toast';

// Query keys for React Query
export const queryKeys = {
  programs: ['programs'] as const,
  program: (id: number) => ['programs', id] as const,
  activityPool: ['activity-pool'] as const,
  domains: ['domains'] as const,
  workers: ['workers'] as const,
  divisions: ['divisions'] as const,
  departments: ['departments'] as const,
  procurementTeams: ['procurement-teams'] as const,
  engagementTypes: ['engagement-types'] as const,
  organizationalRoles: ['organizational-roles'] as const,
  complexityEstimates: ['complexity-estimates'] as const,
  acceptanceOptions: ['acceptance-options'] as const,
};

// Programs hooks
export const usePrograms = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: [...queryKeys.programs, filters],
    queryFn: () => apiClient.getPrograms(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProgram = (taskId: number) => {
  return useQuery({
    queryKey: queryKeys.program(taskId),
    queryFn: () => apiClient.getProgram(taskId),
    enabled: !!taskId,
  });
};

export const useCreateProgram = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: apiClient.createProgram,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.programs });
      toast({
        title: "הצלחה",
        description: `דרישה ${data.data?.taskId} נוצרה בהצלחה`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "שגיאה",
        description: error.response?.data?.error || "שגיאה ביצירת המשימה",
        variant: "destructive"
      });
    }
  });
};

export const useUpdateProgram = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: number; data: any }) => 
      apiClient.updateProgram(taskId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.programs });
      queryClient.invalidateQueries({ queryKey: queryKeys.program(variables.taskId) });
      toast({
        title: "הצלחה",
        description: "המשימה עודכנה בהצלחה",
      });
    },
    onError: (error: any) => {
      toast({
        title: "שגיאה",
        description: error.response?.data?.error || "שגיאה בעדכון המשימה",
        variant: "destructive"
      });
    }
  });
};

// Station assignment hooks
export const useUpdateStation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ taskId, stationId, data }: { taskId: number; stationId: number; data: any }) =>
      apiClient.updateStation(taskId, stationId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.program(variables.taskId) });
      toast({
        title: "הצלחה",
        description: `תחנה ${variables.stationId} עודכנה בהצלחה`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "שגיאה",
        description: error.response?.data?.error || "שגיאה בעדכון התחנה",
        variant: "destructive"
      });
    }
  });
};

// System data hooks
export const useActivityPool = () => {
  return useQuery({
    queryKey: queryKeys.activityPool,
    queryFn: () => apiClient.getActivityPool(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useDomains = () => {
  return useQuery({
    queryKey: queryKeys.domains,
    queryFn: () => apiClient.getDomains(),
    staleTime: 10 * 60 * 1000,
  });
};

export const useWorkers = () => {
  return useQuery({
    queryKey: queryKeys.workers,
    queryFn: () => apiClient.getWorkers(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useDivisions = () => {
  return useQuery({
    queryKey: queryKeys.divisions,
    queryFn: () => apiClient.getDivisions(),
    staleTime: 10 * 60 * 1000,
  });
};

export const useDepartments = () => {
  return useQuery({
    queryKey: queryKeys.departments,
    queryFn: () => apiClient.getDepartments(),
    staleTime: 10 * 60 * 1000,
  });
};

export const useProcurementTeams = () => {
  return useQuery({
    queryKey: queryKeys.procurementTeams,
    queryFn: () => apiClient.getProcurementTeams(),
    staleTime: 10 * 60 * 1000,
  });
};

export const useEngagementTypes = () => {
  return useQuery({
    queryKey: queryKeys.engagementTypes,
    queryFn: () => apiClient.getEngagementTypes(),
    staleTime: 10 * 60 * 1000,
  });
};

export const useOrganizationalRoles = () => {
  return useQuery({
    queryKey: queryKeys.organizationalRoles,
    queryFn: () => apiClient.getOrganizationalRoles(),
    staleTime: 10 * 60 * 1000,
  });
};

// Planning helpers hooks
export const useComplexityEstimates = () => {
  return useQuery({
    queryKey: queryKeys.complexityEstimates,
    queryFn: () => apiClient.getComplexityEstimates(),
    staleTime: 10 * 60 * 1000,
  });
};

export const useUpdateComplexityEstimates = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: apiClient.updateComplexityEstimates,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.complexityEstimates });
      toast({
        title: "הצלחה",
        description: "הערכות המורכבות עודכנו בהצלחה",
      });
    },
    onError: (error: any) => {
      toast({
        title: "שגיאה",
        description: error.response?.data?.error || "שגיאה בעדכון הערכות המורכבות",
        variant: "destructive"
      });
    }
  });
};

export const useAcceptanceOptions = () => {
  return useQuery({
    queryKey: queryKeys.acceptanceOptions,
    queryFn: () => apiClient.getAcceptanceOptions(),
    staleTime: 10 * 60 * 1000,
  });
};

// Generic CRUD hooks for system tables
export const useCreateRecord = (endpoint: string, queryKey: readonly string[]) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: any) => apiClient.createRecord(endpoint, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast({
        title: "הצלחה",
        description: "הרשומה נוספה בהצלחה",
      });
    },
    onError: (error: any) => {
      toast({
        title: "שגיאה",
        description: error.response?.data?.error || "שגיאה בהוספת הרשומה",
        variant: "destructive"
      });
    }
  });
};

export const useUpdateRecord = (endpoint: string, queryKey: readonly string[]) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiClient.updateRecord(endpoint, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast({
        title: "הצלחה",
        description: "הרשומה עודכנה בהצלחה",
      });
    },
    onError: (error: any) => {
      toast({
        title: "שגיאה",
        description: error.response?.data?.error || "שגיאה בעדכון הרשומה",
        variant: "destructive"
      });
    }
  });
};

export const useDeleteRecord = (endpoint: string, queryKey: readonly string[]) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => apiClient.deleteRecord(endpoint, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast({
        title: "הצלחה",
        description: "הרשומה נמחקה בהצלחה",
      });
    },
    onError: (error: any) => {
      toast({
        title: "שגיאה",
        description: error.response?.data?.error || "שגיאה במחיקת הרשומה",
        variant: "destructive"
      });
    }
  });
};

// File upload hook
export const useFileUpload = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ file, path }: { file: File; path?: string }) => 
      apiClient.uploadFile(file, path),
    onSuccess: (data) => {
      toast({
        title: "הצלחה",
        description: "הקובץ הועלה בהצלחה",
      });
    },
    onError: (error: any) => {
      toast({
        title: "שגיאה",
        description: error.response?.data?.error || "שגיאה בהעלאת הקובץ",
        variant: "destructive"
      });
    }
  });
};