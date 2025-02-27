// pages/_app.js
import { useRouter } from "next/router";
import RootLayout from "@/components/layout"; // Adjust the path if needed
import { AuthProvider } from "@/context/AuthContext"; // Import the AuthProvider
import "../styles/globals.css";
import BackButton from "@/components/BackButton";


export default function App({ Component, pageProps }) {
    const router = useRouter();

    const isAdminLoginPage = router.pathname === "/admin/login";
    const is404Page = router.pathname === "/404";
    console.log(isAdminLoginPage, router, 'isAdminLoginPage');

    return (
        <>
            <BackButton />
            {is404Page ? (
                // Render only the 404 component without layout
                <Component {...pageProps} />
            ) : (
                <RootLayout>
                 
                    {!isAdminLoginPage ? (
                        <AuthProvider>
                               {console.log(!isAdminLoginPage, 'isAdminLoginPage')}
                            <Component {...pageProps} />
                        </AuthProvider>
                    ) : (
                        <Component {...pageProps} />
                    )}
                </RootLayout>
            )}
        </>
    );
}
