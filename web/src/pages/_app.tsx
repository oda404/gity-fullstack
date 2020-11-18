import { ThemeProvider, CSSReset, ColorModeProvider } from '@chakra-ui/core';
import { Provider, createClient, dedupExchange, fetchExchange } from "urql";
import ccache from "../urql/cache";
import theme from '../theme';

const client = createClient({
  url: "http://localhost:4200/graphql",
  fetchOptions: { credentials: "include" },
  exchanges: [dedupExchange, ccache, fetchExchange]
});

function MyApp({ Component, pageProps }: any) {
  return (
    <Provider value={client}>
      <ThemeProvider theme={theme}>
        <link rel="preconnect" href="https://fonts.gstatic.com"/>
        <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@100;400&display=swap" rel="stylesheet"/> 
        <ColorModeProvider
          options={{
            useSystemColorMode: true,
          }}
        >
          <CSSReset />
          <Component {...pageProps} />
        </ColorModeProvider>
      </ThemeProvider>
    </Provider>
  )
}

export default MyApp
