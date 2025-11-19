export interface Env {
	UPSTREAM_ENDPOINT: string;
}

/*
	RFC 8484: DNS Queries over HTTPS (DoH)
	https://datatracker.ietf.org/doc/html/rfc8484
*/
export default {
	async fetch(request, env, ctx): Promise<Response> {
		let origUrl: URL;
		let destUrl: URL;
		try {
			origUrl = new URL(request.url);
			destUrl = new URL(env.UPSTREAM_ENDPOINT);
		} catch {
			return new Response(null, {
				status: 400,
			});
		}

		switch (origUrl.pathname) {
			case "/dns-query":
				break;
			case "/generate_204":
				return new Response(null, {
					status: 204,
				});
			default:
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
			default:
				return new Response(null, {
					status: 405,
				});
		}
	},
} satisfies ExportedHandler<Env>;
