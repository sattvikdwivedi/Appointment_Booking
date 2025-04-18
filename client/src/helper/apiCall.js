import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;
console.log(process.env.REACT_APP_SERVER_DOMAIN, "BASE URL");

const fetchData = async (url) => {
  console.log(url, "URL");
  const { data } = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  console.log(data, "DATA");
  return data;
};

export default fetchData;
