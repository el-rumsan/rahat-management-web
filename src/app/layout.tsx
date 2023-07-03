// i18n

// scroll bar
import 'simplebar-react/dist/simplebar.min.css';

// lightbox
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/styles.css';

// map
import 'mapbox-gl/dist/mapbox-gl.css';

// editor
import 'react-quill/dist/quill.snow.css';

// slick-carousel
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

// lazy image
import 'react-lazy-load-image-component/src/effects/blur.css';

// ----------------------------------------------------------------------

// redux
import ReduxProvider from 'src/redux/redux-provider';
// locales
// theme
import ThemeProvider from 'src/theme';
import { primaryFont } from 'src/theme/typography';
// components
import MotionLazy from 'src/components/animate/motion-lazy';
import ProgressBar from 'src/components/progress-bar';
import { SettingsDrawer, SettingsProvider } from 'src/components/settings';
import SnackbarProvider from 'src/components/snackbar/snackbar-provider';
// auth
import { AuthConsumer, AuthProvider } from 'src/auth/context/jwt';
import Web3Provider from 'src/web3/components/Provider';
// import { AuthProvider, AuthConsumer } from 'src/auth/context/auth0';
// import { AuthProvider, AuthConsumer } from 'src/auth/context/amplify';
// import { AuthProvider, AuthConsumer } from 'src/auth/context/firebase';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Rahat',
  description:
    'An open-source blockchain-based Cash and Voucher Assistance platform to support vulnerable communities.',
  themeColor: '#000000',
  manifest: '/manifest.json',
  icons: [
    {
      rel: 'icon',
      type: 'image/png',
      url: '/favicon/favicon.png',
    },
    // {
    //   rel: 'icon',
    //   type: 'image/png',
    //   sizes: '16x16',
    //   url: '/favicon/favicon-16x16.png',
    // },
    // {
    //   rel: 'icon',
    //   type: 'image/png',
    //   sizes: '32x32',
    //   url: '/favicon/favicon-32x32.png',
    // },
    // {
    //   rel: 'apple-touch-icon',
    //   sizes: '180x180',
    //   url: '/favicon/apple-touch-icon.png',
    // },
  ],
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" className={primaryFont.className}>
      <body>
        <Web3Provider />
        <AuthProvider>
          <ReduxProvider>
            <SettingsProvider
              defaultSettings={{
                themeMode: 'light', // 'light' | 'dark'
                themeDirection: 'ltr', //  'rtl' | 'ltr'
                themeContrast: 'default', // 'default' | 'bold'
                themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
                themeColorPresets: 'default', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
                themeStretch: false,
              }}
            >
              <ThemeProvider>
                <MotionLazy>
                  <SnackbarProvider>
                    <SettingsDrawer />
                    <ProgressBar />
                    <AuthConsumer>{children}</AuthConsumer>
                  </SnackbarProvider>
                </MotionLazy>
              </ThemeProvider>
            </SettingsProvider>
          </ReduxProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
