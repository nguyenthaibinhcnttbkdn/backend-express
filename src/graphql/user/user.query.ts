import { User } from "../../models";

export const Query = {
  getAllUser: async (_, args, user) => {
    await User.findAll();
    return [{ id: 1 }];
  },
};
