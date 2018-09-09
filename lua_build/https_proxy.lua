local redis = require "resty.redis"
local ssl = require("ngx.ssl")
local red = redis:new()
local proxy_cache = ngx.shared.https_proxy_cache

local serverName, serverNameErr = ssl.server_name()
if serverName == "localhost" then
  ngx.var.dest_host = "127.0.0.1"
  return
end

red:set_keepalive(10000, 100)

local ok, err = red:connect("127.0.0.1", 6379)
if not ok then
    ngx.log("failed to connect: ", err)
    return ngx.exit(ngx.ERROR)
end

if serverName == nil then
  ngx.log(ngx.ERR, "Server name not set for incoming request. Error: " .. serverNameErr)
  return ngx.exit(ngx.ERROR)
end


local function load_proxy_dest(host)
  local dest_host = proxy_cache:get(host)
  if not dest_host or dest_host == ngx.null then
    dest_host = red:get("ssl_ready_certificate:" .. serverName .. "-dest")
    if dest_host then
      proxy_cache:set(host, dest_host, 10)
    end
  end

  return dest_host
end


local dest_host = load_proxy_dest(serverName)
if not dest_host then
    ngx.log(ngx.ERR, "failed to get dest_host: " .. serverName)
    return ngx.exit(ngx.ERROR)
end

if dest_host == ngx.null then
    return ngx.exit(404)
end

ngx.var.dest_host = dest_host
