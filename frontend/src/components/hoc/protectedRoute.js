// hoc/protectedRoute.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

const protectedRoute = (WrappedComponent) => {
    const Protected = (props) => {
        const { token, isAuthenticated, loading } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!loading && (!isAuthenticated || !token)) {
                router.push("/admin/login");
            }
        }, [isAuthenticated, token, loading, router]);

        if (loading || !isAuthenticated || !token) {
            return <div>Loading...</div>; // Show loading state while checking authentication
        }

        return <WrappedComponent {...props} />;
    };

    return Protected;
};

export default protectedRoute;
