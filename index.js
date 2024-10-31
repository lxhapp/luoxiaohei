import MainClient from "./src/luoxiaohei.js";
const client = new MainClient();
client.start().catch(console.error);
export default client;