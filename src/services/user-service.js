import {
  loginUserValidation,
  registerUserValidation,
} from "../validation/user-validation";
import validate from "../validation/validation";
import { axios, getAccessToken } from "../utils";

async function register({ name, username, passwordForm, phonenumberForm }) {
  const result = validate(registerUserValidation, {
    username,
    passwordForm,
    name,
    phonenumberForm,
  });

  return axios.post(
    "/users",
    {
      username: result.username,
      name: result.username,
      phonenumberForm: result.phonenumberForm,
      password: result.passwordForm.password,
    },
    { cache: false },
  );
}

async function getMyProfile() {
  return await axios
    .get("/users/current", {
      headers: {
        Authorization: "Bearer ".concat(getAccessToken()),
      },
    })
    .catch(() => {
      return null;
    });
}

async function createGuestUser() {
  return await axios.get("/users/guest").catch(() => null);
}

async function login(data) {
  const result = validate(loginUserValidation, data);

  return await axios.post(
    "/users/login",
    {
      username: result.username,
      password: result.password,
    },
    { cache: false },
  );
}

export default { createGuestUser, register, getMyProfile, login };
