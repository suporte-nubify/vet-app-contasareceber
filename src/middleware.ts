export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/", "/contas/:path*", "/cadastros/:path*", "/relatorio", "/relatorio/:path*", "/senha"],
};
