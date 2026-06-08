import { create } from 'zustand';
import { applicationService } from '../services/applicationAPI';

export const updateApplicationStore = create((set) => ({
  // States
  applications: [],
  totalApplications: 0,
  currentApplication: null,
  kanbanData: {},
  loading: false,
  error: null,


  clearError: () => set({ error: null }),
  setCurrentApplication: (application) => set({ currentApplication: application }),

  fetchApplications: async (filters) => {
    set({ loading: true, error: null });
    try {
      const data = await applicationService.getAll(filters);
      set({ applications: data || [], loading: false });
    } catch (error) {
      set({ error: error.message || "Failed to fetch applications", loading: false });
    }
  },

  fetchCandidateApplications: async () => {
    set({ loading: true, error: null });
    try {
      const response = await applicationService.getCandidateApplications();
      set({ applications: response.data || [], loading: false });
    } catch (error) {
      set({ error: error.message || "Failed to fetch candidate applications", loading: false });
    }
  },

  fetchApplicationsByJob: async (jobId, params) => {
    set({ loading: true, error: null });
    try {
      const response = await applicationService.getApplicationsByJob(jobId, params);
      set({
        applications: response.data?.applications || [],
        totalApplications: response.data?.total || 0,
        loading: false,
      });
    } catch (error) {
      set({ error: error.message || "Failed to fetch job applications", loading: false });
    }
  },

  fetchJobKanban: async (jobId) => {
    set({ loading: true, error: null });
    try {
      const response = await applicationService.getJobKanban(jobId);
      set({ kanbanData: response.data || {}, loading: false });
    } catch (error) {
      set({ error: error.message || "Failed to fetch Kanban board data", loading: false });
    }
  },

  fetchApplicationDetails: async (applicationId) => {
    set({ loading: true, error: null });
    try {
      const response = await applicationService.getApplicationDetails(applicationId);
      set({ currentApplication: response.data || null, loading: false });
    } catch (error) {
      set({ error: error.message || "Failed to fetch application details", loading: false });
    }
  },

  applyToJob: async (payload) => {
    set({ loading: true, error: null });
    try {
      const response = await applicationService.applyToJob(payload);
      set({ loading: false });
      return response;
    } catch (error) {
      set({ error: error.message || "Failed to submit application", loading: false });
      throw error;
    }
  },

  quickApply: async (payload) => {
    set({ loading: true, error: null });
    try {
      const response = await applicationService.quickApply(payload);
      set({ loading: false });
      return response;
    } catch (error) {
      set({ error: error.message || "Failed to submit quick application", loading: false });
      throw error;
    }
  },

  updateApplicationStage: async (applicationId, stagePayload) => {
    set({ loading: true, error: null });
    try {
      const response = await applicationService.updateApplicationStage(applicationId, stagePayload);
      const updatedApplication = response.data;

      set((state) => {
        // 1. Update currentApplication if it's the one being modified
        const currentApp = state.currentApplication && state.currentApplication._id === applicationId
          ? { ...state.currentApplication, ...updatedApplication }
          : state.currentApplication;

        // 2. Update list of applications
        const updatedApps = state.applications.map((app) =>
          app._id === applicationId ? { ...app, ...updatedApplication } : app
        );

        // 3. Update Kanban board structure if data is present
        let updatedKanban = { ...state.kanbanData };
        if (Object.keys(updatedKanban).length > 0) {
          // Remove application from any previous stages
          Object.keys(updatedKanban).forEach((stageKey) => {
            updatedKanban[stageKey] = updatedKanban[stageKey].filter(
              (app) => app._id !== applicationId
            );
          });
          // Add application to the new target stage
          const targetStageKey = updatedApplication.stage?.key || 'applied';
          if (updatedKanban[targetStageKey]) {
            updatedKanban[targetStageKey] = [updatedApplication, ...updatedKanban[targetStageKey]];
          } else {
            updatedKanban[targetStageKey] = [updatedApplication];
          }
        }

        return {
          currentApplication: currentApp,
          applications: updatedApps,
          kanbanData: updatedKanban,
          loading: false,
        };
      });
      return response;
    } catch (error) {
      set({ error: error.message || "Failed to update application stage", loading: false });
      throw error;
    }
  },

  retryScreening: async (applicationId) => {
    set({ loading: true, error: null });
    try {
      const response = await applicationService.retryScreening(applicationId);
      const updatedApplication = response.data;

      set((state) => {
        const currentApp = state.currentApplication && state.currentApplication._id === applicationId
          ? { ...state.currentApplication, ...updatedApplication }
          : state.currentApplication;

        const updatedApps = state.applications.map((app) =>
          app._id === applicationId ? { ...app, ...updatedApplication } : app
        );

        let updatedKanban = { ...state.kanbanData };
        Object.keys(updatedKanban).forEach((stageKey) => {
          updatedKanban[stageKey] = updatedKanban[stageKey].map((app) =>
            app._id === applicationId ? { ...app, ...updatedApplication } : app
          );
        });

        return {
          currentApplication: currentApp,
          applications: updatedApps,
          kanbanData: updatedKanban,
          loading: false,
        };
      });
      return response;
    } catch (error) {
      set({ error: error.message || "Failed to retry screening", loading: false });
      throw error;
    }
  },

  addApplicationNote: async (applicationId, notePayload) => {
    set({ loading: true, error: null });
    try {
      const response = await applicationService.addApplicationNote(applicationId, notePayload);
      const updatedApplication = response.data;

      set((state) => {
        const currentApp = state.currentApplication && state.currentApplication._id === applicationId
          ? { ...state.currentApplication, ...updatedApplication }
          : state.currentApplication;

        const updatedApps = state.applications.map((app) =>
          app._id === applicationId ? { ...app, ...updatedApplication } : app
        );

        let updatedKanban = { ...state.kanbanData };
        Object.keys(updatedKanban).forEach((stageKey) => {
          updatedKanban[stageKey] = updatedKanban[stageKey].map((app) =>
            app._id === applicationId ? { ...app, ...updatedApplication } : app
          );
        });

        return {
          currentApplication: currentApp,
          applications: updatedApps,
          kanbanData: updatedKanban,
          loading: false,
        };
      });
      return response;
    } catch (error) {
      set({ error: error.message || "Failed to add note", loading: false });
      throw error;
    }
  },

  updateApplicationNote: async (applicationId, noteId, notePayload) => {
    set({ loading: true, error: null });
    try {
      const response = await applicationService.updateApplicationNote(applicationId, noteId, notePayload);
      const updatedApplication = response.data;

      set((state) => {
        const currentApp = state.currentApplication && state.currentApplication._id === applicationId
          ? { ...state.currentApplication, ...updatedApplication }
          : state.currentApplication;

        const updatedApps = state.applications.map((app) =>
          app._id === applicationId ? { ...app, ...updatedApplication } : app
        );

        let updatedKanban = { ...state.kanbanData };
        Object.keys(updatedKanban).forEach((stageKey) => {
          updatedKanban[stageKey] = updatedKanban[stageKey].map((app) =>
            app._id === applicationId ? { ...app, ...updatedApplication } : app
          );
        });

        return {
          currentApplication: currentApp,
          applications: updatedApps,
          kanbanData: updatedKanban,
          loading: false,
        };
      });
      return response;
    } catch (error) {
      set({ error: error.message || "Failed to update note", loading: false });
      throw error;
    }
  },

  deleteApplicationNote: async (applicationId, noteId) => {
    set({ loading: true, error: null });
    try {
      const response = await applicationService.deleteApplicationNote(applicationId, noteId);
      const updatedApplication = response.data;

      set((state) => {
        const currentApp = state.currentApplication && state.currentApplication._id === applicationId
          ? { ...state.currentApplication, ...updatedApplication }
          : state.currentApplication;

        const updatedApps = state.applications.map((app) =>
          app._id === applicationId ? { ...app, ...updatedApplication } : app
        );

        let updatedKanban = { ...state.kanbanData };
        Object.keys(updatedKanban).forEach((stageKey) => {
          updatedKanban[stageKey] = updatedKanban[stageKey].map((app) =>
            app._id === applicationId ? { ...app, ...updatedApplication } : app
          );
        });

        return {
          currentApplication: currentApp,
          applications: updatedApps,
          kanbanData: updatedKanban,
          loading: false,
        };
      });
      return response;
    } catch (error) {
      set({ error: error.message || "Failed to delete note", loading: false });
      throw error;
    }
  },
}));

export const useApplicationStore = updateApplicationStore;