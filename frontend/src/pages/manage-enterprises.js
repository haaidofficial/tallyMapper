import protectedRoute from "@/components/hoc/protectedRoute";
import dynamic from "next/dynamic";

const ManageEnterprises = dynamic(() => import("@/components/ManageEnterprises"));

function ManageEnterprisesPage() {
    return <ManageEnterprises />;
}

export default protectedRoute(ManageEnterprisesPage);
