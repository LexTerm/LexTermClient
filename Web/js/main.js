
var servers = new lexterm.models.Servers();
var local_server = new lexterm.models.Server(lexterm.helpers.linkifySelf("http://localhost:8000/api")); 
local_server.fetch();
servers.add(local_server);

