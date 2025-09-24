import axios from "axios"

function mockApi(){
    return axios.create({
        baseURL : "https://jsonplaceholder.typicode.com/users", 
        headers: {
    "Content-Type": "application/json",
  },
    });
}
const api=mockApi();

const getUsers=()=>api.get("/");
const addUser=(user)=>api.post("/", user);
const updateUser=(id, user)=>api.put(`/${id}`, user);
const deleteUser=(id)=>api.delete(`/${id}`);

export { getUsers, addUser, updateUser, deleteUser };
export default api;

