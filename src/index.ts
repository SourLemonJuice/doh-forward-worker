const DEST_DOH_ENDPOINT = "https://cloudflare-dns.com/dns-query";

/*
	RFC 8484: DNS Queries over HTTPS (DoH)
	https://datatracker.ietf.org/doc/html/rfc8484
*/
export default {
	async fetch(request, env, ctx): Promise<Response> {
		const origUrl = new URL(request.url);
		let destUrl = new URL(DEST_DOH_ENDPOINT);

		if (origUrl.pathname !== "/dns-query") {
			return new Response(null, {
				status: 404,
			});
		}

		// 4.1. The HTTP Request
		// https://datatracker.ietf.org/doc/html/rfc8484#section-4.1
		switch (request.method) {
			case "GET":
				destUrl.search = origUrl.search;
				return fetch(destUrl, {
					method: "GET",
					headers: request.headers,
				});
			case "POST":
				return fetch(destUrl, {
					method: "POST",
					headers: request.headers,
					body: request.body,
				});
		}

		return new Response(null, {
			status: 400,
		});
	},
} satisfies ExportedHandler<Env>;
