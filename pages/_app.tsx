import Footer from "@/components/footer";
import { Nav } from "@/components/Nav";
import "@/styles/globals.css";
import { loadStripe } from "@stripe/stripe-js";
import type { AppProps } from "next/app";
import { Roboto_Slab } from "next/font/google";
import Head from "next/head";
import { Elements } from "@stripe/react-stripe-js";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallBack from "@/components/fallbackForError";
import { SWRConfig } from "swr/_internal";
const roboto = Roboto_Slab({
  subsets: ["latin"],
  weight: ["300", "500", "700"],
});
export default function App({ Component, pageProps }: AppProps) {
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_P_KEY as string);

  return (
    <SWRConfig value={{ provider: () => new Map() }}>
      <ErrorBoundary FallbackComponent={ErrorFallBack}>
        <Elements stripe={stripePromise}>
          <Head>
            <title>Wine Shop</title>
            <link
              rel="icon"
              type="image/x-icon"
              href="/static/images/wine.png"
            ></link>
          </Head>
          <div
            className={`mx-3 md:mx-2  mt-2 mb-3 ${roboto.className}  md:h-auto `}
          >
            <Nav />
            <Component {...pageProps} />
          </div>
          <Footer />
        </Elements>
      </ErrorBoundary>
    </SWRConfig>
  );
}
