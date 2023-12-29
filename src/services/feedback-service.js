import { axios, getAccessToken, getGuestUserId } from "@/utils";
import validate from "../validation/validation";
import { descriptionValidation } from "../validation/feedback-validation";

async function create(description) {
  const guestUserId = getGuestUserId();

  description = validate(descriptionValidation, description);

  return axios
    .post(
      `/feedback${guestUserId ? "?guest_uid=" + guestUserId : ""}`,
      { description },
      {
        headers: { Authorization: "Bearer ".concat(getAccessToken()) },
      },
    )
    .then((response) => {
      return response;
    });
}

export default { create };
