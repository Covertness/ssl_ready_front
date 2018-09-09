local redis = require("resty.redis")
local ssl = require("ngx.ssl")

local redisInstance = redis:new()
local serverName, serverNameErr = ssl.server_name()
local cert_cache = ngx.shared.ssl_cert_cache

if serverName == "localhost" then
  return
end

redisInstance:set_keepalive(10000, 100)

local ok, err = redisInstance:connect("127.0.0.1", 6379)
if not ok then
  ngx.log("failed to connect: ", err)
  return ngx.exit(ngx.ERROR)
end

if serverName == nil then
  ngx.log(ngx.ERR, "Server name not set for incoming request. Error: " .. serverNameErr)
  return ngx.exit(ngx.ERROR)
end


local function load_private_key(host)
  local keyValue = cert_cache:get(host .. "-key")
  if not keyValue or keyValue == ngx.null then
    keyValue = redisInstance:get("ssl_ready_certificate:" .. host .. "-key")
    if keyValue then
      cert_cache:set(host .. "-key", keyValue, 10)
    end
  end

  if not keyValue then
    ngx.log(ngx.ERR, "No certificate found for " .. host .. ". Resorting to fallback private key")
  end

  return keyValue
end

local function load_certificate(host)
  local certValue  = cert_cache:get(host .. "-cert")
  if not certValue or certValue == ngx.null then
    certValue = redisInstance:get("ssl_ready_certificate:" .. host .. "-cert")
    if certValue then
      cert_cache:set(host .. "-cert", certValue, 10)
    end
  end

  if not certValue then
    ngx.log(ngx.ERR, "No certificate found for " .. host .. ". Resorting to fallback pub cert.")
  end

  return certValue
end

-- clear the fallback certificates and private keys
local ok, err = ssl.clear_certs()
if not ok then
  ngx.log(ngx.ERR, "failed to clear existing (fallback) certificates for " .. serverName, err)
  return ngx.exit(ngx.ERROR)
end

local pem_cert_chain = assert(load_certificate(serverName))
if pem_cert_chain == ngx.null then
  ngx.log(ngx.ERR, "loaded certificate for " .. serverName .. " was null")
  return ngx.exit(ngx.ERROR)
end

local der_cert_chain, err = ssl.cert_pem_to_der(pem_cert_chain)
if not der_cert_chain then
  ngx.log(ngx.ERR, "failed to convert certificate chain for " .. serverName .. " from PEM->DER. Error: " .. err)
  return ngx.exit(ngx.ERROR)
end

local ok, err = ssl.set_der_cert(der_cert_chain)
if not ok then
  ngx.log(ngx.ERR, "failed to set DER cert for " .. serverName .. ". Error: " .. err)
  return ngx.exit(ngx.ERROR)
end

local der_pkey = ssl.priv_key_pem_to_der(assert(load_private_key(serverName)))
local ok, err = ssl.set_der_priv_key(der_pkey)
if not ok then
  ngx.log(ngx.ERR, "failed to set DER key for " .. serverName .. ". Error: " .. err)
  return ngx.exit(ngx.ERROR)
end

