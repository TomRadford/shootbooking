import { type AppType } from 'next/app'
import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { api } from '~/utils/api'
import '~/styles/globals.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import NiceModal from '@ebay/nice-modal-react'
import Layout from '~/components/Layout'

const MyApp: AppType<{ session: Session | null }> = ({
	Component,
	pageProps: { session, ...pageProps },
}) => {
	return (
		<SessionProvider session={session}>
			<NiceModal.Provider>
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</NiceModal.Provider>
			<ReactQueryDevtools />
			<ToastContainer
				theme="dark"
				position="bottom-right"
				progressStyle={{ backgroundColor: 'white' }}
			/>
		</SessionProvider>
	)
}

export default api.withTRPC(MyApp)
