const API_BASE = "http://localhost:4000/api";

export function getToken() {
  return localStorage.getItem("token");
}

export function setToken(t) {
  localStorage.setItem("token", t);
}

export function clearToken() {
  localStorage.removeItem("token");
}

async function http(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` })
  };

  console.log('Sending request:', { path, options }); // Debug

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...headers, ...options.headers }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Error del servidor" }));
    throw new Error(err.message || `Error ${res.status}`);
  }

  return res.json();
}

export const PublicAPI = {
  listAvailablePets: () => http(`/pets?status=AVAILABLE`),
  getPet: (id) => http(`/pets/${id}`),
  reserve: (id, payload) => http(`/pets/${id}/reserve`, { 
    method: "POST", 
    body: JSON.stringify(payload) 
  })
};

export const AdminAPI = {
  login: (email, password) => http("/admin/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  }),
  
  listPets: () => http("/admin/pets"),
  
  createPet: (payload) => {
    console.log('AdminAPI.createPet - Sending payload:', payload);
    console.log('AdminAPI.createPet - Stringified:', JSON.stringify(payload));
    return http("/admin/pets", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  
  patchPetStatus: (id, status) => http(`/admin/pets/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status })
  }),
  
  deletePet: (id) => http(`/admin/pets/${id}`, { method: "DELETE" }),
  
  listRequests: () => http("/admin/requests"),
  
  approveRequest: (id) => http(`/admin/requests/${id}/approve`, { 
    method: "POST" 
  }),
  
  rejectRequest: (id) => http(`/admin/requests/${id}/reject`, { 
    method: "POST" 
  }),
  
  listAdoptions: () => http("/admin/adoptions"),
  
  listFollowups: (adoptionId) => http(`/admin/adoptions/${adoptionId}/followups`),
  
  addFollowup: (adoptionId, notes) => http(`/admin/adoptions/${adoptionId}/followups`, {
    method: "POST",
    body: JSON.stringify({ notes })
  })
};
