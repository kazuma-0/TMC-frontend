const achievementFormReducer = (state, action) => {
  switch (action.type) {
    case "title":
      return {
        ...state,
        [action.field]: action.payload,
      };
    case "type":
      return {
        ...state,
        [action.field]: action.payload,
      };
    case "description":
      return {
        ...state,
        [action.field]: action.payload,
      };
    case "image":
      return {
        ...state,
        [action.field]: action.payload,
      };
    case "author":
      return {
        ...state,
        [action.field]: action.payload,
      };
    case "duration":
      return {
        ...state,
        [action.field]: action.payload,
      };
    default:
      return {
        ...state,
      };
  }
};
const initialAchievementForm = {
  title: "",
  author: "",
  duration: "",
  type: "",
  description: "",
  image: "",
};

export { initialAchievementForm };
export default achievementFormReducer;
