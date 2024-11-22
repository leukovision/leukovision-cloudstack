import { createUserId } from "../utils/idGenerator.js";

const users = []; // Simulasi database

const getUsers = () => users;

const getUserById = (id) => users.find((user) => user.user_id === id);

const addUser = (user) => {
  user.user_id = createUserId(); // Generate ID unik
  users.push(user);
  return user;
};

const updateUser = (id, data) => {
  const index = users.findIndex((user) => user.user_id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...data, updated_at: new Date() };
    return users[index];
  }
  return null;
};

const deleteUser = (id) => {
  const index = users.findIndex((user) => user.user_id === id);
  if (index !== -1) {
    users.splice(index, 1);
    return true;
  }
  return false;
};

export { getUsers, getUserById, addUser, updateUser, deleteUser };
