local redis = require "resty.redis"
local red = redis:new()

red:set_keepalive(10000, 100)

local ok, err = red:connect("127.0.0.1", 6379)
if not ok then
    ngx.log("failed to connect: ", err)
    return ngx.exit(ngx.ERROR)
end

local uri = ngx.var.uri
local token = string.sub(uri, string.find(uri, "/[^/]*$") + 1)

local challenge, err = red:get("ssl_ready_challenge:" .. token)
if not challenge then
    ngx.log("failed to get challenge: ", err)
    return ngx.exit(ngx.ERROR)
end

if challenge == ngx.null then
    return ngx.exit(404)
end

ngx.say(challenge)
