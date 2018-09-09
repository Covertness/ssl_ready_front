local ssl = require("ngx.ssl")

local serverName, serverNameErr = ssl.server_name()
local stat_cache = ngx.shared.flux_stat_cache

if serverName == "localhost" then
  return
end

if serverName == nil then
  ngx.log(ngx.ERR, "Server name not set for incoming request. Error: " .. serverNameErr)
end

local function stat_flux_once(host, flux_type, flux_value)
  if flux_value == nil then return end

  local cache_key = host .. "-" .. flux_type
  local curr, err = stat_cache:incr(cache_key, flux_value, 0)
  if err then
    ngx.log(ngx.ERR, "Stat flux error: " .. err)
    return
  end
end

stat_flux_once(serverName, "tx", ngx.var.request_length)
stat_flux_once(serverName, "rx", ngx.var.upstream_bytes_received)
