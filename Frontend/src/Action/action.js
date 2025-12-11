import {
  getRequest,
  postRequest,
  PatchRequest,
  deleteRequest,
} from "../coreFIles/helper";

//------------------|| USER AUTH ||------------------//

export const adminLogin = async (data) => {
  const res = await postRequest("auth/login", data);
  return res.data;
};

export const logout = async (data) => {
  const res = await postRequest("auth/logout", data);
  return res.data;
};


export const refreshTokenAPI = async (data) => {
  const res = await postRequest("auth/refresh-token", data);
  return res.data;
};


export const getUser = async () => {
  const res = await getRequest("users/getUser");
  return res.data;
};

export const createNewUser = async (data) => {
  const res = await postRequest("users/createNewUser", data);
  return res.data;
};


export const updateUser = async (id, data) => {
  const res = await PatchRequest(`users/updateUser/${id}`, data);
  return res.data;
};


export const deleteUser = async (id) => {
  const res = await deleteRequest(`users/deleteUser/${id}`);
  return res.data;
};




