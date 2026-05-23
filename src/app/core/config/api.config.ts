export const API_CONFIG = {
  baseUrl: 'https://backend-proyecto-de-grado.onrender.com',
  endpoints: {
    auth: {
      requestCode: '/api/auth/register-code/request',
      register: '/api/auth/register',
      login: '/api/auth/login',
    },
    users: {
      me: '/api/users/me',
      list: '/api/users',
    },
    roles: {
      list: '/api/roles',
      assign: '/api/roles/assign',
      remove: '/api/roles/remove',
    },
    companies: {
      create: '/api/companies',
      list: '/api/companies',
      getById: (id: string) => `/api/companies/${id}`,
      getByNit: (nit: string) => `/api/companies/by-nit/${nit}`,
      pendingValidation: '/api/companies/pending-validation',
      submitValidation: (id: string) => `/api/companies/${id}/submit-validation`,
      validate: (id: string) => `/api/companies/${id}/validate`,
      observe: (id: string) => `/api/companies/${id}/observe`,
      reject: (id: string) => `/api/companies/${id}/reject`,
      history: (id: string) => `/api/companies/${id}/history`,
    },
    convenios: {
      create: '/api/convenios',
      list: '/api/convenios',
      getById: (id: string) => `/api/convenios/${id}`,
      update: (id: string) => `/api/convenios/${id}`,
      versions: (id: string) => `/api/convenios/${id}/versions`,
      history: (id: string) => `/api/convenios/${id}/history`,
      submit: (id: string) => `/api/convenios/${id}/submit`,
      previewPdf: (id: string) => `/api/convenios/${id}/preview-pdf`,
      versionPdf: (convenioId: string, versionId: string) =>
        `/api/convenios/${convenioId}/versions/${versionId}/pdf`,
      documents: (id: string) => `/api/convenios/${id}/documents`,
      downloadDocument: (convenioId: string, documentId: string) =>
        `/api/convenios/${convenioId}/documents/${documentId}/pdf`,
    },
    companyDocuments: {
      request: (convenioId: string) => `/api/convenios/${convenioId}/request-company-documents`,
      listRequests: (convenioId: string) =>
        `/api/convenios/${convenioId}/company-document-requests`,
      listDocuments: (convenioId: string) => `/api/convenios/${convenioId}/company-documents`,
      approve: (convenioId: string, documentId: string) =>
        `/api/convenios/${convenioId}/company-documents/${documentId}/approve`,
      observe: (convenioId: string, documentId: string) =>
        `/api/convenios/${convenioId}/company-documents/${documentId}/observe`,
      requestCorrection: (convenioId: string) =>
        `/api/convenios/${convenioId}/company-documents/request-correction`,
      discard: (convenioId: string) => `/api/convenios/${convenioId}/company-documents/discard`,
      markApproved: (convenioId: string) => `/api/convenios/${convenioId}/mark-documents-approved`,
    },
    publicUpload: {
      info: (token: string) => `/api/public/company-upload/${token}`,
      upload: (token: string) => `/api/public/company-upload/${token}/documents`,
    },
    approvals: {
      myPending: '/api/approvals/my-pending',
      rounds: (convenioId: string) => `/api/approvals/convenios/${convenioId}/rounds`,
      steps: (roundId: string) => `/api/approvals/rounds/${roundId}/steps`,
      approve: (stepId: string) => `/api/approvals/${stepId}/approve`,
      requestCorrection: (stepId: string) => `/api/approvals/${stepId}/request-correction`,
      reject: (stepId: string) => `/api/approvals/${stepId}/reject`,
    },
    alerts: {
      me: '/api/review-alerts/me',
      admin: '/api/review-alerts/admin',
      proyeccion: '/api/review-alerts/proyeccion',
      all: '/api/review-alerts',
      checkDeadlines: '/api/review-alerts/check-deadlines',
      unreadCount: '/api/review-alerts/unread-count',
      markRead: (alertId: string) => `/api/review-alerts/${alertId}/read`,
      markAllRead: '/api/review-alerts/read-all',
    },
    dashboard: {
      me: '/api/dashboard/me',
      myWork: '/api/dashboard/my-work',
      adminSummary: '/api/dashboard/admin/summary',
      recentActivity: '/api/dashboard/recent-activity',
    },
  },
};
