import { axios, getAccessToken, getGuestUserId } from "../utils";

async function get(id) {
  const guestUserId = getGuestUserId();
  const accessToken = getAccessToken();

  return axios
    .get(`/payment/${id}${guestUserId ? "?guest_uid=" + guestUserId : ""}`, {
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
      },
    })
    .then((response) => {
      return response;
    });
}

export default { get };
