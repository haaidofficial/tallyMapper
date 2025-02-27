import AddApiEndpointsComp from "@/components/AddApiEndpoints";
import protectedRoute from "@/components/hoc/protectedRoute";


function ManageApiEndpointsPage() {
    return (
        <AddApiEndpointsComp />
    )
}

export default protectedRoute(ManageApiEndpointsPage);