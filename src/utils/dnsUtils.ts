import dnsPacket from "dns-packet";

export default {
  createSuccessResponseFromRequest(request: dnsPacket.Packet, answers: dnsPacket.Answer[], flags = dnsPacket.AUTHORITATIVE_ANSWER): dnsPacket.Packet {
    return {
      id: request.id,
      type: "response",
      flags,
      answers,
      questions: request.questions,
    };
  },

  createNotFoundResponseFromRequest(request: dnsPacket.Packet): dnsPacket.Packet {
    return {
      id: request.id,
      type: "response",
      flags: 387,
      // rcode: 3,
    };
  },

  getDomainComponents(domain: string) {
    if (domain.endsWith(".")) domain = domain.substr(0, domain.length - 1);
    const domainComponents = domain.split(".").reverse();
    const zones: { zone: string; host: string }[] = [];
    const zoneDomains = domain.split(".");
    for (let i = 0; i < domainComponents.length; i++) {
      const zoneName = zoneDomains.slice(i).join(".");
      let hostName = domain.substring(0, domain.length - (zoneName.length + 1));
      if (hostName == "") hostName = "@";
      zones.push({
        zone: zoneName,
        host: hostName,
      });
    }

    return {
      tld: domainComponents.length > 1 ? domainComponents[0] : "",
      domain: domainComponents.length > 1 ? domainComponents[1] : "",
      subdomain: domainComponents.length > 2 ? domainComponents.slice(2).reverse().join(".") : "",
      sld: domainComponents.length == 1 ? domainComponents[0] : "",
      isSLD: domainComponents.length == 1 ? true : false,
      zones: zones,
    };
  },
};
