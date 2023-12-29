import validate from "../validation/validation";
import { axios } from "../utils";
import { getTagsValidation } from "../validation/tag-validation";
import { useTagStore } from "../stores/tag";

async function get(category) {
  const tagStore = useTagStore();
  category = validate(getTagsValidation, category);

  return axios
    .get(`/tags?category=${category}`, { id: `tags-${category}` })
    .then((response) => {
      tagStore.set(response.data.data);

      return response;
    });
}

export default {
  get,
};
