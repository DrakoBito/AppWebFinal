const API_BASE = "https://appwebfinal-i74f.onrender.com/";

export function getToken() {
  return localStorage.getItem("admin_token");
}

export function setToken(t) {
  localStorage.setItem("admin_token", t);
}

export function clearToken() {
  localStorage.removeItem("admin_token");
}

async function http(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error || "Request failed";
    throw new Error(msg);
  }
  return data;
}

export const PublicAPI = {
  listAvailablePets: () => http(`/pets?status=AVAILABLE`),
  getPet: (id) => http(`/pets/${id}`),
  reserve: (id, payload) => http(`/pets/${id}/reserve`, { method: "POST", body: JSON.stringify(payload) })
};

export const AdminAPI = {
  login: (email, password) => http(`/admin/login`, { method: "POST", body: JSON.stringify({ email, password }) }),
  listPets: () =>
    http(`/admin/pets`, { headers: { Authorization: `Bearer ${getToken()}` } }),
  createPet: (payload) =>
    http(`/admin/pets`, { method: "POST", body: JSON.stringify(payload), headers: { Authorization: `Bearer ${getToken()}` } }),
  deletePet: (id) =>
    http(`/admin/pets/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } }),
  patchPetStatus: (id, status) =>
    http(`/admin/pets/${id}`, { method: "PATCH", body: JSON.stringify({ status }), headers: { Authorization: `Bearer ${getToken()}` } }),
  listRequests: (status) =>
    http(`/admin/requests${status ? `?status=${status}` : ""}`, { headers: { Authorization: `Bearer ${getToken()}` } }),
  approveRequest: (id) =>
    http(`/admin/requests/${id}/approve`, { method: "POST", headers: { Authorization: `Bearer ${getToken()}` } }),
  rejectRequest: (id) =>
    http(`/admin/requests/${id}/reject`, { method: "POST", headers: { Authorization: `Bearer ${getToken()}` } }),
  listAdoptions: () =>
    http(`/admin/adoptions`, { headers: { Authorization: `Bearer ${getToken()}` } }),
  listFollowups: (adoptionId) =>
    http(`/admin/adoptions/${adoptionId}/followups`, { headers: { Authorization: `Bearer ${getToken()}` } }),
  addFollowup: (adoptionId, notes) =>
    http(`/admin/adoptions/${adoptionId}/followups`, { method: "POST", body: JSON.stringify({ notes }), headers: { Authorization: `Bearer ${getToken()}` } })
};
