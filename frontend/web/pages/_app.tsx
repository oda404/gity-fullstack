import '../styles/global.css'
import { AppProps } from 'next/app';
import { ThemeProvider, theme, CSSReset } from '@chakra-ui/react';
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { APIHost } from '../utils/apiHost';

const client = new ApolloClient({
  uri: APIHost,
  credentials: "include",
  cache: new InMemoryCache()
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CSSReset />
        <Component {...pageProps} />
      </ThemeProvider>
    </ApolloProvider>
  )
}
