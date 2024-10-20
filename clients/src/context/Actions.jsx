/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
export const LoginStart = (_userCredentials) => ({
  type: "LOGIN_START",
});

export const LoginSuccess = (user) => ({
  type: "LOGIN_SUCCESS",
  payload: user,
});

export const LoginFailure = () => ({
  type: "LOGIN_FAILURE",
});

export const Logout = () => ({
  type: "LOGOUT",
});

export const UpdateStart = (userCredentials) => ({
  type: "UPDATE_START",
});

export const UpdateSuccess = (user) => ({
  type: "UPDATE_SUCCESS",
  payload: user,
});

export const UpdateFailure = () => ({
  type: "UPDATE_FAILURE",
});

export const setDataLoading = () => ({
  type: 'SET_DATA_LOADING',
});

export const setDataSuccess = () => ({
  type: 'SET_DATA_SUCCESS',
});

export const setDataError = (error) => ({
  type: 'SET_DATA_ERROR',
  payload: error,
});
