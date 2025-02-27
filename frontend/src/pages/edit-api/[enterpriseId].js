import EditApiEndpoints from "@/components/EditApiEndpoints";
import protectedRoute from "@/components/hoc/protectedRoute";

function EditApiPage() {
    return (
        <EditApiEndpoints />
    )
}

export default protectedRoute(EditApiPage);