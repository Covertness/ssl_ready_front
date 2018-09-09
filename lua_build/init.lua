local pgmoon = require("pgmoon")
local stat_cache = ngx.shared.flux_stat_cache

local sync_threshold = 1024 * 1024 -- 1MB

update_pg = function(pg, domain, tx, rx)
  pg:query("update fluxes set rx = rx + " .. rx .. ", tx = tx + " .. tx .. " from domains where fluxes.domain_id = domains.id and domains.source_host = '" .. domain .. "'")
end

sync_stat = function(premature)
  if not premature then
    local pg = pgmoon.new({ database = "ssl_ready", password = "ssl_ready" })
    assert(pg:connect())

    local keys = stat_cache:get_keys(0)
    for key, value in pairs(keys) do
      local separator = string.find(value, "-")
      local domain = string.sub(value, 0, separator - 1)
      local stat_type = string.sub(value, separator + 1)
      if stat_type == "tx" then
        local tx = stat_cache:get(domain .. "-tx") or 0
        local rx = stat_cache:get(domain .. "-rx") or 0
          if rx > sync_threshold or tx > sync_threshold then
            stat_cache:delete(domain .. "-tx")
            stat_cache:delete(domain .. "-rx")

            update_pg(pg, domain, tx, rx)
          end
      end
    end
  end
end

if 0 == ngx.worker.id() then
  local ok, err = ngx.timer.every(10, sync_stat)      -- 10s
  if not ok then
    ngx.log(ngx.ERR, "Failed to create timer: ", err)
    return
  end
end
