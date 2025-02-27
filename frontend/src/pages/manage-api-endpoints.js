import protectedRoute from "@/components/hoc/protectedRoute";
import ManageApiEndpoints from "@/components/ManageApiEndpoints";

function ManageApiEndpointsPage() {
    return (
        <ManageApiEndpoints />
    )
}

export default protectedRoute(ManageApiEndpointsPage);