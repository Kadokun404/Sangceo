// Dihasilkan oleh scripts/gen-dnsconfig.mjs dari data/domains/*.json. Jangan edit manual.
var REG_NONE = NewRegistrar("none");
var CF = NewDnsProvider("cloudflare");

D("sang.ceo", REG_NONE, DnsProvider(CF), NO_PURGE,
  // Infrastruktur email zona (ruang.email),
  MX("@", 10, "mx1.ruang.email."),
  MX("@", 10, "mx3.ruang.email."),
  TXT("@", "v=spf1 mx a:mx1.ruang.email a:mx3.ruang.email ~all"));
